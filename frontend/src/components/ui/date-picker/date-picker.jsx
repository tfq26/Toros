"use client"

import React from "react"
import PropTypes from 'prop-types'; // ✨ FIXED: Added the missing import for PropTypes
import { addDays, format, startOfWeek } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const getNextWeekend = () => {
    const today = new Date();
    const nextSaturday = addDays(startOfWeek(today, { weekStartsOn: 6 }), 0);
    const nextSunday = addDays(nextSaturday, 1);
    if (today.getTime() > nextSaturday.getTime()) {
        return { from: addDays(nextSaturday, 7), to: addDays(nextSunday, 7) };
    }
    return { from: nextSaturday, to: nextSunday };
};

export function TournamentDatePicker({ className, value, onChange }) {

    const setPreset = (preset) => {
        let newDate;
        if (preset === 'this-weekend') {
            newDate = { from: new Date(), to: addDays(new Date(), 2) };
        } else if (preset === 'next-weekend') {
            newDate = getNextWeekend();
        } else if (preset === 'next-7-days') {
            newDate = { from: new Date(), to: addDays(new Date(), 7) };
        }
        if (onChange) {
            onChange(newDate);
        }
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "LLL dd, yyyy")} -{" "}
                                    {format(value.to, "LLL dd, yyyy")}
                                </>
                            ) : (
                                format(value.from, "LLL dd, yyyy")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 flex" align="start">
                    <div className="flex flex-col space-y-2 border-r p-4">
                        <span className="text-sm font-medium text-muted-foreground">Presets</span>
                        <Button variant="ghost" className="justify-start" onClick={() => setPreset('this-weekend')}>This Weekend</Button>
                        <Button variant="ghost" className="justify-start" onClick={() => setPreset('next-weekend')}>Next Weekend</Button>
                        <Button variant="ghost" className="justify-start" onClick={() => setPreset('next-7-days')}>Next 7 Days</Button>
                    </div>
                    <div className="p-2">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={value?.from}
                            selected={value}
                            onSelect={onChange}
                            numberOfMonths={2}
                            disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

// ✨ FIXED: Added the prop-types definition block to prevent crashes.
TournamentDatePicker.propTypes = {
    className: PropTypes.string,
    value: PropTypes.shape({
        from: PropTypes.instanceOf(Date),
        to: PropTypes.instanceOf(Date),
    }),
    onChange: PropTypes.func.isRequired,
};
