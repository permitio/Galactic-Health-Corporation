<div align="center">
  <a href="https://www.permit.io/?utm_source=github&utm_medium=referral&utm_campaign=ghc">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/permitio/Galactic-Health-Corporation/assets/4082578/56794ab6-8ae6-4676-bba7-8d38eeeb1c89">
      <img src="https://github.com/permitio/Galactic-Health-Corporation/assets/4082578/c1f1540b-083a-4a12-9b7b-8a02884db3db" height="128">
    </picture>
    <h1 align="center">Galactic Health Corporation</h1>
  </a>
</div>

Galactic Health Corporation is a sample application that demonstrates all the common application permission models (RBAC, ABAC and ReBAC), in one healthcare application.
The application is using the [Permit.io](https://permit.io) low-code solution to manage the following features:

* **Dashboard** - Viewing the current user health plan and medical records, using Relationship-Based Access Control (ReBAC) to view only the current user data.
* **Pilot Groups** - Manage users' pilot groups, using Role-Based Access Control (RBAC) to assign users to pilot groups.
* **Delegate Permissions Wizard** - Delegate permissions to view data for other users' data, using ReBAC, and limit it to date boundaries by Attribute-Based Access Control (ABAC).

## Getting Started
__If you just want to play with the application, refer to the [Hosted Application](#hosted-app) section__

### Setup
To run the application locally, you will need to first setup the following:
* A [Node.js environment](https://nodejs.org/en/download) - to run the application.
* A [docker environment](https://docs.docker.com/engine/install/) - to run the decision point container locally.
* A [clerk.com account](https://dashboard.clerk.com) - to authenticate the users.
* A [permit.io account](https://app.permit.io) - to manage all the permissions and authorize the users.

#### Application Setup
1. Clone the repository to your local machine.
2. In the root folder, create a file named `.env.local` and copy the content of `.env.example` to it.
3. From the clerk.com dashboard, go to `API Keys`, choose `Next.js` example, and copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` values to the `.env.local` file.
4. In the Permit.io dashboard, go to `Connect`, and copy the `token` variable to the `PERMIT_SDK_KEY` value in the `.env.local` file.
5. Run `npm install` to install the application dependencies.

At this point, we have all the required setup to run the application locally. We have configured the runtime and the keys we need to authenticate and authorize the users.
#### Configuration Setup
To play with authorization and permissions, we will have to configure the following data in Clerk.com and Permit.io:
1. Open the terminal in the repository's root folder and run `npm run config` to seed the permissions data to Permit.io.
    * At this step, we configured all the relevant resources, actions, and roles in Permit.io.

At this point, we have configured all the data we need to run the application locally and play with the permissions.

#### Running the Application
To authorize our users to use the data we configured in Permit.io, we should run the decision point locally, and run the following `docker` command to spin up the decision point container:
```bash
docker run -it \
    -e PDP_API_KEY=<YOUR_PERMIT_API_KEY> \
    -p 7766:7000 \
    -p 8081:8081 \
    permitio/pdp-v2:latest
```

As the decision point is up and running, open a new terminal window in the root folder of the repository and run `npm run dev`. 
This will start the application locally, and you can access it in `http://localhost:3000`.

## ReBAC and RBAC Permissions
Now that we run the application let's figure out the ReBAC and RBAC permissions we have in the application.
### Permission Model
#### Requirements
To understand the permission models we are using in our application, let's specify first the permissions requirements we have:
* Users can view their own profile details, health plan, and medical records.
* Users can view the profiles of other users in relationship with them (for example family members).
* Users can delegate permissions to other users to view their health plan and medical records; this delegation is limited to a specific date range.
* Users can view particular features in the application, based on their pilot groups.

#### Entities
To model our permissions based on the requirements above, we will need to define the following entities:

* **Resource** - The resource we want to protect, each resource can have multiple instances. The Member resource for example, have resouce instance per each user in the system.
* **Actions** - The actions that users can perform on a resouce, each action can be allowed or denied for each user as per the permissions model.
* **Relationship** - Defines relationship between resources so we can derive permissions from one resource to another, for example: the Member resource is related to the Member Group resource, so we can derive permissions from the Member Group to the Member.
* **Resource Roles** - Roles that (can be) assigned to specific resource instances, for example: the Owner role can be assigned to a specific member instance and to the specific user that is the owner of this member.
* **Derived Roles** - Roles that are derived from the resource roles, for example: the Caregiver role can be assigned directly to the medical records instance, but also derived to it from a Caregiver role on the parent member instance.

#### Permissions Table
From the requirements and entities above, we can define the following permissions table:

| Resource | Actions | Relationship | Resource Roles | Derived Roles | Description |
| --- | --- | --- | --- | --- | --- |
| Member | View, Read | | Owner(read, write)<br />Caregiver(read) | | A root entity for all member related resources. |
| Profile | View, Read | Member -> Parent</br>Member Group -> Belongs | Owner(read, write)<br />Caregiver(read) | Member:Caregiver<br />Member Group:Org Member | A member profile. |
| Health Plan | View, Read | Member -> Parent | Owner(read, write)<br />Caregiver(read) | Member:Caregiver | A member health plan. |
| Medical Records | View, Read | Member -> Parent | Owner(read, write)<br />Caregiver(read) | Member:Caregiver | A member medical records. |
| Member Group | List, Assign | | Admin(list, assign), Org Member(list) | | A member group. |
| Benefits Pilot Group | View |  | Pilot Group Member(general role) | | A member group for benefits pilot. |

#### Diagram
We can also visualize the permissions table in the following diagram where Rick gives access to his member resource to Morty and derive permissions to his health plan and medical records:

https://github.com/permitio/Galactic-Health-Corporation/assets/4082578/0e551aa2-f0ea-4213-a824-4bb5322f2f34


### API Endpoints
To demonstrate the permissions in the application, we implemented the following API endpoints:
| Endpoint | Description | Roles | Derived Roles |
| --- | --- | --- | --- |
| GET `/account/dashboard/profile/{user}` | Get the (current) user details. | `Profile:Caregiver` | `Member:Owner#Profile`<br />`Member Group:Org Member#Profile`<br />  |
| GET `/account/dashboard/health-plan/{user}` | Get the (current) user health plan. | `Health Plan:Caregiver` | `Member:Owner#Health Plan`<br />`Member:Caregiver#Health Plan` |
| GET `/account/dashboard/medical-records/{user}` | Get the (current) user medical records. | `Medical Records:Caregiver` | `Member:Owner#Medical Records`<br />`Member:Caregiver#Medical Records` |
| GET `/account/member` | Get all the members from all the member groups | `Member Group:Org Member` |  |
| GET `/account/caregiver` | Get all the users' caregivers | `Member:Owner` |  |
| POST `/account/caregiver` | Add a new caregiver to the user | `Member:Owner` |  |
| DELETE `/account/caregiver` | Remove a caregiver from the user | `Member:Owner` |  |

Using the following endpoints, we have all we need to demonstrate the permissions in the application.

### Application Flow
To test the simplest application flow, let's perform the following steps:
1. Signup with (at least) 2 accounts in the app, for example: `rick@sanchez.app` and `morty@smith.app`.
1. Login to the app as `rick@sanchez.app`, as you can see in the dashboard you are able to view only rick's data.
2. In the `Delegate Permissions` wizard, let first choose to share all the data, and then assign `Morty` as a caregiver.
3. As you can see that Rick can give access only to their member groups members `Morty` and `Bird Person`.
4. At this point, let assign `Morty` as a caregiver to `Rick` and login as `Morty`.
5. After finishing the wizard, we can visit the `Shared Access` and see that `Rick` gave us access to his health plan and medical records.
6. If you logout and login as `Morty`, you will see that `Rick` gave us access to his health plan and medical records as well.
7. Now, let's login as `Bird Person` and see they can view only their own data.

By this simple flow, we demonstrate the following ReBAC permissions:
* Rick can see all its data that is related to Member resources, as the Owner role is assigned to him.
* Morty is a caregiver to Rick, so he can see Rick's health plan and medical records that are derived from the `Member:Caregiver` role assigned to him by Rick.
* Bird Person can see only his own data, as he is not related to any other user.
* Looking at Rick's dashboard, you'll find a special box for the `Benefits Pilot Group`, this is a RBAC permission that is assigned to Rick as a member of the `Pilot Group Member` role. Only users that are assigned to this role can see this box.

## ABAC Permissions
Now that we understand the ReBAC and RBAC permissions in the application let's figure out the ABAC permissions we have in the application.
### Requirements
The ABAC requirement for our app, is to limit the delegation of permissions to a specific date range. For example, Rick can give access to his health plan and medical records to Morty, but only for the next 30 days.

### Model
As we achieve the role assignment to `Morty` by the relationship between `Rick` and `Morty`, we can't limit the delegation by the relationship itself, so we will have to use special attributes to achieve this requirement.

To implement the ABAC, we will use special date attributes that can define the boundaries for each role assignment definition. For example, if we assign the `Member:Caregiver` role to `Morty` with the `start_date` attribute set to `2021-01-01` and the `end_date` attribute set to `2021-01-31`, `Morty` will be able to view `Rick`'s health plan and medical records only between `2021-01-01` and `2021-01-31`.

The result will be an object that looks like this:
```json
{
    "{user}": {
        "Member:Caregiver:${instance}": {
            "start_date": "2021-01-01",
            "end_date": "2021-01-31"
        }
    }
}
```

And the query will be something similar to this:
```js
if (user[permission].start_date <= today && user[permission].end_date >= today) {
    return true;
}
```

### Implementation
To implement the ABAC permissions using Permit.io, we can do the following:
* Configure a `Resource Set` based on the condition we defined, and configure it with Permit.io low-code wizard.
* Write a custom `Rego` code that will be combined together with the permissions we already configured in Permit.io and will be analyzed by Permit.io in the decision point.

In our demo, we will use the second option, as we want to demonstrate the flexibility of the Permit.io solution.

#### Configure GitOps
The way that Permit.io let you write your own custom policy code is by using a GitOps feature that uses all Git features such as pull requests, branches, and merge requests to manage the policy configuration.

To configure GitOps, follow the guide in the [Permit.io documentation](https://docs.permit.io/integrations/gitops/github).

#### Configure the Policy
* In the relevant branch, replace the content of `custom/root.rego` with the content of the `scripts/custom.rego` file in the repository.
* In the relevant branch, edit the `root.rego` file so all the conditions will sit on the same allow rule, like this (remember to remove the second allow rule):
    ```rego
    allow {
        policies.allow
        custom.allow
    }
    ```

### Application Flow
To test the ABAC permissions, run the same caregiver delegation flow we did in the [ReBAC and RBAC Permissions](#rebac-and-rbac-permissions) section, but this time, limit the delegation to a specific date range.

As you can see, the permissions are limited to the date range we defined.

## Hosted App
If you'd only like to view the application running, [login with one of the following users here](https://ghc.up.railway.app/) and play with the permissions.
| User | Password | Groups |
| - | - | - |
| rick@sanchez.app | Aa123456! | ricks_org<br />smith_family |
| morty@smith.app | Aa123456! | smith_family |
| bird@person.app | Aa123456! | ricks_org |
| homer@simpson.app | Aa123456! | |

## What's Next?
Now that you understand the permission models and how to implement them using Permit.io, you can use the same flow to implement your own permissions in your application.

For any impovements or questions, we invite you to learn more on [Permit.io docs](https://docs.permit.io) or contact us at [our Slack Community](https://io.permit.io/blog-slack).
