'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
    isAdminMode: boolean;
    setIsAdminMode: (val: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [isAdminMode, setIsAdminMode] = useState(false);

    useEffect(() => {
        // Load preference from localStorage
        const saved = localStorage.getItem('goshen-admin-mode') === 'true';
        if (saved) setIsAdminMode(true);

        // Global keyboard shortcut: Ctrl+Shift+A
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                setIsAdminMode(prev => {
                    const next = !prev;
                    localStorage.setItem('goshen-admin-mode', String(next));
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <AdminContext.Provider value={{ isAdminMode, setIsAdminMode }}>
            {children}
            {isAdminMode && (
                <div className="fixed top-0 left-0 w-full bg-[var(--color-primary)] text-[var(--color-bg-dark)] py-1 px-4 text-xs font-bold z-[1001] flex justify-between items-center shadow-lg">
                    <span>⚡ ADMIN CONTROL MODE ACTIVE - Click any text to edit</span>
                    <button
                        onClick={() => {
                            setIsAdminMode(false);
                            localStorage.setItem('goshen-admin-mode', 'false');
                        }}
                        className="bg-black/20 hover:bg-black/40 px-2 py-0.5 rounded transition-colors"
                    >
                        Exit Mode
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
