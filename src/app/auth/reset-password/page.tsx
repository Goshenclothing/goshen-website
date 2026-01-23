'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                        <div className="w-16 h-16 bg-[var(--gradient-gold)] rounded-2xl flex items-center justify-center font-bold text-[var(--color-bg-dark)] text-2xl shadow-lg mx-auto">
                            G
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
                    <p className="text-[var(--color-text-subtle)]">Secure your account with a fresh password</p>
                </div>

                <div className="bg-[var(--gradient-card)] p-8 rounded-3xl border border-[var(--color-border)] shadow-2xl">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Password Updated</h3>
                            <p className="text-[var(--color-text-subtle)] mb-6">Your password has been changed successfully. Redirecting you to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        placeholder="••••••••"
                                        className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        placeholder="••••••••"
                                        className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        <span>Update Password</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
