'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
    id: string;
    name: string;
    description?: string;
    collection_id?: string;
    collection_title?: string;
    tag?: string;
    image_path: string;
}

export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<{ id: string, title: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        collection_id: '',
        tag: '',
        image_path: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch collections first for the dropdown
            const { data: collData } = await supabase.from('collections').select('id, title');
            setCollections(collData || []);

            // Fetch products with collection info
            const { data: prodData, error } = await supabase
                .from('products')
                .select(`
                    *,
                    collections (title)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedProducts = prodData?.map(p => ({
                ...p,
                collection_title: p.collections?.title
            })) || [];

            setProducts(formattedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newProduct.name) return;

        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    name: newProduct.name,
                    collection_id: newProduct.collection_id || null,
                    tag: newProduct.tag || null,
                    image_path: newProduct.image_path || 'placeholder.jpg',
                    description: newProduct.description || ''
                }])
                .select();

            if (error) throw error;

            await fetchData(); // Refresh list
            setNewProduct({ name: '', collection_id: '', tag: '', image_path: '', description: '' });
            setIsAdding(false);
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Check console.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
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
                <h3 className="text-xl font-bold">Manage Products</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn btn-primary py-2 px-4 text-sm flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            {isAdding && (
                <div className="bg-[var(--color-bg-glass)] p-6 rounded-xl border border-[var(--color-primary)]/30 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <input
                            placeholder="Product Name"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <select
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newProduct.collection_id}
                            onChange={(e) => setNewProduct({ ...newProduct, collection_id: e.target.value })}
                        >
                            <option value="">Select Collection (Optional)</option>
                            {collections.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <input
                            placeholder="Tag (e.g. New, Popular)"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newProduct.tag}
                            onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                        />
                        <input
                            placeholder="Image Path (e.g. aaaaaaa.jpeg)"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newProduct.image_path}
                            onChange={(e) => setNewProduct({ ...newProduct, image_path: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-primary)] outline-none col-span-full md:col-span-2"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsAdding(false)} className="px-6 py-2 rounded-lg text-sm font-bold opacity-50 hover:opacity-100 transition-opacity">Cancel</button>
                        <button onClick={handleAdd} className="btn-primary px-8 py-2 rounded-lg text-sm font-bold shadow-lg">Save Product</button>
                    </div>
                </div>
            )}

            <div className="bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--color-bg-glass)] border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm">Preview</th>
                            <th className="px-6 py-4 font-semibold text-sm">Product Name</th>
                            <th className="px-6 py-4 font-semibold text-sm">Collection</th>
                            <th className="px-6 py-4 font-semibold text-sm">Tag</th>
                            <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-[var(--color-text-subtle)]">
                                    No products found in database.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 bg-black/40 rounded flex items-center justify-center border border-[var(--color-border)] overflow-hidden shadow-inner">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={product.image_path.startsWith('http') ? product.image_path : `/images/goshen/${product.image_path}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{product.name}</div>
                                        <div className="text-[10px] text-[var(--color-text-subtle)] truncate max-w-[200px]">{product.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-subtle)] text-sm">
                                        {product.collection_title || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.tag && (
                                            <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] uppercase font-bold rounded border border-[var(--color-primary)]/20 shadow-sm">
                                                {product.tag}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white">
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500/50 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
