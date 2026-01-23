'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';

interface EditableTextProps {
    id: string;
    defaultValue: string;
    tagName?: keyof React.JSX.IntrinsicElements;
    className?: string;
}

export default function EditableText({ id, defaultValue, tagName: Tag = 'span', className = '' }: EditableTextProps) {
    const { isAdminMode } = useAdmin();
    const [content, setContent] = useState(defaultValue);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // First check local storage for temporary overrides
        const saved = localStorage.getItem(`goshen-content-${id}`);
        if (saved) {
            setContent(saved);
        } else {
            setContent(defaultValue);
        }
    }, [id, defaultValue]);

    const handleBlur = async () => {
        if (elementRef.current) {
            const newContent = elementRef.current.innerText; // Use innerText to avoid HTML injection in DB
            setContent(newContent);
            localStorage.setItem(`goshen-content-${id}`, newContent);

            // INTELLIGENT SYNC: If ID matches a pattern, update Supabase!
            try {
                if (id.startsWith('db-prod-')) {
                    const parts = id.split('-'); // db, prod, field, id
                    const field = parts[2]; // name, desc
                    const dbId = parts[3];
                    const dbField = field === 'name' ? 'name' : 'description';

                    const { error } = await supabase.from('products').update({ [dbField]: newContent }).eq('id', dbId);
                    if (error) throw error;
                    console.log(`Synced product ${dbId} ${dbField} to database.`);
                } else if (id.startsWith('db-coll-')) {
                    const parts = id.split('-'); // db, coll, field, id
                    const field = parts[2]; // title, desc
                    const dbId = parts[3];
                    const dbField = field === 'title' ? 'title' : 'description';

                    const { error } = await supabase.from('collections').update({ [dbField]: newContent }).eq('id', dbId);
                    if (error) throw error;
                    console.log(`Synced collection ${dbId} ${dbField} to database.`);
                }
            } catch (err: any) {
                console.error('Failed to sync change to database:', err);
                alert('Connection error: Changes saved locally but failed to sync with the server. Please check your connection and refresh.');
            }
        }
    };

    // Cast Tag to any to avoid "complex union type" error with dynamic tags
    const Component = Tag as any;

    return (
        <Component
            ref={elementRef}
            className={`${className} ${isAdminMode ? 'outline-dashed outline-1 outline-[var(--color-primary)] ring-offset-4 hover:bg-[var(--color-primary)]/10 cursor-text transition-all' : ''}`}
            contentEditable={isAdminMode}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
        >
            {content}
        </Component>
    );
}
