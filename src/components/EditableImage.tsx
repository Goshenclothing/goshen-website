'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Camera } from 'lucide-react';

interface EditableImageProps {
    id: string;
    defaultSrc: string;
    alt: string;
    className?: string;
}

export default function EditableImage({ id, defaultSrc, alt, className = '' }: EditableImageProps) {
    const { isAdminMode } = useAdmin();
    const [src, setSrc] = useState(defaultSrc);

    useEffect(() => {
        const saved = localStorage.getItem(`goshen-image-${id}`);
        if (saved) setSrc(saved);
    }, [id]);

    const handleImageClick = () => {
        if (!isAdminMode) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev: any) => {
                    const dataUrl = ev.target.result;
                    setSrc(dataUrl);
                    localStorage.setItem(`goshen-image-${id}`, dataUrl);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    return (
        <div className={`relative group ${isAdminMode ? 'cursor-pointer' : ''}`} onClick={handleImageClick}>
            <img src={src} alt={alt} className={className} />
            {isAdminMode && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-3 py-2 rounded-full flex items-center gap-2 font-bold text-sm">
                        <Camera size={16} />
                        Change Image
                    </div>
                </div>
            )}
        </div>
    );
}
