import { useEffect } from 'react';

/** Параллакс главной картинки + блик за курсором (бывший пункт 4 из app.js) */
export default function useCursorEffects(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    let ticking = false;

    const onMove = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const heroImg =
          document.querySelector('.img-frame img') ||
          document.querySelector('.hero__index img');
        const glow = document.querySelector('.cursor-glow');

        if (heroImg) {
          const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
          const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
          heroImg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
        }
        if (glow) {
          glow.style.left = e.clientX + 'px';
          glow.style.top = e.clientY + 'px';
        }
        ticking = false;
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);
}
