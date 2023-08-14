import React, { useContext } from 'react';
import { WizardFormContext } from '@/contexts/WizardFormContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Link from 'next/link';
import { Radio } from '@mui/material';
import { SharingOptions } from '@/models/models';

export default function ShareAccess() {
    const { formState, setFormState } = useContext(WizardFormContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SharingOptions;
        setFormState((prevFormState) => ({
            ...prevFormState,
            whatToShareOption: value,
        }));
    };

    return (
        <div className="px-4 md:px-0">
            <h2 className="font-semibold mt-10 text-xl">
                What would you like to share?
            </h2>
            <span>
                You can choose to share your account access, your health data,
                or both.
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-12">
                <div className="flex flex-col md:flex-row w-full p-5 border rounded-lg border-gray-300">
                    <div className="w-full md:w-1/5">
                        <Radio
                            checked={
                                formState.whatToShareOption ===
                                SharingOptions.health_plan
                            }
                            onChange={handleChange}
                            value={SharingOptions.health_plan}
                            name="radio-buttons"
                            inputProps={{
                                'aria-label': SharingOptions.health_plan,
                            }}
                            color="primary"
                        />
                    </div>
                    <div className="w-full md:w-4/5 pr-4">
                        <h3 className="text-lg font-medium mb-4">
                            Share account access
                        </h3>
                        <span>
                            The person you share account access with must be a
                            member on your plan. They will be able to see the
                            same information and take the same actions you can,
                            with few exceptions. For example, they will be able
                            to:
                        </span>
                        <div className="flex flex-col">
                            <div className="flex mt-4">
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                />
                                <span className="ml-3">
                                    View medical claims and family level
                                    deductible and coinsurance/out of pocket
                                    maximums
                                </span>
                            </div>
                            <div className="flex mt-4">
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                />
                                <span className="ml-3">
                                    Access sensitive information for children 12
                                    and under
                                </span>
                            </div>
                            <div className="flex mt-4">
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                />
                                <span className="ml-3">
                                    View HSA account balance
                                </span>
                            </div>
                            <Link
                                href="#"
                                className="mt-6 mb-3 text-sky-500 font-medium"
                            >
                                See a complete list of what someone with this
                                access can and cannot do
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row w-full p-5 border rounded-lg border-gray-300">
                    <div className="w-full md:w-1/5">
                        <Radio
                            checked={
                                formState.whatToShareOption ===
                                SharingOptions.medical_records
                            }
                            onChange={handleChange}
                            value={SharingOptions.medical_records}
                            name="radio-buttons"
                            inputProps={{
                                'aria-label': SharingOptions.medical_records,
                            }}
                            color="primary"
                        />
                    </div>
                    <div className="w-full md:w-4/5 pr-4">
                        <h3 className="text-lg font-medium mb-4">
                            Share your health data
                        </h3>
                        <span>
                            You can choose to shate your Protected Health
                            Information (PHI) with a person by agreeing to a
                            HIPAA Release of Information. This will enable them
                            to do the following:
                        </span>
                        <div className="flex flex-col">
                            <div className="flex mt-4">
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                />
                                <span className="ml-3">
                                    Discuss your sensitive information with
                                    customer service
                                </span>
                            </div>
                            <div className="flex mt-4">
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                />
                                <span className="ml-3">
                                    View your individual health records
                                </span>
                            </div>
                            <div className="flex mt-4">
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                />
                                <span className="ml-3">
                                    File appeals and grievances on your behalf
                                </span>
                            </div>
                            <Link
                                href="#"
                                className="mt-6 mb-3 text-sky-500 font-medium"
                            >
                                See a complete list of what someone with this
                                access can and cannot do
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row w-full p-5 border rounded-lg border-gray-300">
                    <div className="w-full md:w-1/5">
                        <Radio
                            checked={
                                formState.whatToShareOption ===
                                SharingOptions.member
                            }
                            onChange={handleChange}
                            value={SharingOptions.member}
                            name="radio-buttons"
                            inputProps={{ 'aria-label': SharingOptions.member }}
                            color="primary"
                        />
                    </div>
                    <div className="w-full md:w-4/5 pr-4">
                        <h3 className="text-lg font-medium mb-4">
                            Share both your account access and your health data
                        </h3>
                        <span>
                            This option gives access to both, your health plan
                            account and your Protected Health Information (PHI),
                            as described above.
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col mb-12">
                <h3 className="text-lg font-medium mb-4">
                    The following cannot be shared:
                </h3>
                <div className="flex flex-col">
                    <div className="flex mt-4">
                        <RemoveCircleIcon
                            sx={{ color: 'red' }}
                            fontSize="small"
                        />
                        <span className="ml-3">
                            Sensitive information for members age 13 and older
                        </span>
                    </div>
                    <div className="flex mt-4">
                        <RemoveCircleIcon
                            sx={{ color: 'red' }}
                            fontSize="small"
                        />
                        <span className="ml-3">
                            The ability to pay claims from the web portal or
                            mobile app
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
