'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const HERO_IMAGES = [
    { name: 'WhatsApp Image 2025-12-30 at 12.12.45.jpeg', class: 'img-tl' },
    { name: 'WhatsApp Image 2025-12-30 at 12.12.4jj.jpeg', class: 'img-bl' },
    { name: 'WhatsApp Image 2025-12-30 at 12.12.46.jpeg', class: 'img-tr' },
    { name: 'WhatsApp Image 2025-12-30 at 12.12.47.jpeg', class: 'img-br' }
];

export default function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero-images">
                {HERO_IMAGES.map((img, i) => (
                    <motion.div
                        key={i}
                        className={`floating-img ${img.class}`}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: i * 0.2,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <EditableImage
                            id={`hero-img-${i}`}
                            defaultSrc={`/images/goshen/${img.name}`}
                            alt="African Fashion"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="hero-content"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                <motion.span
                    className="hero-badge"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <EditableText id="hero-badge" defaultValue="✨ Handcrafted in Ghana" />
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <EditableText id="hero-title" defaultValue='Embrace the <span class="highlight">Beauty</span> of African Fashion' />
                </motion.h1>

                <motion.div
                    className="hero-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <EditableText
                        id="hero-desc"
                        tagName="p"
                        defaultValue="Discover our exquisite collection of handcrafted African kimonos and contemporary designs. Each piece tells a story of heritage, elegance, and modern sophistication."
                    />
                </motion.div>

                <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                >
                    <Link href="#products" className="btn btn-primary">Explore Collection</Link>
                    <Link href="#contact" className="btn btn-secondary">Visit Showroom</Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
