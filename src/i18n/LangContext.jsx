import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';
import { extra } from './extra';
import { extra2 } from './extra2';

const LangContext = createContext(null);

// один общий словарь на каждый язык
const dict = {};
['ru', 'uz', 'en'].forEach((code) => {
    dict[code] = { ...translations[code], ...extra[code], ...extra2[code] };
});

const getSaved = () => {
    try {
        return localStorage.getItem('lang') || 'ru';
    } catch {
        return 'ru';
    }
};

export function LangProvider({ children }) {
    const [lang, setLang] = useState(getSaved);

    useEffect(() => {
        try {
            localStorage.setItem('lang', lang);
        } catch {
            /* ignore */
        }
        document.documentElement.lang = lang;
    }, [lang]);

    // если перевода нет, берём русский, потом сам ключ
    const t = (key) => dict[lang]?.[key] ?? dict.ru[key] ?? key;

    return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);