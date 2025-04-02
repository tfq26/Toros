import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Home() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const importImages = () => {
            const importedImages = [
                "/img_1.jpg",
                "/img_2.jpg",
                "/img_3.jpg",
                "/img_1.jpg", // Ensure file extensions are correct
            ];
            setImages(importedImages);
        };
        importImages();
    }, []);

    // Set the tab title to "Toros" on mount.
    useEffect(() => {
        document.title = "Toros";
    }, []);

    // Motion variants for the image grid container and items
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200 } },
    };

    return (
        <div className="min-h-screen  flex flex-col items-center justify-center text-gray-50 px-4 py-8">
            {/* Hero Section */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <motion.h1
                    className="text-5xl sm:text-6xl md:text-7xl font-extrabold drop-shadow-lg mb-4"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    Welcome to <span className="text-amber-300">Toros</span>
                </motion.h1>
                <motion.p
                    className="text-lg sm:text-xl md:text-2xl font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    The Ultimate Pickleball Tournament Experience
                </motion.p>
            </motion.div>

            {/* Separator */}
            <Separator className="w-full max-w-md mb-8" />

            {/* Image Grid */}
            <motion.div
                className="w-full max-w-7xl px-4 mb-10"
                variants={containerVariants}
                initial="show"
                animate="show"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            className="relative overflow-hidden rounded-xl shadow-2xl"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                        >
                            <img
                                src={image}
                                alt={`Pickleball ${index + 1}`}
                                className="w-full h-60 object-cover"
                            />
                            {/* Hover Overlay */}
                            {/*<motion.div*/}
                            {/*    className="absolute inset-0 bg-black bg-opacity-"*/}
                            {/*    whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}*/}
                            {/*    transition={{ duration: 0.3 }}*/}
                            {/*/>*/}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
            >
                <Link to="/tournament/setup">
                    <Button className="bg-amber-400 hover:bg-amber-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transition-all">
                        Start Your Tournament 🏅
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}

export default Home;
