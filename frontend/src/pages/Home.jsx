// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FaCalendarAlt, FaNewspaper, FaChartLine } from "react-icons/fa";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils"; // Assuming you have a utils file with cn

function Home() {
    const [images, setImages] = useState([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        setImages([
            "/img_1.webp",
            "/img_2.webp",
            "/img_3.webp",
            "/img_4",
        ]);
        document.title = "Toros";
    }, []);

    // Motion variants
    const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };

    return (
        <div className="flex flex-col items-center text-gray-50 dark:text-gray-100">
            {/* 1. Hero */}
            <motion.section
                className="min-h-[70vh] w-full flex flex-col items-center justify-center px-4 py-12 text-center relative overflow-hidden"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.img
                    src={"/svgs/Hero_Ball.svg"}
                    alt="Background Spinning Pickleball"
                    className="absolute inset-0 w-full h-full object-contain opacity-30"
                    style={{ pointerEvents: 'none' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, ease: 'linear' }}
                />
                <div className="relative z-10"> {/* Added a container for the text and button */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
                        Welcome to Toros
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md">
                        The Ultimate Pickleball Tournament Experience
                    </p>
                    <Button className="bg-amber-300 hover:bg-amber-400 text-gray-900 px-6 py-3 rounded-full shadow-lg">
                        <Link to="/tournament/setup" className="font-bold text-lg">
                            Let’s Play!
                        </Link>
                    </Button>
                </div>
            </motion.section>

            <Separator className="w-24 my-12 bg-gray-200 dark:bg-gray-600" />

            {/* 2. Features */}
            <motion.section
                className="w-full max-w-5xl px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {[
                    { icon: <FaCalendarAlt size={32} />, title: "Manage Events", desc: "Create, view, and track all your tournaments in one place." },
                    { icon: <FaNewspaper size={32} />, title: "Latest News", desc: "Stay up-to-date with pickleball headlines and tips." },
                    { icon: <FaChartLine size={32} />, title: "Performance Analytics", desc: "Get match stats and see your improvement over time." },
                ].map((feat, i) => (
                    <motion.div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-gray-800 dark:text-gray-100" variants={item}>
                        <div className="mb-4 text-emerald-500">{feat.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
                        <p className="text-sm">{feat.desc}</p>
                    </motion.div>
                ))}
            </motion.section>

            {/* 3. Upcoming Tournaments Carousel */}
            <motion.section
                className="w-full max-w-5xl px-4 mb-16"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Upcoming Tournaments</h2>
                <Carousel className="w-full">
                    <CarouselContent>
                        {images.map((img, idx) => (
                            <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                                <motion.div
                                    className="relative overflow-hidden rounded-xl shadow-lg"
                                    variants={item}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <img src={img} alt={`Event ${idx + 1}`} className="w-full h-64 object-cover aspect-auto" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
                                        <h4 className="font-semibold">Tournament {idx + 1}</h4>
                                        <p className="text-xs">Starts Jan {10 + idx}, 2026</p>
                                    </div>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 bg-gray-200 text-gray-800 rounded-full shadow-md p-2 z-10" />
                    <CarouselNext className="absolute top-1/2 -translate-y-1/2 bg-gray-200 text-gray-800 rounded-full shadow-md p-2 z-10" />
                </Carousel>
                <div className="text-center mt-6">
                    <Link to="/tournaments" className="text-emerald-600 hover:underline font-medium">
                        View All Tournaments →
                    </Link>
                </div>
            </motion.section>

            {/* 4. Testimonials */}
            <motion.section
                className="w-full max-w-5xl px-4 mb-16"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">What People Are Saying</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                        { name: "Alex P.", quote: "Toros made organizing my first tournament a breeze!" },
                        { name: "Jamie R.", quote: "Love the news feed—always up to date with pickleball tips." },
                    ].map((t, i) => (
                        <motion.blockquote key={i} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-lg" variants={item}>
                            <p className="italic mb-4">“{t.quote}”</p>
                            <cite className="font-semibold block text-right">— {t.name}</cite>
                        </motion.blockquote>
                    ))}
                </div>
            </motion.section>

            {/* 5. Newsletter Signup */}
            <motion.section
                className="w-full max-w-md px-4 mb-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            > <div className={'bg-emerald-400 dark:bg-gray-900 text-white p-8 rounded-xl shadow-lg'}>
                <h2 className="text-2xl font-bold mb-4 text-emerald-800 dark:text-gray-100">
                    Stay in the Loop
                </h2>
                <p className="text-sm mb-6">
                    Subscribe for tournament alerts, news, and exclusive offers.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-gray-200 text-gray-800 dark:bg-gray-900 focus:outline-none"
                    />
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        Subscribe
                    </Button>
                </div>
            </div>
            </motion.section>

            {/* 6. Footer */}
            <footer className="w-full bg-gray-900 dark:bg-black text-gray-400 py-6">
                <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} Toros, Inc.</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <Link to="/about" className="hover:text-white">About</Link>
                        <Link to="/contact" className="hover:text-white">Contact</Link>
                        <Link to="/terms" className="hover:text-white">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;