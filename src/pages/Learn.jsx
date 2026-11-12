import Layout from '../components/Layout';
import TechCarousel from '../components/TechCarousel';
import { TECHS } from '../data/services';
import { useLang } from '../i18n/LangContext';

export default function Learn() {
  const { t } = useLang();

  // переводим карточки технологий (названия брендов остаются)
  const techs = TECHS.map((item, i) => ({
    ...item,
    cat: t(`tech${i}_cat`),
    text: t(`tech${i}_text`),
  }));

  return (
    <Layout styles={['main', 'learn']} bodyClass="learn-page" title={t('ln_page_title')}>
      <main>
        <section className="reveal deep-hero">
          <div className="container">
            <h1 className="h-xl">
              {t('ln_h1_1')} <span>{t('ln_h1_2')}</span>
            </h1>
            <p className="hero-desc">{t('ln_hero')}</p>
          </div>
        </section>

        <section className="reveal expert-blocks">
          <div className="container">
            <div className="info-row">
              <div className="info-text">
                <span className="step-num">01</span>
                <h2>{t('ln_b1_title')}</h2>
                <p>{t('ln_b1_text')}</p>
                <ul className="mini-list">
                  <li>{t('ln_b1_l1')}</li>
                  <li>{t('ln_b1_l2')}</li>
                  <li>{t('ln_b1_l3')}</li>
                </ul>
              </div>
              <div className="info-img">
                <img
                  src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800&auto=format&fit=crop"
                  alt="Skin Structure"
                />
              </div>
            </div>

            <div className="info-row reverse">
              <div className="info-text">
                <span className="step-num">02</span>
                <h2>{t('ln_b2_title')}</h2>
                <p>{t('ln_b2_text')}</p>
                <ul className="mini-list">
                  <li>{t('ln_b2_l1')}</li>
                  <li>{t('ln_b2_l2')}</li>
                  <li>{t('ln_b2_l3')}</li>
                </ul>
              </div>
              <div className="info-img">
                <img
                  src="https://img.freepik.com/premium-photo/woman-receives-rf-lifting-facial-massage-therapy-by-cosmetologist-using-professional-equipment_191803-26548.jpg?w=1060"
                  alt="Technology"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="tech-reveal-section reveal">
          <div className="container">
            <div className="section-title-box">
              <span className="eyebrow">Innovation &amp; Excellence</span>
              <h2 className="h-display">
                {t('ln_tech_1')} <span className="thin">{t('ln_tech_2')}</span>
              </h2>
              <div className="accent-separator"></div>
            </div>

            <TechCarousel items={techs} />
          </div>
        </section>

        <section className="reveal table-section">
          <div className="container">
            <h2 className="h">{t('ln_table_title')}</h2>
            <div className="table-wrapper">
              <table className="price-table">
                <thead>
                  <tr>
                    <th>{t('ln_th1')}</th>
                    <th>{t('ln_th2')}</th>
                    <th>{t('ln_th3')}</th>
                    <th>{t('ln_th4')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map((r) => (
                    <tr key={r}>
                      {[0, 1, 2, 3].map((c) => (
                        <td key={c}>{t(`ln_m${r}_${c}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="reveal home-care">
          <div className="container">
            <div className="care-card">
              <h2>{t('ln_care_title')}</h2>
              <p>{t('ln_care_text')}</p>
              <div className="care-grid">
                {[1, 2, 3].map((n) => (
                  <div className="care-item" key={n}>
                    <strong>{t(`ln_care${n}_b`)}</strong> {t(`ln_care${n}_t`)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}