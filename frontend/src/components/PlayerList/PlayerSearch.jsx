import { useState } from "react";

const PlayerSearch = ({ onSearchChange }) => {
    const [query, setQuery] = useState("");

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearchChange(value);
    };

    return (
        <div className="mb-4">
            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search players by name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default PlayerSearch;
