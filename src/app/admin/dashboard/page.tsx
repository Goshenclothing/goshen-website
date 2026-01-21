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
    Plus,
    Sparkles,
    BarChart3,
    Users
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

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
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-[var(--color-text-subtle)] hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="font-semibold text-sm text-[var(--color-bg-dark)]">Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold font-playfair capitalize">{activeTab.replace('-', ' ')}</h2>
                        <p className="text-[var(--color-text-subtle)]">Welcome back, Goshen Admin</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                            <Plus size={18} /> Add New Product
                        </button>
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

                        {activeTab === 'ai-agent' && (
                            <div className="bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
                                <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-bg-glass)]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Sparkles className="text-[var(--color-primary)]" />
                                        <h3 className="text-xl font-bold">Goshen AI Admin Agent</h3>
                                    </div>
                                    <p className="text-[var(--color-text-subtle)]">
                                        Use natural language to manage your store. I can add products, update prices, or change descriptions.
                                    </p>
                                </div>
                                <div className="h-[400px] p-6 flex flex-col justify-end">
                                    <div className="space-y-4 mb-6">
                                        <div className="bg-[var(--color-bg-dark)] p-4 rounded-xl border border-[var(--color-border)] max-w-lg">
                                            <p className="text-sm">"I need to add a new Red Silk Kimono to the Evening Glamour collection."</p>
                                        </div>
                                        <div className="bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] p-4 rounded-xl self-end max-w-lg ml-auto">
                                            <p className="text-sm font-semibold">"Understood. I've prepared a draft for the 'Red Silk Kimono'. Would you like to review the details or publish it immediately?"</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Type a command (e.g., 'Discount all Summer items by 10%')"
                                            className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-xl py-4 px-6 focus:outline-none focus:border-[var(--color-primary)]"
                                        />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]">
                                            <Sparkles size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[var(--color-bg-glass)] border-b border-[var(--color-border)]">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Image</th>
                                            <th className="px-6 py-4 font-semibold">Product Name</th>
                                            <th className="px-6 py-4 font-semibold">Collection</th>
                                            <th className="px-6 py-4 font-semibold">Tag</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)]">
                                        {[1, 2, 3, 4].map((id) => (
                                            <tr key={id} className="hover:bg-[var(--color-bg-glass)] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 bg-[var(--color-bg-dark)] rounded overflow-hidden border border-[var(--color-border)]">
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-white">Example Kimono Item {id}</td>
                                                <td className="px-6 py-4 text-[var(--color-text-subtle)] text-sm">Signature Prints</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">New</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-[var(--color-text-subtle)] hover:text-white mr-3 text-sm">Edit</button>
                                                    <button className="text-red-400/70 hover:text-red-400 text-sm">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
