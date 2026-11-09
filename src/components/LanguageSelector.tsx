import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';

interface LanguageSelectorProps {
    currentLang: Language;
    onLanguageChange: (lang: Language) => void;
    compact?: boolean;
}

const LANGUAGES: Array<{ code: Language; label: string; flag: string; short: string }> = [
    { code: 'pt', label: 'Português', flag: '🇧🇷', short: 'PT' },
    { code: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
    { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
];

export function LanguageSelector({ currentLang, onLanguageChange, compact = false }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code: Language) => {
        onLanguageChange(code);
        setIsOpen(false);
        try {
            localStorage.setItem('moronavila_lang', code);
            const url = new URL(window.location.href);
            url.searchParams.set('lang', code);
            window.history.replaceState({}, '', url.toString());
        } catch (e) {
            console.warn('LocalStorage lang save error:', e);
        }
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/50 text-white transition-all shadow-md backdrop-blur-md cursor-pointer ${
                    compact ? 'text-xs' : 'text-xs font-bold'
                }`}
                title="Mudar Idioma / Change Language / Cambiar Idioma"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span className="text-sm">{activeLanguage.flag}</span>
                <span className="font-black uppercase tracking-wider">{activeLanguage.short}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800/80">
                        Language / Idioma
                    </div>
                    {LANGUAGES.map((lang) => {
                        const isSelected = lang.code === currentLang;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                                    isSelected
                                        ? 'bg-rose-600/20 text-rose-300 font-black'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-base">{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </div>
                                {isSelected && <Check size={14} className="text-rose-400" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
