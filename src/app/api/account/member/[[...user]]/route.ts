import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { UserProfile, permit, permitProfile } from '@/app/api/authorizer';

const GET = async (
    request: NextRequest,
    { params }: { params: { user: string[] } },
) => {
    const { userId } = getAuth(request) || '';
    const usersReq = await permit.api.users.list({
        perPage: 100,
    });
    const users = usersReq.data;

    const memberGroups = await permit.api.roleAssignments.list({
        user: userId || '',
        role: 'admin',
    });

    const filtered: string[] = [];

    for (const group of memberGroups) {
        const groupMembers = await permit.api.roleAssignments.list({
            resourceInstance: group.resource_instance || '',
            role: 'org_member',
        });
        filtered.push(...(groupMembers.map((member) => member.user) || []));
    }

    const allowed = Array.from(new Set(filtered));

    return NextResponse.json(
        users
            .filter(({ key }) => key !== userId && allowed.includes(key))
            .map((user) => permitProfile(user as UserProfile)) || [],
    );
};

export { GET };
