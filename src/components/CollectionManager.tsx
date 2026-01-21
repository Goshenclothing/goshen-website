'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, LayoutGrid, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Collection {
    id: string;
    title: string;
    count_text: string;
    image_path: string;
}

export default function CollectionManager() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCollection, setNewCollection] = useState({
        title: '',
        count_text: '',
        image_path: ''
    });

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCollections(data || []);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newCollection.title) return;

        try {
            const { error } = await supabase
                .from('collections')
                .insert([newCollection]);

            if (error) throw error;

            await fetchCollections();
            setNewCollection({ title: '', count_text: '', image_path: '' });
            setIsAdding(false);
        } catch (error) {
            console.error('Error adding collection:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will not delete the products inside, but they will be unlinked.')) return;

        try {
            const { error } = await supabase
                .from('collections')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCollections(collections.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Manage Albums (Collections)</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn btn-primary py-2 px-4 text-sm flex items-center gap-2"
                >
                    <Plus size={18} /> New Collection
                </button>
            </div>

            {isAdding && (
                <div className="bg-[var(--color-bg-glass)] p-6 rounded-xl border border-[var(--color-primary)]/30 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <input
                            placeholder="Collection Title (e.g. Signature Prints)"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newCollection.title}
                            onChange={(e) => setNewCollection({ ...newCollection, title: e.target.value })}
                        />
                        <input
                            placeholder="Count Text (e.g. 12 Pieces)"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newCollection.count_text}
                            onChange={(e) => setNewCollection({ ...newCollection, count_text: e.target.value })}
                        />
                        <input
                            placeholder="Cover Image Path (e.g. aaaaaaa.jpeg)"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newCollection.image_path}
                            onChange={(e) => setNewCollection({ ...newCollection, image_path: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsAdding(false)} className="px-6 py-2 rounded-lg text-sm font-bold opacity-50 hover:opacity-100 transition-opacity">Cancel</button>
                        <button onClick={handleAdd} className="btn-primary px-8 py-2 rounded-lg text-sm font-bold shadow-lg">Create Album</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((coll) => (
                    <div key={coll.id} className="bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-xl overflow-hidden group shadow-lg flex flex-col">
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={coll.image_path.startsWith('http') ? coll.image_path : `/images/goshen/${coll.image_path}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt={coll.title}
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600x400')}
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                                <Link
                                    href={`/collections/${coll.id}`}
                                    className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <LayoutGrid size={18} /> View Lookbook
                                </Link>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-lg leading-tight">{coll.title}</h4>
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[var(--color-primary)]">{coll.count_text}</span>
                                </div>
                                <p className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-tighter">Album ID: {coll.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 border border-white/5 rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                    <Edit2 size={14} /> Settings
                                </button>
                                <button
                                    onClick={() => handleDelete(coll.id)}
                                    className="p-2 border border-red-500/10 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
