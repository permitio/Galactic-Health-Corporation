import React, { useContext } from 'react';
import Link from 'next/link';
import { WizardFormContext } from '@/contexts/WizardFormContext';
import { Radio } from '@mui/material';

export default function DelegatePermissions() {
    const { formState, setFormState } = useContext(WizardFormContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prevFormState) => ({
            ...prevFormState,
            delegatePermissionOption: event.target.value,
        }));
    };

    return (
        <div className="px-4 md:px-6 lg:px-8">
            <h1 className="font-semibold text-sky-600 text-2xl md:text-4xl">
                Share access to your plan
            </h1>
            <div className="flex flex-col mt-4">
                <span className="text-sm md:text-base">
                    If you&#39;d like others to have access to your health plan, you
                    have options for what your share.
                </span>
                <Link href="#" className="mt-3 mb-3 text-sky-600 text-medium">
                    Learn about the different access and permission types
                </Link>
            </div>

            <h2 className="font-semibold mt-10 text-xl md:text-2xl">
                Choose the type of access you want to share
            </h2>
            <div className="flex flex-col md:flex-row mt-4 mb-12">
                <div className="flex h-full w-full md:w-1/2 py-5 md:p-5 border-black border-b md:border-r md:border-0">
                    <div className="w-1/5">
                        <Radio
                            checked={
                                formState.delegatePermissionOption ===
                                'Account & Health Data'
                            }
                            onChange={handleChange}
                            value="Account & Health Data"
                            name="radio-buttons"
                            inputProps={{
                                'aria-label': 'Account & Health Data',
                            }}
                            color="primary"
                        />
                    </div>
                    <div className="w-4/5">
                        <h3 className="text-lg font-medium mb-4">
                            Share access to your account or health data
                        </h3>
                        <span>
                            Choose this option if you want someone to be able to
                            access and manage your plan. Or, if you want to
                            allow access to your Protected Health Information
                            (PHI), by agreeing to a HIPAA Release of
                            Information.
                        </span>
                    </div>
                </div>
                <div className="flex h-full w-full md:w-1/2 p-5 mt-6 md:mt-0 md:ml-6">
                    <div className="w-1/5">
                        <Radio
                            checked={
                                formState.delegatePermissionOption ===
                                'Power of Attorney, Guardian or Conservator'
                            }
                            onChange={handleChange}
                            value="Power of Attorney, Guardian or Conservator"
                            name="radio-buttons"
                            inputProps={{
                                'aria-label':
                                    'Power of Attorney, Guardian or Conservator',
                            }}
                            color="primary"
                        />
                    </div>
                    <div className="w-4/5">
                        <h3 className="text-lg font-medium mb-4">
                            Provide access for a Power of Attorney, Guardian, or
                            Conservator
                        </h3>
                        <span>
                            We will need to receive a copy of the legal
                            documentation to grant access, and s is based on the
                            specific documentation.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
