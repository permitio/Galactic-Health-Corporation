import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { UserProfile, permit, permitProfile } from '../authorizer';

const GET = async (
    request: NextRequest) => {
    const { userId } = getAuth(request) || '';
    const users = await permit.api.listUsers();

    const careGiverResources = await permit.api.roleAssignments.list({
        user: userId || '',
        role: 'caregiver',
    });

    const allowedUsers = Array.from(new Set(careGiverResources.map(({ resource_instance }) => resource_instance?.substring(resource_instance.indexOf('user_')))));

    return NextResponse.json(
        users.filter(
            ({key}) => (allowedUsers.includes(key) || key === userId)
        ).map((user) => (permitProfile(user as UserProfile))) || []);
}

export { GET };
