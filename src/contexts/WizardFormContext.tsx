import { Person, SharingOptions } from '@/models/models';
import React, { createContext, useState, ReactNode } from 'react';


export type ExpiryDetails = {
    start: string;
    end: string;
};

export interface FormState {
    step: number;
    delegatePermissionOption: string;
    whatToShareOption: SharingOptions;
    selectedPerson: Person | null;
    expiryDate: ExpiryDetails;
}

interface WizardFormProviderProps {
    children: ReactNode;
}

const initialState: FormState = {
    step: 1,
    delegatePermissionOption: 'Account & Health Data',
    whatToShareOption: SharingOptions.health_plan,
    selectedPerson: null,
    expiryDate: {
        start: '',
        end: ''
    },
};

export const WizardFormContext = createContext<{
    formState: FormState;
    setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}>({ formState: initialState, setFormState: () => {} });

export const WizardFormProvider: React.FC<WizardFormProviderProps> = ({
    children,
}) => {
    const [formState, setFormState] = useState<FormState>(initialState);

    return (
        <WizardFormContext.Provider value={{ formState, setFormState }}>
            {children}
        </WizardFormContext.Provider>
    );
};
