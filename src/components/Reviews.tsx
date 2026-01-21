'use client';

import { motion } from 'framer-motion';

const REVIEWS = [
    {
        text: "The quality of my kimono is absolutely stunning! The colors are vibrant and the craftsmanship is exceptional. I receive compliments every time I wear it.",
        author: "Adwoa Mensah",
        location: "Accra, Ghana",
        initial: "A"
    },
    {
        text: "Goshen Clothing has transformed my wardrobe! Their unique designs blend tradition with modern style perfectly. The showroom experience was wonderful.",
        author: "Kofi Asante",
        location: "Kumasi, Ghana",
        initial: "K"
    },
    {
        text: "I ordered three pieces and they all exceeded my expectations. The attention to detail and the authentic African prints make these truly special garments.",
        author: "Nana Yaa Boateng",
        location: "Tema, Ghana",
        initial: "N"
    },
    {
        text: "Best fashion investment I've made! The kimonos are versatile - I style them for work and special occasions. Goshen truly understands African elegance.",
        author: "Efua Owusu",
        location: "Cape Coast, Ghana",
        initial: "E"
    }
];

export default function Reviews() {
    return (
        <section className="reviews" id="reviews">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>What Our Customers Say</h2>
                    <p>Real stories from our valued customers who have experienced the Goshen Clothing difference.</p>
                </motion.div>

                <div className="reviews-grid">
                    {REVIEWS.map((review, i) => (
                        <motion.div
                            key={i}
                            className="review-card"
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                        >
                            <div className="review-stars">
                                {[...Array(5)].map((_, j) => (
                                    <span key={j} className="star">★</span>
                                ))}
                            </div>
                            <p className="review-text">"{review.text}"</p>
                            <div className="review-author">
                                <div className="author-avatar">{review.initial}</div>
                                <div className="author-info">
                                    <h4>{review.author}</h4>
                                    <span>{review.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
