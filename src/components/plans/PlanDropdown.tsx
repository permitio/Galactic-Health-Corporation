'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { useUserContext, UserResource } from '@/contexts/UserContext';
import { Skeleton } from '@mui/material';

interface User {
    id: string;
    firstName: string;
    lastName: string;
}

export default function PlanDropdown() {
    const { user } = useUser();
    const [users, setUsers] = useState<UserResource[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, setCurrentUser, loggedInUser } = useUserContext();

    useEffect(() => {
        // Check if user is signed in
        if (user) {
            fetch('/api/allowed-plans')
                .then((response) => response.json())
                .then((data: UserResource[]) => {
                    setUsers(data);
                    // Look for the logged in user in the fetched user list
                    const loggedInUser = data.find((u) => u.id === user.id);
                    // Set the logged-in user as the current user
                    setCurrentUser(loggedInUser ?? null);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        const selectedUserId = event.target.value;
        const selectedUser = users.find((user) => user.id === selectedUserId);
        setCurrentUser(selectedUser ?? null); // selectedUserId
    };

    if (loading || users.length === 0) {
        return <Skeleton variant="rectangular" width={200} height={40} />;
    }

    if (users.length === 1) {
        return null;
    }

    return (
        <FormControl variant="outlined" size="small" style={{ width: '200px' }}>
            <Select
                value={currentUser?.id || ''}
                onChange={handleUserChange}
                displayEmpty
            >
                {users.map((user: UserResource) => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                        {user.id === loggedInUser?.id ? ' (Logged in)' : ''}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
