import { useState, useEffect } from "react";
import {
    AiOutlineTrophy,
    AiOutlineTeam,
} from "react-icons/ai";
import { TbTournament } from "react-icons/tb";
import { IoPodiumOutline, IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ tournamentSetupComplete, user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/auth"); // Redirect to the login page on logout
    };

    const links = [
        {
            label: "Home",
            path: "/",
            Icon: () => (
                <div className="w-full flex justify-center py-4">
                    <img
                        src="/bull-svgrepo-com.svg"
                        alt="Home Icon"
                        className="w-12 h-12"
                    />
                </div>
            ),
        },
        { label: "Players", path: "/players", Icon: AiOutlineTeam },
        { label: "Tournaments", path: "/tournament/setup", Icon: AiOutlineTrophy },
    ];

    // Conditionally add Bracket and Live Tournament links after setup
    if (tournamentSetupComplete) {
        links.push(
            { label: "Bracket", path: "/bracket", Icon: IoPodiumOutline },
            { label: "Live Tournament", path: "/tournament/live", Icon: TbTournament }
        );
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-20 flex flex-col bg-red-900 text-white shadow-md">
            {links.map((link, idx) => (
                <Link
                    key={idx}
                    to={link.path}
                    className={`flex justify-center items-center w-full h-20 hover:bg-red-700 transition ${
                        location.pathname === link.path ? "bg-red-700" : ""
                    }`}
                >
                    {idx === 0 ? ( // Check if it's the Home link
                        <link.Icon />
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <link.Icon className="text-3xl" />
                        </div>
                    )}
                    <span className="sr-only">{link.label}</span>
                </Link>
            ))}

            {user ? (
                <button
                    onClick={handleLogout}
                    className="flex flex-col justify-center items-center w-full h-20 hover:bg-red-700 transition"
                >
                    <IoLogOutOutline className="text-3xl" />
                    <span className="sr-only">Logout</span>
                </button>
            ) : (
                <Link
                    to="/auth" // ✅ Updated to point to the Signup page
                    className="flex flex-col justify-center items-center w-full h-20 hover:bg-red-700 transition"
                >
                    <IoLogInOutline className="text-3xl" />
                    <span className="sr-only">Signup</span>
                </Link>
            )}
        </div>
    );
};

export default Navbar;
