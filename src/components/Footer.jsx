import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { useLang } from '../i18n/LangContext';

export default function Footer() {
  const { t } = useLang();
  const footerRef = useRef(null);

  // Класс in-view при появлении футера в области видимости
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add('in-view');
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <img className="footer__logo" width="60" height="60" src="/logo-two.jpg" alt="logo" />
            <p className="footer__copy">
              © 2026 Radiance. <br /> {t('ft_rights')}
            </p>
          </div>

          <ul className="footer__links">
            <li className="footer__column">
              <h1 className="footer__title">{t('ft_quick')}</h1>
              <Link className="footer__link" to="/">{t('home')}</Link>
              <Link className="footer__link" to="/about">{t('about')}</Link>
              <Link className="footer__link" to="/servis">{t('services')}</Link>
              <Link className="footer__link" to="/social" target="_blank">{t('contacts')}</Link>
              <Link className="footer__link" to="/help">{t('help')}</Link>
            </li>

            <li className="footer__column">
              <h1 className="footer__title">{t('ft_social')}</h1>
              <a className="footer__link" href="https://www.instagram.com/shoiraotokhonova/" target="_blank" rel="noreferrer">
                {t('ft_insta')}
              </a>
              <a className="footer__link" href="https://t.me/permsh" target="_blank" rel="noreferrer">
                {t('ft_tg')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <MobileNav />
    </footer>
  );
}