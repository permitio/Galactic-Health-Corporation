import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { UserProfile, permit, permitProfile } from "@/app/api/authorizer";

const GET = async (
    request: NextRequest,
    { params }: { params: { user: string[] } }) => {
    const { userId } = getAuth(request);
    const uid = params.user?.[0] || userId || '';

    const allowed = await permit.check(userId || '', 'read', {
        type: 'profile',
        key: `profile_${uid}`
    });

    if (!allowed) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const user = await permit.api.users.get(uid);
    const profile = permitProfile(user as UserProfile);

    return NextResponse.json({
        ...profile,
        id: uid,
        relationship: 'Self',
    } || {});
}

export { GET };
