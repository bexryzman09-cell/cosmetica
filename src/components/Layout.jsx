import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import useStyles from '../hooks/useStyles';
import useReveal from '../hooks/useReveal';
import useCursorEffects from '../hooks/useCursorEffects';

/**
 * Общая обёртка страницы: подключает css, ставит title/класс body,
 * рисует Header + Footer (с мобильным меню) + блик за курсором.
 */
export default function Layout({ styles, title, bodyClass, children }) {
  const ready = useStyles(styles);

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  useEffect(() => {
    if (!bodyClass) return;
    document.body.classList.add(bodyClass);
    return () => document.body.classList.remove(bodyClass);
  }, [bodyClass]);

  useReveal(ready);
  useCursorEffects(ready);

  if (!ready) return null;

  return (
    <>
      <Header />
      {children}
      <Footer />
      <div className="cursor-glow"></div>
    </>
  );
}
