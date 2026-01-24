'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-8xl font-bold bg-[var(--gradient-gold)] bg-clip-text text-transparent mb-4">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-white mb-3">Page Not Found</h2>
                    <p className="text-[var(--color-text-subtle)]">
                        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Let&rsquo;s get you back on track.
                    </p>
                </div>

                <div className="space-y-3 mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 w-full bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] text-white font-bold py-3 px-6 rounded-xl hover:border-[var(--color-primary)] transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href="/auth/login"
                        className="text-sm text-[var(--color-primary)] hover:underline p-2"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="text-sm text-[var(--color-primary)] hover:underline p-2"
                    >
                        Create Account
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-[var(--color-text-subtle)] hover:text-white p-2"
                    >
                        Shop
                    </Link>
                    <a
                        href="https://wa.me/233540402935"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--color-text-subtle)] hover:text-white p-2"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
}
