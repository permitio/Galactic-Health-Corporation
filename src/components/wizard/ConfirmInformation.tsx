import * as React from 'react';
import { useContext, useRef, useState, useEffect } from 'react';
import { WizardFormContext } from '@/contexts/WizardFormContext';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import loremIpsum from '../../../data/lorem-ipsum.json';
import { UserContext } from '@/contexts/UserContext';

export default function ReviewSignSubmit() {
    const { formState } = useContext(WizardFormContext);
    const { currentUser } = useContext(UserContext);

    const [name, setName] = useState<string>('');
    const [checked, setChecked] = useState(false);
    const [scrolledToEnd, setScrolledToEnd] = useState(false);
    const scrollableRef = useRef<HTMLDivElement>(null);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setChecked(event.target.checked);
    };

    const handleScroll = () => {
        if (scrollableRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                scrollableRef.current;
            // Check if the user has scrolled to the end of the content
            setScrolledToEnd(scrollTop + clientHeight >= scrollHeight);
        }
    };

    useEffect(() => {
        const div = scrollableRef.current;
        if (div) {
            div.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (div) {
                div.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div className="flex flex-col space-y-6 my-12">
            <h2 className="text-xl font-semibold mb-2">
                Review, sign and submit
            </h2>
            <div>
                <p className="mb-2">
                    Please review the following information and confirm that you
                    want to share access to your health plan information.
                </p>
                <Box className="border border-gray-200 rounded p-4">
                    <div className=" ml-6">
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">First name:</span>{' '}
                            {formState.selectedPerson?.firstName}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Last name:</span>{' '}
                            {formState.selectedPerson?.lastName}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Date of Birth:</span>{' '}
                            {formState.selectedPerson?.dateOfBirth}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Relationship:</span>{' '}
                            {formState.selectedPerson?.relationship}
                        </div>
                        <div className="flex flex-col mb-3">
                            <span className="font-bold">Phone number:</span>{' '}
                            {formState.selectedPerson?.phoneNumber}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">Email address:</span>{' '}
                            {formState.selectedPerson?.email}
                        </div>
                    </div>
                </Box>
            </div>
            <div>
                <Box className="border border-gray-200 rounded p-4">
                    <div className="flex flex-col mb-3 ml-6">
                        <span className="font-bold">Start Date:</span>{' '}
                        {new Date(formState.expiryDate.start).toLocaleString()}
                    </div>
                    <div className="flex flex-col mb-3 ml-6">
                        <span className="font-bold">End Date:</span>{' '}
                        {new Date(formState.expiryDate.end).toLocaleString()}
                    </div>
                </Box>
                <p className="mb-2 mt-6">
                    Please scroll through, read and acknowledge the below
                    statements before you eSign.
                </p>
                <div
                    className="border rounded p-4 mb-10"
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                    ref={scrollableRef}
                >
                    <p>{loremIpsum['lorem-ipsum']}</p>
                </div>
                <Box className="border-l-4 border-blue-400 p-2 bg-blue-100 rounded">
                    <IconButton size="small" className="text-sky-600">
                        <InfoIcon />
                    </IconButton>
                    <strong>Note:</strong> You need to scroll through the
                    information above before you can check the box.
                </Box>
                <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    disabled={!scrolledToEnd} // Disable the checkbox until scrolled to the end
                />
                <label>
                    By checking this box and signing below, I acknowledge that I
                    have read, understand and agree to all of the above
                </label>
            </div>
            <div>
                <h2 className="font-semibold mb-2">
                    Please enter your full name in order to electronically sign
                    this document.
                </h2>
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="border rounded p-2 mb-2 w-full"
                />
                <p className="text-sm text-gray-500">
                    Date: {dayjs().format('DD/MM/YYYY')}
                </p>
            </div>
            <h2 className="text-lg font-semibold mb-2">
                By selecting &#34;Submit&#34; I agree to the following:
            </h2>
            <ul className="list-disc ml-5">
                <li className="mb-4">
                    I validate that my full name as it appears above is
                    accurate.
                </li>
                <li className="mb-4">
                    I indicate my agreement to use electronic records and
                    signatures to sign this form electronically.
                </li>
                <li className="mb-4">
                    I acknowledge that I have read, understand and intend to
                    indicate my agreement to all of the terms above.
                </li>
                <li>
                    I understand that I have a right to receive a copy of this
                    authorization. To print a copy of this authorization, click
                    on the PDF button on the next screen. PLEASE MAINTAIN A COPY
                    OF THIS FORM FOR YOUR RECORDS.
                </li>
            </ul>
        </div>
    );
}
