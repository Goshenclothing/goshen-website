'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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

interface Product {
    id: string;
    name: string;
    description: string;
    image_path: string;
    tag?: string;
    price?: number;
}

export default function Products() {
    const { addItem } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('id, name, description, image_path, tag, price, created_at')
                .order('created_at', { ascending: false })
                .limit(8);

            if (error) {
                console.error('[Products] Error fetching:', error.message || error);
                // Gracefully handle error - show empty state
                setProducts([]);
                return;
            }
            
            if (!data || data.length === 0) {
                console.info('[Products] No products available');
                setProducts([]);
                return;
            }
            
            setProducts(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('[Products] Error:', errorMessage);
            setProducts([]);
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
                        {products.map((product) => (
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
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-lg font-bold text-[var(--color-primary)]">
                                            GHS {(product.price || 150).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => {
                                                addItem({
                                                    id: product.id,
                                                    name: product.name,
                                                    price: product.price || 150,
                                                    image_path: product.image_path
                                                });
                                                setAddedProducts(prev => new Set(prev).add(product.id));
                                                setTimeout(() => {
                                                    setAddedProducts(prev => {
                                                        const newSet = new Set(prev);
                                                        newSet.delete(product.id);
                                                        return newSet;
                                                    });
                                                }, 2000);
                                            }}
                                            className={`btn btn-primary py-2 px-4 text-sm flex items-center gap-2 transition-all ${addedProducts.has(product.id) ? 'bg-green-600 hover:bg-green-700' : ''
                                                }`}
                                        >
                                            <ShoppingCart size={16} />
                                            {addedProducts.has(product.id) ? 'Added!' : 'Add to Cart'}
                                        </button>
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
