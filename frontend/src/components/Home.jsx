import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-hero_gradient text-gray-800">
            {/*<h1 className="text-9xl font-bold mb-6 text-orange-400">Taurus</h1>*/}
            <h1 className="text-9xl font-bold text-center mb-4 text-amber-100">Welcome to the Pickleball App!</h1>

            {/*<div className="grid gap-4">*/}
            {/*    <Link*/}
            {/*        to="/players"*/}
            {/*        className="bg-amber-900 text-white text-center px-6 py-3 rounded-lg hover:bg-red-600 transition"*/}
            {/*    >*/}
            {/*        View Players*/}
            {/*    </Link>*/}

            {/*    <Link*/}
            {/*        to="/matches"*/}
            {/*        className="bg-amber-900 text-white text-center px-6 py-3 rounded-lg hover:bg-red-600 transition"*/}
            {/*    >*/}
            {/*        Manage Matches*/}
            {/*    </Link>*/}

            {/*    <Link*/}
            {/*        to="/standings"*/}
            {/*        className="bg-amber-900 text-white text-center px-6 py-3 rounded-lg hover:bg-red-600 transition"*/}
            {/*    >*/}
            {/*        View Standings*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </div>
    );
}

export default Home;