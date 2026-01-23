'use client';

export const dynamic = 'force-dynamic';

import { useUserAuth } from '@/context/UserAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User,
    Settings,
    ShoppingBag,
    LogOut,
    ChevronRight,
    Clock,
    MapPin,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountDashboard() {
    const { user, signOut, loading, is2FAComplete } = useUserAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || !is2FAComplete) {
        return null; // Should be handled by middleware, but safety first
    }

    const stats = [
        { label: 'Total Orders', value: '0', icon: ShoppingBag },
        { label: 'Saved Items', value: '0', icon: Clock },
        { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString(), icon: User },
    ];

    const menuItems = [
        { title: 'Personal Profile', desc: 'Update your name, email, and phone', icon: User, href: '/account/profile' },
        { title: 'Order History', desc: 'View and track your previous orders', icon: ShoppingBag, href: '/account/orders' },
        { title: 'Shipping Addresses', desc: 'Manage your delivery locations', icon: MapPin, href: '/account/addresses' },
        { title: 'Payment Methods', desc: 'Update your saved payment options', icon: CreditCard, href: '/account/payments' },
        { title: 'Security Settings', desc: 'Password and 2FA preferences', icon: Settings, href: '/account/security' },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] py-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-[var(--gradient-gold)] flex items-center justify-center overflow-hidden border-2 border-[var(--color-primary)]">
                            {user.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-[var(--color-bg-dark)]" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-playfair mb-1">
                                Welcome, {user.user_metadata?.full_name || 'Guest'}
                            </h1>
                            <p className="text-[var(--color-text-subtle)]">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-6 py-3 bg-[var(--color-border)] hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all font-medium text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-[var(--gradient-card)] p-6 rounded-3xl border border-[var(--color-border)]">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-[var(--color-text-subtle)]">{stat.label}</span>
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Menu Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                        {menuItems.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group flex items-center justify-between p-6 bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-3xl hover:border-[var(--color-primary)] transition-all shadow-lg"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-[var(--color-bg-dark)] text-[var(--color-text-subtle)] group-hover:text-[var(--color-primary)] rounded-2xl flex items-center justify-center transition-colors">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-0.5">{item.title}</h3>
                                        <p className="text-sm text-[var(--color-text-subtle)]">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-[var(--color-text-subtle)] group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="bg-[var(--gradient-gold)] p-8 rounded-3xl text-[var(--color-bg-dark)] shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Goshen Signature</h3>
                                <p className="text-sm font-medium opacity-80 mb-6 font-playfair">Exclusive rewards for our valued members.</p>
                                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-80 transition-all uppercase tracking-widest text-[10px]">
                                    Browse Collection
                                </button>
                            </div>
                            <ShoppingBag className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
                        </div>

                        <div className="bg-[var(--gradient-card)] p-8 rounded-3xl border border-[var(--color-border)]">
                            <h3 className="font-bold mb-4">Support</h3>
                            <p className="text-sm text-[var(--color-text-subtle)] mb-6">Need help with an order? Our team is available 24/7.</p>
                            <Link href="/contact" className="block text-center py-3 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
