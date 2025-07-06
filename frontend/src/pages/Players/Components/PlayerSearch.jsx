import React, { useState } from "react";
import PropTypes from "prop-types";
import { useResponsive } from "@/contexts/ResponsiveContext.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PlayerSearch = ({ onSearchChange }) => {
    const { isMobile } = useResponsive();
    const [query, setQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearchChange(value);
    };

    const clearSearch = () => {
        setQuery("");
        onSearchChange("");
        if (isMobile) {
            setIsSearchOpen(false);
        }
    };

    // On desktop, always show the full search bar
    if (!isMobile) {
        return (
            <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search players..."
                    className="pl-10 w-full h-9 placeholder:text-foreground"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={clearSearch}
                    >
                        <FaTimes className="h-3 w-3" />
                    </Button>
                )}
            </div>
        );
    }

    // On mobile, show an icon that expands into the search bar
    return (
        <div className="w-full flex justify-end">
            <AnimatePresence>
                {isSearchOpen ? (
                    <motion.div
                        key="search-input"
                        className="relative w-full"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '100%', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            placeholder="Search players..."
                            className="w-full pl-10"
                            autoFocus
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={clearSearch}
                        >
                            <FaTimes className="h-3 w-3" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="search-button"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <FaSearch className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

PlayerSearch.propTypes = {
    onSearchChange: PropTypes.func.isRequired,
};

export default PlayerSearch;
