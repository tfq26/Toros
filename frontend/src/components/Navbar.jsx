import { useState, useEffect } from "react";
import {
    AiOutlineTrophy,
    AiOutlineTeam,
} from "react-icons/ai";
import { TbTournament } from "react-icons/tb";
import { IoPodiumOutline, IoLogInOutline, IoLogOutOutline } from "react-icons/io5"; // Add IoLogOutOutline
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
                <img
                    src="/bull-svgrepo-com.svg" // Replace with your actual image path
                    alt="Home Icon"
                    className="w-12 h-12" // Increase image size
                />
            ),
        },
        { label: "Players", path: "/players", Icon: AiOutlineTeam },
        { label: "Tournaments", path: "/tournament/setup", Icon: AiOutlineTrophy },
        { label: "Bracket", path: "/bracket", Icon: IoPodiumOutline },
    ];

    if (tournamentSetupComplete) {
        links.push({
            label: "Live Tournament",
            path: "/tournament/live",
            Icon: TbTournament,
        });
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-20 flex flex-col bg-red-900 text-white shadow-md">
            {/* Map through the main links */}
            {links.map((link, idx) => (
                <Link
                    key={idx}
                    to={link.path}
                    className={`flex justify-center items-center w-full h-20 hover:bg-red-700 transition ${
                        location.pathname === link.path ? "bg-red-700" : ""
                    }`}
                >
                    <link.Icon className="text-3xl" />
                    <span className="sr-only">{link.label}</span>
                </Link>
            ))}

            {/* Conditionally show login/logout links */}
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
                    to="/auth/login"
                    className="flex flex-col justify-center items-center w-full h-20 hover:bg-red-700 transition"
                >
                    <IoLogInOutline className="text-3xl" />
                    <span className="sr-only">Login</span>
                </Link>
            )}
        </div>
    );
};

export default Navbar;
