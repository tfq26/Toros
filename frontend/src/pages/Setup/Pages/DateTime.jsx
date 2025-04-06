import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FaClock } from "react-icons/fa";
import { Label } from "@/components/ui/label.jsx";
import { DatePicker } from "@/components/ui/date-picker.jsx";

const DateTimeStep = ({ tournamentConfig, handleConfigChange, handleSetCurrentTime }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                    <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Start Date
                    </Label>
                    <DatePicker
                        value={tournamentConfig.startDate}
                        onChange={(value) =>
                            handleConfigChange("startDate", value)
                        }
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                    <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Start Time
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="time"
                            value={tournamentConfig.startTime}
                            onChange={(e) =>
                                handleConfigChange("startTime", e.target.value)
                            }
                            className="w-fit p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        />
                        <Button
                            type="button"
                            onClick={handleSetCurrentTime}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                        >
                            <FaClock size={16} /> Now
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Match Duration (min)
                    </Label>
                    <Slider
                        value={[tournamentConfig.matchDuration]}
                        max={120}
                        step={5}
                        onValueChange={(newValue) =>
                            handleConfigChange("matchDuration", newValue[0])
                        }
                    />
                    <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                        {tournamentConfig.matchDuration} minutes
                    </p>
                </div>
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Break Time (min)
                    </Label>
                    <Slider
                        value={[tournamentConfig.breakTime]}
                        max={60}
                        step={5}
                        onValueChange={(newValue) =>
                            handleConfigChange("breakTime", newValue[0])
                        }
                    />
                    <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                        {tournamentConfig.breakTime} minutes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DateTimeStep;
