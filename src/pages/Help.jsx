import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLang } from '../i18n/LangContext';

const FAQ_COUNT = 5;
const SUGGESTIONS = ['hc_s1', 'hc_s2', 'hc_s3'];

export default function Help() {
    const { t, lang } = useLang();

    const [openQ, setOpenQ] = useState(0);
    const [messages, setMessages] = useState([]); // только реплики пользователя и Элен
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const listRef = useRef(null);

    // прокручиваем только сам чат, а не всю страницу
    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages, loading]);

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

    return (
        <Layout styles={['main']} title={t('hp_page_title')}>
            <main className="help-page">
                <section className="help-hero">
                    <span className="section-tag">{t('hp_tag')}</span>
                    <h1 className="section-title">{t('hp_h1')}</h1>
                    <p>{t('hp_sub')}</p>
                </section>

                <div className="container">
                    <div className="help-grid">
                        {/* FAQ */}
                        <div className="help-faq">
                            <div className="hc-section-title" style={{ marginTop: 0 }}>{t('hc_faq_title')}</div>

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

                            <div className="help-contact">
                                <h3>{t('hp_still')}</h3>
                                <p>{t('hp_still_sub')}</p>
                                <div className="help-contact__row">
                                    <a className="help-btn help-btn--primary" href="tel:+79319778700">{t('hp_call')}</a>
                                    <a className="help-btn help-btn--outline" href="https://t.me/KosmetologShoiraN1" target="_blank" rel="noreferrer">
                                        Telegram
                                    </a>
                                    <Link className="help-btn help-btn--dark" to="/contact">{t('book')}</Link>
                                </div>
                            </div>
                        </div>

                        {/* ЧАТ С ЭЛЕН */}
                        <div className="help-chat">
                            <div className="hc-head">
                                <div className="hc-avatar">
                                    ✦<span className="hc-online"></span>
                                </div>
                                <div className="hc-head__text">
                                    <div className="hc-head__title">{t('hc_ai_name')}</div>
                                    <div className="hc-head__sub">{t('hc_ai_role')}</div>
                                </div>
                            </div>

                            <div className="hc-messages" ref={listRef}>
                                <div className="hc-msg hc-msg--ai">
                                    <div className="hc-msg__ava">✦</div>
                                    <div className="hc-bubble">{t('hc_hello')}</div>
                                </div>

                                {messages.length === 0 && (
                                    <div className="hc-chips">
                                        {SUGGESTIONS.map((k) => (
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
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}