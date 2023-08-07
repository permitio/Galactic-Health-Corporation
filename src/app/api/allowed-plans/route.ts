import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { Permit } from 'permitio';
import { permit } from '../authorizer';

const GET = async (
    request: NextRequest) => {
    const { userId } = getAuth(request) || '';
    const jsonDirectory = path.join(process.cwd(), 'data');
    const appData = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
    const users = JSON.parse(appData)?.users || {};

    const careGiverResources = await permit.api.roleAssignments.list({
        user: userId || '',
        role: 'caregiver',
    });

    const allowedUsers = Array.from(new Set(careGiverResources.map(({ resource_instance }) => resource_instance?.substring(resource_instance.indexOf('user_')))));

    return NextResponse.json(
        Object.keys(users).filter(
            (id) => (allowedUsers.includes(id) || id === userId)
        ).map(
            (id) => ({ id, ...users[id] })
        ) || []);
}

export { GET };
