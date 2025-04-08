'use client';
import  { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker/date-picker.jsx';

export const DateTimePopup = () => {
    const [date, setDate] = useState<Date | undefined>undefined;
    return <DatePicker value={date} onChange={setDate} className="w-[280px]" />;
};
