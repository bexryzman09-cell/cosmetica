import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LangContext';

// [до, после] — имена файлов лежат в public
const SLIDES = [
  ['img-imdex-one.png', 'img-index-two.png'],
  ['img-index-three.png', 'img-index-four.png'],
  ['photo.jpg', 'phot.jpg'],
  ['img-index-seven.jpg', 'img-index-eight.jpg'],
];

export default function BeforeAfterModal({ open, onClose }) {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);

  const go = (n) => setCurrent((n + SLIDES.length) % SLIDES.length);

  // блокируем скролл страницы пока модалка открыта
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      id="beforeAfterFull"
      className={'ba-overlay' + (open ? ' active' : '')}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ba-modal-full">
        <button id="closeFull" className="ba-modal-full__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="services__title m-title ba-modal-full__title">{t('ba_title')}</h2>

        <div className="ba-slider">
          <button className="ba-slider__btn prev" aria-label={t('ba_prev')} onClick={() => go(current - 1)}>
            &#10094;
          </button>

          <div className="ba-slider__viewport">
            <div className="ba-slider__track" style={{ transform: `translateX(-${current * 100}%)` }}>
              {SLIDES.map(([before, after]) => (
                <div className="ba-slide" key={before}>
                  <div className="ba-modal-full__grid">
                    <div className="ba-modal-full__item">
                      <img src={`/${before}`} alt={t('ba_before')} />
                      <span className="m-text">{t('ba_before')}</span>
                    </div>
                    <div className="ba-modal-full__item">
                      <img src={`/${after}`} alt={t('ba_after')} />
                      <span className="m-text">{t('ba_after')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="ba-slider__btn next" aria-label={t('ba_next')} onClick={() => go(current + 1)}>
            &#10095;
          </button>
        </div>

        <div className="ba-dots">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={'ba-dot' + (i === current ? ' active' : '')}
              onClick={() => go(i)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}