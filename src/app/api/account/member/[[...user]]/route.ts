import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { getAuth } from '@clerk/nextjs/server';
import { Permit } from 'permitio';
import { permit } from '@/app/api/authorizer';

const GET = async (
    request: NextRequest,
    { params }: { params: { user: string[] } }) => {
    const { userId } = getAuth(request) || '';
    const jsonDirectory = path.join(process.cwd(), 'data');
    const appData = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
    const users = JSON.parse(appData)?.users || {};

    const memberGroups = await permit.api.roleAssignments.list({
        user: userId || '',
        role: 'admin',
    });

    const filtered: string[] = [];

    for (const group of memberGroups) {
        const groupMembers = await permit.api.roleAssignments.list({
            resourceInstance: group.resource_instance || '',
            role: 'org_member'
        });
        filtered.push(...groupMembers.map((member) => member.user) || []);
    }

    const allowed = Array.from(new Set(filtered));

    return NextResponse.json(
        Object.keys(users).filter((id) => (id !== userId) && allowed.includes(id)).map((id) => ({
            id,
            relationship: id === userId ? 'Self' : 'Other',
            ...users[id]
        })) || []);
}

export { GET };
