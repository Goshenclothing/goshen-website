'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Heart, Zap, Globe, Sparkles } from 'lucide-react';

export default function AboutPage() {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    };

    const staggerItem = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <main className="min-h-screen bg-[var(--color-bg-dark)] pt-32 pb-20">
            {/* Header */}
            <motion.div className="container mb-16" {...fadeInUp}>
                <Link href="/" className="flex items-center gap-2 text-[var(--color-primary)] hover:gap-3 transition-all mb-8">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
                
                <h1 className="text-5xl md:text-6xl font-playfair mb-6">
                    About <span className="bg-gradient-to-r from-[var(--color-primary)] to-yellow-400 bg-clip-text text-transparent">Goshen</span>
                </h1>
                
                <p className="text-xl text-white/70 max-w-2xl">
                    Where African tradition meets contemporary elegance. Discover the story behind every handcrafted piece.
                </p>
            </motion.div>

            {/* Mission Statement */}
            <motion.section className="container mb-20" {...fadeInUp}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-playfair mb-6">Our Mission</h2>
                        <p className="text-white/80 text-lg leading-relaxed mb-4">
                            At Goshen Clothing, we believe that fashion is more than fabric and stitches—it's a form of cultural expression and personal empowerment.
                        </p>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Our mission is to preserve African heritage, celebrate individual expression, support artisanal excellence, and bridge cultures through authentic fashion.
                        </p>
                    </div>
                    
                    <div className="relative h-80 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/30 to-transparent"></div>
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Sparkles size={120} className="text-[var(--color-primary)] opacity-50" />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* What Makes Us Unique */}
            <motion.section className="container mb-20">
                <h2 className="text-4xl font-playfair text-center mb-16">What Makes Goshen Unique</h2>
                
                <motion.div 
                    className="grid md:grid-cols-2 gap-8"
                    variants={staggerContainer}
                >
                    {[
                        {
                            icon: Heart,
                            title: "Authentic Craftsmanship",
                            desc: "Every piece is meticulously handcrafted, ensuring quality and uniqueness that mass production can never replicate."
                        },
                        {
                            icon: Globe,
                            title: "Premium African Prints",
                            desc: "We source the finest African textiles, celebrating bold colors, geometric patterns, and symbolic meanings embedded in African design."
                        },
                        {
                            icon: Zap,
                            title: "Signature Kimonos",
                            desc: "Our luxury kimonos blend traditional African prints with contemporary silhouettes, creating pieces that transcend borders."
                        },
                        {
                            icon: Sparkles,
                            title: "Timeless Collections",
                            desc: "From Casual Elegance to Evening Glamour, each collection celebrates African heritage while embracing modern sophistication."
                        }
                    ].map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                className="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300"
                                variants={staggerItem}
                            >
                                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/30 transition-colors">
                                    <Icon size={24} className="text-[var(--color-primary)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.section>

            {/* Collections Overview */}
            <motion.section className="container mb-20" {...fadeInUp}>
                <h2 className="text-4xl font-playfair text-center mb-12">Our Collections</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { name: "Casual Elegance", desc: "Perfect for everyday luxury and refined simplicity" },
                        { name: "Evening Glamour", desc: "For special occasions and unforgettable celebrations" },
                        { name: "Signature Prints", desc: "Our iconic collection featuring beloved designs" },
                        { name: "Luxury Line", desc: "Limited edition pieces for the discerning collector" },
                        { name: "New Arrivals", desc: "Fresh designs that keep tradition alive and thriving" }
                    ].map((col, i) => (
                        <motion.div
                            key={i}
                            className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all duration-300"
                            whileHover={{ y: -5 }}
                        >
                            <h3 className="text-lg font-bold mb-2 text-[var(--color-primary)]">{col.name}</h3>
                            <p className="text-white/70">{col.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Heritage & Inspiration */}
            <motion.section className="container mb-20 bg-white/5 rounded-3xl p-12 border border-white/10" {...fadeInUp}>
                <h2 className="text-4xl font-playfair mb-8">Our Heritage & Inspiration</h2>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Born in Accra, Ghana</h3>
                        <p className="text-white/80 leading-relaxed mb-4">
                            In a city where ancient traditions dance with contemporary creativity, Goshen Clothing emerged from a simple belief: African fashion deserves a global stage.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            Every stitch, every color, every design choice reflects the pride, elegance, and resilience of the African people who inspire us daily.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-bold mb-1">Historical African Textiles</h4>
                                <p className="text-white/70">Kente, Adire, Ankara, and traditions that survived centuries</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-bold mb-1">Vibrant Streets of Accra</h4>
                                <p className="text-white/70">The energy, fusion of styles, and pride of our people</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-bold mb-1">Global Conversations</h4>
                                <p className="text-white/70">Merging African aesthetics with international sensibilities</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-bold mb-1">Sustainable Futures</h4>
                                <p className="text-white/70">Respecting culture and environment in every creation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Why Choose Goshen */}
            <motion.section className="container mb-20" {...fadeInUp}>
                <h2 className="text-4xl font-playfair text-center mb-12">Why Choose Goshen?</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { emoji: "✨", title: "Authenticity", desc: "Handcrafted in Ghana by skilled artisans" },
                        { emoji: "🌍", title: "Cultural Pride", desc: "Every piece celebrates African heritage" },
                        { emoji: "💎", title: "Premium Quality", desc: "Luxury fabrics and meticulous craftsmanship" },
                        { emoji: "🎨", title: "Unique Design", desc: "Contemporary pieces rooted in tradition" },
                        { emoji: "♻️", title: "Conscious Fashion", desc: "Supporting sustainable, ethical production" },
                        { emoji: "👥", title: "Community", desc: "Part of a movement celebrating African excellence" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="text-center"
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-5xl mb-4">{item.emoji}</div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-white/70">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section className="container text-center" {...fadeInUp}>
                <h2 className="text-4xl font-playfair mb-6">
                    Experience African Excellence
                </h2>
                <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                    When you wear Goshen, you're carrying stories, supporting artisans, celebrating heritage, and making a statement about the beauty of African fashion.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <motion.a
                        href="/#products"
                        className="px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-yellow-500 text-[var(--color-bg-dark)] font-bold rounded-full hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Collections
                    </motion.a>
                    
                    <motion.a
                        href="https://wa.me/233540402935"
                        target="_blank"
                        className="px-8 py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-full hover:bg-[var(--color-primary)]/10 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Contact Us
                    </motion.a>
                </div>

                <div className="mt-16 pt-12 border-t border-white/10">
                    <h3 className="text-2xl font-playfair mb-6">Get in Touch</h3>
                    <div className="grid md:grid-cols-3 gap-8 text-white/80">
                        <div>
                            <p className="font-bold mb-2">📍 Location</p>
                            <p>Accra, Ghana</p>
                        </div>
                        <div>
                            <p className="font-bold mb-2">🕐 Hours</p>
                            <p>Mon - Sat: 9AM - 6PM</p>
                        </div>
                        <div>
                            <p className="font-bold mb-2">💬 Contact</p>
                            <p>+233 540 402 935</p>
                        </div>
                    </div>
                </div>
            </motion.section>
        </main>
    );
}
