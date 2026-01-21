'use client';

import { motion } from 'framer-motion';

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
                    <h2>Explore Our Collections</h2>
                    <p>Browse through our curated lookbooks featuring different styles and occasions.</p>
                </motion.div>

                <div className="collections-grid">
                    {COLLECTIONS.map((c, i) => (
                        <motion.div
                            key={i}
                            className="collection-item"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                        >
                            <img src={`/images/goshen/${c.image}`} alt={c.title} />
                            <div className="collection-overlay">
                                <h3 className="collection-title">{c.title}</h3>
                                <span className="collection-count">{c.count}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
