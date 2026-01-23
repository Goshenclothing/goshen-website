'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, items, removeItem, updateQuantity, checkoutViaWhatsApp, total } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-[2000] backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Sidebar */}
                    <motion.div
                        className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-[var(--color-bg-dark)] border-l border-[var(--color-border)] z-[2001] shadow-2xl flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-glass)]">
                            <h2 className="text-xl font-playfair font-bold flex items-center gap-2">
                                <ShoppingBag size={20} className="text-[var(--color-primary)]" />
                                Your Bag ({items.length})
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                                    <ShoppingBag size={48} />
                                    <p>Your bag is empty.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-[var(--color-primary)] underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-[var(--color-bg-glass)] rounded-xl border border-[var(--color-border-light)]">
                                        <div className="w-20 h-24 bg-black/20 rounded overflow-hidden flex-shrink-0 relative border border-[var(--color-border-light)]">
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `/images/goshen/${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold line-clamp-1">{item.name}</h3>
                                                <p className="text-xs text-[var(--color-text-subtle)]">{item.size}</p>
                                                <p className="text-sm font-semibold text-[var(--color-primary)] mt-1">
                                                    GHS {item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex items-center gap-3 bg-black/30 rounded-lg px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                                        className="w-6 h-6 flex items-center justify-center hover:text-[var(--color-primary)] font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                        className="w-6 h-6 flex items-center justify-center hover:text-[var(--color-primary)] font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold">GHS {(item.price * item.quantity).toFixed(2)}</span>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="p-2 text-red-500/70 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-glass)] space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-[var(--color-primary)]">GHS {total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-center text-[var(--color-text-subtle)]">
                                    Shipping & taxes calculated at checkout
                                </p>
                                <button
                                    onClick={checkoutViaWhatsApp}
                                    className="w-full py-4 bg-[#25D366] hover:bg-[#1dbf57] text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-green-900/20"
                                >
                                    <span>Checkout on WhatsApp</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
