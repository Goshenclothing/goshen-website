/**
 * Environment variable validation utility.
 * Ensures all required env vars are configured for the app to function properly.
 */

export interface EnvironmentConfig {
    // Supabase
    supabaseUrl: string;
    supabaseKey: string;
    
    // Gemini AI
    geminiKey: string;
    
    // App
    isProduction: boolean;
    isDevelopment: boolean;
}

/**
 * Validates and retrieves all required environment variables.
 * Logs warnings for missing optional configs.
 */
export function validateEnvironment(): Partial<EnvironmentConfig> {
    const config: Partial<EnvironmentConfig> = {
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development',
    };

    // Supabase (required for database features)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL not configured. Database features will be disabled.');
    } else {
        config.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured. Database features will be disabled.');
    } else {
        config.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }

    // Gemini (required for AI chat)
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️ GEMINI_API_KEY not configured. AI Chat will be unavailable.');
    } else {
        config.geminiKey = process.env.GEMINI_API_KEY;
    }

    return config;
}

/**
 * Checks if critical services are available
 */
export function servicesAvailable(): { supabase: boolean; gemini: boolean } {
    return {
        supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        gemini: !!process.env.GEMINI_API_KEY,
    };
}

// Validate on startup (server-side only)
if (typeof window === 'undefined') {
    validateEnvironment();
}
