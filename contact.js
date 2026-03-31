// const TOKEN = "8791994783:AAFWF1thbgR8MmhUzg2_v81Zw3ijXm0ALAk";
// const CHAT_ID = "7017966153";

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('tg-form');
//     const dateInput = document.getElementById('date');
//     const dateError = document.getElementById('date-error');

//     // Устанавливаем минимальную дату — сегодня (нельзя записаться на прошедшее число)
//     const today = new Date().toISOString().split('T')[0];
//     dateInput.setAttribute('min', today);

//     if (form) {
//         form.addEventListener('submit', function (e) {
//             e.preventDefault();

//             const status = document.getElementById('status-msg');
//             const btn = document.getElementById('submit-btn');

//             // Данные полей
//             const name = document.getElementById('name').value;
//             const phone = document.getElementById('phone').value;
//             const serviceSelect = document.getElementById('service');
//             const service = serviceSelect.options[serviceSelect.selectedIndex].text;
//             const selectedDate = dateInput.value;
//             const messageText = document.getElementById('message').value || "Нет комментария";

//             // --- ЛОГИКА ПРОВЕРКИ ДАТЫ ---
//             // Получаем список уже занятых дат из памяти браузера
//             let occupiedDates = JSON.parse(localStorage.getItem('bookedDates')) || [];

//             if (occupiedDates.includes(selectedDate)) {
//                 dateError.style.display = 'block';
//                 dateInput.style.borderColor = 'red';
//                 return; // Останавливаем отправку
//             } else {
//                 dateError.style.display = 'none';
//                 dateInput.style.borderColor = '#eee';
//             }
//             // ----------------------------

//             const fullMessage = `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
//                 `<b>👤 Клиент:</b> ${name}\n` +
//                 `<b>📞 Тел:</b> <code>${phone}</code>\n` +
//                 `<b>📅 Дата:</b> ${selectedDate}\n` +
//                 `<b>💅 Услуга:</b> ${service}\n` +
//                 `<b>💬 Коммент:</b> ${messageText}`;

//             btn.disabled = true;
//             btn.innerText = "Отправка...";

//             fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     chat_id: CHAT_ID,
//                     parse_mode: 'html' ,
//                     text: fullMessage
//                 })
//             })
//                 .then(res => {
//                     if (res.ok) {
//                         // Сохраняем дату как занятую после успешной отправки
//                         occupiedDates.push(selectedDate);
//                         localStorage.setItem('bookedDates', JSON.stringify(occupiedDates));

//                         status.innerText = "✅ Заявка отправлена! Дата забронирована.";
//                         status.style.color = "#d4af37";
//                         form.reset();
//                     } else {
//                         status.innerText = "Ошибка отправки в Telegram.";
//                     }
//                 })
//                 .catch(err => {
//                     status.innerText = "❌ Ошибка сети.";
//                 })
//                 .finally(() => {
//                     btn.disabled = false;
//                     btn.innerText = "Записаться к Шоире";
//                 });
//         });
//     }
// });

const TOKEN = "8791994783:AAFWF1thbgR8MmhUzg2_v81Zw3ijXm0ALAk"; 
const CHAT_ID = "7017966153"; 

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tg-form');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const nameInput = document.getElementById('name');
    const status = document.getElementById('status-msg');

    // 1. ГЕНЕРАЦИЯ ВРЕМЕНИ (с 09:00 до 20:45 с шагом 15 мин)
    for (let hour = 9; hour <= 20; hour++) {
        [0, 15, 30, 45].forEach(min => {
            let h = hour < 10 ? '0' + hour : hour;
            let m = min === 0 ? '00' : min;
            let option = document.createElement('option');
            option.value = `${h}:${m}`;
            option.textContent = `${h}:${m}`;
            timeSelect.appendChild(option);
        });
    }

    // Ограничение даты (минимум сегодня)
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

    if (form) {
        // МАСТЕР-КОМАНДА: RESET_ALL в поле имени
        nameInput.addEventListener('input', function() {
            if (this.value === "RESET_ALL") {
                localStorage.clear();
                alert("Все записи и блокировки удалены!");
                location.reload();
            }
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const date = dateInput.value;
            const time = timeSelect.value;
            const dateTimeKey = `${date} ${time}`; // Ключ вида "2026-03-31 15:00"

            // --- ЛОГИКА МАСТЕРА /BLACK ---
            if (nameInput.value.startsWith('/black')) {
                let blackList = JSON.parse(localStorage.getItem('adminBlackList')) || [];
                blackList.push(dateTimeKey);
                localStorage.setItem('adminBlackList', JSON.stringify(blackList));
                alert(`Время ${dateTimeKey} заблокировано!`);
                form.reset();
                return;
            }

            // --- ПРОВЕРКА ЗАНЯТОСТИ (с интервалом 30 мин) ---
            let booked = JSON.parse(localStorage.getItem('bookedDates')) || [];
            let blacks = JSON.parse(localStorage.getItem('adminBlackList')) || [];
            
            // Функция проверки пересечения
            const isBusy = (checkDT) => {
                let [d, t] = checkDT.split(' ');
                let [h, m] = t.split(':').map(Number);
                let currentTotal = h * 60 + m;

                return [...booked, ...blacks].some(bDT => {
                    let [bD, bT] = bDT.split(' ');
                    if (bD !== d) return false; // Другой день — ок
                    let [bH, bM] = bT.split(':').map(Number);
                    let bookedTotal = bH * 60 + bM;
                    // Если разница меньше 30 минут — блокируем
                    return Math.abs(currentTotal - bookedTotal) < 30;
                });
            };

            if (isBusy(dateTimeKey)) {
                status.innerText = "❌ Это время занято или слишком близко к другой записи (нужен перерыв 30 мин).";
                status.style.color = "red";
                return;
            }

            // --- ОТПРАВКА ---
            const service = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;
            const fullMessage = `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
                                `<b>👤 Клиент:</b> ${nameInput.value}\n` +
                                `<b>📞 Тел:</b> <code>${document.getElementById('phone').value}</code>\n` +
                                `<b>📅 Дата:</b> ${date}\n` +
                                `<b>⏰ Время:</b> ${time}\n` +
                                `<b>💅 Услуга:</b> ${service}`;

            btn.disabled = true;
            btn.innerText = "ОТПРАВЛЯЕМ...";

            fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, parse_mode: 'html', text: fullMessage })
            })
            .then(res => {
                if (res.ok) {
                    booked.push(dateTimeKey);
                    localStorage.setItem('bookedDates', JSON.stringify(booked));
                    status.innerText = "✅ Запись на " + time + " принята!";
                    status.style.color = "gold";
                    form.reset();
                }
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerText = "ЗАПИСАТЬСЯ К ШОИРЕ";
            });
        });
    }
});