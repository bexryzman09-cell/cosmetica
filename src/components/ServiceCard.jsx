import { useEffect, useRef, useState } from 'react';

/** Карточка услуги: появление при скролле + 3D-наклон за мышью */
export default function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    let timer;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), (index % 3) * 100);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(timer);
    };
  }, [index]);

  const onMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--rx', `${(rect.height / 2 - y) / 10}deg`);
    card.style.setProperty('--ry', `${(x - rect.width / 2) / 10}deg`);
  };

  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={'service-card' + (visible ? ' visible' : '')}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="card-img">
        <img src={service.img} alt={service.title} />
      </div>
      <div className="card-body">
        <h3 className="m-card-title">{service.title}</h3>
        <p className="m-text">{service.text}</p>
        <div className="price">{service.price}</div>
      </div>
    </div>
  );
}
