'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';

interface EditableTextProps {
    id: string;
    defaultValue: string;
    tagName?: keyof JSX.IntrinsicElements;
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
            if (id.startsWith('db-prod-')) {
                const parts = id.split('-'); // db, prod, field, id
                const field = parts[2]; // name, desc
                const dbId = parts[3];
                const dbField = field === 'name' ? 'name' : 'description';

                await supabase.from('products').update({ [dbField]: newContent }).eq('id', dbId);
                console.log(`Synced product ${dbId} ${dbField} to database.`);
            } else if (id.startsWith('db-coll-')) {
                const parts = id.split('-'); // db, coll, field, id
                const field = parts[2]; // title, desc
                const dbId = parts[3];
                const dbField = field === 'title' ? 'title' : 'description';

                await supabase.from('collections').update({ [dbField]: newContent }).eq('id', dbId);
                console.log(`Synced collection ${dbId} ${dbField} to database.`);
            }
        }
    };

    return (
        <Tag
            ref={elementRef as any}
            className={`${className} ${isAdminMode ? 'outline-dashed outline-1 outline-[var(--color-primary)] ring-offset-4 hover:bg-[var(--color-primary)]/10 cursor-text transition-all' : ''}`}
            contentEditable={isAdminMode}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
        >
            {content}
        </Tag>
    );
}
