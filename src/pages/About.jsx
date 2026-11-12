import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLang } from '../i18n/LangContext';

const STAT_NUMS = ['1.5k', '8', '10'];

export default function About() {
  const navigate = useNavigate();
  const { t } = useLang();
  const revealRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // "Фонарик": передаём координаты мыши в CSS-переменные
  const onMove = (e) => {
    const el = revealRef.current;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--y', `${e.clientY - rect.top}px`);
    setHovered(true);
  };

  return (
    <Layout styles={['main', 'about']} title="Shoira Cosmenika">
      <main>
        <section className="reveal hero" id="home">
          <div className="hero-container">
            <div className="hero-text">
              <span className="badge">{t('ab_badge')}</span>
              <h1 className="h">
                {t('ab_h1_1')} <br /> {t('ab_h1_2')}
              </h1>
              <p>{t('ab_text')}</p>
              <button className="btn-main" onClick={() => navigate('/learn')}>
                {t('learn_more')}
              </button>
              <Link to="/servis" style={{ textDecoration: 'none' }}>
                <button className="btn-outline">{t('view_services')}</button>
              </Link>
            </div>
            <div className="hero-image">
              <div className="img-frame">
                <img src="/about-img.jpg" alt="Kosmetolog Shoira" />
              </div>
            </div>
          </div>
        </section>

        <section className="reveal stats">
          {STAT_NUMS.map((num, i) => (
            <div className="stat-item" key={num}>
              <h2 className="counter">{num}</h2>
              <p>{t(`ab_stat${i + 1}`)}</p>
            </div>
          ))}
        </section>

        <section className="reveal about-details" id="about">
          <div className="details-grid">
            {[1, 2, 3].map((n) => (
              <div className={'details-card' + (n === 2 ? ' active-card' : '')} key={n}>
                <h3>{t(`ab_d${n}_title`)}</h3>
                <p>{t(`ab_d${n}_text`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="interactive-reveal"
          ref={revealRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="reveal-content">
            <h2 className="reveal-title">{t('ab_secret')}</h2>
            <p className="reveal-description" style={{ opacity: hovered ? 1 : 0 }}>
              {t('ab_secret_text')}
            </p>
          </div>
          <div className="reveal-overlay" data-text={t('ab_reveal')}></div>
        </section>
      </main>
    </Layout>
  );
}