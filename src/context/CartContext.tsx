'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: { id: string; name: string; price?: number; image_path: string }, size?: string) => void;
    removeItem: (id: string, size?: string) => void;
    updateQuantity: (id: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    total: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    checkoutViaWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('goshen-cart');
                return saved ? JSON.parse(saved) : [];
            } catch (error) {
                console.error('[Cart] Failed to parse saved cart:', error);
                localStorage.removeItem('goshen-cart');
                return [];
            }
        }
        return [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const isMounted = useRef(false);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isMounted.current) {
            localStorage.setItem('goshen-cart', JSON.stringify(items));
        } else {
            isMounted.current = true;
        }
    }, [items]);

    const addItem = (product: { id: string; name: string; price?: number; image_path: string }, size: string = 'One Size') => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id && item.size === size);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.size === size)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: product.price || 0, // Fallback if price missing
                image: product.image_path,
                quantity: 1,
                size
            }];
        });
        setIsCartOpen(true);
    };

    const removeItem = (id: string, size: string = 'One Size') => {
        setItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id: string, quantity: number, size: string = 'One Size') => {
        if (quantity < 1) {
            removeItem(id, size);
            return;
        }
        setItems(prev => prev.map(item =>
            (item.id === id && item.size === size) ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const checkoutViaWhatsApp = () => {
        const phoneNumber = "233540402935"; // Goshen Clothing WhatsApp number
        const timestamp = Date.now();
        const referenceId = `GOSHEN-${timestamp}`;
        
        let message = "Hello Goshen Clothing 👋\\n\\n";
        message += "I would like to place an order / make enquiries for the following items:\\n\\n";
        
        items.forEach((item, index) => {
            const imageUrl = item.image.startsWith('http') 
                ? item.image 
                : `${typeof window !== 'undefined' ? window.location.origin : ''}/images/goshen/${item.image}`;
            
            message += `${index + 1}. Product Name: ${item.name}\\n`;
            message += `   Quantity: ${item.quantity}\\n`;
            message += `   Price: GHS ${item.price.toFixed(2)}\\n`;
            message += `   Size: ${item.size}\\n`;
            message += `   Image: ${imageUrl}\\n\\n`;
        });
        
        message += `Total Items: ${cartCount}\\n`;
        message += `Total Cost: GHS ${total.toFixed(2)}\\n\\n`;
        message += `Reference ID: ${referenceId}\\n\\n`;
        message += "Thank you.";
        
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            total,
            cartCount,
            isCartOpen,
            setIsCartOpen,
            checkoutViaWhatsApp
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
