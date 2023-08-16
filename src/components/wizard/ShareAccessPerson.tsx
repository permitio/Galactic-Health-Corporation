import React, { useEffect, useState, useContext } from 'react';
import { WizardFormContext } from '@/contexts/WizardFormContext';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Skeleton } from '@mui/material';
import { Person } from '@/models/models';
import Link from 'next/link';


export default function ShareAccess() {
    const { setFormState } = useContext(WizardFormContext);
    const [persons, setPersons] = useState<Person[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/account/member`);
            const data = await response.json();
            setPersons(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const personId = event.target.value;
        setSelectedPersonId(personId);

        const person = persons.find((person) => person.id === personId);

        // Save selected person's entire data to the form state
        setFormState((prevFormState) => ({
            ...prevFormState,
            selectedPerson: person || null,
        }));
    };

    const selectedPerson = persons.find(
        (person) => person.id === selectedPersonId,
    );

    return (
        <div>
            <h2 className="font-semibold mt-10 text-xl mb-8">
                Who do you want to have this access?
            </h2>
            <div className="mb-12">
                {loading && (
                    <Skeleton variant="rectangular" className="w-full" height={50} />
                )}
                {!loading && persons.length === 0 && (
                    <>
                        <p className="font-semibold">No members found.</p>
                        <p className="text-gray-500">
                            To add a member, <Link href='/access'>add them to your member groups</Link> in your account.
                        </p>
                    </>
                )}
                {!loading && persons.length > 0 && (
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Person
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedPersonId}
                            label="Person"
                            onChange={handleChange}
                        >
                            {persons.map((person) => (
                                <MenuItem key={person.id} value={person.id}>
                                    {person.firstName} {person.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </div>

            {selectedPerson && (
                <>
                    <div className="flex flex-col mb-12">
                        <span className="font-bold">
                            Provide or confirm their personal information
                        </span>
                        <span>
                            The information below cannot e changed if pre-populated, but
                            you can add any missing information. If any pre-populated
                            information is incorrect, please call member services at
                            1-800-555-5555 to update the information.
                        </span>
                    </div>
                    <div className="mb-12 ml-6">
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">First name:</span>{' '}
                            {selectedPerson.firstName}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Last name:</span>{' '}
                            {selectedPerson.lastName}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Date of Birth:</span>{' '}
                            {selectedPerson.dateOfBirth}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Relationship:</span>{' '}
                            {selectedPerson.relationship}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Phone number:</span>{' '}
                            {selectedPerson.phoneNumber}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Email address:</span>{' '}
                            {selectedPerson.email}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
