const { Permit } = require('permitio');
require('dotenv').config({ path: '.env.local' });

const permit = new Permit({
    token: process.env.PERMIT_SDK_KEY,
    apiUrl: process.env.PERMIT_API_URL || 'https://api.permit.io',
});

const cleanEnv = async () => {
    const resources = await permit.api.resources.list();
    console.log(`Found ${resources.length} resources`);
    for (const resource of resources) {
        const resourceRelations = await permit.api.resourceRelations.list({
            resourceKey: resource.key,
        });
        console.log(`Found ${resourceRelations.length} resource relations`);
        for (const resourceRelation of resourceRelations.data) {
            console.log(`Deleting resource relation: ${resourceRelation.key}`);
            await permit.api.resourceRelations.delete(
                resource.key,
                resourceRelation.key,
            );
        }

        const resourceRoles = await permit.api.resourceRoles.list({
            resourceKey: resource.key,
        });
        console.log(`Found ${resourceRoles.length} resource roles`);
        for (const resourceRole of resourceRoles) {
            console.log(`Deleting resource role: ${resourceRole.key}`);
            await permit.api.resourceRoles.delete(
                resource.key,
                resourceRole.key,
            );
        }
        console.log(`Deleting resource: ${resource.key}`);
        await permit.api.resources.delete(resource.key);
    }

    const users = await permit.api.users.list();
    console.log(`Found ${users.length} users`);
    for (const user of users.data) {
        console.log(`Deleting user: ${user.key}`);
        await permit.api.users.delete(user.key);
    }

    const roles = await permit.api.roles.list();
    console.log(`Found ${roles.length} roles`);
    for (const role of roles) {
        console.log(`Deleting role: ${role.key}`);
        await permit.api.roles.delete(role.key);
    }
};

const createResources = async () => {
    console.log('Creating Member Group Resource');
    await permit.api.createResource({
        key: 'member_group',
        name: 'Member Group',
        actions: {
            list: {},
            assign: {},
        },
        roles: {
            admin: {
                name: 'Admin',
                permissions: ['list', 'assign'],
            },
            org_member: {
                name: 'Org Member',
                permissions: ['list'],
            },
        },
    });

    console.log('Creating Member Resource');
    await permit.api.createResource({
        key: 'member',
        name: 'Member',
        actions: {
            read: {},
            write: {},
        },
        roles: {
            owner: {
                name: 'Owner',
                permissions: ['read', 'write'],
            },
            caregiver: {
                name: 'Caregiver',
                permissions: ['read'],
            },
        },
    });

    console.log('Creating Profile Resource');
    await permit.api.createResource({
        key: 'profile',
        name: 'Profile',
        actions: {
            read: {},
            write: {},
        },
        roles: {
            owner: {
                name: 'Owner',
                permissions: ['read', 'write'],
            },
            caregiver: {
                name: 'Caregiver',
                permissions: ['read'],
            },
        },
    });

    console.log('Creating Health Plan Resource');
    await permit.api.createResource({
        key: 'health_plan',
        name: 'Health Plan',
        actions: {
            read: {},
        },
        roles: {
            owner: {
                name: 'Owner',
                permissions: ['read'],
            },
            caregiver: {
                name: 'Caregiver',
                permissions: ['read'],
            },
        },
    });

    console.log('Creating Medical Records Resource');
    await permit.api.createResource({
        key: 'medical_records',
        name: 'Medical Records',
        actions: {
            read: {},
        },
        roles: {
            owner: {
                name: 'Owner',
                permissions: ['read'],
            },
            caregiver: {
                name: 'Caregiver',
                permissions: ['read'],
            },
        },
    });

    console.log('Creating Benefits Pilot Group Resource');
    await permit.api.createResource({
        key: 'benefits_pg',
        name: 'Benefits',
        description: 'The benefits resource that belongs to a pilot group.',
        actions: { view: {} },
    });
    console.log('Creating Benefits Pilot Group Role');
    await permit.api.createRole({
        key: 'benefits_pg_role',
        name: 'Benefits Pilot Group',
        permissions: ['benefits_pg:view'],
    });
};

const createResourceRelations = async () => {
    console.log('Create Member Group -> Profile Relation');
    await permit.api.resourceRelations.create('profile', {
        key: 'belongs',
        name: 'Belongs',
        subject_resource: 'member_group',
    });

    console.log('Create Member -> Profile Relation');
    await permit.api.resourceRelations.create('profile', {
        key: 'parent',
        name: 'Parent',
        subject_resource: 'member',
    });

    console.log('Create Member -> Health Plan Relation');
    await permit.api.resourceRelations.create('health_plan', {
        key: 'parent',
        name: 'Parent',
        subject_resource: 'member',
    });

    console.log('Create Member -> Medical Records Relation');
    await permit.api.resourceRelations.create('medical_records', {
        key: 'parent',
        name: 'Parent',
        subject_resource: 'member',
    });
};

const createRoleDerivations = async () => {
    console.log(
        'Create profile:caregiver derivations from member_group:org_member and member:caregiver',
    );
    await permit.api.resourceRoles.update('profile', 'caregiver', {
        granted_to: {
            users_with_role: [
                {
                    linked_by_relation: 'belongs',
                    on_resource: 'member_group',
                    role: 'org_member',
                },
                {
                    linked_by_relation: 'parent',
                    on_resource: 'member',
                    role: 'caregiver',
                },
            ],
        },
    });

    console.log('Create Profile:owner from Member:owner');
    await permit.api.resourceRoles.update('profile', 'owner', {
        granted_to: {
            users_with_role: [
                {
                    linked_by_relation: 'parent',
                    on_resource: 'member',
                    role: 'owner',
                },
            ],
        },
    });

    console.log('Create Health Plan:owner from Member:owner');
    await permit.api.resourceRoles.update('health_plan', 'owner', {
        granted_to: {
            users_with_role: [
                {
                    linked_by_relation: 'parent',
                    on_resource: 'member',
                    role: 'owner',
                },
            ],
        },
    });

    console.log('Create Health Plan:caregiver from Member:caregiver');
    await permit.api.resourceRoles.update('health_plan', 'caregiver', {
        granted_to: {
            users_with_role: [
                {
                    linked_by_relation: 'parent',
                    on_resource: 'member',
                    role: 'caregiver',
                },
            ],
        },
    });

    console.log('Create Medical Records:owner -> Member:owner');
    await permit.api.resourceRoles.update('medical_records', 'owner', {
        granted_to: {
            users_with_role: [
                {
                    linked_by_relation: 'parent',
                    on_resource: 'member',
                    role: 'owner',
                },
            ],
        },
    });

    console.log('Create Medical Records:caregiver -> Member:caregiver');
    await permit.api.resourceRoles.update('medical_records', 'caregiver', {
        granted_to: {
            users_with_role: [
                {
                    linked_by_relation: 'parent',
                    on_resource: 'member',
                    role: 'caregiver',
                },
            ],
        },
    });
};

(async () => {
    await cleanEnv();
    await createResources();
    await createResourceRelations();
    await createRoleDerivations();
    console.log('Done');
})();
