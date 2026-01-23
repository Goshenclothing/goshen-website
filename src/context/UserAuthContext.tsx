'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import type { User, Session } from '@supabase/supabase-js';

interface UserAuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    is2FAComplete: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
    set2FAComplete: (status: boolean) => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [is2FAComplete, setIs2FAComplete] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Check if 2FA is already verified in database for this user
                const { data } = await supabase
                    .from('two_factor')
                    .select('is_verified')
                    .eq('user_id', session.user.id)
                    .single();

                setIs2FAComplete(data?.is_verified ?? false);
            }

            setLoading(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data } = await supabase
                    .from('two_factor')
                    .select('is_verified')
                    .eq('user_id', session.user.id)
                    .single();

                setIs2FAComplete(data?.is_verified ?? false);
            } else {
                setIs2FAComplete(false);
            }

            setLoading(false);
            router.refresh();
        });

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    const signOut = async () => {
        // Reset 2FA status in DB before logout for security
        if (user) {
            await supabase
                .from('two_factor')
                .update({ is_verified: false })
                .eq('user_id', user.id);
        }

        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setIs2FAComplete(false);
        router.push('/');
        router.refresh();
    };

    const refreshSession = async () => {
        const { data: { session: newSession } } = await supabase.auth.getSession();
        setSession(newSession);
        setUser(newSession?.user ?? null);
    };

    return (
        <UserAuthContext.Provider value={{
            user,
            session,
            loading,
            is2FAComplete,
            signOut,
            refreshSession,
            set2FAComplete: setIs2FAComplete
        }}>
            {children}
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error('useUserAuth must be used within a UserAuthProvider');
    }
    return context;
}
