import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { Permit } from 'permitio';
import { getAuth } from '@clerk/nextjs/server';
import { permit } from '@/app/api/authorizer';

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


    const jsonDirectory = path.join(process.cwd(), 'data');
    const appData = await fs.readFile(jsonDirectory + '/data.json', 'utf8');

    return NextResponse.json(JSON.parse(appData)?.health_plan?.[`health_plan_${uid}`] || {});
}

export { GET };
