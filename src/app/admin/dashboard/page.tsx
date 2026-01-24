'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    Image as ImageIcon,
    MessageSquare,
    Settings,
    LogOut,
    Sparkles,
    BarChart3,
    Users
} from 'lucide-react';
import AdminAIChat from '@/components/AdminAIChat';
import ProductManager from '@/components/ProductManager';
import CollectionManager from '@/components/CollectionManager';
import { useAdmin } from '@/context/AdminContext';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const { logout } = useAdmin();

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'collections', label: 'Collections', icon: ImageIcon },
        { id: 'ai-agent', label: 'AI Admin Agent', icon: Sparkles },
        { id: 'customer-chat', label: 'Customer Chat', icon: MessageSquare },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--gradient-card)] border-r border-[var(--color-border)] p-6">
                <div className="mb-10 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--gradient-gold)] rounded-lg flex items-center justify-center font-bold text-[var(--color-bg-dark)]">G</div>
                    <span className="text-xl font-bold font-playfair tracking-tight">GOSHEN <span className="text-sm font-normal text-[var(--color-text-subtle)] block">Admin Portal</span></span>
                </div>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] shadow-lg'
                                : 'text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-glass)] hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-semibold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-10">
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-[var(--color-text-subtle)] hover:text-red-400 transition-colors w-full">
                        <LogOut size={20} />
                        <span className="font-semibold text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold font-playfair capitalize">{activeTab.replace('-', ' ')}</h2>
                        <p className="text-[var(--color-text-subtle)]">Welcome back, Goshen Admin</p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Products', value: '24', icon: Package, color: 'blue' },
                                    { label: 'Total Sales', value: 'GH₵ 12.5k', icon: BarChart3, color: 'green' },
                                    { label: 'Active Users', value: '1.2k', icon: Users, color: 'purple' },
                                    { label: 'AI Responses', value: '450', icon: MessageSquare, color: 'gold' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-[var(--gradient-card)] border border-[var(--color-border)] p-6 rounded-[var(--radius-md)]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-lg bg-[var(--color-bg-glass)] text-[var(--color-primary)]`}>
                                                <stat.icon size={24} />
                                            </div>
                                        </div>
                                        <span className="text-[var(--color-text-subtle)] text-sm">{stat.label}</span>
                                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'ai-agent' && <AdminAIChat />}

                        {activeTab === 'products' && <ProductManager />}

                        {activeTab === 'collections' && <CollectionManager />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}