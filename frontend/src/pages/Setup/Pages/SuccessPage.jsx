import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSetup } from '@/contexts/SetupContext'; // To display the tournament name

const TournamentSetupSuccess = () => {
    // Get the final tournament name from the context to personalize the message
    const { state } = useSetup();

    // Animation variants for the container and its children
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center p-4 min-h-[300px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                    <motion.div variants={itemVariants} className="flex justify-center text-green-500 mb-4">
                        {/* Animated success icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
                        >
                            <FaCheckCircle size={72} />
                        </motion.div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardTitle className="text-3xl">Setup Complete!</CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardDescription className="text-lg">
                            Your tournament, "{state.tournamentName || "Unnamed Tournament"}", is ready.
                        </CardDescription>
                    </motion.div>
                </CardHeader>
                <CardContent>
                    <motion.p variants={itemVariants} className="text-muted-foreground">
                        You can now view it in your tournament list or proceed to manage it.
                    </motion.p>
                </CardContent>
                <motion.div variants={itemVariants} className="p-6 pt-0">
                    {/* REFACTORED: Button now correctly functions as a Link */}
                    <Button asChild size="lg" className="w-full">
                        <Link to="/tournament/my">Go to My Tournaments</Link>
                    </Button>
                </motion.div>
            </Card>
        </motion.div>
    );
};

// Note: The 'finalize' prop is no longer needed as the primary action is navigation.
export default TournamentSetupSuccess;