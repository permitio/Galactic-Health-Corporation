import { NextRequest, NextResponse } from "next/server";
import { permit } from "../../../authorizer";
import { getAuth } from "@clerk/nextjs/server";
import { ResourceInstanceRead } from "permitio/build/main/openapi";
import { MemberGroup } from "@/models/models";
import { PermitApiError } from "permitio";

type MemberGroupAttribute = {
    name: string;
}

type MemberGroupInstance = ResourceInstanceRead & {
    attributes: MemberGroupAttribute;
}

const createMemberGroup = async (userId: string, name: string) => {
    const key = `member_group_${userId}_${name.toLowerCase().replace(/ /g, '_')}`;

    try {
        const group = await permit.api.resourceInstances.create({
            resource: 'member_group',
            key,
            tenant: 'default',
            attributes: {
                name,
            },
        });

        await permit.api.roleAssignments.assign({
            user: userId || '',
            role: 'admin',
            resource_instance: `member_group:${key}`,
        });

        await permit.api.relationshipTuples.create({
            subject: `member_group:${key}`,
            relation: 'belongs',
            object: `profile:profile_${userId}`,
            tenant: 'default',
        });

        return NextResponse.json(group);
    } catch (e) {
        const { response } = e as PermitApiError<any>;
        return NextResponse.json({
            message: response?.data?.message || 'An error occurred, make sure the group name is unique and stand in the correct format',
        }, {
            status: response?.status || 500,
        });
    }
};

const assignMemberGroup = async (userId: string, email: string, group: string) => {
    const allowed = await permit.check(userId || '', 'assign', `member_group:${group}`);

    if (!allowed) {
        return NextResponse.json({
            message: 'You are not allowed to assign members to this group',
        }, {
            status: 403,
        });
    }

    try {
        const users = await permit.api.listUsers();
        const assignedUser = users.find(({ email: userEmail }) => (userEmail === email))?.id || '';

        await permit.api.roleAssignments.assign({
            user: assignedUser,
            role: 'org_member',
            resource_instance: `member_group:${group}`,
            tenant: 'default',
        });

        await permit.api.relationshipTuples.create({
            subject: `member_group:${group}`,
            relation: 'belongs',
            object: `profile:profile_${assignedUser}`,
            tenant: 'default',
        });

        return NextResponse.json({
            success: true,
        });

    } catch (e) {
        const { response } = e as PermitApiError<any>;
        return NextResponse.json({
            message: response?.data?.message || 'An error occurred, make sure this user exists and is not already assigned to this group',
        }, {
            status: response?.status || 500,
        });
    }
};

const unassignMemberGroup = async (userId: string, email: string, group: string) => {
    if (!await permit.check(userId || '', 'assign', `member_group:${group}`)) {
        return NextResponse.json({
            message: 'You are not allowed to assign members to this group',
        }, {
            status: 403,
        });
    }

    try {
        const users = await permit.api.listUsers();
        const assignedUser = users.find(({ email: userEmail }) => (userEmail === email))?.id || '';

        await permit.api.roleAssignments.unassign({
            user: assignedUser,
            role: 'org_member',
            resource_instance: `member_group:${group}`,
            tenant: 'default',
        });

        await permit.api.relationshipTuples.delete({
            subject: `member_group:${group}`,
            relation: 'belongs',
            object: `profile:profile_${assignedUser}`,
        });

        return NextResponse.json({
            success: true,
        });
    } catch (e) {
        const { response } = e as PermitApiError<any>;
        return NextResponse.json({
            message: response?.data?.message || 'An error occurred',
        }, {
            status: response?.status || 500,
        });
    }
};


const GET = async (
    request: NextRequest
) => {
    const { userId } = getAuth(request) || '';
    const groups: MemberGroup[] = [];

    const userGroups = await permit.api.roleAssignments.list({
        user: userId || '',
        role: 'admin',
    });

    for (const group of userGroups.filter(group => group.resource_instance?.indexOf('member_group') === 0)) {
        const { key, attributes } = await permit.api.resourceInstances.get(group.resource_instance_id || '') as MemberGroupInstance;
        const members = await permit.api.roleAssignments.list({
            resourceInstance: `member_group:${key}`,
            role: 'org_member',
        });

        const users = await Promise.all(members.filter(({ user }) => (user !== userId)).map(({ user_id }) => permit.api.users.get(user_id || '')));

        groups.push({
            key,
            name: attributes?.name || '',
            members: users
        });
    }

    return NextResponse.json(groups);
};

const POST = async (
    request: NextRequest,
    { params }: { params: { action: string[] } }
) => {
    const { userId } = getAuth(request) || '';
    if (!params.action) {
        const { name } = await request.json();
        return createMemberGroup(userId || '', name);
    } else if (params.action[0] === 'assign') {
        const { email, group } = await request.json();
        return assignMemberGroup(userId || '', email, group);
    } else if (params.action[0] === 'unassign') {
        const { email, group } = await request.json();
        return unassignMemberGroup(userId || '', email, group);
    }
    return NextResponse.json({
        success: false,
    }, {
        status: 404
    });
};

const DELETE = async (
    request: NextRequest
) => {
    const { userId } = getAuth(request) || '';
    const { key } = await request.json();

    const allowed = await permit.check(userId || '', 'assign', `member_group:${key}`);

    if (!allowed) {
        return NextResponse.json({
            message: 'You are not allowed to delete this group',
        }, {
            status: 403,
        });
    }

    await permit.api.resourceInstances.delete(key);

    return NextResponse.json({
        success: true,
    });
};

export { GET, POST, DELETE };
