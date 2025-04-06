import React from "react";

const CheckboxField = ({ label, checked, onChange, className = "" }) => {
    return (
        <label className={`flex items-center gap-3 text-gray-800 dark:text-gray-200 cursor-pointer select-none ${className}`}>
            {/* Checkbox Input */}
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 accent-emerald-600 dark:accent-emerald-400 focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            {/* Label Text */}
            <span className="text-lg">{label}</span>
        </label>
    );
};

export default CheckboxField;
