'use client';

import { useAdmin } from '@/context/AdminContext';
import { useState, useEffect, useRef } from 'react';
import { apiPost } from '@/lib/apiClient';
import {
    Send,
    Image as ImageIcon,
    X,
    MessageSquare,
    RefreshCcw,
    Loader2,
    Camera,
    Sparkles
} from 'lucide-react';
import NextImage from 'next/image';

type Message = {
    role: string;
    text: string;
    image?: string;
};

export default function Chatbot() {
    const { isAdminMode } = useAdmin();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: "Hello! I'm your Goshen assistant. Ask me about our collections, luxury fashion, or styling advice." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // SECURITY: Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setError(`File too large. Maximum size is 5MB`);
            return;
        }

        // SECURITY: Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid image format. Please use JPEG, PNG, WebP, or GIF.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.onerror = () => {
            setError('Failed to read image file.');
        };
        reader.readAsDataURL(file);
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMsg = input.trim();
        const imageData = selectedImage;

        // Clear any previous errors
        setError(null);

        // Add user message to UI
        setMessages(prev => [...prev, {
            role: 'user',
            text: userMsg || "Sent an image",
            image: imageData || undefined
        }]);

        setInput('');
        setSelectedImage(null);
        setIsLoading(true);

        // Admin command shortcuts
        if (isAdminMode && userMsg.toLowerCase() === 'reset content') {
            localStorage.clear();
            setMessages(prev => [...prev, { role: 'bot', text: "Content reset! Please refresh. 🔄" }]);
            setIsLoading(false);
            return;
        }

        try {
            const response = await apiPost<{ text: string }>('/api/chat', {
                messages: messages.map(m => ({ role: m.role, text: m.text })),
                imageData: imageData
            });

            if (response.error) {
                throw new Error(response.error);
            }

            if (!response.data?.text) {
                throw new Error('No response from AI service');
            }

            setMessages(prev => [...prev, { role: 'bot', text: response.data.text }]);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            let errorText = "I'm having trouble connecting. Please try again!";
            
            if (errorMsg.includes('timeout') || errorMsg.includes('504')) {
                errorText = "That took too long. Please try a shorter message.";
            } else if (errorMsg.includes('503')) {
                errorText = "AI service is temporarily unavailable. Please try again later.";
            } else if (isAdminMode) {
                errorText = `Error: ${errorMsg}`;
            }

            setMessages(prev => [...prev, { role: 'bot', text: errorText }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className={`chatbot-window ${isOpen ? 'active' : ''} glass-card`}>
                <div className="chatbot-header">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--gradient-gold)] flex items-center justify-center shadow-lg">
                            <Sparkles size={16} className="text-[var(--color-bg-dark)]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight">Goshen AI Assistant</span>
                            <span className="text-[10px] text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Online & Elegant
                            </span>
                        </div>
                    </div>
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((m, i) => (
                        <div key={i} className={`chat-message ${m.role} group`}>
                            {m.image && (
                                <div className="mb-2 rounded-xl overflow-hidden border border-white/10">
                                    <img src={m.image} alt="User upload" className="max-w-full h-auto" />
                                </div>
                            )}
                            <div className="message-text">
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message bot opacity-50 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-[var(--color-primary)]" />
                            <span>Designing a response...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-controls-container">
                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="px-4 py-2 border-t border-white/5 bg-white/5 flex items-center gap-3 animate-fade-in">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[var(--color-primary)]">
                                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} className="text-white" />
                                </button>
                            </div>
                            <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-widest font-bold">Image ready to scan</span>
                        </div>
                    )}

                    <div className="chatbot-input-area p-4 pt-2">
                        <div className="flex items-center gap-2 bg-[var(--color-bg-dark)] border border-white/10 rounded-2xl p-1.5 focus-within:border-[var(--color-primary)]/50 transition-all shadow-inner">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] hover:bg-white/5 rounded-xl transition-all"
                                title="Upload visual context"
                            >
                                <Camera size={20} />
                            </button>
                            <input
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none py-2 px-1 text-sm placeholder:text-white/20"
                                placeholder="Describe a style or ask about fabrics..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                            />
                            <button
                                className={`p-2.5 rounded-xl transition-all ${(input.trim() || selectedImage) && !isLoading
                                        ? 'bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] shadow-lg scale-100'
                                        : 'text-white/20 scale-95 opacity-50'
                                    }`}
                                onClick={handleSend}
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                        />
                    </div>
                </div>
            </div>

            <button
                className={`chatbot-toggle ${isOpen ? 'active hover:rotate-90' : 'hover:scale-110 shadow-[0_0_30px_rgba(212,175,55,0.3)]'} transition-all duration-500`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Goshen Intelligence"
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-primary)]"></span>
                    </span>
                )}
            </button>
        </div>
    );
}

