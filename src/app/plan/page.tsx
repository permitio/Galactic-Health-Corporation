'use client';

import React, { useEffect, useState, useContext, FC } from 'react';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { UserContext, UserResource } from '@/contexts/UserContext';
import { Skeleton } from '@mui/material';
import PlanDropdown from '@/components/plans/PlanDropdown';

import { permitState } from 'permit-fe-sdk';

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
}

interface MedicalRecords {
    id: string;
    bloodType: string;
    allergies: string[];
}

interface Claim {
    id: string;
    date: string;
    provider: string;
    amount: number;
    status: string;
}

interface HealthPlan {
    id: string;
    claims: Claim[];
    balance: number;
    deductible: number;
    outOfPocketMax: number;
    claimsPaid: number;
    claimsPending: number;
    claimsDenied: number;
}

const UserTitle: FC<{
    currentUser?: UserResource | null;
    loggedInUser?: UserResource | null;
}> = ({ currentUser, loggedInUser }) => (
    <>
        {!currentUser?.firstName && (
            <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={500} />
        )}
        {currentUser?.firstName && (
            <h1 className="font-semibold text-sky-600 mb-8">
                {loggedInUser?.id === currentUser.id ? 'Welcome, ' : 'Viewing '}
                {currentUser.firstName} {currentUser.lastName}
                {loggedInUser?.id === currentUser.id
                    ? ''
                    : ' Dashboard as a Caregiver'}
            </h1>
        )}
    </>
);

const Dashboard = () => {
    const { currentUser, loggedInUser } = useContext(UserContext);

    const [healthPlan, setHealthPlan] = useState<HealthPlan | null>(null);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecords | null>(
        null,
    );
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchDashboard = () => {
            if (currentUser === null) {
                return;
            }
            setUserProfile(null);
            setHealthPlan(null);
            setMedicalRecords(null);
            let up: UserProfile | null = null, hp: HealthPlan | null = null, mr: MedicalRecords | null = null;
            Promise.all([
                // Fetching user profile data
                fetch(`/api/account/profile/${currentUser.id}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network Error');
                        }
                        return response.json();
                    })
                    .then((data) => (up = data))
                    .catch((error) => {
                        console.error(error);
                        up = null;
                    }),

                // Fetching health information
                fetch(`/api/account/dashboard/health-plan/${currentUser.id}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network Error');
                        }
                        return response.json();
                    })
                    .then((data) => (hp = data))
                    .catch((error) => {
                        console.error(error);
                        hp = null;
                    }),

                // Fetching health plan data
                fetch(`/api/account/dashboard/medical-records/${currentUser.id}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network Error');
                        }
                        return response.json();
                    })
                    .then((data) => (mr = data))
                    .catch((error) => {
                        console.error(error);
                        mr = null;
                    }),
            ]).finally(() => {
                console.log('All data fetched');
                if (!up || (!hp && !mr && !up && currentUser.id === loggedInUser?.id)) {
                    setTimeout(() => { fetchDashboard(); }, 5000);
                } else {
                    setUserProfile(up);
                    setHealthPlan(hp);
                    setMedicalRecords(mr);
                }
            });
        };
        fetchDashboard();
    }, [currentUser]);

    const personalBenefits = {
        GymMembershipDiscount: '20% off',
        WellnessProgram: 'Access to weekly yoga classes',
        HealthcareShopDiscounts: '10% off all products',
        TravelBenefits: 'Free annual health check-ups abroad',
        NutritionCounseling: 'Monthly session with a nutritionist',
    };

    return (
        <div className="flex flex-col p-8 justify-center">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <UserTitle
                    loggedInUser={loggedInUser}
                    currentUser={currentUser}
                />
                <PlanDropdown />
            </div>
            {!userProfile && !healthPlan && !medicalRecords && (
                <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={500}
                />
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loggedInUser?.id === currentUser?.id && permitState?.check('view', 'benefits_pg') && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
                        <div className="h-full w-full bg-white rounded">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Personal Benefits
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Your health benefits for this month (August)
                                </p>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                {Object.keys(personalBenefits).map(
                                    (key, index) => (
                                        <React.Fragment key={index}>
                                            <dt className="text-sm font-medium text-gray-500">
                                                {key
                                                    .split(/(?=[A-Z])/)
                                                    .join(' ')}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {
                                                    personalBenefits[
                                                    key as keyof typeof personalBenefits
                                                    ]
                                                }
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        window.alert(
                                                            `More information about ${key}`,
                                                        )
                                                    }
                                                >
                                                    <InfoIcon />
                                                </IconButton>
                                            </dd>
                                        </React.Fragment>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {loggedInUser?.id === currentUser?.id && permitState?.check('view', 'alt_medicine_pg') && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg bg-gradient-to-r from-green-500 via-purple-500 to-blue-500 p-1">
                        <div className="h-full w-full bg-white rounded">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Alternative Medicine Recommendations
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Personalized recommendations for alternative
                                    treatments
                                </p>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <div className="mt-2 flex justify-between">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Acupuncture
                                    </dt>
                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            window.alert(
                                                `More information about Acupuncture`,
                                            )
                                        }
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </div>
                                <dd className="mt-1 text-sm text-gray-900">
                                    We recommend trying acupuncture to help with
                                    stress relief.
                                </dd>

                                <div className="mt-4 flex justify-between">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Herbal Medicine
                                    </dt>
                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            window.alert(
                                                `More information about Herbal Medicine`,
                                            )
                                        }
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </div>
                                <dd className="mt-1 text-sm text-gray-900">
                                    Based on your records, certain herbal
                                    supplements could improve your sleep
                                    quality.
                                </dd>

                                <div className="mt-4 flex justify-between">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Chiropractic Adjustments
                                    </dt>
                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            window.alert(
                                                `More information about Chiropractic Adjustments`,
                                            )
                                        }
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </div>
                                <dd className="mt-1 text-sm text-gray-900">
                                    A series of chiropractic adjustments could
                                    alleviate your back pain.
                                </dd>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Profile */}
                {userProfile && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                User Profile
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Your account information
                            </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                First Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {userProfile.firstName}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Last Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {userProfile.lastName}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {userProfile.email}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Date of Birth
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {userProfile.dateOfBirth}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Phone Number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {userProfile.phoneNumber}
                            </dd>
                        </div>
                    </div>
                )}
                {/* Medical Records */}
                {medicalRecords && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Health Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Your personal health information
                            </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Blood Type
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {medicalRecords.bloodType}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Allergies
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {medicalRecords.allergies.join(', ')}
                            </dd>
                        </div>
                    </div>
                )}

                {/* Health Plan */}
                {healthPlan && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Health Plan
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Your current health plan details
                            </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Balance
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                ${healthPlan.balance}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Deductible
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                ${healthPlan.deductible}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Out of Pocket Max
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                ${healthPlan.outOfPocketMax}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Claims Paid
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                ${healthPlan.claimsPaid}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Claims Pending
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                ${healthPlan.claimsPending}
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 mt-2">
                                Claims Denied
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                ${healthPlan.claimsDenied}
                            </dd>
                        </div>
                        {/* Claims */}
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Claims
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:flex sm:justify-between overflow-x-auto">
                                {healthPlan.claims.map((claim, index) => (
                                    <div key={index} className="mt-2 sm:mt-0 min-w-[33%] pr-1">
                                        <div className="text-sm text-gray-900">
                                            {claim.date}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span className="text-gray-900">Provider:</span> {claim.provider}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span className="text-gray-900">Amount:</span> {claim.amount}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span className="text-gray-900">Status:</span> {claim.status}
                                        </div>
                                    </div>
                                ))}
                            </dd>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
