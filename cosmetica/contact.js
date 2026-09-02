const BOTS = [
    { token: "8791994783:AAFWF1thbgR8MmhUzg2_v81Zw3ijXm0ALAk", chatId: "7017966153" },
    { token: "7854194910:AAE4JOdpZwvP73-HDPkovyFaqSPyKaShhio", chatId: "329478169" }
];

const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 часа

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tg-form');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const status = document.getElementById('status-msg');
    const btn = document.getElementById('submit-btn');
    const addServiceBtn = document.getElementById('add-service-btn');
    const servicesContainer = document.getElementById('services-container');

    // Кнопка отмены — добавляем в DOM
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-cancel';
    cancelBtn.textContent = '✕ Отменить запись';
    btn.insertAdjacentElement('afterend', cancelBtn);

    const serviceOptions = `
            <option value="" disabled selected>Выберите услугу</option>
            <optgroup label="Косметология">
                <option value="Комбинированная чистка лица">Комбинированная чистка лица</option>
                <option value="Пилинг PRX-T33">Пилинг PRX-T33</option>
                <option value="Ботулинотерапия">Ботулинотерапия</option>
                <option value="Карбокситерапия">Карбокситерапия</option>
                <option value="Мезотерапия">Мезотерапия</option>
                <option value="Биоревитализация">Биоревитализация</option>
                <option value="Криомассаж">Криомассаж</option>
                <option value="RF-лифтинг">RF-лифтинг</option>
                <option value="Фракционная мезотерапия">Фракционная мезотерапия</option>
                <option value="Биоревитализация BioGel RED">Биоревитализация BioGel RED</option>
                <option value="BioGel MONACO терапия">BioGel MONACO терапия</option>
                <option value="Контурная пластика губ">Контурная пластика губ</option>
            </optgroup>`;

    // === Счётчик записей с устройства (переживает закрытие браузера) ===
    function getBookingCount() {
        return parseInt(localStorage.getItem('bookingCount') || '0', 10);
    }

    function isMilestone(count) {
        return count === 1 || count % 5 === 0;
    }

    // Сколько осталось до конца кулдауна (мс). 0 или меньше — можно записываться.
    function getCooldownRemaining() {
        const last = parseInt(localStorage.getItem('lastBookingTime') || '0', 10);
        if (!last) return 0;
        const remaining = COOLDOWN_MS - (Date.now() - last);
        return remaining > 0 ? remaining : 0;
    }

    // Формат Ч:ММ:СС (например 1:59:59), без часов — М:СС
    function formatCountdown(ms) {
        const totalSec = Math.max(0, Math.ceil(ms / 1000));
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const mm = String(m).padStart(2, '0');
        const ss = String(s).padStart(2, '0');
        return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
    }

    let cooldownInterval = null;

    function lockForm(remainingMs) {
        btn.classList.add('active');
        btn.disabled = true;
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
        cancelBtn.classList.add('visible');
        status.style.color = 'green';

        clearInterval(cooldownInterval);

        function tick() {
            const left = getCooldownRemaining();
            if (left <= 0) {
                unlockForm();
                status.innerText = '';
                return;
            }
            status.innerHTML = `✅ Вы уже записаны! Повторная запись через <b>${formatCountdown(left)}</b>`;
        }

        tick();
        cooldownInterval = setInterval(tick, 1000);
    }

    function unlockForm() {
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.cursor = '';
        btn.classList.remove('active');
        cancelBtn.classList.remove('visible');
        clearInterval(cooldownInterval);
        checkForm();
    }

    // === Блок отзыва после записи ===
    const reviewBlock = document.getElementById('review-block');
    const reviewStars = document.querySelectorAll('#review-stars span');
    const reviewText = document.getElementById('review-text');
    const reviewSubmitBtn = document.getElementById('review-submit-btn');
    const reviewThanks = document.getElementById('review-thanks');
    let selectedRating = 0;

    reviewStars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = +star.dataset.star;
            reviewStars.forEach(s => s.classList.toggle('hover', +s.dataset.star <= val));
        });
        star.addEventListener('mouseleave', () => {
            reviewStars.forEach(s => s.classList.remove('hover'));
        });
        star.addEventListener('click', () => {
            selectedRating = +star.dataset.star;
            reviewStars.forEach(s => s.classList.toggle('active', +s.dataset.star <= selectedRating));
        });
    });

    function showReviewBlock() {
        reviewBlock.classList.add('visible');
        if (localStorage.getItem('reviewSent') === 'true') {
            const savedRating = +localStorage.getItem('reviewRating') || 0;
            reviewStars.forEach(s => {
                s.classList.toggle('active', +s.dataset.star <= savedRating);
                s.style.pointerEvents = 'none';
            });
            reviewText.style.display = 'none';
            reviewSubmitBtn.style.display = 'none';
            reviewThanks.style.display = 'block';
        }
    }

    function resetReviewBlock() {
        selectedRating = 0;
        reviewStars.forEach(s => { s.classList.remove('active'); s.style.pointerEvents = ''; });
        reviewText.value = '';
        reviewText.style.display = '';
        reviewSubmitBtn.style.display = '';
        reviewSubmitBtn.disabled = false;
        reviewThanks.style.display = 'none';
        reviewBlock.classList.remove('visible');
        localStorage.removeItem('reviewSent');
        localStorage.removeItem('reviewRating');
    }

    reviewSubmitBtn.addEventListener('click', () => {
        if (selectedRating === 0) {
            showToast('Поставьте оценку ⭐', '⚠️');
            return;
        }
        reviewSubmitBtn.disabled = true;

        const starsStr = '⭐'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
        const reviewMessage =
            `<b>💬 Новый отзыв: Shoira Studio</b>\n\n` +
            `<b>👤 Клиент:</b> ${localStorage.getItem('clientName') || 'Не указан'}\n` +
            `<b>📞 Тел:</b> <code>${localStorage.getItem('clientPhone') || 'Не указан'}</code>\n` +
            `<b>⭐ Оценка:</b> ${starsStr} (${selectedRating}/5)\n` +
            `<b>📝 Текст:</b> ${reviewText.value.trim() || 'Без комментария'}`;

        const requests = BOTS.map(bot =>
            fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: bot.chatId, parse_mode: 'html', text: reviewMessage })
            })
        );

        Promise.all(requests)
            .then(responses => {
                if (responses.some(r => r.ok)) {
                    localStorage.setItem('reviewSent', 'true');
                    localStorage.setItem('reviewRating', selectedRating);
                    reviewText.style.display = 'none';
                    reviewStars.forEach(s => s.style.pointerEvents = 'none');
                    reviewSubmitBtn.style.display = 'none';
                    reviewThanks.style.display = 'block';
                    showToast('Спасибо за отзыв! 💛', '⭐');
                } else {
                    reviewSubmitBtn.disabled = false;
                    showToast('Ошибка отправки отзыва', '❌');
                }
            })
            .catch(() => {
                reviewSubmitBtn.disabled = false;
                showToast('Ошибка соединения', '❌');
            });
    });

    function checkForm() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const selects = servicesContainer.querySelectorAll('.service-select');
        const allServicesChosen = [...selects].every(s => s.value !== '');
        const valid = name.length > 1 && phone.length >= 6 && allServicesChosen;

        if (valid) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        addServiceBtn.style.display = (allServicesChosen && selects.length < 5) ? 'block' : 'none';
    }

    // Если ещё действует кулдаун с прошлой записи (даже после закрытия браузера)
    const remaining = getCooldownRemaining();
    if (remaining > 0) {
        lockForm(remaining);
        showReviewBlock();
    }

    // Отмена записи (снимает кулдаун сразу, можно записаться заново)
    cancelBtn.addEventListener('click', () => {
        if (!confirm('Отменить запись?')) return;

        const cancelMessage =
            `<b>❌ Отмена записи: Shoira Studio</b>\n\n` +
            `<b>👤 Клиент:</b> ${localStorage.getItem('clientName') || 'Не указан'}\n` +
            `<b>📞 Тел:</b> <code>${localStorage.getItem('clientPhone') || 'Не указан'}</code>\n\n` +
            `<i>Клиент отменил запись через сайт</i>`;

        BOTS.forEach(bot =>
            fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: bot.chatId, parse_mode: 'html', text: cancelMessage })
            })
        );

        localStorage.removeItem('lastBookingTime');
        localStorage.removeItem('clientName');
        localStorage.removeItem('clientPhone');
        unlockForm();
        status.innerText = '';
        form.reset();
        checkForm();
        resetReviewBlock();

        showToast('Запись отменена', '❌');
    });

    // Маска телефона
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('7') || val.startsWith('8')) val = val.substring(1);
        let res = val.length > 0 ? '+7 (' + val.substring(0, 3) : '';
        if (val.length > 3) res += ') ' + val.substring(3, 6);
        if (val.length > 6) res += '-' + val.substring(6, 8);
        if (val.length > 8) res += '-' + val.substring(8, 10);
        e.target.value = res;
        checkForm();
    });

    form.addEventListener('input', updateAllSelects);

    function getSelectedServices(exceptSelect = null) {
        const selects = servicesContainer.querySelectorAll('.service-select');
        return [...selects]
            .filter(s => s !== exceptSelect && s.value !== '')
            .map(s => s.value);
    }

    function updateAllSelects() {
        const selects = servicesContainer.querySelectorAll('.service-select');
        selects.forEach(sel => {
            const taken = getSelectedServices(sel);
            [...sel.options].forEach(opt => {
                if (opt.value === '') return;
                opt.disabled = taken.includes(opt.value);
                opt.style.color = taken.includes(opt.value) ? '#ccc' : '';
            });
        });
        checkForm();
    }

    addServiceBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'input-group service-row';
        row.innerHTML = `
        <select class="service-select" required>${serviceOptions}</select>
        <button type="button" class="remove-service" title="Удалить">×</button>`;
        row.querySelector('.remove-service').addEventListener('click', () => {
            row.remove();
            updateAllSelects();
        });
        row.querySelector('.service-select').addEventListener('change', updateAllSelects);
        servicesContainer.appendChild(row);
        updateAllSelects();
    });

    // Отправка
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getCooldownRemaining() > 0 || !btn.classList.contains('active')) return;

        const selects = servicesContainer.querySelectorAll('.service-select');
        const services = [...selects].map(s => s.value).filter(Boolean).join(', ');
        const comment = document.getElementById('message').value.trim() || "Нет";

        const newCount = getBookingCount() + 1;

        let fullMessage =
            `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
            `<b>👤 Клиент:</b> ${nameInput.value}\n` +
            `<b>📞 Тел:</b> <code>${phoneInput.value}</code>\n` +
            `<b>💅 Услуга:</b> ${services}\n` +
            `<b>💬 Коммент:</b> ${comment}\n\n` +
            `<i>⏰ Дата и время — уточнить по звонку</i>`;

        if (isMilestone(newCount)) {
            fullMessage += `\n\n🎉 <b>Это ${newCount}-я запись с этого устройства!</b>`;
        }

        btn.disabled = true;

        const requests = BOTS.map(bot =>
            fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: bot.chatId, parse_mode: 'html', text: fullMessage })
            })
        );

        Promise.all(requests)
            .then(responses => {
                if (responses.some(r => r.ok)) {
                    localStorage.setItem('lastBookingTime', Date.now().toString());
                    localStorage.setItem('bookingCount', newCount.toString());
                    localStorage.setItem('clientName', nameInput.value);
                    localStorage.setItem('clientPhone', phoneInput.value);
                    form.reset();
                    checkForm();
                    lockForm(COOLDOWN_MS);
                    fireInject(btn);
                    showReviewBlock();
                }
            })
            .catch(() => {
                status.innerText = '❌ Ошибка соединения.';
                btn.disabled = false;
            });
    });

    checkForm();
});

// Анимации
function showToast(msg, icon) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.innerHTML = `<span style="font-size:18px">${icon}</span>${msg}`;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.classList.remove('show'); }, 5000);
}
 
function fireInject(btn) {
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
    showToast('Вам позвонят для выбора даты и времени. Ждите звонка! 📞', '💉');
}