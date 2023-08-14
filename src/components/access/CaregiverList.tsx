import { Button, CircularProgress, Skeleton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';
import { Caregiver, Person } from '@/models/models';

type CaregiverListItem = Caregiver & {
    user: Person;
};

const CaregiverList = () => {

    const [caregiverData, setCaregiverData] = useState<CaregiverListItem[]>([]);
    const [revokingCaregiver, setRevokingCaregiver] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCaregiverData();
    }, []);

    const fetchCaregiverData = async () => {
        try {
            const response = await fetch('/api/account/caregiver');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCaregiverData(data);
            setLoading(false);
        } catch (error) {
            console.error(
                'An error occurred while fetching caregiver data',
                error,
            );
            setLoading(false);
        }
    };

    // userId should be passed in as a parameter
    const revokePermissions = async (userId: string, resource: string) => {
        setRevokingCaregiver(userId);
        try {
            const response = await fetch(
                `/api/account/caregiver/${userId}/${resource}`,
                {
                    method: 'DELETE',
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setLoading(true);
            await fetchCaregiverData();
        } catch (error) {
            console.error(
                'An error occurred while revoking caregiver permissions',
                error,
            );
            setRevokingCaregiver('');
        } finally {
            setRevokingCaregiver('');
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <h2 className="font-semibold text-sky-600 my-2">
                Caregiver Access
            </h2>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                {isMobile ? (

                    // Mobile view
                    <div>
                        {!loading &&
                            caregiverData.length > 0 &&
                            caregiverData.map(
                                ({
                                    user,
                                    startDate,
                                    endDate,
                                    resource,
                                }: CaregiverListItem) => (
                                    <div
                                        className="border p-4 m-2 rounded"
                                        key={`${user.id}${resource}`}
                                    >
                                        <div className="font-bold text-xs mb-2">
                                            Full Name
                                        </div>
                                        <div className="mb-4">
                                            {user.firstName +
                                                ' ' +
                                                user.lastName}
                                        </div>

                                        <div className="font-bold text-xs mb-2">
                                            Start Date
                                        </div>
                                        <div className="mb-4">
                                            {startDate
                                                ? new Date(
                                                    startDate,
                                                ).toLocaleString()
                                                : 'N/A'}
                                        </div>

                                        <div className="font-bold text-xs mb-2">
                                            End Date
                                        </div>
                                        <div className="mb-4">
                                            {endDate
                                                ? new Date(
                                                    endDate,
                                                ).toLocaleString()
                                                : 'N/A'}
                                        </div>

                                        <div className="font-bold text-xs mb-2">
                                            Shared Data
                                        </div>
                                        <div className="mb-4">
                                            {`${resource[0].toUpperCase()}${resource.slice(
                                                1,
                                            )}`
                                                .split('_')
                                                .join(' ')}
                                        </div>

                                        <Button
                                            onClick={() =>
                                                revokePermissions(
                                                    user.id,
                                                    resource,
                                                )
                                            }
                                            variant="contained"
                                            color="error"
                                            style={{
                                                backgroundColor: '#d32f2f',
                                            }}
                                            disabled={
                                                revokingCaregiver === user.id
                                            }
                                        >
                                            {revokingCaregiver === user.id && (
                                                <CircularProgress
                                                    size={24}
                                                    color="error"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        marginTop: '-12px',
                                                        marginLeft: '-12px',
                                                    }}
                                                />
                                            )}
                                            Revoke Permissions
                                        </Button>
                                    </div>
                                ),
                            )}
                    </div>
                ) : (
                    // Desktop view
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Full Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Shared Data
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <Skeleton
                                            variant="rectangular"
                                            className="w-full"
                                            height={40}
                                        />
                                    </td>
                                </tr>
                            )}
                            {!loading && caregiverData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 whitespace-nowrap text-center"
                                    >
                                        <p className="text-gray-500">
                                            No caregivers found.
                                        </p>
                                    </td>
                                </tr>
                            )}
                            {!loading &&
                                caregiverData.length > 0 &&
                                caregiverData.map(
                                    ({
                                        user,
                                        startDate,
                                        endDate,
                                        resource,
                                    }: CaregiverListItem) => (
                                        <tr key={`${user.id}${resource}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.firstName +
                                                        ' ' +
                                                        user.lastName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {startDate
                                                        ? new Date(
                                                            startDate,
                                                        ).toLocaleString()
                                                        : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {endDate
                                                    ? new Date(
                                                        endDate,
                                                    ).toLocaleString()
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {`${resource[0].toUpperCase()}${resource.slice(
                                                    1,
                                                )}`
                                                    .split('_')
                                                    .join(' ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    onClick={() =>
                                                        revokePermissions(
                                                            user.id,
                                                            resource,
                                                        )
                                                    }
                                                    variant="contained"
                                                    color="error"
                                                    style={{
                                                        backgroundColor:
                                                            '#d32f2f',
                                                    }}
                                                    disabled={
                                                        revokingCaregiver ===
                                                        user.id
                                                    }
                                                >
                                                    {revokingCaregiver ===
                                                        user.id && (
                                                            <CircularProgress
                                                                size={24}
                                                                color="error"
                                                                sx={{
                                                                    position:
                                                                        'absolute',
                                                                    top: '50%',
                                                                    left: '50%',
                                                                    marginTop:
                                                                        '-12px',
                                                                    marginLeft:
                                                                        '-12px',
                                                                }}
                                                            />
                                                        )}
                                                    Revoke Permissions
                                                </Button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
};

export default CaregiverList;
