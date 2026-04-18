
const BOTS = [
    { token: "8791994783:AAFWF1thbgR8MmhUzg2_v81Zw3ijXm0ALAk", chatId: "7017966153" },
    { token: "7854194910:AAE4JOdpZwvP73-HDPkovyFaqSPyKaShhio", chatId: "329478169" }
];

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tg-form');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const status = document.getElementById('status-msg');
    const btn = document.getElementById('submit-btn');

    // 1. Генерация времени
    if (timeSelect) {
        for (let h = 9; h <= 21; h++) {
            [0, 30].forEach(m => {
                if (h === 20 && m > 0) return;
                let opt = document.createElement('option');
                let timeVal = `${h < 10 ? '0' + h : h}:${m === 0 ? '00' : m}`;
                opt.value = timeVal;
                opt.textContent = timeVal;
                timeSelect.appendChild(opt);
            });
        }
    }

    // 2. Ограничение даты
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    // 3. Маска телефона
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('7') || val.startsWith('8')) val = val.substring(1);
        let res = val.length > 0 ? '+7 (' + val.substring(0, 3) : '';
        if (val.length > 3) res += ') ' + val.substring(3, 6);
        if (val.length > 6) res += '-' + val.substring(6, 8);
        if (val.length > 8) res += '-' + val.substring(8, 10);
        e.target.value = res;
    });

    // 4. Отправка формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const dateTimeKey = `${dateInput.value} ${timeSelect.value}`;
        const service = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;
        const comment = document.getElementById('message').value.trim() || "Нет";

        // Проверка занятости
        let booked = JSON.parse(localStorage.getItem('bookedDates')) || [];
        if (booked.includes(dateTimeKey)) {
            status.innerText = "❌ Это время уже занято.";
            status.style.color = "red";
            return;
        }

        const fullMessage = `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
            `<b>👤 Клиент:</b> ${nameInput.value}\n` +
            `<b>📞 Тел:</b> <code>${phoneInput.value}</code>\n` +
            `<b>📅 Дата:</b> ${dateInput.value}\n` +
            `<b>⏰ Время:</b> ${timeSelect.value}\n` +
            `<b>💅 Услуга:</b> ${service}\n` +
            `<b>💬 Коммент:</b> ${comment}`;

        btn.disabled = true;
        btn.innerText = "ОТПРАВКА...";

        // Отправка обоим ботам
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
                    booked.push(dateTimeKey);
                    localStorage.setItem('bookedDates', JSON.stringify(booked));
                    status.innerText = "✅ Вы успешно записаны!";
                    status.style.color = "gold";
                    form.reset();
                }
            })
            .catch(() => {
                status.innerText = "❌ Ошибка соединения.";
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerText = "Записаться к Шоире";
            });
    });
});