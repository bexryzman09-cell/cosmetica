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

// const TOKEN = "8791994783:AAFWF1thbgR8MmhUzg2_v81Zw3ijXm0ALAk";
// const CHAT_ID = "7017966153";

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('tg-form');
//     const dateInput = document.getElementById('date');
//     const timeSelect = document.getElementById('time');
//     const nameInput = document.getElementById('name');
//     const status = document.getElementById('status-msg');

//     // 1. ГЕНЕРАЦИЯ ВРЕМЕНИ (с 09:00 до 20:45 с шагом 15 мин)
//     for (let hour = 9; hour <= 20; hour++) {
//         [0, 15, 30, 45].forEach(min => {
//             let h = hour < 10 ? '0' + hour : hour;
//             let m = min === 0 ? '00' : min;
//             let option = document.createElement('option');
//             option.value = `${h}:${m}`;
//             option.textContent = `${h}:${m}`;
//             timeSelect.appendChild(option);
//         });
//     }

//     // Ограничение даты (минимум сегодня)
//     dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

//     if (form) {
//         // МАСТЕР-КОМАНДА: RESET_ALL в поле имени
//         nameInput.addEventListener('input', function () {
//             if (this.value === "RESET_ALL") {
//                 localStorage.clear();
//                 alert("Все записи и блокировки удалены!");
//                 location.reload();
//             }
//         });

//         form.addEventListener('submit', function (e) {
//             e.preventDefault();
//             const btn = document.getElementById('submit-btn');
//             const date = dateInput.value;
//             const time = timeSelect.value;
//             const dateTimeKey = `${date} ${time}`; // Ключ вида "2026-03-31 15:00"

//             // --- ЛОГИКА МАСТЕРА /BLACK ---
//             if (nameInput.value.startsWith('/black')) {
//                 let blackList = JSON.parse(localStorage.getItem('adminBlackList')) || [];
//                 blackList.push(dateTimeKey);
//                 localStorage.setItem('adminBlackList', JSON.stringify(blackList));
//                 alert(`Время ${dateTimeKey} заблокировано!`);
//                 form.reset();
//                 return;
//             }

//             // --- ПРОВЕРКА ЗАНЯТОСТИ (с интервалом 30 мин) ---
//             let booked = JSON.parse(localStorage.getItem('bookedDates')) || [];
//             let blacks = JSON.parse(localStorage.getItem('adminBlackList')) || [];

//             // Функция проверки пересечения
//             const isBusy = (checkDT) => {
//                 let [d, t] = checkDT.split(' ');
//                 let [h, m] = t.split(':').map(Number);
//                 let currentTotal = h * 60 + m;

//                 return [...booked, ...blacks].some(bDT => {
//                     let [bD, bT] = bDT.split(' ');
//                     if (bD !== d) return false; // Другой день — ок
//                     let [bH, bM] = bT.split(':').map(Number);
//                     let bookedTotal = bH * 60 + bM;
//                     // Если разница меньше 30 минут — блокируем
//                     return Math.abs(currentTotal - bookedTotal) < 30;
//                 });
//             };

//             if (isBusy(dateTimeKey)) {
//                 status.innerText = "❌ Это время занято или слишком близко к другой записи (нужен перерыв 30 мин).";
//                 status.style.color = "red";
//                 return;
//             }

//             // --- ОТПРАВКА ---
//             const service = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;
//             const fullMessage = `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
//                 `<b>👤 Клиент:</b> ${nameInput.value}\n` +
//                 `<b>📞 Тел:</b> <code>${document.getElementById('phone').value}</code>\n` +
//                 `<b>📅 Дата:</b> ${date}\n` +
//                 `<b>⏰ Время:</b> ${time}\n` +
//                 `<b>💅 Услуга:</b> ${service}`;

//             btn.disabled = true;
//             btn.innerText = "ОТПРАВЛЯЕМ...";

//             fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ chat_id: CHAT_ID, parse_mode: 'html', text: fullMessage })
//             })
//                 .then(res => {
//                     if (res.ok) {
//                         booked.push(dateTimeKey);
//                         localStorage.setItem('bookedDates', JSON.stringify(booked));
//                         status.innerText = "✅ Запись на " + time + " принята!";
//                         status.style.color = "gold";
//                         form.reset();
//                     }
//                 })
//                 .finally(() => {
//                     btn.disabled = false;
//                     btn.innerText = "ЗАПИСАТЬСЯ К ШОИРЕ";
//                 });
//         });
//     }
// });
// // 3. Собираем данные
// const service = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;
// const phone = document.getElementById('phone').value;
// const comment = document.getElementById('message').value.trim() || "Нет комментария"; // <--- ИСПРАВЛЕНО ЗДЕСЬ

// const fullMessage = `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
//     `<b>👤 Клиент:</b> ${nameInput.value}\n` +
//     `<b>📞 Тел:</b> <code>${phone}</code>\n` +
//     `<b>📅 Дата:</b> ${date}\n` +
//     `<b>⏰ Время:</b> ${time}\n` +
//     `<b>💅 Услуга:</b> ${service}\n` +
//     `<b>💬 Коммент:</b> ${comment}`; // <--- ДОБАВЛЕНО В СООБЩЕНИЕ

// btn.disabled = true;
// btn.innerText = "ОТПРАВЛЯЕМ...";

// fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//         chat_id: CHAT_ID,
//         parse_mode: 'html',
//         text: fullMessage
//     })
// })4

const TOKEN = "8791994783:AAFWF1thbgR8MmhUzg2_v81Zw3ijXm0ALAk";
const CHAT_ID = "7017966153";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tg-form');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const nameInput = document.getElementById('name');
    const status = document.getElementById('status-msg');

    // 1. ГЕНЕРАЦИЯ ВРЕМЕНИ (с 09:00 до 20:45)
    if (timeSelect) {
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
    }

    // Ограничение даты (минимум сегодня)
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    if (form) {
        // МАСТЕР-КОМАНДА: RESET_ALL в поле имени для очистки базы
        nameInput.addEventListener('input', function () {
            if (this.value === "RESET_ALL") {
                localStorage.clear();
                alert("Все записи и блокировки удалены!");
                location.reload();
            }
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');

            const date = dateInput.value;
            const time = timeSelect.value;
            const name = nameInput.value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;

            // ВОТ ТУТ МЫ БЕРЕМ КОММЕНТАРИЙ
            const comment = document.getElementById('message').value.trim() || "Нет комментария";

            const dateTimeKey = `${date} ${time}`;

            // --- ПРОВЕРКА МАСТЕРА /BLACK ---
            if (name.startsWith('/black')) {
                let blackList = JSON.parse(localStorage.getItem('adminBlackList')) || [];
                blackList.push(dateTimeKey);
                localStorage.setItem('adminBlackList', JSON.stringify(blackList));
                alert(`Время ${dateTimeKey} заблокировано!`);
                form.reset();
                return;
            }

            // --- ПРОВЕРКА ЗАНЯТОСТИ (интервал 30 мин) ---
            let booked = JSON.parse(localStorage.getItem('bookedDates')) || [];
            let blacks = JSON.parse(localStorage.getItem('adminBlackList')) || [];

            const isBusy = (checkDT) => {
                let [d, t] = checkDT.split(' ');
                let [h, m] = t.split(':').map(Number);
                let currentTotal = h * 60 + m;

                return [...booked, ...blacks].some(bDT => {
                    let [bD, bT] = bDT.split(' ');
                    if (bD !== d) return false;
                    let [bH, bM] = bT.split(':').map(Number);
                    let bookedTotal = bH * 60 + bM;
                    return Math.abs(currentTotal - bookedTotal) < 30;
                });
            };

            if (isBusy(dateTimeKey)) {
                status.innerText = "❌ Это время занято (интервал 30 мин).";
                status.style.color = "red";
                return;
            }

            // --- ФОРМИРОВАНИЕ СООБЩЕНИЯ (ТЕПЕРЬ С КОММЕНТАРИЕМ) ---
            const fullMessage = `<b>✨ Новая запись: Shoira Studio</b>\n\n` +
                `<b>👤 Клиент:</b> ${name}\n` +
                `<b>📞 Тел:</b> <code>${phone}</code>\n` +
                `<b>📅 Дата:</b> ${date}\n` +
                `<b>⏰ Время:</b> ${time}\n` +
                `<b>💅 Услуга:</b> ${service}\n` +
                `<b>💬 Коммент:</b> ${comment}`; // <--- ДОБАВИЛИ ЭТУ СТРОКУ

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
                        status.innerText = "✅ Запись подтверждена!";
                        status.style.color = "gold";
                        form.reset();
                    }
                })
                .catch(err => {
                    status.innerText = "❌ Ошибка сети";
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerText = "ЗАПИСАТЬСЯ К ШОИРЕ";
                });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn-send');
    const phoneInput = document.getElementById('phone');
    const timeSelect = document.getElementById('time');

    // 1. МАГНИТНАЯ КНОПКА (тянется к курсору)
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            // Если курсор близко к кнопке (в радиусе 80px)
            if (Math.abs(x) < 80 && Math.abs(y) < 80) {
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            } else {
                btn.style.transform = `translate(0, 0)`;
            }
        });
    }

    // 2. ГЕНЕРАЦИЯ ВРЕМЕНИ (с 10:00 до 20:00)
    if (timeSelect) {
        for (let h = 10; h <= 20; h++) {
            let opt = document.createElement('option');
            opt.value = `${h}:00`;
            opt.innerHTML = `${h}:00`;
            timeSelect.appendChild(opt);
        }
    }

    // 3. МАСКА ТЕЛЕФОНА
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('7') || val.startsWith('8')) val = val.substring(1);

        let res = '+7 ';
        if (val.length > 0) res += '(' + val.substring(0, 3);
        if (val.length > 3) res += ') ' + val.substring(3, 6);
        if (val.length > 6) res += '-' + val.substring(6, 8);
        if (val.length > 8) res += '-' + val.substring(8, 10);

        e.target.value = val.length === 0 ? '' : res;
    });

    // 4. ЭФФЕКТ "ПУЛЬСАЦИИ" ПРИ КЛИКЕ
    btn.addEventListener('click', function (e) {
        let ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.background = 'rgba(255,255,255,0.5)';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';
        ripple.style.pointerEvents = 'none';

        this.appendChild(ripple);

        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(4)', opacity: 0 }
        ], { duration: 600 });

        setTimeout(() => ripple.remove(), 600);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn-send');
    const phoneInput = document.getElementById('phone');
    const timeSelect = document.getElementById('time');

    // 1. МАГНИТНЫЙ ЭФФЕКТ ДЛЯ КНОПКИ
    if (window.innerWidth > 768) { // Только для ПК
        document.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();

            // Вычисляем центр кнопки
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;

            // Расстояние от курсора до центра кнопки
            const distX = e.clientX - btnX;
            const distY = e.clientY - btnY;

            // Если курсор в радиусе 100px — кнопка тянется
            if (Math.hypot(distX, distY) < 100) {
                btn.style.transform = `translate(${distX * 0.3}px, ${distY * 0.3}px)`;
            } else {
                btn.style.transform = `translate(0, 0)`;
            }
        });
    }

    // 2. АВТО-ГЕНЕРАЦИЯ ВРЕМЕНИ
    if (timeSelect) {
        for (let h = 9; h <= 20; h++) {
            let opt = document.createElement('option');
            opt.value = `${h}:00`;
            opt.innerHTML = `${h}:00`;
            timeSelect.appendChild(opt);
        }
    }

    // 3. МАСКА ТЕЛЕФОНА (удобство для клиента)
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (!x[2]) return e.target.value = x[1] === '7' ? '+7 ' : x[1];
        e.target.value = `+7 (${x[2]}) ${x[3]}${x[4] ? '-' + x[4] : ''}${x[5] ? '-' + x[5] : ''}`;
    });
});

submitBtn.addEventListener('click', function () {   // Имитация загрузки
            this.innerHTML = 'Секундочку...';

            setTimeout(() => {
                this.style.background = '#28a745'; // Зеленый цвет успеха
                this.innerHTML = 'Запись создана! ✨';

                // Маленький прикол: через 3 секунды возвращаем текст
                setTimeout(() => {
                    this.style.background = '#1a1a1a';
                    this.innerHTML = 'Записаться к Шоире';
                }, 3000);
            }, 1500);
        });