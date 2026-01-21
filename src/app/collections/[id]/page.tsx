'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function CollectionPage() {
    const params = useParams();
    const id = params.id as string;

    const [collection, setCollection] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) fetchCollectionData();
    }, [id]);

    const fetchCollectionData = async () => {
        setIsLoading(true);
        try {
            // Fetch collection details
            const { data: collData, error: collError } = await supabase
                .from('collections')
                .select('*')
                .eq('id', id)
                .single();

            if (collError) throw collError;
            setCollection(collData);

            // Fetch products for this collection
            const { data: prodData, error: prodError } = await supabase
                .from('products')
                .select('*')
                .eq('collection_id', id);

            if (prodError) throw prodError;
            setProducts(prodData || []);
        } catch (error) {
            console.error('Error fetching collection page data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-dark)] flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Album Not Found</h2>
                <p className="text-[var(--color-text-subtle)] mb-8">The collection you are looking for doesn't exist or has been moved.</p>
                <Link href="/#collections" className="btn btn-primary">Back to Home</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--color-bg-dark)]">
            <Navbar />

            <header className="pt-40 pb-20 px-4 text-center relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent pointer-events-none" />

                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-4 py-1 rounded-full border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest mb-6">
                            Lookbook Volume {id.slice(0, 4)}
                        </div>
                        <h1 className="mb-4 text-5xl md:text-7xl font-playfair italic">
                            <EditableText id={`coll-page-title-${id}`} defaultValue={collection.title} />
                        </h1>
                        <div className="max-w-2xl mx-auto text-[var(--color-text-muted)] text-lg leading-relaxed">
                            <EditableText
                                id={`coll-page-desc-${id}`}
                                tagName="p"
                                defaultValue={collection.description || "Discover the essence of African luxury in this curated collection."}
                            />
                        </div>
                    </motion.div>
                </div>
            </header>

            <section className="pb-32 px-4">
                <div className="container">
                    {products.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                            <p className="text-[var(--color-text-subtle)]">This album currently has no items assigned to it.</p>
                            <Link href="/admin/dashboard" className="text-[var(--color-primary)] hover:underline mt-2 inline-block">Go to Dashboard to add products</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {products.map((item: any, idx: number) => (
                                <motion.div
                                    key={item.id}
                                    className="group relative"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                                >
                                    <div className="relative rounded-[var(--radius-md)] overflow-hidden aspect-[3/4] shadow-2xl bg-[var(--color-bg-glass)]">
                                        <EditableImage
                                            id={`db-prod-img-${item.id}`}
                                            defaultSrc={item.image_path.startsWith('http') ? item.image_path : `/images/goshen/${item.image_path}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            {item.tag && (
                                                <span className="self-start px-3 py-1 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-[10px] font-bold uppercase rounded mb-4">
                                                    {item.tag}
                                                </span>
                                            )}
                                            <h3 className="text-white text-3xl font-playfair italic mb-2">
                                                <EditableText id={`db-prod-name-${item.id}`} defaultValue={item.name} />
                                            </h3>
                                            <p className="text-white/70 text-sm line-clamp-2">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Mobile Label */}
                                    <div className="mt-4 md:hidden">
                                        <h3 className="text-xl font-bold">{item.name}</h3>
                                        {item.tag && <span className="text-[var(--color-primary)] text-xs uppercase font-bold">{item.tag}</span>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="mt-32 text-center">
                        <Link href="/#collections" className="btn btn-secondary flex items-center gap-3 mx-auto w-fit">
                            <ArrowLeft size={18} /> Back to Collections
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
