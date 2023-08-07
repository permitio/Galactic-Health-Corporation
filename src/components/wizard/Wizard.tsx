import React, { useContext } from 'react';
import { WizardFormContext, FormState } from '../../contexts/WizardFormContext';
import { useUserContext } from '../../contexts/UserContext';

import DelegatePermissions from './DelegatePermissions';
import ShareAccess from './ShareAccess';
import ShareAccessPerson from './ShareAccessPerson';
import AccessLength from './AccessLength';
import ConfirmInformation from './ConfirmInformation';
import Summary from './Summary';
import { Step, StepLabel, Stepper } from '@mui/material';
import { Caregiver } from '@/models/models';

const steps = [
    'Choose what to share',
    'Who to share with',
    'Set access period',
    'Review and submit',
];
const StepComponents = [
    DelegatePermissions,
    ShareAccess,
    ShareAccessPerson,
    AccessLength,
    ConfirmInformation,
    Summary,
];

export default function Wizard() {
    const { formState, setFormState } = useContext(WizardFormContext);
    const { loggedInUser } = useUserContext();

    const StepComponent = StepComponents[formState.step - 1]; // -1 because array is zero indexed

    const nextStep = () => {
        setFormState((prevState) => ({
            ...prevState,
            step: prevState.step + 1,
        }));
    };

    const prevStep = () => {
        setFormState((prevState) => ({
            ...prevState,
            step: prevState.step - 1,
        }));
    };

    const cancelStep = () => {
        // Handle the cancel logic here
    };

    const submitStep = async () => {
        if (!loggedInUser) {
            console.error('Logged in user is not defined');
            return;
        }

        const {
            whatToShareOption,
            selectedPerson,
            expiryDate: { start, end },
        } = formState;

        const requestBody: Caregiver = {
            user: selectedPerson?.id || '',
            resource: whatToShareOption,
            startDate: start || new Date().toISOString(),
            endDate:
                end ||
                new Date(
                    new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
                ).toISOString(),
        };

        try {
            const response = await fetch('/api/account/caregiver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // If everything is ok, go to the next step
            nextStep();

            // Add code to handle success or use the response as required
        } catch (error) {
            console.error('An error occurred while assigning caregiver', error);
        }
    };

    console.log(formState);

    return (
        <div>
            {formState.step > 1 && formState.step < 6 && (
                <Stepper activeStep={formState.step - 2} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            )}
            <StepComponent />
            {formState.step > 1 && formState.step < 6 && (
                <button
                    onClick={prevStep}
                    disabled={formState.step === 1}
                    className="px-3 py-1 border border-blue-900 rounded-3xl w-32 mr-4 mt-4"
                >
                    Back
                </button>
            )}
            {formState.step < 6 && (
                <button
                    onClick={cancelStep}
                    className="px-3 py-1 border border-blue-900 rounded-3xl w-32 mr-4 mt-4"
                >
                    Cancel
                </button>
            )}
            {formState.step < 5 ? (
                <button
                    onClick={nextStep}
                    disabled={formState.step === StepComponents.length}
                    className="px-3 py-1 border border-blue-900 rounded-3xl w-32 mr-4 bg-blue-900 text-white mt-4"
                >
                    Next
                </button>
            ) : formState.step === 5 ? (
                <button
                    onClick={submitStep}
                    className="px-3 py-1 border border-blue-900 rounded-3xl w-32 mr-4 bg-blue-900 text-white mt-4"
                >
                    Submit
                </button>
            ) : (
                <button className="px-3 py-1 border border-blue-900 rounded-3xl w-32 mr-4 bg-blue-900 text-white mt-4">
                    View PDF
                </button>
            )}
        </div>
    );
}
