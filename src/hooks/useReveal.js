import { useEffect } from 'react';

/** Появление блоков с классом .reveal при скролле (бывший пункт 3 из app.js) */
export default function useReveal(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
}
