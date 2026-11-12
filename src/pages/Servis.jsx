import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { SERVICES } from '../data/services';
import { useLang } from '../i18n/LangContext';

export default function Servis() {
  const { t } = useLang();

  return (
    <Layout styles={['main', 'servis']} title={t('sv_page_title')}>
      <main className="services-page">
        <section className="services-intro">
          <h1 className="m-title">{t('sv_title')}</h1>
          <p className="m-text">{t('sv_sub')}</p>
        </section>

        <div className="container">
          <h2 className="category-title">{t('sv_category')}</h2>
          <div className="services-grid">
            {SERVICES.map((s, i) => {
              // цена переводится только если для неё есть свой ключ (например "от 300 ₽ / ед.")
              const priceKey = `svc${i}_price`;
              const price = t(priceKey) === priceKey ? s.price : t(priceKey);
              const service = {
                ...s,
                title: t(`svc${i}_title`),
                text: t(`svc${i}_text`),
                price,
              };
              return <ServiceCard key={s.title} service={service} index={i} />;
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}