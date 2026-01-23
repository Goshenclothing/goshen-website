'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signupError) throw signupError;

            if (data.user) {
                // Success - redirect to verification pending or login
                // Since we implemented a trigger in DB, profile will be created automatically.
                router.push('/auth/login?message=Check your email to confirm your account.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                        <div className="w-16 h-16 bg-[var(--gradient-gold)] rounded-2xl flex items-center justify-center font-bold text-[var(--color-bg-dark)] text-2xl shadow-lg">
                            G
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-[var(--color-text-subtle)]">Join the Goshen family for a luxury fashion experience</p>
                </div>

                <div className="bg-[var(--gradient-card)] p-8 rounded-3xl border border-[var(--color-border)] shadow-2xl">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Abena Mansa"
                                    className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Phone Number (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                <input
                                    type="tel"
                                    placeholder="+233..."
                                    className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Password</label>
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
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--color-border)]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[var(--color-bg-dark)] px-4 text-[var(--color-text-subtle)] tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-3 bg-[var(--color-bg-dark)] border border-[var(--color-border)] py-3 rounded-xl hover:bg-[var(--color-border)] transition-all"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 bg-[var(--color-bg-dark)] border border-[var(--color-border)] py-3 rounded-xl hover:bg-[var(--color-border)] transition-all">
                                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 invert" alt="Apple" />
                                <span className="text-sm font-medium">Apple</span>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-[var(--color-text-subtle)]">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-[var(--color-primary)] font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
