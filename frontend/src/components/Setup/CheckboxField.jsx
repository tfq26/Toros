import React from "react";

const CheckboxField = ({ label, checked, onChange }) => {
    return (
        <div className="mb-4">
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="mr-2"
                />
                {label}
            </label>
        </div>
    );
};

export default CheckboxField;
