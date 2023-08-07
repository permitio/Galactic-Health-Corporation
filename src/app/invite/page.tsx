'use client';

import React from 'react';
import { WizardFormProvider } from '../../contexts/WizardFormContext';
import Wizard from '../../components/wizard/Wizard';

export default function InviteUser() {
  return (
    <div className="p-8">
      <WizardFormProvider>
        <Wizard />
      </WizardFormProvider>
    </div>
  );
}
