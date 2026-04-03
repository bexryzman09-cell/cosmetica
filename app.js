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

document.addEventListener('DOMContentLoaded', () => {

    // === 1. ЗАЩИТА ОТ КОПИРОВАНИЯ И ПРОСМОТРА ===

    // // Блокировка правой кнопки мыши
    document.addEventListener('contextmenu', e => e.preventDefault());

    // // // Блокировка клавиш (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+S, Ctrl+C)
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
document.addEventListener('DOMContentLoaded', () => {
    const learnBtn = document.querySelector('.btn-main');

    if (learnBtn) {
        learnBtn.addEventListener('click', () => {
            // Плавный переход на страницу learn.html
            window.location.href = 'learn.html';
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Кнопка "Узнать больше" (уже делали ранее)
    const learnBtn = document.querySelector('.btn-main');
    if (learnBtn) {
        learnBtn.addEventListener('click', () => {
            window.location.href = 'learn.html';
        });
    }

    // Кнопка "Смотреть услуги"
    const servicesBtn = document.querySelector('.btn-outline');
    if (servicesBtn) {
        servicesBtn.addEventListener('click', () => {
            window.location.href = 'servis.html';
        });
    }
});
// Функция для появления элементов при скролле
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150; // Высота, при которой элемент начинает появляться

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

// Запуск при скролле
window.addEventListener("scroll", reveal);

// Запуск один раз при загрузке, чтобы проверить видимые элементы
window.addEventListener("load", reveal);

// Бонус: Плавная прокрутка для ссылок (уже есть в CSS, но это подстраховка)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});















document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('beforeAfterFull');
    const closeBtn = document.getElementById('closeFull');
    const servicesSection = document.querySelector('.services');

    // ПРОВЕРКА: Если уже видели — удаляем обработчики сразу
    if (localStorage.getItem('ba_popup_permanent')) {
        if (overlay) overlay.remove(); // Вообще удаляем из DOM, чтоб не мешал
        return;
    }

    // 1. Логика слайдера
    const slides = document.querySelectorAll('.ba-slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        const showSlide = (n) => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        if (prevBtn) prevBtn.onclick = (e) => { e.preventDefault(); showSlide(currentSlide - 1); };
        if (nextBtn) nextBtn.onclick = (e) => { e.preventDefault(); showSlide(currentSlide + 1); };
    }

    // 2. Появление при скролле (строго 1 раз за все время)
    const handleScroll = () => {
        if (servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            // Если прокрутили секцию услуг
            if (rect.bottom < 0) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                // ЗАПИСЫВАЕМ НАВСЕГДА
                localStorage.setItem('ba_popup_permanent', 'true');

                // Перестаем следить за скроллом
                window.removeEventListener('scroll', handleScroll);
            }
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 3. Закрытие
    const closePopup = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.onclick = closePopup;
    if (overlay) {
        overlay.onclick = (e) => {
            if (e.target === overlay) closePopup();
        };
    }
});






// 1. Слежение блика за мышью
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// 2. Эффект параллакса для главного фото
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    const img = document.querySelector('.img-frame img');
    if (img) {
        img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
    }
});

// 3. Плавное появление элементов при скролле (Observer API)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});


// Добавьте CSS для active
// .reveal { opacity: 0; transform: translateY(30px); transition: 1s all ease; }
// .reveal.active { opacity: 1; transform: translateY(0); }




