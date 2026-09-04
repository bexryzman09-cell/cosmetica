document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded triggered');
    
    // 1. ГЛОБАЛЬНЫЙ ОБРАБОТЧИК КЛИКОВ
    document.addEventListener('click', (e) => {
        const targetEl = e.target.closest('[data-link], .btn, .btn-main, .btn-outline, .header__btn, .hero__btn, .cta__btn, .info__btn, .features__btn');
        if (!targetEl) return;

        const url = targetEl.getAttribute('data-link');
        let finalUrl = url;

        if (!url) {
            const text = targetEl.textContent.toLowerCase().trim();
            const routes = {
                'узнать больше': 'about.html',
                'подробнее': 'about.html',
                'наши услуги': 'servis.html',
                'смотреть услуги': 'servis.html',
                'записаться': 'contact.html',
                'записаться на приём': 'contact.html'
            };
            finalUrl = routes[text];
        }

        if (targetEl.classList.contains('btn-main')) finalUrl = 'learn.html';
        if (targetEl.classList.contains('btn-outline')) finalUrl = 'servis.html';

        if (finalUrl) {
            e.preventDefault();
            if (finalUrl === 'social.html') {
                window.open(finalUrl, '_blank');
            } else {
                window.location.href = finalUrl;
            }
        }
    });

    // 2. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ========== BEFORE/AFTER MODAL ==========
    const overlay = document.getElementById('beforeAfterFull');
    const track = document.getElementById('baTrack');
    const dotsWrap = document.getElementById('baDots');
    const slides = document.querySelectorAll('.ba-slide');
    let currentSlide = 0;

    if (!overlay || !track || slides.length === 0) {
        console.warn('⚠️ Before/After модалка не найдена на странице');
        console.log('overlay:', overlay);
        console.log('track:', track);
        console.log('slides:', slides.length);
    } else {
        console.log('✅ Модалка найдена. Слайдов:', slides.length);

        // Создаем точки
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'ba-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsWrap.appendChild(dot);
        });
        const dots = document.querySelectorAll('.ba-dot');

        function goToSlide(n) {
            currentSlide = (n + slides.length) % slides.length;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }

        const prevBtn = document.querySelector('.ba-slider__btn.prev');
        const nextBtn = document.querySelector('.ba-slider__btn.next');

        if (prevBtn) prevBtn.onclick = (e) => { e.preventDefault(); goToSlide(currentSlide - 1); };
        if (nextBtn) nextBtn.onclick = (e) => { e.preventDefault(); goToSlide(currentSlide + 1); };

        const closeBtn = document.getElementById('closeFull');
        const closePopup = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('✅ Модалка закрыта');
        };

        if (closeBtn) closeBtn.onclick = closePopup;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });

        // ========== АВТОМАТИЧЕСКОЕ ПОЯВЛЕНИЕ ==========
        const servicesSection = document.querySelector('.services');
        if (servicesSection) {
            const handlePopupScroll = () => {
                if (localStorage.getItem('ba_popup_permanent')) {
                    return;
                }

                const rect = servicesSection.getBoundingClientRect();

                // Появляется когда верхний край секции услуг уходит выше экрана
                if (rect.top < 0) {
                    console.log('🎉 Условие скролла выполнено! Открываем модалку');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    localStorage.setItem('ba_popup_permanent', 'true');
                    window.removeEventListener('scroll', handlePopupScroll);
                }
            };

            window.addEventListener('scroll', handlePopupScroll);
        } else {
            console.warn('⚠️ Секция .services не найдена');
        }
    }

    // 4. ПАРАЛЛАКС И КУРСОР
    const heroImg = document.querySelector('.img-frame img') || document.querySelector('.hero__index img');
    const glow = document.querySelector('.cursor-glow');

    let ticking = false;
    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (heroImg) {
                    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
                    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
                    heroImg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
                }
                if (glow) {
                    glow.style.left = e.clientX + 'px';
                    glow.style.top = e.clientY + 'px';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});

// ========== CAROUSEL (ОТЗЫВЫ) ==========
const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');

if (track && nextBtn && prevBtn) {
    let index = 0;

    function updateCarousel() {
        const cardWidth = document.querySelector('.review-card').offsetWidth + 20;
        track.style.transform = `translateX(${-index * cardWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.review-card');
        if (index < cards.length - 1) {
            index++;
        } else {
            index = 0;
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (index > 0) {
            index--;
        }
        updateCarousel();
    });

    setInterval(() => {
        nextBtn.click();
    }, 5000);
}

// ========== LOADER ==========
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('progress-bar');

    if (!loader || !bar) return;

    if (sessionStorage.getItem('loaderShown')) {
        loader.style.display = 'none';
        return;
    }

    sessionStorage.setItem('loaderShown', 'true');

    let progress = 0;

    const interval = setInterval(function () {
        progress += Math.random() * 18;
        if (progress >= 100) {
            progress = 100;
            bar.style.width = '100%';
            clearInterval(interval);
            setTimeout(function () {
                loader.classList.add('is-hidden');
                setTimeout(function () {
                    loader.style.display = 'none';
                }, 900);
            }, 300);
        } else {
            bar.style.width = progress + '%';
        }
    }, 200);
});

// ========== FOOTER ANIMATION ==========
const footer = document.querySelector('footer');
if (footer) {
    const footerObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) footer.classList.add('in-view'); });
    }, { threshold: 0.1 });
    footerObs.observe(footer);
}
// ========== MOBILE NAV ==========
document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.mobile-nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ========== FAQ ==========
document.querySelectorAll('.faq__q').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        document.querySelectorAll('.faq__item').forEach(other => {
            if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
    });
});

// ========== ROTATE OVERLAY (для мобильных) ==========
window.addEventListener('load', function () {
    const overlay = document.getElementById('rotateOverlay');
    if (overlay && window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches) {
        setTimeout(() => {
            overlay.classList.add('active');
        }, 100);
    }
});

// ========== HEADER SCROLL ANIMATION ==========
const header = document.querySelector('.header');
if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.classList.add('scrolling');
                } else {
                    header.classList.remove('scrolling');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
