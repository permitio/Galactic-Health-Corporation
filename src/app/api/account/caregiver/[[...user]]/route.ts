import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { UserRead } from 'permitio';
import { Caregiver, SharingOptions } from '@/models/models';
import { UserProfile, permit, permitProfile } from '@/app/api/authorizer';

type CaregiverAttributes = {
    caregiver_bounds: {
        [key: string]: {
            start_date: string;
            end_date: string;
        };
    };
};

type CaregiverUser = UserRead & {
    attributes: CaregiverAttributes;
};

const POST = async (
    request: NextRequest,
    { params }: { params: { user: string[] } },
) => {
    const { userId } = getAuth(request) || '';

    const allowed = await permit.check(userId || '', 'write', {
        type: 'member',
        key: `member_${userId}`,
    });

    if (!allowed) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const uid = params.user?.[0] || userId || '';
    const {
        user,
        resource,
        startDate: start_date,
        endDate: end_date,
    } = (await request.json()) as Caregiver;
    const resourceInstance = `${resource}:${resource}_${uid}`;

    const userRead = (await permit.api.getUser(
        user as string,
    )) as CaregiverUser;

    await permit.api.users.update(user as string, {
        attributes: {
            ...userRead?.attributes,
            caregiver_bounds: {
                ...userRead?.attributes?.caregiver_bounds,
                [resourceInstance]: {
                    start_date,
                    end_date,
                },
            },
        },
    });

    await permit.api.roleAssignments.assign({
        user: user as string,
        role: 'caregiver',
        resource_instance: resourceInstance,
    });

    return NextResponse.json({ success: true });
};

const DELETE = async (
    request: NextRequest,
    { params }: { params: { user: string[] } },
) => {
    const { userId } = getAuth(request) || '';

    const allowed = await permit.check(userId || '', 'write', {
        type: 'member',
        key: `member_${userId}`,
    });

    if (!allowed) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const uid = params.user?.[0] || userId || '';
    const resource = params.user?.[1] || '';
    const resourceInstance = `${resource}:${resource}_${userId}`;

    const user = (await permit.api.getUser(uid)) as CaregiverUser;

    delete user?.attributes?.caregiver_bounds?.[resourceInstance];

    await permit.api.users.update(uid, {
        attributes: {
            ...user?.attributes,
            caregiver_bounds: user?.attributes?.caregiver_bounds,
        },
    });

    await permit.api.roleAssignments.unassign({
        user: uid,
        role: 'caregiver',
        tenant: 'default',
        resource_instance: resourceInstance,
    });

    return NextResponse.json({ success: true });
};

const GET = async (
    request: NextRequest,
    { params }: { params: { user: string[] } },
) => {
    const { userId } = getAuth(request) || '';

    const allowed = await permit.check(userId || '', 'write', {
        type: 'member',
        key: `member_${userId}`,
    });

    if (!allowed) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const usersCall = await permit.api.users.list({
        perPage: 100,
    });
    const users = usersCall.data;
    const caregivers = await permit.api.roleAssignments.list({
        role: 'caregiver',
    });

    const caregiverUsers = caregivers.filter(
        ({ resource_instance = '' }) =>
            resource_instance?.indexOf(userId || '') > -1,
    );

    const permitUsers = (await Promise.all(
        caregiverUsers.map(({ user }) => permit.api.getUser(user as string)),
    )) as CaregiverUser[];

    const res = caregiverUsers.map(
        ({ user, resource_instance = '' }): Caregiver => ({
            user: permitProfile(
                users.find(({ key }) => key === user) as UserProfile,
            ),
            resource: resource_instance?.substring(
                0,
                resource_instance.indexOf(':'),
            ) as SharingOptions,
            startDate:
                permitUsers.find(({ key }) => key === user)?.attributes
                    ?.caregiver_bounds?.[resource_instance]?.start_date || '',
            endDate:
                permitUsers.find(({ key }) => key === user)?.attributes
                    ?.caregiver_bounds?.[resource_instance]?.end_date || '',
        }),
    );

    return NextResponse.json(res || []);
};

export { POST, GET, DELETE };
