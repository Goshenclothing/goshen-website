'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Initialize Supabase browser client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            // Verify admin role and email immediately (optional since middleware handles it, but good for UX)
            const isAdmin = data.session?.user.app_metadata?.role === 'admin';
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
            const isTargetAdmin = data.session?.user.email === adminEmail;

            if (!isAdmin || !isTargetAdmin) {
                setError('Access denied. Admin privileges required.');
                // Log out immediately if they aren't the designated admin
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }

            // Success - redirect to dashboard
            // router.push is client-side, router.refresh ensures server components pick up the new session
            router.push('/admin/dashboard');
            router.refresh();
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-dark)] px-4">
            <div className="max-w-md w-full bg-[var(--gradient-card)] p-10 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-[var(--gradient-gold)] rounded-xl flex items-center justify-center font-bold text-[var(--color-bg-dark)] mx-auto mb-4 text-xl">
                        G
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
                    <p className="text-[var(--color-text-subtle)]">Enter your credentials to access system controls</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-subtle)]">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="admin@goshenclothing.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-subtle)]">Password</label>
                        <input
                            type="password"
                            className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-400/10 p-4 rounded-lg border border-red-400/20 flex items-center gap-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full justify-center py-4 text-lg"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                <span>Authenticating...</span>
                            </div>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-[var(--color-text-subtle)]">
                    <button onClick={() => router.push('/')} className="hover:text-[var(--color-primary)] transition-colors">
                        ← Back to Website
                    </button>
                </div>
            </div>
        </div>
    );
}
