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