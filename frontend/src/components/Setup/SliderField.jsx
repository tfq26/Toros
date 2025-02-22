import React from "react";

const SliderField = ({ label, value, min, max, step, onChange }) => {
    return (
        <div className="mb-6">
            {/* Label with Value */}
            <div className="flex justify-between items-center text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                <label>{label}</label>
                <span className="text-sm font-semibold bg-yellow-100 dark:bg-yellow-500 text-gray-800 dark:text-gray-900 px-2 py-1 rounded-md">
                    {value} min
                </span>
            </div>

            {/* Slider Input */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-700 accent-emerald-500 dark:accent-emerald-400 transition-all focus:ring-2 focus:ring-yellow-400"
            />
        </div>
    );
};

export default SliderField;
