import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private translate = inject(TranslateService);
    private document = inject(DOCUMENT);

    currentLang = signal<'en' | 'ar'>('en');

    constructor() {
        // Initialize language
        // Check localStorage if available
        const savedLang = this.getSavedLang();
        this.setLanguage(savedLang);
    }

    setLanguage(lang: 'en' | 'ar') {
        this.currentLang.set(lang);
        this.translate.use(lang);

        // Set direction
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.document.documentElement.setAttribute('dir', dir);
        this.document.documentElement.lang = lang;

        // Save preference
        this.saveLang(lang);
    }

    toggleLanguage() {
        const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    }

    private getSavedLang(): 'en' | 'ar' {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('app-lang');
            if (saved === 'en' || saved === 'ar') {
                return saved;
            }
        }
        return 'en'; // Default
    }

    private saveLang(lang: 'en' | 'ar') {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('app-lang', lang);
        }
    }
}
