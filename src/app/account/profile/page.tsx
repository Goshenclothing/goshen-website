'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { createBrowserClient } from '@supabase/ssr';
import {
    User,
    Mail,
    Phone,
    Camera,
    Save,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, refreshSession, loading: authLoading } = useUserAuth();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user?.id) {
            setError('No user found');
            return;
        }
        
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Failed to fetch profile:', error);
            return;
        }

        if (data) {
            setProfileData(data);
            setFullName(data.full_name || '');
            setPhone(data.phone || '');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            setError('User session lost. Please refresh and try again.');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    phone: phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Also update Auth metadata for consistency
            await supabase.auth.updateUser({
                data: { full_name: fullName, phone: phone }
            });

            setMessage('Profile updated successfully!');
            await refreshSession();
        } catch (err: any) {
            setError(err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user!.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload image to storage
            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user!.id);

            if (updateError) throw updateError;

            // Update Auth metadata
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            setProfileData({ ...profileData, avatar_url: publicUrl });
            setMessage('Avatar updated successfully!');
            await refreshSession();
        } catch (err: any) {
            setError(err.message || 'Failed to upload avatar.');
        } finally {
            setUploading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <Link href="/account" className="inline-flex items-center gap-2 text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
                    Back to Dashboard
                </Link>

                <h1 className="text-4xl font-bold font-playfair mb-10">Personal Profile</h1>

                <div className="bg-[var(--gradient-card)] p-10 rounded-[40px] border border-[var(--color-border)] shadow-2xl">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] overflow-hidden">
                                {profileData?.avatar_url ? (
                                    <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-subtle)] bg-[var(--gradient-gold)]/10">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-3 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-full cursor-pointer shadow-lg hover:scale-110 transition-all border-4 border-[var(--color-bg-dark)]">
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                            </label>
                        </div>
                        <p className="mt-4 text-sm text-[var(--color-text-subtle)]">Tap the camera icon to update your photo</p>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-8 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl flex items-center gap-3 text-sm animate-fade-in">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                <input
                                    type="text"
                                    className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 opacity-60 cursor-not-allowed">
                            <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Email Address (Primary)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                <input
                                    type="email"
                                    readOnly
                                    className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-2xl py-4 pl-12 pr-4 focus:outline-none"
                                    value={user?.email || ''}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-subtle)] ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-subtle)]" />
                                <input
                                    type="tel"
                                    className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+233..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full bg-[var(--gradient-gold)] text-[var(--color-bg-dark)] font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl disabled:opacity-50 mt-12"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
