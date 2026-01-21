'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { Loader2 } from 'lucide-react';

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
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(8); // Show only recent items on home

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching home products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="products" id="products">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <EditableText id="products-title" tagName="h2" defaultValue="Our Collection" />
                    <EditableText
                        id="products-subtitle"
                        tagName="p"
                        defaultValue="Each piece is uniquely crafted, blending traditional African prints with contemporary styling for the modern fashion enthusiast."
                    />
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-md)]"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {products.map((product, i) => (
                            <motion.div key={product.id} className="product-card" variants={item}>
                                <div className="product-image">
                                    <EditableImage
                                        id={`product-img-${product.id}`}
                                        defaultSrc={product.image_path.startsWith('http') ? product.image_path : `/images/goshen/${product.image_path}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.tag && (
                                        <span className="product-tag font-bold">
                                            <EditableText id={`product-tag-${product.id}`} defaultValue={product.tag} />
                                        </span>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">
                                        <EditableText id={`product-name-${product.id}`} defaultValue={product.name} />
                                    </h3>
                                    <div className="product-description">
                                        <EditableText
                                            id={`product-desc-${product.id}`}
                                            tagName="p"
                                            defaultValue={product.description}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
