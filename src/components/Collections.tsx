'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { Loader2 } from 'lucide-react';

export default function Collections() {
    const [collections, setCollections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('collections')
                .select('id, title, image_path, description, created_at')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('[Collections] Supabase error:', error);
                throw error;
            }
            
            if (!data) {
                console.warn('[Collections] No data returned from query');
                setCollections([]);
                return;
            }
            
            setCollections(data || []);
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            console.error('[Collections] Failed to fetch:', err.message);
            setCollections([]); // Gracefully degrade to empty state
        } finally {
            setIsLoading(false);
        }
    };

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

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                    </div>
                ) : (
                    <div className="collections-grid">
                        {collections.map((c, i) => (
                            <Link
                                key={c.id}
                                href={`/collections/${c.id}`}
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
                                        id={`collection-img-${c.id}`}
                                        defaultSrc={c.image_path.startsWith('http') ? c.image_path : `/images/goshen/${c.image_path}`}
                                        alt={c.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="collection-overlay">
                                        <h3 className="collection-title">
                                            <EditableText id={`collection-title-${c.id}`} defaultValue={c.title} />
                                        </h3>
                                        <div className="collection-count">
                                            <EditableText id={`collection-count-${c.id}`} defaultValue={c.count_text} />
                                        </div>
                                        <span className="mt-4 text-[10px] font-bold tracking-widest uppercase text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                            Open Lookbook
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
