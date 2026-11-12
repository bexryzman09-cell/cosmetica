import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import Reviews from '../components/Reviews';
import Faq from '../components/Faq';
import BeforeAfterModal from '../components/BeforeAfterModal';
import { useLang } from '../i18n/LangContext';

const INSTAGRAM_POSTS = [
  ['one', 'https://www.instagram.com/p/DN_N5DtiV7G/'],
  ['two', 'https://www.instagram.com/p/DV-reWYDLj3/'],
  ['three', 'https://www.instagram.com/p/DQh6bI8jCPR/'],
  ['four', 'https://www.instagram.com/p/DMUz-ZDums_/'],
  ['five', 'https://www.instagram.com/p/DKmCKm2syTW/'],
  ['six', 'https://www.instagram.com/p/DMw8AeJuthM/'],
];

const STEP_NUMS = ['01', '02', '03', '04'];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLang();
  const servicesRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Модалка "До/После" открывается один раз, когда секция услуг уходит выше экрана
  useEffect(() => {
    const onScroll = () => {
      if (localStorage.getItem('ba_popup_permanent')) return;
      const rect = servicesRef.current?.getBoundingClientRect();
      if (rect && rect.top < 0) {
        setModalOpen(true);
        localStorage.setItem('ba_popup_permanent', 'true');
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Layout styles={['main']} title="Shoira Cosmenika">
      <Loader />

      <main className="main">
        {/* HERO */}
        <section className="reveal hero__index">
          <div className="hero__container">
            <div className="hero__content">
              <h1 className="hero__subtitle m-subtitle">{t('hero_sub')}</h1>
              <h2 className="hero__title m-title">{t('hero_title')}</h2>
              <p className="hero__text m-text">{t('hero_text')}</p>
              <button className="btn hero__btn" onClick={() => navigate('/about')}>
                {t('learn_more')}
              </button>
            </div>
          </div>
        </section>

        {/* СИЯЮЩАЯ КОЖА */}
        <section className="services reveal" ref={servicesRef}>
          <div className="container">
            <div className="services__header">
              <h1 className="services__title m-title">{t('glow_title')}</h1>
              <p className="services__text m-text">{t('glow_text')}</p>
            </div>
            <div className="services__grid">
              {INSTAGRAM_POSTS.map(([n, href]) => (
                <a
                  key={n}
                  className={`services__item services__item--${n}`}
                  target="_blank"
                  rel="noreferrer"
                  href={href}
                ></a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta reveal">
          <div className="container cta__container">
            <div className="cta__content">
              <h1 className="cta__title m-title">{t('cta_title')}</h1>
              <p className="cta__text m-text">{t('cta_text')}</p>
              <button className="btn cta__btn" onClick={() => navigate('/contact')}>
                {t('book_visit')}
              </button>
            </div>
          </div>
        </section>

        {/* INFO 1 */}
        <section className="info reveal">
          <div className="container">
            <div className="info__content">
              <div className="info__wrapper">
                <h1 className="info__title m-title">{t('info1_title')}</h1>
                <p className="info__text m-text">{t('info1_text')}</p>
                <button className="btn info__btn" onClick={() => navigate('/about')}>
                  {t('details')}
                </button>
              </div>
              <img src="/image.png" alt="Косметология" className="info__image" />
            </div>
          </div>
        </section>

        {/* INFO 2 */}
        <section className="info reveal info--alt">
          <div className="info__container">
            <div className="info__content info__content--alt">
              <img src="/man.jpg" alt="img" className="info__image" />
              <div>
                <h1 className="info__title--alt m-title">{t('info2_title')}</h1>
                <p className="info__text--alt m-text">
                  {t('info2_text1')}
                  <br />
                  <br />
                  {t('info2_text2')}
                </p>
                <button className="btn info__btn--alt" onClick={() => navigate('/servis')}>
                  {t('our_services')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* КАК ЭТО РАБОТАЕТ */}
        <section className="section process reveal">
          <div className="section__inner">
            <span className="section-tag">{t('how_tag')}</span>
            <h2 className="section-title">
              {t('how_title_1')} <em>{t('how_title_2')}</em>
            </h2>
            <div className="process__steps">
              {STEP_NUMS.map((num, i) => (
                <div className="process__step" key={num}>
                  <div className="process__step-num">{num}</div>
                  <div className="process__step-title">{t(`step${i + 1}_title`)}</div>
                  <div className="process__step-text">{t(`step${i + 1}_text`)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Reviews />

        {/* ПОБАЛУЙТЕ СЕБЯ */}
        <section className="features reveal">
          <div className="container">
            <div className="features__top">
              <h1 className="features__title m-title">{t('spoil_title')}</h1>
              <p className="features__text m-text">{t('spoil_text')}</p>
            </div>

            <div className="features__grid reveal">
              <div className="features__card">
                <h1 className="features__card-title m-card-title">{t('card1_title')}</h1>
                <p className="features__card-text m-text">
                  {t('card1_text1')}
                  <br />
                  <br />
                  {t('card1_text2')}
                </p>
                <button className="btn features__btn" onClick={() => navigate('/contact')}>
                  {t('book')}
                </button>
              </div>

              <div className="features__card features__card--alt">
                <h1 className="features__card-title m-card-title">{t('card2_title')}</h1>
                <p className="features__card-text m-text">
                  {t('card2_text1')}
                  <br />
                  <br />
                  {t('card2_text2')}
                </p>
                <button className="btn features__btn" onClick={() => navigate('/servis')}>
                  {t('view_services')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <Faq />
      </main>

      <BeforeAfterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}