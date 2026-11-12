import { useEffect, useRef } from 'react';

const SPEED = 0.8; // пикселей за кадр

/** Бесшовная бегущая карусель. Карточки рендерятся дважды (вместо cloneNode). */
export default function TechCarousel({ items }) {
  const trackRef = useRef(null);
  const paused = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    let x = 0;
    let raf;

    const tick = () => {
      if (!paused.current && track.children.length > items.length) {
        x -= SPEED;
        // реальная длина одного круга (с учётом gap)
        const loop = track.children[items.length].offsetLeft - track.children[0].offsetLeft;
        if (Math.abs(x) >= loop) x = 0;
        track.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  return (
    <div
      className="premium-carousel"
      id="techCarousel"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="carousel-track" id="track" ref={trackRef}>
        {[...items, ...items].map((item, i) => (
          <div className="tech-item" key={i}>
            <div className="image-wrapper">
              <img src={`/${item.img}`} alt={item.title} />
              {item.badge && <div className="item-badge">{item.badge}</div>}
            </div>
            <div className="item-details">
              <span className="item-cat">{item.cat}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
