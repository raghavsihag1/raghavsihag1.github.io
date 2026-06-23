/* ========================================
   RECLAV — Script
   ======================================== */

gsap.registerPlugin(ScrollTrigger);

/* ---- Particle Canvas ---- */
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x  = Math.random() * W;
            this.y  = init ? Math.random() * H : H + 10;
            this.r  = Math.random() * 1.2 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = -(Math.random() * 0.25 + 0.05);
            const palette = ['rgba(31,111,235,', 'rgba(13,191,126,', 'rgba(124,92,252,'];
            this.color = palette[Math.floor(Math.random() * palette.length)];
            this.alpha = Math.random() * 0.5 + 0.15;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    function buildParticles(n) {
        particles = [];
        for (let i = 0; i < n; i++) particles.push(new Particle());
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(31,111,235,${0.07 * (1 - d / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            particles[i].update();
            particles[i].draw();
        }
        animId = requestAnimationFrame(loop);
    }

    resize();
    buildParticles(70);
    loop();
    window.addEventListener('resize', () => { resize(); buildParticles(70); });
})();

/* ---- Navbar scroll state ---- */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ---- Hero entrance animations ---- */
window.addEventListener('DOMContentLoaded', () => {

    // Stagger hero elements
    gsap.timeline()
        .fromTo('.animate-in', {
            y: 40, opacity: 0, filter: 'blur(8px)'
        }, {
            y: 0, opacity: 1, filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.18,
            ease: 'power4.out'
        })
        .fromTo('.dashboard-float', {
            y: 80, opacity: 0, rotateX: 12
        }, {
            y: 0, opacity: 1, rotateX: 4,
            duration: 1.2,
            ease: 'power4.out'
        }, '-=0.5')
        .fromTo('.float-card', {
            scale: 0.85, opacity: 0
        }, {
            scale: 1, opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        }, '-=0.3');

    /* ---- Scroll reveal using IntersectionObserver ---- */
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger children if inside a grid container
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((el, i) => {
        // Add staggered delays for grid siblings
        const parent = el.parentElement;
        const siblings = [...parent.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(el);
        el.dataset.delay = idx * 80;
        io.observe(el);
    });

    /* ---- Animated bar widths ---- */
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => { bar.style.width = targetWidth; }, 200);
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const leakageTable = document.querySelector('.leakage-table');
    if (leakageTable) barObserver.observe(leakageTable);

    /* ---- Ambient orb parallax ---- */
    gsap.to('.orb-1', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 }
    });
    gsap.to('.orb-2', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 }
    });
    gsap.to('.orb-3', {
        xPercent: 15,
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });

    /* ---- Bento grid hover tilt ---- */
    document.querySelectorAll('.bento-item, .stat-card, .kpi-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width  / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            gsap.to(card, {
                rotateY: dx * 4,
                rotateX: -dy * 4,
                transformPerspective: 800,
                ease: 'power2.out',
                duration: 0.4
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
        });
    });

    /* ---- Chart line animation ---- */
    const chartPath = document.querySelector('.chart-svg path:first-of-type');
    if (chartPath) {
        const len = chartPath.getTotalLength();
        gsap.set(chartPath, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({
            trigger: '.dash-window',
            start: 'top 80%',
            onEnter: () => gsap.to(chartPath, { strokeDashoffset: 0, duration: 2, ease: 'power2.out' })
        });
    }
});

/* ---- Waitlist form ---- */
function submitWaitlist() {
    const btn        = document.getElementById('submitBtn');
    const emailInput = document.getElementById('emailInput');
    const hospitalInput = document.getElementById('hospitalInput');
    const msg        = document.getElementById('formMsg');

    const email    = emailInput.value.trim();
    const hospital = hospitalInput ? hospitalInput.value.trim() : '';

    if (!email) return;

    btn.disabled = true;
    const btnSpan = btn.querySelector('span');
    if (btnSpan) btnSpan.textContent = 'Submitting...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        btn.style.opacity    = '1';
        btn.style.background = 'var(--emerald)';
        if (btnSpan) btnSpan.textContent = '✓ Access Requested';

        emailInput.value = '';
        if (hospitalInput) hospitalInput.value = '';

        msg.textContent = hospital
            ? `${hospital} has been added to the private pilot waitlist. We'll be in touch within 48 hours.`
            : "You've been added to the private pilot waitlist. We'll reach out within 48 hours.";
        msg.classList.add('show');

        gsap.fromTo(msg, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });

        setTimeout(() => {
            msg.classList.remove('show');
            btn.style.background = '';
            btn.disabled         = false;
            if (btnSpan) btnSpan.textContent = 'Request Private Pilot Access';
        }, 7000);
    }, 1600);
}

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    const ticker = document.querySelector(".ticker-wrap");

    if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
        ticker.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
        ticker.classList.remove("scrolled");
    }
});