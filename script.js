// Firebase SDK is loaded via CDN scripts in HTML. Configuration is provided via global window.firebaseConfig.

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Navigation & Header Styling
    // ==========================================================================
    const header = document.getElementById('header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const body = document.body;

    // Add visual class to header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile nav toggle click handler
    mobileNavToggle.addEventListener('click', () => {
        const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
        mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        primaryNav.classList.toggle('active');
        body.classList.toggle('mobile-nav-active');
    });

    // Close mobile nav when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('active');
            body.classList.remove('mobile-nav-active');
        });
    });

    // Close mobile nav when clicking outside of menu
    document.addEventListener('click', (e) => {
        if (!primaryNav.contains(e.target) && !mobileNavToggle.contains(e.target) && primaryNav.classList.contains('active')) {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('active');
            body.classList.remove('mobile-nav-active');
        }
    });


    // ==========================================================================
    // Typewriter Animation
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        " Entrepreneurial Technologist.",
        " Developer & Designer.",
        " B.Tech CSE Student.",
        " Problem Solver."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            // Remove character
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            // Add character
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle word completions and deletions
        if (!isDeleting && charIndex === currentWord.length) {
            // Word complete, wait before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter if element exists
    if (typewriterElement) {
        setTimeout(type, 1000);
    }


    // ==========================================================================
    // Intersection Observer for Scroll Reveals
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15, // Reveal when 15% of element is in viewport
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });


    // ==========================================================================
    // Back to Top Button
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ==========================================================================
    // Active Navigation Link on Scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Offset for navbar
            const sectionId = current.getAttribute('id');

            // Query matches navbar link corresponding to this section
            const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active-nav-item');
                    // Styling for active state in JS (custom styling in header)
                    link.style.color = '#ffffff';
                } else {
                    link.classList.remove('active-nav-item');
                    link.style.color = ''; // Reset to default CSS value
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial call

    // ==========================================================================
    // Contact Form Submission (mailto fallback)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const submitBtn = contactForm.querySelector('.form-submit');
            const originalBtnText = submitBtn.innerHTML;

            // Build mailto URL
            const emailBody = `Hi Raghav,%0A%0AYou have received a new message from your portfolio website contact form:%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
            const mailtoUrl = `mailto:rgvsihag@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;

            // Show temporary status
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Opening email...';

            window.location.href = mailtoUrl;

            // Show success placeholder
            const wrapper = contactForm.parentElement;
            wrapper.innerHTML = `
                <div class="form-success-message">
                    <i class="fa-solid fa-circle-check"></i>
                    <h3>Email Client Opened!</h3>
                    <p>Please hit "Send" in your email client to deliver the message to Raghav.</p>
                </div>
            `;
        });
    }
});
