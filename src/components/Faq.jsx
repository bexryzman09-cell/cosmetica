import { useState } from 'react';
import { useLang } from '../i18n/LangContext';

const COUNT = 5;

export default function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(null);

  return (
    <section className="section">
      <span className="section-tag">{t('faq_tag')}</span>
      <h2 className="section-title">{t('faq_title')}</h2>

      <div className="faq__list">
        {Array.from({ length: COUNT }, (_, i) => (
          <div className={'faq__item' + (open === i ? ' open' : '')} key={i}>
            <button className="faq__q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{t(`faq_q${i + 1}`)}</span>
              <span className="faq__q-icon">+</span>
            </button>
            <div className="faq__a">
              <div className="faq__a-inner">{t(`faq_a${i + 1}`)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}