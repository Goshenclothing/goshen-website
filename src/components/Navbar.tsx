'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { ShoppingBag, User } from 'lucide-react';

export default function Navbar() {
    const { isAdminMode } = useAdmin();
    const { user, is2FAComplete } = useUserAuth();
    const { setIsCartOpen, cartCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'default' | 'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('goshen-theme') as any) || 'default';
        }
        return 'default';
    });



    const applyTheme = (newTheme: 'default' | 'light' | 'dark') => {
        document.body.classList.remove('theme-light', 'theme-dark');
        if (newTheme !== 'default') {
            document.body.classList.add(`theme-${newTheme}`);
        }
        localStorage.setItem('goshen-theme', newTheme);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        applyTheme(theme);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const cycleTheme = () => {
        const themes: ('default' | 'light' | 'dark')[] = ['default', 'light', 'dark'];
        const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        setTheme(nextTheme);
        applyTheme(nextTheme);
    };

    const themeIcons = { default: '🌙', light: '☀️', dark: '🌑' };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link href="/" className="nav-logo flex items-center gap-2">
                    <NextImage src="/logo.png" alt="Goshen Logo" width={32} height={32} className="object-contain" />
                    <span>GOSHEN <span>Clothing</span></span>
                </Link>

                <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <li><Link href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                    <li><Link href="#products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link></li>
                    <li><Link href="#collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link></li>
                    <li><Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
                    <li><Link href="#reviews" onClick={() => setIsMobileMenuOpen(false)}>Reviews</Link></li>
                    <li><Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
                    {user && is2FAComplete ? (
                        <li><Link href="/account" className="text-[var(--color-primary)] font-bold flex items-center gap-2">
                            <User size={18} />
                            Account
                        </Link></li>
                    ) : (
                        <li><Link href="/auth/login" className="hover:text-[var(--color-primary)] transition-colors">Sign In</Link></li>
                    )}
                    {isAdminMode && (
                        <li><Link href="/admin/dashboard" className="text-[var(--color-primary)] font-bold">Admin</Link></li>
                    )}
                </ul>

                <button
                    className="theme-toggle"
                    onClick={cycleTheme}
                    aria-label="Toggle theme"
                >
                    <span>{themeIcons[theme]}</span>
                </button>

                <button
                    className="theme-toggle relative"
                    onClick={() => setIsCartOpen(true)}
                    aria-label="Shopping cart"
                >
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>

                <button
                    className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
