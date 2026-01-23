'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface AdminContextType {
    isAdminMode: boolean;
    user: User | null;
    logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const checkAdminSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Refresh role from DB (metadata) to ensure it hasn't been revoked
                const isAdmin = session.user.app_metadata?.role === 'admin';
                const isTargetAdmin = session.user.email === 'Mawuo247@gmail.com';

                const valid = isAdmin && isTargetAdmin;
                setUser(session.user);
                setIsAdminMode(valid);

                if (valid) {
                    // Sync with server middleware
                    router.refresh();
                }
            } else {
                setUser(null);
                setIsAdminMode(false);
            }
        };

        checkAdminSession();

        // Setup real-time auth listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const isAdmin = session.user.app_metadata?.role === 'admin';
                const isTargetAdmin = session.user.email === 'Mawuo247@gmail.com';
                const valid = isAdmin && isTargetAdmin;

                setUser(session.user);
                setIsAdminMode(valid);
            } else {
                setUser(null);
                setIsAdminMode(false);
            }

            // Sync with server middleware
            router.refresh();
        });

        // Set up periodic "heartbeat" to verify session is still valid
        const heartbeat = setInterval(checkAdminSession, 5 * 60 * 1000); // Every 5 minutes

        return () => {
            subscription.unsubscribe();
            clearInterval(heartbeat);
        };
    }, [supabase, router]);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAdminMode(false);
        router.push('/');
        router.refresh();
    };

    return (
        <AdminContext.Provider value={{ isAdminMode, user, logout }}>
            {children}
            {isAdminMode && user && (
                <div className="fixed top-0 left-0 w-full bg-[var(--color-primary)] text-[var(--color-bg-dark)] py-1.5 px-6 text-[10px] tracking-wider font-bold z-[2000] flex justify-between items-center shadow-xl border-b border-black/10">
                    <div className="flex items-center gap-3">
                        <span className="flex h-2 w-2 rounded-full bg-[var(--color-bg-dark)] animate-pulse"></span>
                        <span className="uppercase">Secure Admin Session • {user.email}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-black/10 hover:bg-black/20 px-3 py-0.5 rounded-full transition-all border border-black/5 hover:border-black/10 flex items-center gap-2"
                    >
                        <span>End Session</span>
                    </button>
                </div>
            )}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
