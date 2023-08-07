import { permit } from "@/app/api/authorizer";
import { NextRequest, NextResponse } from "next/server";

const GET = async (request: NextRequest) => {
    const url = new URL(request.nextUrl.href);
    const { user: userId, action, resource } = Object.fromEntries(url.searchParams);

    if (!userId) {
        return NextResponse.json({ error: 'No User Id' }, { status: 400 });
    }

    console.log("USER-ID: ", userId);

    if (!action || !resource) {
        return NextResponse.json({ error: 'Missing action or resource' }, { status: 400 });
    }

    console.log("Action & Resource: ", action, resource);

    const allowed = await permit.check(userId, action, resource);

    console.log("ALLOWED: ", allowed);

    if (!allowed) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    return NextResponse.json({ permitted: allowed });
}

export { GET };
