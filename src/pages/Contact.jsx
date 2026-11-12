import { useCallback, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { SERVICE_OPTIONS } from '../data/services';
import { escapeHtml, sendToBots } from '../config/telegram';
import { fireInject } from '../utils/fireInject';
import { useLang } from '../i18n/LangContext';

const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 часа
const REVIEW_MAX_LEN = 300;
const MAX_SERVICES = 5;

const ls = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

const getCooldownRemaining = () => {
  const last = parseInt(ls.get('lastBookingTime') || '0', 10);
  if (!last) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - last));
};

const formatCountdown = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${Number(m)}:${s}`;
};

// Маска +7 (XXX) XXX-XX-XX
const maskPhone = (raw) => {
  let val = raw.replace(/\D/g, '');
  if (val.startsWith('7') || val.startsWith('8')) val = val.substring(1);
  let res = val.length > 0 ? '+7 (' + val.substring(0, 3) : '';
  if (val.length > 3) res += ') ' + val.substring(3, 6);
  if (val.length > 6) res += '-' + val.substring(6, 8);
  if (val.length > 8) res += '-' + val.substring(8, 10);
  return res;
};

export default function Contact() {
  const { t } = useLang();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [services, setServices] = useState(['']);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(getCooldownRemaining);
  const [errorStatus, setErrorStatus] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '', icon: '' });

  // отзыв
  const [reviewVisible, setReviewVisible] = useState(() => getCooldownRemaining() > 0);
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSent, setReviewSent] = useState(() => ls.get('reviewSent') === 'true');
  const [sentRating, setSentRating] = useState(() => +ls.get('reviewRating') || 0);

  const countryRef = useRef('Не удалось определить');
  const countryPromiseRef = useRef(null);
  const submitRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, icon) => {
    setToast({ show: true, msg, icon });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 5000);
  }, []);

  // Страна по IP (ожидание не дольше 2 секунд)
  useEffect(() => {
    const timeout = new Promise((r) => setTimeout(r, 2000));
    const fetchCountry = fetch('https://ipapi.co/json/')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (d?.country_name) countryRef.current = d.country_name; })
      .catch(() => { countryRef.current = 'Не удалось определить'; });
    countryPromiseRef.current = Promise.race([fetchCountry, timeout]);
    return () => clearTimeout(toastTimer.current);
  }, []);

  // Обратный отсчёт кулдауна
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      const left = getCooldownRemaining();
      setCooldown(left);
      if (left <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const locked = cooldown > 0;
  const allChosen = services.every((s) => s !== '');
  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length === 11 && allChosen;
  const active = valid || locked;

  const setService = (i, v) => setServices((arr) => arr.map((s, idx) => (idx === i ? v : s)));
  const addService = () => setServices((arr) => [...arr, '']);
  const removeService = (i) => setServices((arr) => arr.filter((_, idx) => idx !== i));

  const resetReview = () => {
    setRating(0);
    setReviewText('');
    setReviewSent(false);
    setSentRating(0);
    setReviewVisible(false);
    ls.del('reviewSent');
    ls.del('reviewRating');
  };

  // Сообщения в Telegram остаются на русском (их читает мастер)
  const onSubmit = async (e) => {
    e.preventDefault();
    if (honeypot.trim() !== '') return; // бот
    if (getCooldownRemaining() > 0 || !valid || sending) return;

    setSending(true);
    setErrorStatus('');
    try { await countryPromiseRef.current; } catch { /* ignore */ }

    const newCount = parseInt(ls.get('bookingCount') || '0', 10) + 1;
    let text =
      `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
      `<b>👤 Клиент:</b> ${escapeHtml(name)}\n` +
      `<b>📞 Тел:</b> <code>${escapeHtml(phone)}</code>\n` +
      `<b>🌍 Страна:</b> ${escapeHtml(countryRef.current)}\n` +
      `<b>💅 Услуга:</b> ${escapeHtml(services.filter(Boolean).join(', '))}\n` +
      `<b>💬 Коммент:</b> ${escapeHtml(message.trim() || 'Нет')}\n\n` +
      `<i>⏰ Дата и время — уточнить по звонку</i>`;
    if (newCount === 1 || newCount % 5 === 0) {
      text += `\n\n🎉 <b>Это ${newCount}-я запись с этого устройства!</b>`;
    }

    try {
      const ok = await sendToBots(text);
      if (ok) {
        ls.set('lastBookingTime', Date.now().toString());
        ls.set('bookingCount', String(newCount));
        ls.set('clientName', name);
        ls.set('clientPhone', phone);
        setName(''); setPhone(''); setServices(['']); setMessage('');
        setCooldown(COOLDOWN_MS);
        setReviewVisible(true);
        // текст уведомления берём из словаря, чтобы он был на выбранном языке
        fireInject(submitRef.current, (_msg, icon) => showToast(t('ct_toast_after'), icon));
      } else {
        showToast(t('ct_toast_fail'), '❌');
      }
    } catch {
      setErrorStatus(t('ct_err_conn'));
    } finally {
      setSending(false);
    }
  };

  const onCancel = () => {
    if (!window.confirm(t('ct_confirm'))) return;
    const text =
      `<b>❌ Отмена записи: Shoira Studio</b>\n\n` +
      `<b>👤 Клиент:</b> ${escapeHtml(ls.get('clientName') || 'Не указан')}\n` +
      `<b>📞 Тел:</b> <code>${escapeHtml(ls.get('clientPhone') || 'Не указан')}</code>\n\n` +
      `<i>Клиент отменил запись через сайт</i>`;
    sendToBots(text).catch(() => { });

    ls.del('lastBookingTime');
    ls.del('clientName');
    ls.del('clientPhone');
    setCooldown(0);
    setErrorStatus('');
    setName(''); setPhone(''); setServices(['']); setMessage('');
    resetReview();
    showToast(t('ct_cancelled'), '❌');
  };

  const onReviewSubmit = async () => {
    if (rating === 0) {
      showToast(t('ct_rate_first'), '⚠️');
      return;
    }
    if (reviewSending) return;
    setReviewSending(true);

    const starsStr = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    const text =
      `<b>💬 Новый отзыв: Shoira Studio</b>\n\n` +
      `<b>👤 Клиент:</b> ${escapeHtml(ls.get('clientName') || 'Не указан')}\n` +
      `<b>📞 Тел:</b> <code>${escapeHtml(ls.get('clientPhone') || 'Не указан')}</code>\n` +
      `<b>🌍 Страна:</b> ${escapeHtml(countryRef.current)}\n` +
      `<b>⭐ Оценка:</b> ${starsStr} (${rating}/5)\n` +
      `<b>📝 Текст:</b> ${escapeHtml(reviewText.trim().slice(0, REVIEW_MAX_LEN) || 'Без комментария')}`;

    try {
      const ok = await sendToBots(text);
      if (ok) {
        ls.set('reviewSent', 'true');
        ls.set('reviewRating', String(rating));
        setSentRating(rating);
        setReviewSent(true);
        showToast(t('ct_thanks'), '⭐');
      } else {
        showToast(t('ct_rev_fail'), '❌');
      }
    } catch {
      showToast(t('ct_conn'), '❌');
    } finally {
      setReviewSending(false);
    }
  };

  const shownStars = reviewSent ? sentRating : rating;

  return (
    <Layout styles={['main', 'contact']} title={t('ct_page_title')}>
      <main className="contact-page">
        <section className="reveal contact-hero">
          <h1>{t('ct_h1')}</h1>
          <p>{t('ct_sub')}</p>
        </section>

        <div className="container">
          <div className="contact-wrapper">
            {/* ИНФО */}
            <div className="contact-info">
              <div className="info-item">
                <h3>{t('ct_address')}</h3>
                <a
                  href="https://www.google.com/maps/place/%D0%90%D1%82%D0%BB%D0%B0%D0%BD%D1%82+(6,+8,+12+%D0%BA%D0%BE%D1%80%D0%BF%D1%83%D1%81)/@59.9251849,30.3605283,20.99z/data=!4m6!3m5!1s0x469631b08e482ff5:0xcca78b30d21605d2!8m2!3d59.925135!4d30.360806!16s%2Fg%2F1td0f4vw?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="address-link"
                >
                  <span className="address-icon">📍</span>
                  <p>{t('ct_address_val')}</p>
                </a>
              </div>

              <div className="info-item">
                <h3>{t('ct_phone')}</h3>
                <a href="tel:+79319778700" className="phone-link">+7 931 977 87 00</a>
              </div>

              <div className="info-item">
                <h3>{t('ct_hours')}</h3>
                <p>{t('ct_hours_val')}</p>
                <p className="work-status">{t('ct_hours_days')}</p>
                <small className="holiday-note">{t('ct_holiday')}</small>
              </div>

              <div className="info-item">
                <h3>{t('socials')}</h3>
                <div className="social-icons">
                  <a className="links links-instagram" href="https://www.instagram.com/shoiraotokhonova/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
                      <title>Instagram SVG Icon</title>
                      <path fill="currentColor" d="M12.7 10c0-1.5-1.2-2.7-2.7-2.7S7.3 8.5 7.3 10s1.2 2.7 2.7 2.7c1.5 0 2.7-1.2 2.7-2.7m1.4 0c0 2.3-1.8 4.1-4.1 4.1S5.9 12.3 5.9 10S7.7 5.9 10 5.9s4.1 1.8 4.1 4.1m1.1-4.3c0 .6-.4 1-1 1s-1-.4-1-1s.4-1 1-1s1 .5 1 1M10 3.4c-1.2 0-3.7-.1-4.7.3c-.7.3-1.3.9-1.5 1.6c-.4 1-.3 3.5-.3 4.7s-.1 3.7.3 4.7c.2.7.8 1.3 1.5 1.5c1 .4 3.6.3 4.7.3s3.7.1 4.7-.3c.7-.3 1.2-.8 1.5-1.5c.4-1.1.3-3.6.3-4.7s.1-3.7-.3-4.7c-.2-.7-.8-1.3-1.5-1.5c-1-.5-3.5-.4-4.7-.4m8 6.6v3.3c0 1.2-.4 2.4-1.3 3.4c-.9.9-2.1 1.3-3.4 1.3H6.7c-1.2 0-2.4-.4-3.4-1.3c-.8-.9-1.3-2.1-1.3-3.4V6.7c0-1.3.5-2.5 1.3-3.4C4.3 2.5 5.5 2 6.7 2h6.6c1.2 0 2.4.4 3.4 1.3c.8.9 1.3 2.1 1.3 3.4z" />
                    </svg>
                  </a>{' '}
                  <a className="links links-telegram" href="https://t.me/KosmetologShoiraN1" target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1792 1792">
                      <title>Telegram SVG Icon</title>
                      <path fill="currentColor" d="m1189 1307l147-693q9-44-10.5-63t-51.5-7L410 877q-29 11-39.5 25t-2.5 26.5t32 19.5l221 69l513-323q21-14 32-6q7 5-4 15l-415 375l-16 228q23 0 45-22l108-104l224 165q64 36 81-38m603-411q0 182-71 348t-191 286t-286 191t-348 71t-348-71t-286-191t-191-286T0 896t71-348t191-286T548 71T896 0t348 71t286 191t191 286t71 348" />
                    </svg>
                  </a>
                  <a className="links links-whatsapp" href="https://wa.clck.bar/79319778700" target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                      <title>WhatsApp SVG Icon</title>
                      <path fill="currentColor" d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2l-3.1.8l.8-3l-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.3-.6-1.5-.7c-.2-.1-.4-.1-.5.1c-.2.2-.5.7-.6.8c-.1.2-.3.2-.5.1c-.2-.1-.9-.3-1.8-1.1c-.7-.6-1.1-1.3-1.2-1.5c-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.2-.3c.1-.1 0-.3 0-.4c-.1-.1-.5-1.2-.7-1.6c-.2-.4-.4-.4-.5-.4h-.4c-.1 0-.4.1-.6.3c-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.5c.5.2.9.3 1.2.4c.5.2 1 .2 1.3.1c.4-.1 1.3-.5 1.5-1c.2-.5.2-.9.1-1c-.1-.1-.3-.2-.5-.3Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* ФОРМА */}
            <form className="reveal contact-form" onSubmit={onSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder={t('ct_name_ph')}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('ct_phone_ph')}
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                />
              </div>

              {/* honeypot для ботов */}
              <input
                type="text"
                name="website"
                style={{ position: 'absolute', left: -9999 }}
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />

              <div id="services-container">
                {services.map((value, i) => (
                  <div className="input-group service-row" key={i}>
                    <select
                      className="service-select"
                      required
                      value={value}
                      onChange={(e) => setService(i, e.target.value)}
                    >
                      <option value="" disabled>{t('ct_choose')}</option>
                      <optgroup label={t('ct_group')}>
                        {/* value остаётся русским (уходит в Telegram), на экране — перевод */}
                        {SERVICE_OPTIONS.map((opt, idx) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={services.some((s, k) => k !== i && s === opt)}
                          >
                            {t(`svc${idx}_title`)}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {i > 0 && (
                      <button type="button" className="remove-service" title={t('ct_remove')} onClick={() => removeService(i)}>
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {allChosen && services.length < MAX_SERVICES && (
                <button type="button" className="btn-add-service" style={{ display: 'block' }} onClick={addService}>
                  {t('ct_add')}
                </button>
              )}

              <div className="input-group">
                <textarea
                  name="message"
                  placeholder={t('ct_msg_ph')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                ref={submitRef}
                className={'btn-inject' + (active ? ' active' : '')}
                disabled={locked || sending}
                style={locked ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
              >
                <div className="fill"></div>
                <span className="label">
                  {sending ? (
                    t('ct_sending')
                  ) : (
                    <>
                      <svg className="needle-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="18" y1="2" x2="22" y2="6" />
                        <path d="M4 20L2 22M14 4l-10 10 4 4 10-10-4-4z" />
                        <path d="M16 8l-8 8" />
                      </svg>
                      {t('ct_submit')}
                    </>
                  )}
                </span>
              </button>

              <button type="button" className={'btn-cancel' + (locked ? ' visible' : '')} onClick={onCancel}>
                {t('ct_cancel')}
              </button>

              <div id="status-msg" style={{ color: locked ? 'green' : undefined }}>
                {locked ? (
                  <>{t('ct_booked')} <b>{formatCountdown(cooldown)}</b></>
                ) : (
                  errorStatus
                )}
              </div>

              {/* ОТЗЫВ */}
              <div className={'review-block' + (reviewVisible ? ' visible' : '')}>
                <h4 className="review-title">{t('ct_rev_title')}</h4>
                <p className="review-sub">{t('ct_rev_sub')}</p>

                <div className="review-stars" onMouseLeave={() => setHoverStar(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={
                        (n <= shownStars ? 'active ' : '') + (!reviewSent && n <= hoverStar ? 'hover' : '')
                      }
                      style={reviewSent ? { pointerEvents: 'none' } : undefined}
                      onMouseEnter={() => setHoverStar(n)}
                      onClick={() => setRating(n)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {!reviewSent && (
                  <>
                    <textarea
                      placeholder={t('ct_rev_ph')}
                      maxLength={REVIEW_MAX_LEN}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                    <div style={{ textAlign: 'right', fontSize: 12, color: '#999', margin: '-12px 0 12px' }}>
                      {reviewText.length}/{REVIEW_MAX_LEN}
                    </div>
                    <button type="button" className="btn-review" disabled={reviewSending} onClick={onReviewSubmit}>
                      {reviewSending ? t('ct_sending') : t('ct_rev_send')}
                    </button>
                  </>
                )}

                {reviewSent && (
                  <div className="review-thanks" style={{ display: 'block' }}>{t('ct_thanks')}</div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      <div className={'toast' + (toast.show ? ' show' : '')}>
        <span style={{ fontSize: 18 }}>{toast.icon}</span>
        {toast.msg}
      </div>
    </Layout>
  );
}