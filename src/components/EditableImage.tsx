'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Camera, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface EditableImageProps {
    id: string;
    defaultSrc: string;
    alt: string;
    className?: string;
}

export default function EditableImage({ id, defaultSrc, alt, className = '' }: EditableImageProps) {
    const { isAdminMode } = useAdmin();
    const [src, setSrc] = useState(defaultSrc);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(`goshen-image-${id}`);
        if (saved) {
            setSrc(saved);
        } else {
            setSrc(defaultSrc);
        }
    }, [id, defaultSrc]);

    const handleImageClick = async () => {
        if (!isAdminMode) return;

        // Choice: Upload or Link
        const choice = confirm("Do you want to upload a new image? (OK to upload, Cancel to enter a file name/URL)");

        if (choice) {
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
                        alert("Image updated locally. For permanent storage, please use the Admin Dashboard File Manager.");
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        } else {
            const newPath = prompt("Enter the image file name (e.g. products/kimono1.jpg) or a URL:", src);
            if (newPath) {
                setSrc(newPath);
                localStorage.setItem(`goshen-image-${id}`, newPath);

                // SYNC TO DATABASE
                if (id.startsWith('db-prod-')) {
                    setIsSyncing(true);
                    const dbId = id.split('-')[3];
                    await supabase.from('products').update({ image_path: newPath }).eq('id', dbId);
                    setIsSyncing(false);
                } else if (id.startsWith('db-coll-')) {
                    setIsSyncing(true);
                    const dbId = id.split('-')[3];
                    await supabase.from('collections').update({ image_path: newPath }).eq('id', dbId);
                    setIsSyncing(false);
                }
            }
        }
    };

    return (
        <div className={`relative group ${isAdminMode ? 'cursor-pointer' : ''}`} onClick={handleImageClick}>
            <img
                src={src.startsWith('data:') || src.startsWith('http') ? src : `/images/goshen/${src}`}
                alt={alt}
                className={className}
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x1200')}
            />
            {isAdminMode && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm shadow-xl transform group-hover:scale-105 transition-transform">
                        {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Camera size={16} />}
                        Change Image
                    </div>
                </div>
            )}
        </div>
    );
}
