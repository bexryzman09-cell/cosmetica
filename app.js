// document.addEventListener('DOMContentLoaded', () => {
//     // Выбираем все элементы с атрибутом data-link
//     const navElements = document.querySelectorAll('[data-link]');

//     navElements.forEach(el => {
//         el.addEventListener('click', (e) => {
//             e.preventDefault(); // Отменяем стандартный переход

//             const target = el.getAttribute('data-link');

//             if (target === 'social.html') {
//                 // ОТКРЫВАЕМ В НОВОЙ ВКЛАДКЕ
//                 // '_blank' — это команда открыть в новом окне
//                 window.open(target, '_blank');
//             } else if (target) {
//                 // ОТКРЫВАЕМ В ТОЙ ЖЕ ВКЛАДКЕ
//                 window.location.href = target;
//             }
//         });
//     });
// });
// document.addEventListener('DOMContentLoaded', () => {
//     // Выбираем все элементы с атрибутом data-link
//     const links = document.querySelectorAll('[data-link]');

//     links.forEach(item => {
//         item.addEventListener('click', (e) => {
//             e.preventDefault();
//             const url = item.getAttribute('data-link');

//             if (!url) return;

//             // Логика переходов
//             if (url === 'social.html') {
//                 // Соцсети — открываем в новом окне
//                 window.open(url, '_blank');
//             } else {
//                 // Остальные страницы — переходим в этом же окне
//                 window.location.href = url;
//             }
//         });
//     });
// });
// document.addEventListener('DOMContentLoaded', () => {

//     // 1. Находим все кнопки на странице
//     const allButtons = document.querySelectorAll('.btn');

//     allButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const buttonText = button.textContent.toLowerCase().trim();

//             // 2. Логика переходов в зависимости от текста кнопки

//             // Переход на about.html
//             if (buttonText === 'узнать больше' || buttonText === 'подробнее') {
//                 window.location.href = 'about.html';
//             }

//             // Переход на servis.html
//             else if (buttonText === 'наши услуги' || buttonText === 'смотреть услуги') {
//                 window.location.href = 'servis.html';
//             }

//             // Переход на contact.html
//             else if (buttonText === 'записаться на приём' || buttonText === 'записаться') {
//                 window.location.href = 'contact.html';
//             }
//         });
//     });

// });

document.addEventListener('DOMContentLoaded', () => {

    // === 1. ЗАЩИТА ОТ КОПИРОВАНИЯ И ПРОСМОТРА ===

    // Блокировка правой кнопки мыши
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Блокировка клавиш (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+S, Ctrl+C)
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c'))
        ) {
            e.preventDefault();
            return false;
        }
    });

    // Запрет выделения текста
    document.addEventListener('selectstart', e => e.preventDefault());

    // Ловушка для консоли (Debugger)
    setInterval(() => {
        (function () {
            (function a() {
                try {
                    (function b(i) {
                        if (String(i / i).length !== 1 || i % 20 === 0) {
                            (function () { }).constructor('debugger')();
                        } else {
                            debugger;
                        }
                        b(++i);
                    })(0);
                } catch (e) {
                    setTimeout(a, 50);
                }
            })();
        })();
    }, 1000); // Запуск раз в секунду, чтобы не вешать браузер намертво


    // === 2. ЛОГИКА ПЕРЕХОДОВ (Твой код) ===

    // Обработка элементов с data-link
    const navElements = document.querySelectorAll('[data-link]');
    navElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.getAttribute('data-link');
            if (!target) return;

            if (target === 'social.html') {
                window.open(target, '_blank');
            } else {
                window.location.href = target;
            }
        });
    });

    // Обработка кнопок по тексту (.btn)
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent.toLowerCase().trim();

            if (buttonText === 'узнать больше' || buttonText === 'подробнее') {
                window.location.href = 'about.html';
            }
            else if (buttonText === 'наши услуги' || buttonText === 'смотреть услуги') {
                window.location.href = 'servis.html';
            }
            else if (buttonText === 'записаться на приём' || buttonText === 'записаться') {
                window.location.href = 'contact.html';
            }
        });
    });
});