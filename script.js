document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initMenuTabs();
    initHorizontalScroll();
    initTestimonialSlider();
    initMagneticButtons();
    initSmoothAnchors();
    initParallax();
    initBackToTop();
    initFormEffects();
});

/* ===== PRELOADER ===== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const bar = document.querySelector('.preloader-bar');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 18 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bar.style.width = '100%';
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.remove('no-scroll');
                setTimeout(animateHero, 400);
            }, 500);
        } else {
            bar.style.width = progress + '%';
        }
    }, 120);

    document.body.classList.add('no-scroll');
}

function animateHero() {
    const lines = document.querySelectorAll('.hero-title .line-inner');
    lines.forEach((line, i) => {
        setTimeout(() => {
            line.style.transform = 'translateY(0)';
            line.style.opacity = '1';
        }, i * 180);
    });

    const delay = lines.length * 180 + 300;
    setTimeout(() => {
        document.querySelector('.hero-badge')?.classList.add('revealed');
    }, delay);
    setTimeout(() => {
        document.querySelector('.hero-subtitle')?.classList.add('revealed');
    }, delay + 150);
    setTimeout(() => {
        document.querySelector('.hero-cta')?.classList.add('revealed');
    }, delay + 300);
    setTimeout(() => {
        document.querySelector('.hero-scroll')?.classList.add('revealed');
    }, delay + 600);
}

/* ===== CUSTOM CURSOR ===== */
function initCursor() {
    if (window.innerWidth < 768) return;

    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let fx = 0, fy = 0;
    let visible = false;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!visible) {
            visible = true;
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        visible = false;
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });

    function tick() {
        cx += (mx - cx) * 0.45;
        cy += (my - cy) * 0.45;
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        cursor.style.transform = `translate(${cx}px, ${cy}px)`;
        follower.style.transform = `translate(${fx}px, ${fy}px)`;
        requestAnimationFrame(tick);
    }
    tick();

    cursor.style.opacity = '0';
    follower.style.opacity = '0';

    const hoverEls = 'a, button, .menu-card, .gallery-item, input, textarea';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverEls)) {
            cursor.classList.add('cursor-hover');
            follower.classList.add('cursor-hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverEls)) {
            cursor.classList.remove('cursor-hover');
            follower.classList.remove('cursor-hover');
        }
    });
}

/* ===== NAVIGATION ===== */
function initNavigation() {
    const nav = document.getElementById('navbar');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('active');
        links.classList.toggle('open', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => el.classList.add('revealed'), delay);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-image').forEach(el => observer.observe(el));

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.menu-card[style=""], .menu-card:not([style])');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('revealed'), i * 100);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    const menuGrid = document.querySelector('.menu-grid');
    if (menuGrid) cardObserver.observe(menuGrid);
}

/* ===== COUNTERS ===== */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ===== MENU TABS ===== */
function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const cards = document.querySelectorAll('.menu-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            cards.forEach(card => card.classList.remove('revealed'));

            setTimeout(() => {
                cards.forEach(card => {
                    card.style.display = card.dataset.category === cat ? '' : 'none';
                });

                requestAnimationFrame(() => {
                    const visible = document.querySelectorAll(`.menu-card[data-category="${cat}"]`);
                    visible.forEach((card, i) => {
                        setTimeout(() => card.classList.add('revealed'), i * 80);
                    });
                });
            }, 250);
        });
    });

    requestAnimationFrame(() => {
        cards.forEach(card => {
            if (card.dataset.category === 'espresso') {
                card.classList.add('revealed');
            }
        });
    });
}

/* ===== HORIZONTAL SCROLL ===== */
function initHorizontalScroll() {
    const container = document.querySelector('.gallery-scroll-container');
    const track = document.querySelector('.gallery-track');
    if (!container || !track) return;

    function onScroll() {
        const rect = container.getBoundingClientRect();
        const scrollRange = container.offsetHeight - window.innerHeight;
        if (scrollRange <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
        const maxTranslate = track.scrollWidth - window.innerWidth + 80;
        track.style.transform = `translateX(-${progress * maxTranslate}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
}

/* ===== TESTIMONIAL SLIDER ===== */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    if (!testimonials.length || !dotsContainer) return;

    let current = 0;
    let autoTimer;

    testimonials.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(idx) {
        testimonials[current].classList.remove('active');
        dotsContainer.children[current].classList.remove('active');
        current = (idx + testimonials.length) % testimonials.length;
        testimonials[current].classList.add('active');
        dotsContainer.children[current].classList.add('active');
        resetAuto();
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 6000);
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    resetAuto();
}

/* ===== MAGNETIC BUTTONS ===== */
function initMagneticButtons() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transition = 'none';
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* ===== SMOOTH ANCHORS ===== */
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* ===== PARALLAX ===== */
function initParallax() {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.25}px)`;
                    hero.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== FORM EFFECTS ===== */
function initFormEffects() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Reserved!';
        btn.style.background = '#2d4a2a';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            form.reset();
        }, 2500);
    });

    const newsletter = document.querySelector('.footer-newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletter.querySelector('input');
            const val = input.value;
            input.value = 'Subscribed!';
            input.style.color = 'var(--accent)';
            setTimeout(() => {
                input.value = '';
                input.style.color = '';
            }, 2500);
        });
    }
}
