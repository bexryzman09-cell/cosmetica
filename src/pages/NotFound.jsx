import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLang } from '../i18n/LangContext';

const REDIRECT_SECONDS = 12;

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const [cancelled, setCancelled] = useState(false);

  // декоративные частицы
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }, () => {
        const size = 6 + Math.random() * 12;
        return {
          width: size,
          height: size,
          left: `${Math.random() * 100}%`,
          bottom: '-5%',
          animationDuration: `${8 + Math.random() * 10}s`,
          animationDelay: `-${Math.random() * 12}s`,
        };
      }),
    []
  );

  // обратный отсчёт до редиректа на главную
  useEffect(() => {
    if (cancelled) return;
    if (seconds <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, cancelled, navigate]);

  return (
    <Layout styles={['main', 'error']} title={t('nf_page_title')}>
      <main className="notfound-page">
        <div className="notfound-petals" id="notfoundBg">
          {petals.map((style, i) => (
            <div className="notfound-petal" style={style} key={i}></div>
          ))}
        </div>

        <div className="notfound-wrapper">
          <h1 className="notfound-code">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h1>

          <div className="notfound-divider"></div>

          <h2 className="notfound-title">{t('nf_title')}</h2>
          <p className="notfound-text">
            {t('nf_text1')}
            <br />
            {t('nf_text2')}
          </p>

          <div className="notfound-actions">
            <Link to="/" className="notfound-btn notfound-btn--primary">{t('nf_home')}</Link>
            <Link to="/contact" className="notfound-btn notfound-btn--outline">{t('book')}</Link>
          </div>

          {!cancelled && (
            <div className="notfound-redirect" id="notfound-redirect">
              {t('nf_redirect')} <b>{seconds}</b> {t('nf_sec')}{' '}
              <a
                href="#"
                style={{ color: 'inherit', textDecoration: 'underline' }}
                onClick={(e) => {
                  e.preventDefault();
                  setCancelled(true);
                }}
              >
                {t('nf_cancel')}
              </a>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}