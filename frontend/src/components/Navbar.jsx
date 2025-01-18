import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = ({ tournamentSetupComplete }) => {
    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };

    // Base links
    const links = [
        { label: "Players", path: "/players" },
        { label: "Tournaments", path: "/tournament/setup" },
        { label: "Bracket", path: "/bracket" },
    ];

    // Add "Live Tournament" link if setup is complete
    if (tournamentSetupComplete) {
        links.push({ label: "Live Tournament", path: "/tournament/live" });
    }

    return (
        <header className="bg-red-600 text-white px-4 shadow-md w-full sticky top-0 left-0 z-50">
            {/* Desktop Navbar */}
            <div className="flex justify-between items-center h-16 relative">
                <h1 className="text-2xl font-bold z-20 flex items-center">
                    <Link to="/">
                        <img
                            src="/bull-svgrepo-com.svg"
                            alt="Toros Logo"
                            width="48"
                            className="h-12"
                        />
                    </Link>
                </h1>
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-5xl font-bold text-orange-400 z-10 pointer-events-none w-max flex items-center">
                    Toros
                </h1>
                <nav className="hidden md:flex space-x-6 justify-end items-center h-full">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.path}
                            className="hover:bg-red-700 px-4 py-2 rounded-md transition font-bold flex items-center"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <button
                    className="text-white text-3xl md:hidden focus:outline-none z-30"
                    onClick={handleNav}
                >
                    {nav ? <AiOutlineClose /> : <AiOutlineMenu />}
                </button>
            </div>

            {/* Mobile Navbar */}
            {nav && (
                <div className="md:hidden bg-red-600 text-white p-4 space-y-4 absolute top-full left-0 w-full shadow-lg z-20">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.path}
                            className="block hover:bg-red-700 px-3 py-2 rounded-md transition font-bold text-left w-full"
                            onClick={() => setNav(false)} // Close mobile nav on link click
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Navbar;
