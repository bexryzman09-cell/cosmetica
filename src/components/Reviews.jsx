import { useEffect, useRef, useState } from 'react';
import { REVIEWS } from '../data/reviews';
import { useLang } from '../i18n/LangContext';

export default function Reviews() {
  const { t, lang } = useLang();
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i < REVIEWS.length - 1 ? i + 1 : 0));
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : i));

  // сдвиг трека
  useEffect(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!card) return;
    const cardWidth = card.offsetWidth + 20;
    track.style.transform = `translateX(${-index * cardWidth}px)`;
  }, [index]);

  // автопрокрутка каждые 5 секунд
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="reviews-section">
      <h2 className="section-title">{t('rv_title')}</h2>

      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {REVIEWS.map((r, i) => {
            const name = lang === 'ru' ? r.name.ru : r.name.en;
            const text = r.text[lang] ?? r.text.ru;
            return (
              <div className="review-card" key={i}>
                <img
                  src={`https://randomuser.me/api/portraits/women/${r.img}.jpg`}
                  alt={name}
                  className="user-img"
                />
                <div className="stars">★★★★★</div>
                <p className="review-text">"{text}"</p>
                <h4 className="user-name">{name}</h4>
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-buttons">
        <button className="btn-prev" onClick={prev}>←</button>
        <button className="btn-next" onClick={next}>→</button>
      </div>
    </section>
  );
}