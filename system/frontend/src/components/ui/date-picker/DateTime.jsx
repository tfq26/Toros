'use client';
import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/date-picker/date-picker.jsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";

const DateTime = ({ value, onChange, className = "" }) => {
    // If a value is provided, use it; otherwise, default to the current date/time.
    const initialDate = value ? new Date(value) : new Date();
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [time, setTime] = useState(() => {
        const hours = initialDate.getHours().toString().padStart(2, "0");
        const minutes = initialDate.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    });

    // When either the date or time changes, combine them into one Date object.
    useEffect(() => {
        const [hours, minutes] = time.split(":").map(Number);
        const combinedDate = new Date(selectedDate);
        combinedDate.setHours(hours);
        combinedDate.setMinutes(minutes);
        combinedDate.setSeconds(0);
        combinedDate.setMilliseconds(0);
        onChange && onChange(combinedDate);
    }, [selectedDate, time, onChange]);

    // Reset date and time to the current moment.
    const handleNow = () => {
        const now = new Date();
        setSelectedDate(now);
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        setTime(`${hours}:${minutes}`);
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {/* Date Picker */}
            <DatePicker
                value={selectedDate}
                onChange={(newDate) => {
                    if (newDate instanceof Date) {
                        setSelectedDate(newDate);
                    }
                }}
                className="w-full"
            />
            <div className="flex items-center gap-2">
                {/* Time Input */}
                <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
                {/* "Now" Button */}
                <Button
                    type="button"
                    onClick={handleNow}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                    <FaClock size={16} /> Now
                </Button>
            </div>
        </div>
    );
};

export default DateTime;
