'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, FolderArchive, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

interface Collection {
    id: string;
    title: string;
    description: string;
    itemCount: string;
    image: string;
}

export default function CollectionManager() {
    const [collections, setCollections] = useState<Collection[]>([
        { id: '0', title: 'Casual Elegance', description: 'Everyday African prints', itemCount: '8 Pieces', image: '/images/goshen/WhatsApp Image 2025-12-30 at 12.12.05.jpeg' },
        { id: '1', title: 'Evening Glamour', description: 'Regal silhouettes', itemCount: '6 Pieces', image: '/images/goshen/WhatsApp Image 2025-12-30 at 12.12.06.jpeg' },
        { id: '2', title: 'Signature Prints', description: 'Unique patterns', itemCount: '12 Pieces', image: '/images/goshen/WhatsApp Image 2025-12-30 at 12.12.07.jpeg' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Manage Albums (Collections)</h3>
                <button className="btn btn-primary py-2 px-4 text-sm flex items-center gap-2">
                    <Plus size={18} /> New Collection
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((coll) => (
                    <div key={coll.id} className="bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-xl overflow-hidden group">
                        <div className="aspect-video relative overflow-hidden">
                            <img src={coll.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={coll.title} />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/collections/${coll.id}`}
                                    className="bg-white text-black p-2 rounded-full hover:bg-[var(--color-primary)] transition-colors"
                                >
                                    <LayoutGrid size={20} />
                                </Link>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">{coll.title}</h4>
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{coll.itemCount}</span>
                            </div>
                            <p className="text-xs text-[var(--color-text-subtle)] mb-4">{coll.description}</p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 border border-white/10 rounded-lg text-xs hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                    <Edit2 size={12} /> Edit Details
                                </button>
                                <button className="p-2 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
