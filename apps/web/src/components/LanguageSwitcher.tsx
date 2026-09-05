'use client';

import React, { useState, useEffect } from 'react';
import { SupportedLocale } from '@school-cms/shared';

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>('vi');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('school_cms_locale') as SupportedLocale;
      if (saved === 'en' || saved === 'vi') {
        setCurrentLocale(saved);
      }
    }
  }, []);

  const handleSelectLocale = (locale: SupportedLocale) => {
    setCurrentLocale(locale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('school_cms_locale', locale);
      window.dispatchEvent(new CustomEvent('locale_changed', { detail: locale }));
    }
  };

  return (
    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs font-bold shadow-sm bg-slate-50">
      <button
        type="button"
        onClick={() => handleSelectLocale('vi')}
        className={`px-2.5 py-1.5 transition-all flex items-center gap-1 ${
          currentLocale === 'vi'
            ? 'bg-emerald-700 text-white shadow-inner font-black'
            : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
        }`}
        title="Tiếng Việt"
      >
        <span>🇻🇳</span>
        <span>VI</span>
      </button>
      <button
        type="button"
        onClick={() => handleSelectLocale('en')}
        className={`px-2.5 py-1.5 transition-all flex items-center gap-1 ${
          currentLocale === 'en'
            ? 'bg-emerald-700 text-white shadow-inner font-black'
            : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
        }`}
        title="English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
