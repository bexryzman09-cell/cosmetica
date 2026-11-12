import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LANGS } from '../i18n/translations';
import { useLang } from '../i18n/LangContext';

export default function LangSwitcher({ variant = 'header' }) {
    const { lang, setLang, t } = useLang();
    const [open, setOpen] = useState(false);

    // закрытие по Esc
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const current = LANGS.find((l) => l.code === lang);

    const popup = (
        <div
            className="lsw-overlay"
            onClick={() => setOpen(false)}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000,
                background: 'rgba(26, 21, 32, 0.45)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
            }}
        >
            <div
                className="lsw-card"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 'min(92vw, 340px)',
                    padding: 22,
                    background: '#fff',
                    borderRadius: 24,
                    boxShadow: '0 30px 80px rgba(74, 34, 98, 0.35)',
                }}
            >
                <div className="lsw-card__head">
                    <span className="lsw-card__title">{t('language')}</span>
                    <button type="button" className="lsw-card__close" onClick={() => setOpen(false)}>
                        ×
                    </button>
                </div>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {LANGS.map((l, i) => (
                        <li key={l.code} className="lsw-card__li" style={{ '--i': i }}>
                            <button
                                type="button"
                                className={'lsw__item' + (l.code === lang ? ' active' : '')}
                                onClick={() => {
                                    setLang(l.code);
                                    setOpen(false);
                                }}
                            >
                                <span className="lsw__badge">{l.label}</span>
                                <span className="lsw__name">{l.name}</span>
                                <svg className="lsw__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <div className={`lsw lsw--${variant}`}>
            <button type="button" className="lsw__btn" onClick={() => setOpen(true)}>
                <svg className="lsw__globe" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3c2.8 2.6 4.2 5.6 4.2 9s-1.4 6.4-4.2 9c-2.8-2.6-4.2-5.6-4.2-9S9.2 5.6 12 3Z" />
                </svg>
                <span className="lsw__code">{current.label}</span>
                <svg className="lsw__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && createPortal(popup, document.body)}
        </div>
    );
}