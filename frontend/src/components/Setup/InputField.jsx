import React from "react";

const InputField = ({ label, type = "text", value, onChange, placeholder }) => {
    return (
        <div className="mb-4">
            {/* Label */}
            <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                {label}
            </label>

            {/* Input Field */}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                min={1}
                max={100}
                className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition duration-200"
            />
        </div>
    );
};

export default InputField;
