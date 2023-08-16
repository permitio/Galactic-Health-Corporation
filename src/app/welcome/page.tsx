'use client';

import { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';

const Welcome = () => {
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: dayjs().subtract(18, 'year'),
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDateChange = (date: any) => {
        setFormState((prevState) => ({
            ...prevState,
            dateOfBirth: date.format('DD/MM/YYYY'),
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        if (!formState.firstName || !formState.lastName || !formState.phoneNumber || !formState.dateOfBirth) {
            return;
        }
        try {
            await fetch('/api/welcome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
            redirect('/plan', RedirectType.push);
        }
    };

    return (
        <div className='grid place-items-center mt-10'>
            <Paper className='p-4'>
                <Typography variant='h5' className='py-2'>
                    Welcome to Galactic Health Corporation!
                </Typography>
                <Typography variant='body1'>
                    Please fill out the following information to complete your registration.
                </Typography>
                <Box sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}>
                    <TextField
                        id='firstName'
                        label='First Name'
                        variant='outlined'
                        name='firstName'
                        value={formState.firstName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        id='lastName'
                        label='Last Name'
                        variant='outlined'
                        name='lastName'
                        value={formState.lastName}
                        onChange={handleChange}
                        required
                    />
                </Box>
                <Box sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}>
                    <TextField
                        id='phoneNumber'
                        label='Phone Number'
                        placeholder='(123) 456-7890'
                        variant='outlined'
                        name='phoneNumber'
                        value={formState.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label='Date of Birth'
                            value={formState.dateOfBirth}
                            onChange={handleDateChange}
                        />
                    </LocalizationProvider>
                </Box>
                <Box
                    sx={{
                        p: 1
                    }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleSubmit}
                        fullWidth
                        disabled={submitting || !formState.firstName || !formState.lastName || !formState.phoneNumber || !formState.dateOfBirth}
                    >
                        Submit
                    </Button>
                </Box>
            </Paper>
        </div>
    )
};

export default Welcome;
