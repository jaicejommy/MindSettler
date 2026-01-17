import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircularGallery from './CircularGallery';
import { FadeIn } from './FadeIn';

// Generate items array for 25 desi mental health images (1-26, excluding 10)
const generateDesiItems = () => {
    const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
    return imageNumbers.map((num) => ({
        image: `/desi/desi-${num}.jpg`,
        text: ''
    }));
};

export default function CircularGallerySection() {
    const items = useMemo(() => generateDesiItems(), []);

    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Multi-layer gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/40 to-secondary-50/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/30 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary-100/20 via-transparent to-transparent" />

            {/* Animated floating blobs */}
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-primary-200/40 to-primary-300/20 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
                animate={{
                    x: [0, -25, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-20 -right-32 w-[500px] h-[500px] bg-gradient-to-tl from-secondary-200/30 to-primary-200/20 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
                animate={{
                    y: [0, 25, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-primary-100/25 to-transparent rounded-full blur-2xl pointer-events-none"
            />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none" />

            <div className="max-w-screen-xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <FadeIn className="text-center mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-primary-100 shadow-sm mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 animate-pulse" />
                        <span className="text-primary-700 font-semibold tracking-wide text-sm uppercase">
                            Desi Mental Health Dictionary
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6 leading-tight">
                        From anxiety to zen —{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-500">
                            a visual journey
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
                        Explore our A–Z collection of mental health concepts, reimagined with warmth and cultural familiarity.
                        Each card is a gentle reminder that <em className="text-secondary-800 font-medium">your feelings are valid</em>.
                    </p>
                </FadeIn>

                {/* Gallery Container with glass effect */}
                <FadeIn delay={0.2}>
                    <div className="relative">
                        {/* Decorative frame */}
                        <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-r from-primary-100/50 via-white/30 to-secondary-100/50 rounded-[2.5rem] blur-sm" />
                        <div className="absolute -inset-2 md:-inset-3 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/50" />

                        {/* Main gallery container */}
                        <div
                            className="relative w-full h-[480px] md:h-[650px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/80 to-primary-50/60 backdrop-blur-md shadow-xl shadow-primary-900/5 border border-white/60"
                            style={{ minHeight: '480px' }}
                        >
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent pointer-events-none" />

                            <CircularGallery
                                items={items}
                                bend={3}
                                textColor="#6b5b7f"
                                borderRadius={0.05}
                                scrollEase={0.02}
                                scrollSpeed={1.5}
                            />

                            {/* Edge fade effects */}
                            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white/80 to-transparent pointer-events-none z-10" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white/80 to-transparent pointer-events-none z-10" />
                        </div>
                    </div>
                </FadeIn>

                {/* Interaction hint with enhanced styling */}
                <FadeIn delay={0.4} className="text-center mt-10 md:mt-12">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/70 backdrop-blur-sm border border-primary-100/50 shadow-sm"
                    >
                        <div className="flex items-center gap-1">
                            <motion.span
                                animate={{ x: [-3, 3, -3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="text-primary-600"
                            >
                                ←
                            </motion.span>
                            <span className="text-secondary-600 font-medium text-sm md:text-base">
                                Drag or scroll to explore the collection
                            </span>
                            <motion.span
                                animate={{ x: [3, -3, 3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="text-primary-600"
                            >
                                →
                            </motion.span>
                        </div>
                    </motion.div>
                </FadeIn>

                {/* Decorative card count indicator */}
                <FadeIn delay={0.5} className="text-center mt-6">
                    <p className="text-sm text-secondary-400">
                        <span className="font-semibold text-primary-500">25</span> illustrated cards • A to Z
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}
