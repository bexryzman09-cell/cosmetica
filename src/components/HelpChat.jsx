import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { useNavigate, useLocation } from 'react-router-dom';
const FAQ_COUNT = 5;

export default function HelpChat() {
    const { t, lang } = useLang();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('faq'); // 'faq' | 'ai'
    const [openQ, setOpenQ] = useState(null);
    const [messages, setMessages] = useState([]); // только то, что написали пользователь и Элен
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const listRef = useRef(null);
    const inputRef = useRef(null);

    // Esc закрывает окно
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    // прокрутка чата вниз
    useEffect(() => {
        if (view === 'ai' && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, loading, view]);

    // фокус на поле ввода при входе в чат
    useEffect(() => {
        if (open && view === 'ai') setTimeout(() => inputRef.current?.focus(), 350);
    }, [open, view]);

    const send = async (text) => {
        const content = (text ?? input).trim();
        if (!content || loading) return;

        const next = [...messages, { role: 'user', content }];
        setMessages(next);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: next.filter((m) => !m.error).map(({ role, content }) => ({ role, content })),
                    lang,
                }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.reply) {
                console.error('Chat error:', res.status, data);
                const why = data.detail || data.error || 'no response';
                throw new Error(`${res.status}: ${why}`);
            }

            setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
        } catch (e) {
            console.error(e);
            setMessages((m) => [
                ...m,
                { role: 'assistant', content: `${t('hc_error')}\n\n[${e.message}]`, error: true },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        send();
    };

    const goBook = () => {
        setOpen(false);
        navigate('/contact');
    };

    const suggestions = ['hc_s1', 'hc_s2', 'hc_s3'];

    const panel = (
        <div className={'hc-panel' + (open ? ' is-open' : '')} role="dialog" aria-label={t('hc_title')}>
            {/* Шапка */}
            <div className="hc-head">
                {view === 'ai' && (
                    <button type="button" className="hc-icon-btn" onClick={() => setView('faq')} aria-label={t('hc_back')}>
                        ←
                    </button>
                )}
                <div className="hc-avatar">
                    ✦<span className="hc-online"></span>
                </div>
                <div className="hc-head__text">
                    <div className="hc-head__title">{view === 'ai' ? t('hc_ai_name') : t('hc_title')}</div>
                    <div className="hc-head__sub">{view === 'ai' ? t('hc_ai_role') : t('hc_sub')}</div>
                </div>
                <button type="button" className="hc-icon-btn" onClick={() => setOpen(false)} aria-label={t('hc_close')}>
                    ×
                </button>
            </div>

            {/* FAQ */}
            {view === 'faq' && (
                <div className="hc-body">
                    <button type="button" className="hc-cta" onClick={() => setView('ai')}>
                        <span className="hc-cta__icon">✦</span>
                        <span className="hc-cta__text">
                            <b>{t('hc_ask')}</b>
                            <small>{t('hc_ask_sub')}</small>
                        </span>
                        <span className="hc-cta__arrow">→</span>
                    </button>

                    <div className="hc-section-title">{t('hc_faq_title')}</div>

                    <div className="hc-faq">
                        {Array.from({ length: FAQ_COUNT }, (_, i) => (
                            <div className={'hc-q' + (openQ === i ? ' open' : '')} key={i}>
                                <button type="button" className="hc-q__btn" onClick={() => setOpenQ(openQ === i ? null : i)}>
                                    <span>{t(`faq_q${i + 1}`)}</span>
                                    <span className="hc-q__icon">+</span>
                                </button>
                                <div className="hc-q__a">
                                    <div>
                                        <p>{t(`faq_a${i + 1}`)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" className="hc-book" onClick={goBook}>
                        {t('hc_book')}
                    </button>
                </div>
            )}

            {/* AI-чат */}
            {view === 'ai' && (
                <>
                    <div className="hc-messages" ref={listRef}>
                        <div className="hc-msg hc-msg--ai">
                            <div className="hc-msg__ava">✦</div>
                            <div className="hc-bubble">{t('hc_hello')}</div>
                        </div>

                        {messages.length === 0 && (
                            <div className="hc-chips">
                                {suggestions.map((k) => (
                                    <button type="button" key={k} className="hc-chip" onClick={() => send(t(k))}>
                                        {t(k)}
                                    </button>
                                ))}
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div className={'hc-msg ' + (m.role === 'user' ? 'hc-msg--user' : 'hc-msg--ai')} key={i}>
                                {m.role !== 'user' && <div className="hc-msg__ava">✦</div>}
                                <div className={'hc-bubble' + (m.error ? ' is-error' : '')}>{m.content}</div>
                            </div>
                        ))}

                        {loading && (
                            <div className="hc-msg hc-msg--ai">
                                <div className="hc-msg__ava">✦</div>
                                <div className="hc-bubble hc-typing" aria-label={t('hc_typing')}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form className="hc-input" onSubmit={onSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            maxLength={500}
                            placeholder={t('hc_ph')}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="hc-send" disabled={loading || !input.trim()} aria-label={t('hc_send')}>
                            ↑
                        </button>
                    </form>
                    <div className="hc-note">{t('hc_note')}</div>
                </>
            )}
        </div>
    );
    if (pathname === '/help') return null;
    return createPortal(
        <>
            {panel}
            <button
                type="button"
                className={'hc-fab' + (open ? ' is-open' : '')}
                onClick={() => setOpen((o) => !o)}
                aria-label={t('hc_open')}
            >
                {open ? (
                    <span className="hc-fab__x">×</span>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z" />
                        <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="2.4" />
                    </svg>
                )}
            </button>
        </>,
        document.body
    );
}