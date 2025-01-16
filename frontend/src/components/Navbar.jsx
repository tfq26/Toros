import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="bg-red-600 text-white px-4 shadow-md w-full sticky top-0 left-0 z-50">
            <div className="flex justify-between items-center h-16 relative">
                <h1 className="text-2xl font-bold z-20 flex items-center">
                    <Link to="/">
                        <img src="/bull-svgrepo-com.svg" alt="Toros Logo" width="48" className="h-12" />
                    </Link>
                </h1>
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-5xl font-bold text-orange-400 z-10 pointer-events-none w-max flex items-center">
                    Toros
                </h1>
                <div className="hidden md:flex space-x-6 justify-end items-center h-full">
                    <Link
                        to="/players"
                        className="hover:bg-red-700 px-4 py-2 rounded-md transition font-bold flex items-center"
                    >
                        Players
                    </Link>
                    <Link
                        to="/matches"
                        className="hover:bg-red-700 px-4 py-2 rounded-md transition font-bold flex items-center"
                    >
                        Matches
                    </Link>
                    <Link
                        to="/standings"
                        className="hover:bg-red-700 px-4 py-2 rounded-md transition font-bold flex items-center"
                    >
                        Standings
                    </Link>
                    <Link
                        to="/bracket"
                        className="hover:bg-red-700 px-4 py-2 rounded-md transition font-bold flex items-center"
                    >
                        Bracket
                    </Link>
                </div>
                <button
                    className="text-white text-3xl md:hidden focus:outline-none z-30"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-red-600 text-white p-4 space-y-4 absolute top-full left-0 w-full shadow-lg z-20">
                    <Link
                        to="/players"
                        className="block hover:bg-red-700 px-3 py-2 rounded-md transition font-bold text-left w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Players
                    </Link>
                    <Link
                        to="/matches"
                        className="block hover:bg-red-700 px-3 py-2 rounded-md transition font-bold text-left w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Matches
                    </Link>
                    <Link
                        to="/standings"
                        className="block hover:bg-red-700 px-3 py-2 rounded-md transition font-bold text-left w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Standings
                    </Link>
                    <Link
                        to="/bracket"
                        className="block hover:bg-red-700 px-3 py-2 rounded-md transition font-bold text-left w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Bracket
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Navbar;
