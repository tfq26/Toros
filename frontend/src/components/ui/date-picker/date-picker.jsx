'use client';
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";

export function DatePicker() {
    // Change state to hold an array of dates for multiple selection.
    const [dates, setDates] = React.useState([]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        dates.length === 0 && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {dates.length > 0
                        ? dates.map((d) => format(d, "PPP")).join(", ")
                        : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-full flex-col space-y-2 p-2">
                <Select
                    onValueChange={(value) =>
                        // For example, add a date relative to today when a selection is made.
                        setDates((prev) => [...prev, addDays(new Date(), parseInt(value))])
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    {/* Switch mode to "multiple" for selecting multiple dates */}
                    <Calendar mode="range" selected={dates} onSelect={setDates} />
                </div>
            </PopoverContent>
        </Popover>
    );
}
