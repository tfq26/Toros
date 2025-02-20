const SliderField = ({ label, value, min, max, step, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 dark:text-white">
                {label}: {value} minutes
            </label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full mt-2 h-2 rounded-lg cursor-pointer bg-gray-300 dark:bg-gray-700 accent-emerald-500 dark:accent-emerald-400"
            />
        </div>
    );
};

export default SliderField;
