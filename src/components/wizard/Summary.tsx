import React, { useContext } from 'react';
import { WizardFormContext } from '../../contexts/WizardFormContext';
import ExpiryDate from './AccessLength';

function SuccessComponent() {
    const { formState } = useContext(WizardFormContext);
    const { selectedPerson, expiryDate } = formState;

    if (!selectedPerson) {
        return null;
    }

    return (
        <div className="my-12">
            <h2 className="font-semibold mt-10 text-2xl mb-6">
                Success! You&#39;ve set up shared account and health data access for{' '}
                {selectedPerson.firstName}
            </h2>
            <span>
                {selectedPerson.firstName} will receive an email or mailed
                confirmation letting them know that you have provided your
                approval for them to access your information and act on your
                behalf in certain circumstances.
            </span>
            <h3 className="text-lg font-medium mb-4 mt-6">
                Manage their access
            </h3>
            <span>
                You can manage shared access at any time from this site or by
                calling the number on the back of your medical card.
            </span>
            <h2 className="font-semibold mt-10 text-xl mb-6">
                {selectedPerson.firstName} will have shared access until{' '}
                {new Date(expiryDate.end).toLocaleString()}.
            </h2>
        </div>
    );
}

export default SuccessComponent;
