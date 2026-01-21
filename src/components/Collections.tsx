'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const COLLECTIONS = [
    {
        title: "Casual Elegance",
        count: "8 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.05.jpeg",
    },
    {
        title: "Evening Glamour",
        count: "6 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.06.jpeg",
    },
    {
        title: "Signature Prints",
        count: "12 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.07.jpeg",
    },
    {
        title: "Luxury Line",
        count: "5 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.08.jpeg",
    },
    {
        title: "New Arrivals",
        count: "10 Pieces",
        image: "aaaaaaa.jpeg",
    }
];

import EditableText from './EditableText';
import EditableImage from './EditableImage';

export default function Collections() {
    return (
        <section className="collections" id="collections">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <EditableText id="collections-title" tagName="h2" defaultValue="Explore Our Collections" />
                    <EditableText id="collections-subtitle" tagName="p" defaultValue="Browse through our curated lookbooks featuring different styles and occasions." />
                </motion.div>

                <div className="collections-grid">
                    {COLLECTIONS.map((c, i) => (
                        <Link
                            key={i}
                            href={`/collections/${i}`}
                            className="block"
                        >
                            <motion.div
                                className="collection-item"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                whileHover={{ y: -10 }}
                            >
                                <EditableImage
                                    id={`collection-img-${i}`}
                                    defaultSrc={`/images/goshen/${c.image}`}
                                    alt={c.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="collection-overlay">
                                    <h3 className="collection-title">
                                        <EditableText id={`collection-title-${i}`} defaultValue={c.title} />
                                    </h3>
                                    <div className="collection-count">
                                        <EditableText id={`collection-count-${i}`} defaultValue={c.count} />
                                    </div>
                                    <span className="mt-4 text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Lookbook
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
