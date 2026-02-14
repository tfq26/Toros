import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FaCalendarAlt, FaNewspaper, FaChartLine, FaSpinner } from "react-icons/fa";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useTheme } from '@/contexts/ThemeContext.jsx';

// Inline SVG component for the hero background
const HeroBall = ({ className }) => (
    <svg width="100%" height="100%" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path fill="currentColor" d="m1096.8 390c-116.4-274.8-433.2-403.2-708-286.8-273.6 117.6-402 434.4-285.6 708 116.4 274.8 433.2 402 708 285.6 274.8-116.4 403.2-433.2 285.6-706.8zm-939.6 82.801c-12 43.199-30 74.398-42 72-12-3.6016-12-40.801 0-82.801 12-43.199 30-74.398 42-72 12 3.6016 12 40.801 0 82.801zm109.2 126c33.602-14.398 74.398 9.6016 93.602 52.801 18 43.199 6 90-26.398 103.2-33.602 14.398-74.398-9.6016-93.602-52.801-19.199-42-7.1992-88.801 26.398-103.2zm120 405.6c-13.199 16.801-52.801 9.6016-88.801-16.801-36-26.398-54-62.398-40.801-80.398s52.801-9.6016 88.801 16.801c36.004 27.602 54.004 63.602 40.801 80.398zm18-638.4c-37.199 25.199-84 20.398-104.4-9.6016s-6-74.398 32.398-99.602c37.199-25.199 84-20.398 104.4 9.6016 20.402 31.203 6.0039 75.602-32.398 99.602zm84-230.4c-2.3984-18 32.398-36 76.801-40.801 44.398-4.8008 81.602 6 82.801 22.801 2.3984 18-32.398 36-76.801 40.801-44.398 4.7969-81.598-4.8008-82.801-22.801zm68.402 340.8c42-18 90 1.1992 106.8 43.199 18 42-1.1992 90-43.199 106.8-42 18-90-1.1992-106.8-43.199-16.801-40.801 2.3984-88.801 43.199-106.8zm-48 399.6c-3.6016-38.398 31.199-74.398 79.199-79.199s90 22.801 93.602 61.199c3.6016 38.398-31.199 74.398-79.199 79.199-48.004 4.8008-90.004-21.598-93.602-61.199zm145.2 223.2c-44.398 4.8008-80.398 2.3984-81.602-6-1.1992-8.3984 33.602-18 78-22.801 44.398-4.8008 80.398-2.3984 81.602 6 0 8.4023-34.801 18-78 22.801zm81.602-753.6c-39.602-20.398-58.801-62.398-43.199-93.602 15.602-31.199 61.199-40.801 100.8-21.602 39.602 20.398 58.801 62.398 43.199 93.602-15.602 31.199-61.203 40.801-100.8 21.602zm172.8 572.4c-32.398 30-73.199 40.801-88.801 22.801-16.801-18-3.6016-56.398 30-87.602 32.398-30 73.199-40.801 88.801-22.801 16.801 19.203 3.6016 57.602-30 87.602zm49.203-267.6c-18 39.602-58.801 60-91.199 45.602-32.398-14.398-44.398-58.801-26.398-98.398 18-39.602 58.801-60 91.199-45.602s44.398 58.801 26.398 98.398zm75.598-176.4c-20.398 8.3984-50.398-18-68.398-58.801s-15.602-81.602 4.8008-90c20.398-8.3984 50.398 18 68.398 58.801 16.801 40.801 14.398 81.602-4.8008 90zm45.602 290.4c-8.3984-1.1992-8.3984-38.398-1.1992-81.602 7.1992-43.199 20.398-78 28.801-76.801 8.3984 1.1992 8.3984 38.398 1.1992 81.602-8.4023 44.402-20.402 78.004-28.801 76.801z" />
    </svg>
);

// Data for sections
const featuresData = [
    { icon: <FaCalendarAlt size={36} />, title: "Manage Events with Ease", desc: "Create, view, and track all your tournaments and matches effortlessly, all in one intuitive platform." },
    { icon: <FaNewspaper size={36} />, title: "Stay Updated with Latest News", desc: "Get real-time updates and insightful articles on pickleball strategies, tips, and global headlines." },
    { icon: <FaChartLine size={36} />, title: "Boost Performance with Analytics", desc: "Dive deep into your match statistics and personal performance analytics to track progress and identify areas for improvement." },
];

const testimonialsData = [
    { name: "Alex P.", quote: "Toros made organizing my first tournament a breeze! The interface is incredibly intuitive and the features are exactly what I needed." },
    { name: "Jamie R.", quote: "I love the news feed—always up to date with the latest pickleball tips and community happenings. It's a fantastic resource for any player." },
    { name: "Chris D.", quote: "Tracking my performance has never been easier. The analytics help me understand my game better and improve significantly." },
    { name: "Samantha L.", quote: "The community features are great! It's easy to connect with other players and find new partners for games." },
];

export default function Home() {
    const [images, setImages] = useState([]);
    const [email, setEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState("idle");
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const bgColor = isDarkMode ? '1d1f20' : 'e1e3e5';
        const textColor = isDarkMode ? 'e1e3e5' : '1d1f20';
        setImages([
            `https://placehold.co/600x400/${bgColor}/${textColor}?text=Tournament+1`,
            `https://placehold.co/600x400/${bgColor}/${textColor}?text=Tournament+2`,
            `https://placehold.co/600x400/${bgColor}/${textColor}?text=Tournament+3`,
            `https://placehold.co/600x400/${bgColor}/${textColor}?text=Tournament+4`,
        ]);
        document.title = "Toros - The Ultimate Pickleball Tournament Experience";
    }, [isDarkMode]);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setNewsletterStatus("error");
            return;
        }
        setNewsletterStatus("loading");
        setTimeout(() => {
            setNewsletterStatus("success");
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }
    };

    return (
        <div className="flex flex-col items-center text-foreground min-h-screen">
            {/* 1. Hero Section */}
            <motion.section
                className="relative min-h-[75vh] w-full flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden"
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
            >
                <motion.div
                    className="absolute inset-0 m-auto w-auto h-[40%] sm:h-[75%] opacity-20 dark:opacity-10 scale-125"
                    style={{ pointerEvents: 'none' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
                >
                    <HeroBall className="w-full h-full text-primary" />
                </motion.div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* --- FIXED: Replaced <h6> with <span> --- */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-foreground drop-shadow-lg leading-tight">
                        Welcome to <span className="text-primary font-bungee-inline">Toros</span>
                    </h1>
                    <br className="block h-20 sm:h-12" />
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-10 text-muted-foreground drop-shadow-md font-light">
                        Your Ultimate Destination for Pickleball Tournament Experiences
                    </p>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-xl font-semibold"
                        asChild
                    >
                        <Link to="/tournament/setup">
                            <h2>
                                Let’s Play!
                            </h2>
                        </Link>
                    </Button>
                </div>
            </motion.section>

            <Separator className="w-32 h-1 bg-primary my-16 rounded-full" />

            {/* 2. Features Section */}
            <motion.section
                className="container grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                {featuresData.map((feat, i) => (
                    <motion.div
                        key={i}
                        className="bg-card text-card-foreground rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-border"
                        variants={itemVariants}
                    >
                        <div className="mb-5 text-primary">{feat.icon}</div>
                        <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">{feat.desc}</p>
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
                <h2 className="text-4xl font-bold mb-10 text-center text-foreground">Upcoming Tournaments</h2>
                <Carousel
                    className="w-full relative"
                    opts={{ align: "start", loop: true }}
                >
                    <CarouselContent className="-ml-4">
                        {images.map((img, idx) => (
                            <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <motion.div
                                    className="relative overflow-hidden rounded-2xl shadow-xl border border-border group"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img src={img} alt={`Tournament ${idx + 1}`} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end text-white opacity-90">
                                        <h4 className="font-bold text-xl mb-1">Tournament {idx + 1}</h4>
                                        <p className="text-sm text-gray-200">Starts Jan {10 + idx}, 2026</p>
                                        <Button
                                            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg shadow transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                            asChild
                                        >
                                            <Link to={`/tournament/${idx + 1}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        aria-label="View previous tournament"
                        className="absolute top-1/2 -left-2 md:-left-8 -translate-y-1/2 bg-card/80 text-card-foreground hover:bg-card rounded-full size-8 md:size-10 flex items-center justify-center shadow-lg transition-all duration-200 z-20"
                    />
                    <CarouselNext
                        aria-label="View next tournament"
                        className="absolute top-1/2 -right-2 md:-right-8 -translate-y-1/2 bg-card/80 text-card-foreground hover:bg-card rounded-full size-8 md:size-10 flex items-center justify-center shadow-lg transition-all duration-200 z-20"
                    />
                </Carousel>
                <div className="text-center mt-12">
                    <Link to="/tournaments" className="text-primary hover:text-primary/90 hover:underline font-bold text-lg transition-colors duration-200">
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
                <h2 className="text-4xl font-bold mb-10 text-center text-foreground">What People Are Saying</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonialsData.map((t, i) => (
                        <motion.blockquote
                            key={i}
                            className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border relative overflow-hidden"
                            variants={itemVariants}
                        >
                            <span aria-hidden="true" className="absolute top-0 left-0 text-9xl font-serif text-primary/10 -z-0">“</span>
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
                <div className={cn('p-10 rounded-2xl shadow-2xl border-2 border-primary', isDarkMode ? 'bg-card' : 'bg-secondary')}>
                    <h2 className="text-3xl font-bold mb-4 text-secondary-foreground">
                        {newsletterStatus === "success" ? "You're In!" : "Stay in the Loop"}
                    </h2>

                    {newsletterStatus === "success" ? (
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Thanks for subscribing! Keep an eye on your inbox for the latest news and tournament alerts.
                        </p>
                    ) : (
                        <>
                            <p className="text-base mb-8 text-secondary-foreground leading-relaxed">
                                Subscribe to our newsletter for exclusive tournament alerts, the latest pickleball news, and special offers.
                            </p>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={newsletterStatus === "loading"}
                                    className="flex-1 px-5 py-3 rounded-full text-lg border-2 bg-background text-foreground border-foreground placeholder:text-muted-foreground"
                                />
                                <Button
                                    type="submit"
                                    disabled={newsletterStatus === "loading"}
                                    className="px-8 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {newsletterStatus === "loading" && <FaSpinner className="animate-spin" />}
                                    {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
                                </Button>
                            </form>
                            {newsletterStatus === "error" && (
                                <p className="mt-4 text-sm text-destructive">Please enter a valid email address.</p>
                            )}
                        </>
                    )}
                </div>
            </motion.section>
        </div>
    );
}
