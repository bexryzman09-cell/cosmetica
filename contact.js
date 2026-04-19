const BOTS = [
    { token: "8791994783:AAFWF1thbgR8MmhUzg2_v81Zw3ijXm0ALAk", chatId: "7017966153" },
    { token: "7854194910:AAE4JOdpZwvP73-HDPkovyFaqSPyKaShhio", chatId: "329478169" }
];

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

        // Кнопка "+ ещё услуга" — показываем если все выбраны и меньше 5
        addServiceBtn.style.display = (allServicesChosen && selects.length < 5) ? 'block' : 'none';
    }

    // Если уже отправлял в этой сессии
    if (sessionStorage.getItem('formSent')) {
        btn.classList.add('active');
        btn.disabled = true;
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
        cancelBtn.classList.add('visible');
        status.innerHTML = '✅ Вы уже записаны! Ожидайте звонка.';
        status.style.color = 'green';
    }

    // Отмена записи
    // Отмена записи
    cancelBtn.addEventListener('click', () => {
        if (!confirm('Отменить запись?')) return;

        const cancelMessage =
            `<b>❌ Отмена записи: Shoira Studio</b>\n\n` +
            `<b>👤 Клиент:</b> ${sessionStorage.getItem('clientName') || 'Не указан'}\n` +
            `<b>📞 Тел:</b> <code>${sessionStorage.getItem('clientPhone') || 'Не указан'}</code>\n\n` +
            `<i>Клиент отменил запись через сайт</i>`;

        BOTS.forEach(bot =>
            fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: bot.chatId, parse_mode: 'html', text: cancelMessage })
            })
        );

        sessionStorage.removeItem('formSent');
        sessionStorage.removeItem('clientName');
        sessionStorage.removeItem('clientPhone');
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.cursor = '';
        btn.classList.remove('active');
        cancelBtn.classList.remove('visible');
        status.innerText = '';
        form.reset();
        checkForm();

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

    form.addEventListener('input', checkForm);

    // Добавить ещё услугу
    addServiceBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'input-group service-row';
        row.innerHTML = `
                <select class="service-select" required>${serviceOptions}</select>
                <button type="button" class="remove-service" title="Удалить">×</button>`;
        row.querySelector('.remove-service').addEventListener('click', () => {
            row.remove();
            checkForm();
        });
        row.querySelector('.service-select').addEventListener('change', checkForm);
        servicesContainer.appendChild(row);
        checkForm();
    });

    // Отправка
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (sessionStorage.getItem('formSent') || !btn.classList.contains('active')) return;

        const selects = servicesContainer.querySelectorAll('.service-select');
        const services = [...selects].map(s => s.value).filter(Boolean).join(', ');
        const comment = document.getElementById('message').value.trim() || "Нет";

        const fullMessage =
            `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
            `<b>👤 Клиент:</b> ${nameInput.value}\n` +
            `<b>📞 Тел:</b> <code>${phoneInput.value}</code>\n` +
            `<b>💅 Услуга:</b> ${services}\n` +
            `<b>💬 Коммент:</b> ${comment}\n\n` +
            `<i>⏰ Дата и время — уточнить по звонку</i>`;

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
                    sessionStorage.setItem('formSent', 'true');
                    sessionStorage.setItem('clientName', nameInput.value);
                    sessionStorage.setItem('clientPhone', phoneInput.value);
                    form.reset();
                    checkForm();
                    status.innerHTML = '✅ Вы записаны! Ожидайте звонка.';
                    status.style.color = 'green';
                    btn.style.opacity = '0.4';
                    btn.style.cursor = 'not-allowed';
                    cancelBtn.classList.add('visible');
                    fireInject(btn);
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