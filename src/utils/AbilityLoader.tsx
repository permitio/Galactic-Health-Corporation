'use client';

import React, { useEffect, useState } from 'react';

import { Ability } from '@casl/ability';
import { Permit, permitState } from 'permit-fe-sdk';
import { UserResource, useUserContext } from '@/contexts/UserContext';

const AbilityLoader: React.FC = () => {
    const { loggedInUser } = useUserContext();
    const [ability, setAbility] = useState<Ability | undefined>(undefined);

    useEffect(() => {
        if (loggedInUser) {
            getAbility(loggedInUser).then((caslAbility: any) => {
                setAbility(caslAbility);
            });
        }
    }, [loggedInUser]);

    if (!ability) {
        return null; // or return a loading spinner
    }

    return null;
};

const getAbility = async (loggedInUser: UserResource) => {
    const permit = Permit({
        loggedInUser: loggedInUser?.id, // use the email from loggedInUser
        backendUrl:
            '/api/account/dashboard/health-benefits/',
    });

    await permit.loadLocalState([
        { action: 'view', resource: 'benefits_pg' },
        { action: 'view', resource: 'alt_medicine_pg' },
    ]);

    const caslConfig = permitState.getCaslJson();

    console.log('CASL Config: ', caslConfig);

    return caslConfig && caslConfig.length
        ? new Ability(caslConfig)
        : undefined;
};

export default AbilityLoader;
