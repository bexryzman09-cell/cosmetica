/** Анимация "укола" (капли + кольцо) после успешной записи */
export function fireInject(btn, showToast) {
  if (btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const nd = document.createElement('div');
        nd.className = 'needle-drop';
        nd.style.cssText = `left:${cx + (Math.random() - 0.5) * 60}px;top:${cy}px;`;
        const d = document.createElement('div');
        d.className = 'drop';
        nd.appendChild(d);
        document.body.appendChild(nd);
        setTimeout(() => nd.remove(), 700); 
      }, i * 80);
    }

    const ring = document.createElement('div');
    ring.className = 'ripple-ring';
    ring.style.cssText = `left:${cx}px;top:${cy}px;`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 700);
  }

  showToast('Вам позвонят для выбора даты и времени. Ждите звонка! 📞', '💉');
}
