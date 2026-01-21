'use client';

import { motion } from 'framer-motion';

const PRODUCTS = [
    {
        name: "Vibrant Heritage Kimono",
        description: "Bold red and green African print with geometric patterns",
        image: "WhatsApp Image 2025-12-30 at 12.12.45.jpeg",
        tag: "New"
    },
    {
        name: "Sunset Blaze Kimono",
        description: "Striking red batik design with intricate circle motifs",
        image: "WhatsApp Image 2025-12-30 at 12.12.46.jpeg",
        tag: "Popular"
    },
    {
        name: "Rainbow Fusion Kimono",
        description: "Multi-colored traditional print in vibrant earthy tones",
        image: "WhatsApp Image 2025-12-30 at 12.12.4jj.jpeg"
    },
    {
        name: "Classic XO Print Kimono",
        description: "Black and red XO pattern with elegant striped borders",
        image: "WhatsApp Image 2025-12-30 at 12.12.411.jpeg",
        tag: "Bestseller"
    },
    {
        name: "Ocean Wave Kimono",
        description: "Serene blue and white wave patterns with floral accents",
        image: "WhatsApp Image 2025-12-30 at 12.12.47.jpeg"
    },
    {
        name: "Royal Purple Elegance",
        description: "Regal purple design with traditional African motifs",
        image: "WhatsApp Image 2025-12-30 at 12.12.48jnk.jpeg",
        tag: "Limited"
    },
    {
        name: "Tropical Garden Kimono",
        description: "Lush green and gold botanical print design",
        image: "WhatsApp Image 2025-12-30 at 12.12.4j.jpeg"
    },
    {
        name: "Earthy Tribal Kimono",
        description: "Warm earth tones with classic tribal patterns",
        image: "WhatsApp Image 2025-12-30 at 12.12.43.jpeg"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

export default function Products() {
    return (
        <section className="products" id="products">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>Our Collection</h2>
                    <p>
                        Each piece is uniquely crafted, blending traditional African prints with contemporary styling
                        for the modern fashion enthusiast.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-md)]"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {PRODUCTS.map((product, i) => (
                        <motion.div key={i} className="product-card" variants={item}>
                            <div className="product-image">
                                <img
                                    src={`/images/goshen/${product.image}`}
                                    alt={product.name}
                                />
                                {product.tag && <span className="product-tag">{product.tag}</span>}
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-description">{product.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
