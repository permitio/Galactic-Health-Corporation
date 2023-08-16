import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { permit } from "../authorizer";
import { clerkClient } from "@clerk/nextjs";

const GET = async (
    request: NextRequest) => {
    const { userId } = getAuth(request) || '';

    const user = await permit.api.users.get(userId || '');

    if (!user) {
        return NextResponse.json({
            success: false,
        }, {
            status: 404,
        });
    }

    return NextResponse.json(user);
};

const POST = async (
    request: NextRequest) => {
    const { userId } = getAuth(request) || '';
    const user = await clerkClient.users.getUser(userId || '');
    const { firstName, lastName, phoneNumber, dateOfBirth } = await request.json();
    
    await clerkClient.users.updateUser(userId || '', {
        firstName,
        lastName,
    });

    const { key: createdUser } = await permit.api.syncUser({
        key: userId || '',
        first_name: firstName,
        last_name: lastName,
        email: user?.emailAddresses[0].emailAddress || '',
        attributes: {
            phoneNumber,
            dateOfBirth,
        }
    });

    await permit.api.roleAssignments.assign({
        user: createdUser,
        role: 'owner',
        resource_instance: `member:member_${createdUser}`,
        tenant: 'default',
    });

    await permit.api.relationshipTuples.create({
        subject: `member:member_${createdUser}`,
        relation: 'parent',
        object: `profile:profile_${createdUser}`,
        tenant: 'default',
    });

    await permit.api.relationshipTuples.create({
        subject: `member:member_${createdUser}`,
        relation: 'parent',
        object: `health_plan:health_plan_${createdUser}`,
        tenant: 'default',
    });

    await permit.api.relationshipTuples.create({
        subject: `member:member_${createdUser}`,
        relation: 'parent',
        object: `medical_records:medical_records_${createdUser}`,
        tenant: 'default',
    });

    return NextResponse.json({
        success: true,
    });
}

export { GET, POST };
