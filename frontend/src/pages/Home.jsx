import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const importImages = () => {
            const importedImages = [
                "/img_1.jpg",
                "/img_2.jpg",
                "/img_3.jpg",
                "/img_4", // Ensure file extensions are correct
            ];
            setImages(importedImages);
        };
        importImages();
    }, []);

    // Set the tab title to "Viewer" on mount.
    useEffect(() => {
        document.title = "Toros";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 px-6">
            {/* Animated Title */}
            <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-center mb-6 text-amber-100 dark:text-amber-300 drop-shadow-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                Welcome to <span className="text-amber-300 dark:text-emerald-200">Toros</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className="text-xl sm:text-2xl md:text-3xl text-center text-white mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
            >
                The Ultimate Pickleball Tournament Experience
            </motion.p>

            {/* Image Grid - Fixed Clipping Issue */}
            <div className="w-full max-w-7xl px-4 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            className="relative overflow-hidden rounded-xl shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img
                                src={image}
                                alt={`Pickleball ${index + 1}`}
                                className="w-full h-60 object-cover rounded-xl"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Fun CTA Button */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <Link to="/tournament/setup">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-amber-400 hover:bg-amber-500 text-white text-xl font-semibold py-3 px-8 rounded-full shadow-lg transition-all"
                    >
                        Start Your Tournament 🏅
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}

export default Home;
