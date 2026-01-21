'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';

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
        const saved = localStorage.getItem(`goshen-content-${id}`);
        if (saved) setContent(saved);
    }, [id]);

    const handleBlur = () => {
        if (elementRef.current) {
            const newContent = elementRef.current.innerHTML;
            setContent(newContent);
            localStorage.setItem(`goshen-content-${id}`, newContent);
        }
    };

    return (
        <Tag
            ref={elementRef as any}
            className={`${className} ${isAdminMode ? 'outline-dashed outline-1 outline-[var(--color-primary)] ring-offset-2 hover:bg-[var(--color-primary)]/10 cursor-text' : ''}`}
            contentEditable={isAdminMode}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
