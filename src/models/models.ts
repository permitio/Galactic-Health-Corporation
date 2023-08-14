import { UserRead } from "permitio";

export enum SharingOptions {
    member = 'member',
    health_plan = 'health_plan',
    medical_records = 'medical_records',
}

export type Person = {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    relationship: string;
    groups?: string[];
};

export type Caregiver = {
    user: Person | string;
    resource: SharingOptions;
    startDate: string;
    endDate: string;
}

export type MemberGroup = {
    key: string;
    name: string;
    members: UserRead[];
}
