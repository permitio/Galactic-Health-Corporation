package permit.custom

import future.keywords.in
import data.permit.policies
import data.permit.utils.abac
import data.permit.rebac
import data.permit.debug

default allow := false

# Allow State Machine for adding date boundries to particular relationship sources
allow {
	# Filter all decisions that are not related to rebac
	not "rebac" in policies.__allow_sources
} else {
	# Filter all decisions that are ReBac but does not related to the caregiver role
	count(filter_resource) == 0
} else {
	# Filter all the resources that are not allowed by the caregiver role
	some filtered_resource in filter_resource
	# For each resource check if the boundries are enforced
	enforce_boundries(filtered_resource)
	print("Allowing resource: ", filtered_resource)
	print("Enforce boundries: ", enforce_boundries(filtered_resource))
}

# Filter resources that allow caregiver permissions for derived resources
filter_resource[derived_resource] {
	print("Derived resource")
	some allowing_role in rebac.rebac_roles_debugger
	print("Allowing role: ", allowing_role.role)
	some source in allowing_role.sources
	derived_resource = exctract_resouce(allowing_role, source)
	print("Derived resource: ", derived_resource)
}

# Extract the "root" derived resource of a caregiver role assignment or derivation
# Profile resource filtered becasue they allowed without boundries to any org_member role
exctract_resouce(allowing_role, source) := returned_resource {
	# In case the role is on the assignment of the relationship, the resource is the resource of the assignment
	source.type == "role_assignment"
	print("Role assignment - role: ", allowing_role.role)
	endswith(allowing_role.role, "#caregiver")
	not startswith(allowing_role.role, "profile")
	print("Role assignment - Caregiver role after endswith")
	returned_resource := allowing_role.resource
	print("Role assignment - returned resource: ", returned_resource)
} else := returned_resource {
	# In case the role is on the derivation of the relationship, the resource is the resource of the derivation
	source.type == "role_derivation"
	print("Role derivation - role: ", source.role)
	endswith(source.role, "#caregiver")
	not startswith(allowing_role.role, "profile")
	print("Role derivation - Caregiver role after endswith")
	returned_resource := source.resource
	print("Role derivation - returned resource: ", returned_resource)
}

# Check if the derived resource boundries from the user attributes with the current time
enforce_boundries(resource) {
	print("Enforce boundries")
	print("Time now: ", time.now_ns())
	print("Start date: ", time.parse_rfc3339_ns(abac.attributes.user.caregiver_bounds[resource].start_date))
	print("End date: ", time.parse_rfc3339_ns(abac.attributes.user.caregiver_bounds[resource].end_date))
	time.now_ns() >= time.parse_rfc3339_ns(abac.attributes.user.caregiver_bounds[resource].start_date)
	time.now_ns() <= time.parse_rfc3339_ns(abac.attributes.user.caregiver_bounds[resource].end_date)
}
