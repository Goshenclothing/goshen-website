'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';

// In a real app, this would fetch from Supabase based on the ID
const COLLECTIONS_DATA: any = {
    '0': {
        title: "Casual Elegance",
        description: "Effortless style for your everyday moments. Our casual pieces blend comfort with authentic African prints.",
        items: [
            { name: "Daily Chic Kimono", image: "WhatsApp Image 2025-12-30 at 12.12.05.jpeg" },
            { name: "Morning Breeze Robe", image: "WhatsApp Image 2025-12-30 at 12.12.45.jpeg" },
            { name: "Urban Safari Print", image: "WhatsApp Image 2025-12-30 at 12.12.43.jpeg" },
        ]
    },
    '1': {
        title: "Evening Glamour",
        description: "Transform your evenings with regal silhouettes and bold colors designed to turn heads.",
        items: [
            { name: "Midnight Star Kimono", image: "WhatsApp Image 2025-12-30 at 12.12.06.jpeg" },
            { name: "Royal Banquet Piece", image: "WhatsApp Image 2025-12-30 at 12.12.46.jpeg" },
        ]
    }
};

export default function CollectionPage() {
    const params = useParams();
    const id = params.id as string;
    const collection = COLLECTIONS_DATA[id] || { title: "Collection", description: "Discover our latest pieces.", items: [] };

    return (
        <main className="min-h-screen bg-[var(--color-bg-dark)]">
            <Navbar />

            <header className="pt-40 pb-20 px-4 text-center">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="mb-4">
                            <EditableText id={`coll-page-title-${id}`} defaultValue={collection.title} />
                        </h1>
                        <div className="max-w-2xl mx-auto text-[var(--color-text-muted)] text-lg">
                            <EditableText
                                id={`coll-page-desc-${id}`}
                                tagName="p"
                                defaultValue={collection.description}
                            />
                        </div>
                    </motion.div>
                </div>
            </header>

            <section className="pb-32 px-4">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collection.items.map((item: any, idx: number) => (
                            <motion.div
                                key={idx}
                                className="group relative rounded-[var(--radius-md)] overflow-hidden aspect-[3/4] shadow-xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <EditableImage
                                    id={`item-img-${id}-${idx}`}
                                    defaultSrc={`/images/goshen/${item.image}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <h3 className="text-white text-xl">
                                        <EditableText id={`item-name-${id}-${idx}`} defaultValue={item.name} />
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link href="/#collections" className="btn btn-secondary">
                            Back to Collections
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
