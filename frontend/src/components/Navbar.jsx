import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-red-600 text-white px-4 py-3 shadow-md w-full sticky top-0 left-0 z-50">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    <Link to="/">
                        <img src="/bull-svgrepo-com.svg" alt="My SVG" width="48"/>
                    </Link>
                </h1>
                <h1 className="text-5xl font-bold ml-[14.5rem] text-orange-400">Toros</h1>
                <div className="space-x-4">
                    <Link
                        to="/players"
                        className="hover:bg-red-700 px-3 py-2 rounded-md transition font-bold"
                    >
                        Players
                    </Link>
                    <Link
                        to="/matches"
                        className="hover:bg-red-700 px-3 py-2 rounded-md transition font-bold"
                    >
                        Matches
                    </Link>
                    <Link
                        to="/standings"
                        className="hover:bg-red-700 px-3 py-2 rounded-md transition font-bold"
                    >
                        Standings
                    </Link>
                    <Link
                        to="/bracket"
                        className="hover:bg-red-700 px-3 py-2 rounded-md transition font-bold"
                    >
                        Bracket
                    </Link>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
