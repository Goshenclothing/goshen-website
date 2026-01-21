'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'default' | 'light' | 'dark'>('default');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const savedTheme = localStorage.getItem('goshen-theme') as any || 'default';
        setTheme(savedTheme);
        applyTheme(savedTheme);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const applyTheme = (newTheme: 'default' | 'light' | 'dark') => {
        document.body.classList.remove('theme-light', 'theme-dark');
        if (newTheme !== 'default') {
            document.body.classList.add(`theme-${newTheme}`);
        }
        localStorage.setItem('goshen-theme', newTheme);
    };

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
                <Link href="/" className="nav-logo">
                    GOSHEN <span>Clothing</span>
                </Link>

                <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <li><Link href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                    <li><Link href="#products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link></li>
                    <li><Link href="#collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link></li>
                    <li><Link href="#reviews" onClick={() => setIsMobileMenuOpen(false)}>Reviews</Link></li>
                    <li><Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
                </ul>

                <button
                    className="theme-toggle"
                    onClick={cycleTheme}
                    aria-label="Toggle theme"
                >
                    <span>{themeIcons[theme]}</span>
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
