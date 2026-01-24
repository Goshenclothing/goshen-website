'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (resetError) throw resetError;
            setSuccess(true);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <Link href="/auth/login" className="inline-block mb-6">
                        <div className="w-16 h-16 bg-[var(--gradient-gold)] rounded-2xl flex items-center justify-center font-bold text-[var(--color-bg-dark)] text-2xl shadow-lg mx-auto">
                            G
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    <p className="text-[var(--color-text-subtle)]">Enter your email to receive a reset link</p>
                </div>

                <div className="bg-[var(--gradient-card)] p-8 rounded-3xl border border-[var(--color-border)] shadow-2xl">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Check your inbox</h3>
                            <p className="text-[var(--color-text-subtle)] mb-6">We&rsquo;ve sent a password reset link to <span className="text-[var(--color-primary)]">{email}</span></p>
                            <Link href="/auth/login" className="text-[var(--color-primary)] font-bold hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="abena@example.com"
                                        className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {!success && (
                    <p className="text-center mt-8 text-[var(--color-text-subtle)]">
                        Remember your password?{' '}
                        <Link href="/auth/login" className="text-[var(--color-primary)] font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
