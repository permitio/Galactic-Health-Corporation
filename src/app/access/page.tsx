'use client';

import CaregiverList from '@/components/access/CaregiverList';
import MemberGroups from '@/components/access/MemberGroups';
import { Caregiver, Person } from '@/models/models';


function ControlAccessPage() {
    return (
        <div className="flex flex-col p-8 justify-center">
            <h1 className="font-semibold text-sky-600 mb-8">
                Control Access
            </h1>
            <MemberGroups />
            <CaregiverList />
        </div>
    );
}

export default ControlAccessPage;
