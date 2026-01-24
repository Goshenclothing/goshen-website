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
            input.onchange = (e: Event) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev: ProgressEvent<FileReader>) => {
                        const dataUrl = ev.target?.result as string;
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
                try {
                    const parts = id.split('-');
                    const dbId = parts[3];
                    const isProduct = id.startsWith('db-prod-');
                    const isCollection = id.startsWith('db-coll-');

                    if (isProduct || isCollection) {
                        setIsSyncing(true);
                        const table = isProduct ? 'products' : 'collections';
                        const { error } = await supabase
                            .from(table)
                            .update({ image_path: newPath })
                            .eq('id', dbId);

                        if (error) throw error;
                        console.log(`Synced ${table} ${dbId} image to database.`);
                    }
                } catch (err) {
                    const error = err instanceof Error ? err : new Error(String(err));
                    console.error('Failed to sync image change:', error);
                    alert('Connection error: Changes saved locally but failed to sync with the server.');
                } finally {
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
