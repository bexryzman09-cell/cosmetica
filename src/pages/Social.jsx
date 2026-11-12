import { useEffect } from 'react';
import useStyles from '../hooks/useStyles';

// Отдельная страница-"линктри": без шапки и футера (как social.html)
export default function   Social() {
  const ready = useStyles(['social']);

  useEffect(() => {
    document.title = 'Контакты';
  }, []);

  const onMove = (e) => {
    const b = e.currentTarget;
    b.style.setProperty('--x', e.pageX - b.offsetLeft + 'px');
    b.style.setProperty('--y', e.pageY - b.offsetTop + 'px');
  };

  if (!ready) return null;

  return (
    <div className="reveal card">
      <h1>Давайте общаться</h1>
      <p>Напишите мне в любой из соцсетей</p>

      <div className="links-stack">
        <a href="https://www.instagram.com/shoiraotokhonova/" className="btn btn-ins" target="_blank" rel="noreferrer" onMouseMove={onMove}>
          Instagram
        </a>
        <a href="https://vk.ru/shoirakos0205" className="btn btn-vk" target="_blank" rel="noreferrer" onMouseMove={onMove}>
          ВКонтакте
        </a>
        <a href="https://t.me/permsh" className="btn btn-tg" target="_blank" rel="noreferrer" onMouseMove={onMove}>
          Telegram
        </a>
        {/* TODO: замените на настоящий email */}
        <a href="mailto:your.email@example.com" className="btn btn-mail" onMouseMove={onMove}>
          Email
        </a>
      </div>
    </div>
  );
}
