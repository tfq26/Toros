// src/components/Footer.jsx
import React from "react";
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-emerald-100 dark:bg-black text-gray-400 py-6">
            <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} Toros, Inc.</p>
                <div className="flex gap-4 mt-4 sm:mt-0">
                    <Link to="/about" className="hover:text-white">About</Link>
                    <Link to="/contact" className="hover:text-white">Contact</Link>
                    <Link to="/terms" className="hover:text-white">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
