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
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext"; // Import the useTheme hook

export default function Home() {
    const [images, setImages] = useState([]);
    const [email, setEmail] = useState("");
    const { isDarkMode } = useTheme(); // Get the current theme

    useEffect(() => {
        // Using placeholder images for demonstration. In a real app,
        // you'd likely fetch these or have them as static assets.
        setImages([
            "https://placehold.co/600x400/FFD700/000000?text=Tournament+1",
            "https://placehold.co/600x400/FFA500/000000?text=Tournament+2",
            "https://placehold.co/600x400/FF8C00/000000?text=Tournament+3",
            "https://placehold.co/600x400/FF6347/000000?text=Tournament+4",
        ]);
        document.title = "Toros - The Ultimate Pickleball Tournament Experience";
    }, []);

    // Motion variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Slightly increased stagger for more noticeable effect
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 }, // Increased y for more distinct slide-up
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } } // Added damping for smoother spring
    };

    // Determine the image source based on the theme
    // Assuming 'svgs/Hero_Ball_Dark.svg' and 'svgs/Hero_Ball.svg' exist relative to public folder
    const heroBallSrc = isDarkMode ? "svgs/Hero_Ball_Dark.svg" : "svgs/Hero_Ball.svg";

    return (
        <div className="flex flex-col items-center text-foreground min-h-screen">
            {/* 1. Hero Section */}
            <motion.section
                className="relative min-h-[75vh] w-full flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden"
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
            >
                <motion.img
                    src={heroBallSrc}
                    alt="Background Spinning Pickleball"
                    className="absolute inset-0 w-auto m-auto h-120 object-cover opacity-20 dark:opacity-10 scale-125" // Adjusted opacity, added scale for subtle effect
                    style={{ pointerEvents: 'none' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, ease: 'linear', repeat: Infinity }} // Slower rotation
                />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-gray-900 dark:text-gray-50 drop-shadow-lg leading-tight">
                        Welcome to <span className="text-amber-500">Toros</span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-10 text-gray-700 dark:text-gray-200 drop-shadow-md font-light">
                        Your Ultimate Destination for Pickleball Tournament Experiences.
                    </p>
                    <Button
                        className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-xl font-semibold"
                        asChild // Use asChild to pass props to Link
                    >
                        <Link to="/tournament/setup">
                            Let’s Play!
                        </Link>
                    </Button>
                </div>
            </motion.section>

            <Separator className="w-32 h-1 bg-amber-400 my-16 rounded-full" /> {/* Thicker, amber separator */}

            {/* 2. Features Section */}
            <motion.section
                className="container grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="show" // Animate when in view
                viewport={{ once: true, amount: 0.3 }}
            >
                {[
                    { icon: <FaCalendarAlt size={36} />, title: "Manage Events with Ease", desc: "Create, view, and track all your tournaments and matches effortlessly, all in one intuitive platform." },
                    { icon: <FaNewspaper size={36} />, title: "Stay Updated with Latest News", desc: "Get real-time updates and insightful articles on pickleball strategies, tips, and global headlines." },
                    { icon: <FaChartLine size={36} />, title: "Boost Performance with Analytics", desc: "Dive deep into your match statistics and personal performance analytics to track progress and identify areas for improvement." },
                ].map((feat, i) => (
                    <motion.div
                        key={i}
                        className="bg-card text-card-foreground rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-border" // Card styling improvements
                        variants={itemVariants}
                    >
                        <div className="mb-5 text-amber-500">{feat.icon}</div> {/* Icon color matching theme */}
                        <h3 className="text-2xl font-bold mb-3">{feat.title}</h3> {/* Larger, bolder title */}
                        <p className="text-base text-muted-foreground leading-relaxed">{feat.desc}</p> {/* Better readability */}
                    </motion.div>
                ))}
            </motion.section>

            {/* 3. Upcoming Tournaments Carousel */}
            <motion.section
                className="w-full max-w-6xl px-4 mb-20 mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-gray-50">Upcoming Tournaments</h2>
                <Carousel
                    className="w-full relative"
                    opts={{
                        align: "start",
                    }}
                >
                    <CarouselContent className="-ml-4"> {/* Adjusted margin for better spacing */}
                        {images.map((img, idx) => (
                            <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <motion.div
                                    className="relative overflow-hidden rounded-2xl shadow-xl border border-border group" // Added group for hover effect
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" }} // More prominent hover shadow
                                    transition={{ duration: 0.3 }}
                                >
                                    <img src={img} alt={`Tournament ${idx + 1}`} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end text-white opacity-90"> {/* Gradient overlay */}
                                        <h4 className="font-bold text-xl mb-1">Tournament {idx + 1}</h4>
                                        <p className="text-sm text-gray-200">Starts Jan {10 + idx}, 2026</p>
                                        <Button
                                            className="mt-4 bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm px-4 py-2 rounded-lg shadow transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                            asChild
                                        >
                                            <Link to={`/tournament/${idx + 1}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute top-1/2 -left-12 -translate-y-1/2 bg-primary/50 text-primary-foreground hover:bg-primary/50 rounded-full size-10 flex items-center justify-center shadow-lg transition-all duration-200 z-20" />
                    <CarouselNext className="absolute top-1/2 -right-12 -translate-y-1/2 bg-primary/50 text-primary-foreground hover:bg-primary/50 rounded-full size-10 flex items-center justify-center shadow-lg transition-all duration-200 z-20" />
                </Carousel>
                <div className="text-center mt-12">
                    <Link to="/tournaments" className="text-amber-600 hover:text-amber-700 hover:underline font-bold text-lg transition-colors duration-200">
                        View All Tournaments →
                    </Link>
                </div>
            </motion.section>

            {/* 4. Testimonials Section */}
            <motion.section
                className="w-full max-w-6xl px-4 mb-20 mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-gray-50">What People Are Saying</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { name: "Alex P.", quote: "Toros made organizing my first tournament a breeze! The interface is incredibly intuitive and the features are exactly what I needed." },
                        { name: "Jamie R.", quote: "I love the news feed—always up to date with the latest pickleball tips and community happenings. It's a fantastic resource for any player." },
                        { name: "Chris D.", quote: "Tracking my performance has never been easier. The analytics help me understand my game better and improve significantly." },
                        { name: "Samantha L.", quote: "The community features are great! It's easy to connect with other players and find new partners for games." },
                    ].map((t, i) => (
                        <motion.blockquote
                            key={i}
                            className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border relative overflow-hidden" // Enhanced styling
                            variants={itemVariants}
                        >
                            <span className="absolute top-0 left-0 text-9xl font-serif text-amber-200 dark:text-amber-900 opacity-20 -z-0">“</span> {/* Large quote graphic */}
                            <p className="italic mb-6 text-lg relative z-10 leading-relaxed">“{t.quote}”</p>
                            <cite className="font-semibold block text-right text-base text-muted-foreground relative z-10">— {t.name}</cite>
                        </motion.blockquote>
                    ))}
                </div>
            </motion.section>

            {/* 5. Newsletter Signup */}
            <motion.section
                className="w-full max-w-lg px-4 mb-24 text-center mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
                <div className={cn(
                    'p-10 rounded-2xl shadow-2xl border-2 border-amber-400', // Stronger border
                    isDarkMode ? 'bg-gray-900 text-gray-50' : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' // Themed background
                )}>
                    <h2 className="text-3xl font-bold mb-4">
                        Stay in the Loop
                    </h2>
                    <p className="text-base mb-8 text-gray-100 dark:text-gray-300 leading-relaxed">
                        Subscribe to our newsletter for exclusive tournament alerts, the latest pickleball news, and special offers directly to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4"> {/* Increased gap */}
                        <Input
                            type="email"
                            placeholder="your.email@example.com" // More descriptive placeholder
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                                "flex-1 px-5 py-3 rounded-full text-lg border-2", // Pill-shaped input
                                isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-amber-400" : "bg-white border-amber-300 text-gray-900 placeholder:text-gray-500 focus:border-amber-700"
                            )}
                        />
                        <Button
                            className={cn(
                                "px-8 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5",
                                isDarkMode ? "bg-amber-400 hover:bg-amber-500 text-gray-900" : "bg-gray-900 hover:bg-gray-700 text-white" // Themed button
                            )}
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
