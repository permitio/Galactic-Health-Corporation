import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { permit } from '@/app/api/authorizer';

const generateRandomHealthPlan = () => {
    const status = ['Claimed', 'Pending', 'Denied'];
    const provider = ['Dr. Watson', 'Dr. House', 'Dr. Strange', 'Dr. Banner', 'Dr. Doom', 'Dr. Octopus', 'Dr Pepper'];

    const claims = new Array(Math.floor(Math.random() * 10)).fill(0).map(() => ({
        status: status[Math.floor(Math.random() * status.length)],
        provider: provider[Math.floor(Math.random() * provider.length)],
        amount: Math.floor(Math.random() * 1000),
        date: new Date(Math.floor(Math.random() * 1000000000000)).toDateString(),
        id: Math.floor(Math.random() * 1000000000000),
    }));
        
    return {
        claims,
        balance: Math.floor(Math.random() * 10000),
        deductible: Math.floor(Math.random() * 10000),
        outOfPocketMax: Math.floor(Math.random() * 10000),
        claimsPaid: Math.floor(Math.random() * 10000),
        claimsPending: Math.floor(Math.random() * 10000),
        claimsDenied: Math.floor(Math.random() * 10000),
    }
};

const GET = async (
    request: NextRequest,
    { params }: { params: { user: string[] } }) => {

    const { userId } = getAuth(request) || '';
    const uid = params.user?.[0] || userId || '';

    const allowed = await permit.check(userId || '', 'read', {
        type: 'health_plan',
        key: `health_plan_${uid}`
    });

    if (!allowed) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    return NextResponse.json(generateRandomHealthPlan());
}

export { GET };
