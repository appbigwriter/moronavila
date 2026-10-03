/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string, fallback: string = ''): string => {
    if (typeof window !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__[key]) {
        return (window as any).__ENV__[key];
    }
    const viteVal = (import.meta.env as any)?.[key];
    if (typeof viteVal === 'string' && viteVal.trim().length > 0) {
        return viteVal.trim();
    }
    return fallback;
};

export const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://supabase-control-tower-api.fbr.news');
export const supabaseAnonKey = getEnvVar(
    'VITE_SUPABASE_ANON_KEY',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5OTkwODc2LCJleHAiOjE5NDc2NzA4NzZ9.f2enmw8Mk0hWI6WcNfkZLGOl-qaqVzQBGt8qftDaR6k'
);
export const supabaseSchema = getEnvVar('VITE_SUPABASE_SCHEMA', 'custom_moronavila');

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ [Supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram definidos.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: supabaseSchema
    }
});

