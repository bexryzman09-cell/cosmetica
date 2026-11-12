import { useEffect, useState } from 'react';

/**
 * Подключает css-файлы из /public/css только на время жизни страницы
 * (как в оригинале, где у каждого .html были свои стили).
 * Возвращает true, когда все файлы загружены — это убирает "мигание" без стилей.
 */
export default function useStyles(files) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const links = files.map((name) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/css/${name}.css`;
      return link;
    });

    Promise.all(
      links.map(
        (link) =>
          new Promise((resolve) => {
            link.onload = link.onerror = resolve;
            document.head.appendChild(link); // порядок = порядок каскада
          })
      )
    ).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      links.forEach((l) => l.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
