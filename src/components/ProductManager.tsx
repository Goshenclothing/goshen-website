'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, ImageIcon } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    collection: string;
    tag: string;
    image: string;
}

export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Vibrant Heritage Kimono', collection: 'Casual Elegance', tag: 'New', image: '/images/goshen/WhatsApp Image 2025-12-30 at 12.12.45.jpeg' },
        { id: '2', name: 'Sunset Blaze Kimono', collection: 'Evening Glamour', tag: 'Popular', image: '/images/goshen/WhatsApp Image 2025-12-30 at 12.12.46.jpeg' },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', collection: 'Casual Elegance', tag: '', image: '' });

    const handleAdd = () => {
        if (!newProduct.name) return;
        const id = Math.random().toString(36).substr(2, 9);
        setProducts([...products, { ...newProduct, id }]);
        setNewProduct({ name: '', collection: 'Casual Elegance', tag: '', image: '' });
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                            placeholder="Product Name"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-2 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <select
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-2 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newProduct.collection}
                            onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value })}
                        >
                            <option>Casual Elegance</option>
                            <option>Evening Glamour</option>
                            <option>Signature Prints</option>
                            <option>Luxury Line</option>
                        </select>
                        <input
                            placeholder="Tag (e.g. New)"
                            className="bg-black/20 border border-[var(--color-border)] rounded-lg p-2 text-sm focus:border-[var(--color-primary)] outline-none"
                            value={newProduct.tag}
                            onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAdd} className="btn-primary flex-1 py-2 rounded-lg text-sm font-bold">Save</button>
                            <button onClick={() => setIsAdding(false)} className="btn-secondary flex-1 py-2 rounded-lg text-sm font-bold opacity-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--color-bg-glass)] border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm">Image</th>
                            <th className="px-6 py-4 font-semibold text-sm">Product Name</th>
                            <th className="px-6 py-4 font-semibold text-sm">Collection</th>
                            <th className="px-6 py-4 font-semibold text-sm">Tag</th>
                            <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 bg-black/40 rounded flex items-center justify-center border border-[var(--color-border)] overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={20} className="text-white/20" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                <td className="px-6 py-4 text-[var(--color-text-subtle)] text-sm">{product.collection}</td>
                                <td className="px-6 py-4">
                                    {product.tag && (
                                        <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] uppercase font-bold rounded border border-[var(--color-primary)]/20">
                                            {product.tag}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
