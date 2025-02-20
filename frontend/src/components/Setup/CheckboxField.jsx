const CheckboxField = ({ label, checked, onChange, className }) => {
    return (
        <label className={`flex items-center gap-2 text-gray-700 dark:text-white ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-5 w-5 accent-emerald-600 dark:accent-emerald-400"
            />
            {label}
        </label>
    );
};

export default CheckboxField;
