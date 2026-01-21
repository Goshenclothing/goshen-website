'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function AdminAIChat() {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Welcome back, Goshen Owner. I'm your AI Admin Agent. How can I assist with the store today? (e.g., 'Update a product description' or 'Plan a seasonal collection')" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'admin', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'admin', text: userMsg }]
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: "I encountered a synchronization error. Please ensure your cloud credentials are active. ✨"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-glass)]">
                <div className="flex items-center gap-3 mb-1">
                    <Sparkles className="text-[var(--color-primary)]" size={20} />
                    <h3 className="text-lg font-bold">Goshen AI Admin Agent</h3>
                </div>
                <p className="text-sm text-[var(--color-text-subtle)]">
                    Natural language store management and business intelligence.
                </p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'admin'
                                ? 'bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] font-medium shadow-md'
                                : 'bg-[var(--color-bg-dark)] border border-[var(--color-border)] text-white'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[var(--color-bg-dark)] border border-[var(--color-border)] text-[var(--color-text-subtle)] p-4 rounded-2xl text-sm italic">
                            AI is analyzing store context...
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-glass)]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                        placeholder="e.g. 'Draft a description for the new Ruby Sunrise Kimono'"
                        className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:border-[var(--color-primary)] text-sm transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isLoading ? 'text-[var(--color-text-subtle)]' : 'text-[var(--color-primary)] hover:bg-[var(--color-bg-glass)]'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
