'use client';

import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
                        <div className="max-w-md text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h1>
                            <p className="text-[var(--color-text-subtle)] mb-6">
                                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                            >
                                Refresh Page
                            </button>
                            {process.env.NODE_ENV === 'development' && (
                                <details className="mt-6 text-left bg-white/5 p-4 rounded-lg border border-white/10">
                                    <summary className="cursor-pointer text-sm font-mono text-red-400">
                                        Error Details
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-300 overflow-auto max-h-48">
                                        {this.state.error?.toString()}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
