'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldCheck, ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useUserAuth } from '@/context/UserAuthContext';

export default function TwoFactorPage() {
    const [pin, setPin] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { user, refreshSession, set2FAComplete } = useUserAuth();
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // If no user is logged in, redirect to login
        if (!user) {
            // Wait a bit to ensure context hydration
            const timer = setTimeout(() => {
                if (!user) router.push('/auth/login');
            }, 1000);
            return () => clearTimeout(timer);
        }

        // Trigger the first PIN send
        sendPin();
    }, [user]);

    const sendPin = async () => {
        setSending(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/2fa/send', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send PIN.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    const handlePinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const pinString = pin.join('');
        if (pinString.length < 4) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: pinString }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Verification failed.');

            setSuccess(true);
            set2FAComplete(true);
            router.push('/account');
        } catch (err: any) {
            setError(err.message);
            setPin(['', '', '', '']);
            inputRefs[0].current?.focus();
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[var(--gradient-gold)] rounded-2xl flex items-center justify-center font-bold text-[var(--color-bg-dark)] text-2xl shadow-lg mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Two-Step Verification</h1>
                    <p className="text-[var(--color-text-subtle)]">
                        Enter the 4-digit code sent to<br />
                        <span className="text-[var(--color-primary)] font-medium">{user.email}</span>
                    </p>
                </div>

                <div className="bg-[var(--gradient-card)] p-8 rounded-3xl border border-[var(--color-border)] shadow-2xl">
                    <form onSubmit={handleVerify} className="space-y-8">
                        <div className="flex justify-between gap-4">
                            {pin.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={inputRefs[idx]}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    className="w-full h-16 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] rounded-xl text-center text-2xl font-bold focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                    value={digit}
                                    onChange={(e) => handlePinChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    disabled={loading || success}
                                    autoFocus={idx === 0}
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || success || pin.join('').length < 4}
                            className="w-full bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>Verify & Continue</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={sendPin}
                            disabled={sending || loading || success}
                            className="text-sm text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className={`w-4 h-4 ${sending ? 'animate-spin' : ''}`} />
                            {sending ? 'Sending...' : "Didn't receive a code? Resend"}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-[var(--color-text-subtle)]">
                    Having trouble?{' '}
                    <button onClick={signOut} className="text-[var(--color-primary)] font-bold hover:underline">
                        Sign Out
                    </button>
                </p>
            </div>
        </div>
    );
}
