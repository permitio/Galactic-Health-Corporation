import { NextRequest, NextResponse } from "next/server";

import { getAuth } from '@clerk/nextjs/server';
import { permit } from "@/app/api/authorizer";

const generateRandomMedicalRecords = () => {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    const allergiesOptions = ['Peanuts', 'Shellfish', 'Eggs', 'Milk', 'Wheat', 'Soy', 'Tree Nuts', 'Fish'];
    const allergies = new Array(Math.floor(Math.random() * 5)).fill(0).map(() => allergiesOptions[Math.floor(Math.random() * allergiesOptions.length)]);
    return {
        bloodType,
        allergies
    }
};

const GET = async (
    request: NextRequest,
    { params }: { params: { user: string[] } }) => {
    const { userId } = getAuth(request) || '';
    const uid = params.user?.[0] || userId || '';

    const allowed = await permit.check(userId || '', 'read', {
        type: 'medical_records',
        key: `medical_records_${uid}`
    });

    if (!allowed) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    return NextResponse.json(generateRandomMedicalRecords());
}

export { GET };
