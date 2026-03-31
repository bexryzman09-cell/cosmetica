document.addEventListener('DOMContentLoaded', () => {
    // Выбираем все элементы с атрибутом data-link
    const navElements = document.querySelectorAll('[data-link]');

    navElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault(); // Отменяем стандартный переход

            const target = el.getAttribute('data-link');

            if (target === 'social.html') {
                // ОТКРЫВАЕМ В НОВОЙ ВКЛАДКЕ
                // '_blank' — это команда открыть в новом окне
                window.open(target, '_blank');
            } else if (target) {
                // ОТКРЫВАЕМ В ТОЙ ЖЕ ВКЛАДКЕ
                window.location.href = target;
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Выбираем все элементы с атрибутом data-link
    const links = document.querySelectorAll('[data-link]');

    links.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const url = item.getAttribute('data-link');

            if (!url) return;

            // Логика переходов
            if (url === 'social.html') {
                // Соцсети — открываем в новом окне
                window.open(url, '_blank');
            } else {
                // Остальные страницы — переходим в этом же окне
                window.location.href = url;
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {

    // 1. Находим все кнопки на странице
    const allButtons = document.querySelectorAll('.btn');

    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent.toLowerCase().trim();

            // 2. Логика переходов в зависимости от текста кнопки

            // Переход на about.html
            if (buttonText === 'узнать больше' || buttonText === 'подробнее') {
                window.location.href = 'about.html';
            }

            // Переход на servis.html
            else if (buttonText === 'наши услуги' || buttonText === 'смотреть услуги') {
                window.location.href = 'servis.html';
            }

            // Переход на contact.html
            else if (buttonText === 'записаться на приём' || buttonText === 'записаться') {
                window.location.href = 'contact.html';
            }
        });
    });

});