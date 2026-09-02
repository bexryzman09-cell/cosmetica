/**
 * Премиальная логика бесшовной карусели
 */
class TechCarousel {
    constructor(containerId, trackId) {
        this.container = document.getElementById(containerId);
        this.track = document.getElementById(trackId);
        this.cards = Array.from(this.track.children);

        this.speed = 0.8; // Базовая скорость (пикселей за кадр)
        this.currentX = 0;
        this.isPaused = false;

        this.init();
    }

    init() {
        // 1. Клонируем элементы для создания эффекта бесконечности
        this.cloneCards();

        // 2. Слушатели событий для паузы
        this.container.addEventListener('mouseenter', () => this.isPaused = true);
        this.container.addEventListener('mouseleave', () => this.isPaused = false);

        // 3. Обработка изменения размера окна (респавн расчетов)
        window.addEventListener('resize', () => this.resetPosition());

        // 4. Запуск цикла анимации
        this.animate();
    }

    cloneCards() {
        // Клонируем все карточки и добавляем в конец трека
        this.cards.forEach(card => {
            const clone = card.cloneNode(true);
            this.track.appendChild(clone);
        });
    }

    resetPosition() {
        // Если при ресайзе мы вылетели за границы, сбрасываем в 0
        const halfWidth = this.track.scrollWidth / 2;
        if (Math.abs(this.currentX) >= halfWidth) {
            this.currentX = 0;
        }
    }

    animate() {
        if (!this.isPaused) {
            this.currentX -= this.speed;

            // Вычисляем ширину оригинального контента (половина общего трека)
            const halfWidth = this.track.scrollWidth / 2;

            // Если прокрутили всю первую половину — мгновенно прыгаем в начало
            // Пользователь этого не заметит, так как контент идентичен
            if (Math.abs(this.currentX) >= halfWidth) {
                this.currentX = 0;
            }

            // Используем translate3d для аппаратного ускорения (GPU)
            this.track.style.transform = `translate3d(${this.currentX}px, 0, 0)`;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Передаем ID контейнера и ID трека из вашего HTML
    new TechCarousel('techCarousel', 'track');
});