import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private translate = inject(TranslateService);
    private document = inject(DOCUMENT);

    currentLang = signal<'en' | 'ar' | 'fr' | 'de' | 'es'>('en');

    languages = [
        { code: 'en', name: 'English', dir: 'ltr', flag: '🇺🇸' },
        { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇪🇬' },
        { code: 'de', name: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', dir: 'ltr', flag: '🇫🇷' },
        { code: 'es', name: 'Español', dir: 'ltr', flag: '🇪🇸' }
    ];

    constructor() {
        // Initialize language
        // Check localStorage if available
        const savedLang = this.getSavedLang();
        this.setLanguage(savedLang);
    }

    setLanguage(lang: 'en' | 'ar' | 'fr' | 'de' | 'es') {
        this.currentLang.set(lang);
        this.translate.use(lang);

        // Set direction
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.document.documentElement.setAttribute('dir', dir);
        this.document.documentElement.lang = lang;

        // Save preference
        this.saveLang(lang);
    }

    private getSavedLang(): 'en' | 'ar' | 'fr' | 'de' | 'es' {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('app-lang') as any;
            if (['en', 'ar', 'fr', 'de', 'es'].includes(saved)) {
                return saved;
            }
        }
        return 'en'; // Default
    }

    private saveLang(lang: string) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('app-lang', lang);
        }
    }
}
