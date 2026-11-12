import { Link, useNavigate } from 'react-router-dom';
import LangSwitcher from './LangSwitcher';
import { useLang } from '../i18n/LangContext';

export default function Header() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__wrapper">
          <Link className="header__logo" to="/" aria-label={t('home')} />
          <div className="header__right">
            <nav className="header__nav">
              <Link className="header__link" to="/">{t('home')}</Link>
              <Link className="header__link" to="/about">{t('about')}</Link>
              <Link className="header__link" to="/servis">{t('services')}</Link>
              <Link className="header__link" to="/social" target="_blank">{t('contacts')}</Link>
            </nav>
            <LangSwitcher />
            <button className="btn header__btn" onClick={() => navigate('/contact')}>
              {t('book')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}