'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useUser } from '@clerk/nextjs';

export interface UserResource {
    id: string;
    firstName: string | null;
    lastName: string | null;
}

export interface UserContextInterface {
    loggedInUser: UserResource | null; // User that owns the current session
    currentUser: UserResource | null; // User that is selected via the dropdown
    setCurrentUser: React.Dispatch<React.SetStateAction<UserResource | null>>;
    loading: boolean;
}

export const UserContext = createContext<UserContextInterface>({
    loggedInUser: null,
    currentUser: null,
    setCurrentUser: () => {},
    loading: true, // By default, loading is true
});

interface UserContextProviderProps {
    children: React.ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
    children,
}) => {
    const { user } = useUser();
    const [loggedInUser, setLoggedInUser] = useState<UserResource | null>(null);
    const [currentUser, setCurrentUser] = useState<UserResource | null>(null);
    const [loading, setLoading] = useState(true); // Create a loading state

    useEffect(() => {}, [currentUser]);

    // Setting loggedIn user only once.
    if (user && !loggedInUser) {
        setLoggedInUser(user);
    }

    useEffect(() => {
        // Only update the currentUser state if user has a valid value
        if (user) {
            setLoggedInUser(user);
            setCurrentUser(user);
            setLoading(false); // Set loading to false once user is fetched
        }
    }, [user]);

    return (
        <UserContext.Provider
            value={{
                loggedInUser,
                currentUser,
                setCurrentUser,
                loading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error(
            'useUserContext must be used within a UserContextProvider',
        );
    }
    return context;
}
