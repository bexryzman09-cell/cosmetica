document.addEventListener('DOMContentLoaded', () => {
    // ===== Декоративные плавающие частицы на фоне =====
    const bg = document.getElementById('notfoundBg');
    if (bg) {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'notfound-petal';
            const size = 6 + Math.random() * 12;
            p.style.cssText = `
                width:${size}px;height:${size}px;
                left:${Math.random() * 100}%;
                bottom:-5%;
                animation-duration:${8 + Math.random() * 10}s;
                animation-delay:-${Math.random() * 12}s;
            `;
            bg.appendChild(p);
        }
    }

    // ===== Автоматический редирект на главную с обратным отсчётом =====
    const redirectEl = document.getElementById('notfound-countdown');
    const redirectWrap = document.getElementById('notfound-redirect');
    const cancelBtn = document.getElementById('notfound-cancel-redirect');

    if (redirectEl && redirectWrap) {
        let seconds = 12;
        redirectEl.textContent = seconds;

        let stopped = false;
        const interval = setInterval(() => {
            if (stopped) return;
            seconds--;
            if (seconds <= 0) {
                clearInterval(interval);
                window.location.href = 'index.html';
                return;
            }
            redirectEl.textContent = seconds;
        }, 1000);

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                stopped = true;
                clearInterval(interval);
                redirectWrap.style.display = 'none';
            });
        }
    }
});