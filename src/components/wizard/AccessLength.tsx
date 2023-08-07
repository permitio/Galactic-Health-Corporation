import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useContext } from 'react';
import { WizardFormContext } from '@/contexts/WizardFormContext';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';

export default function ExpiryDate() {
    const { formState, setFormState } = useContext(WizardFormContext);
    const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = React.useState<Dayjs | null>(
        dayjs().add(1, 'week'),
    );

    React.useEffect(() => {
        setFormState((prevFormState) => ({
            ...prevFormState,
            expiryDate: {
                start: startDate?.startOf('minute').toISOString() || '',
                end: endDate?.startOf('minute')?.toISOString() || '',
            },
        }));
    }, [startDate, endDate]);

    return (
        <div className="flex flex-col space-y-4 my-12">
            <div>
                <label className="block mb-1">Start on</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        className="mr-4"
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                    />
                </LocalizationProvider>
            </div>

            <div>
                <label className="block mb-1">End on</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        className="mr-4"
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                    />
                    <span className="text-sm text-gray-500 mt-1 block">
                        Maximum of one year
                    </span>
                </LocalizationProvider>
            </div>

            <h2 className="text-lg font-semibold mb-2">What to know</h2>
            <ul className="list-disc ml-5">
                <li className="mb-4">
                    You are granting PHI access with the Release of Information
                    under HIPAA laws and sharing Protected Health Information
                    (PHI).
                </li>
                <li className="mb-4">
                    You have selected to give Galactic Healthcare Corporation and its
                    affiliates permission to share your personal information.
                    Shared information could include Protected Health
                    Information (PHI).
                </li>
                <li className="mb-4">
                    Shared access to a dependent&#39;s information will end
                    automatically when the dependent reaches age 12, regardless
                    of the date selected above.
                </li>
                <li>
                    You can control access by using this website or calling the
                    number on the back of your medical card.
                </li>
            </ul>
        </div>
    );
}
