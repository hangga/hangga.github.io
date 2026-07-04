    // ===== HAMBURGER TOGGLE =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // ===== NAVBAR SHADOW =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // ===== SMOOTH ANCHOR SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== REPLAY INSTALL ANIMATION =====
    function replayInstallAnimation() {
        const codeBlock = document.querySelector('.install .code-block');
        if (!codeBlock) return;

        const typingEl = codeBlock.querySelector('.linetyping');
        const lineEls = codeBlock.querySelectorAll('.line');

        if (typingEl) {
            typingEl.classList.remove('linetyping');
            typingEl.style.width = '0';
            typingEl.style.animation = 'none';
            typingEl.style.opacity = '1';
        }

        lineEls.forEach(el => {
            el.classList.remove('line');
            el.style.opacity = '0';
            el.style.transform = 'translateY(6px)';
            el.style.animation = 'none';
        });

        void codeBlock.offsetHeight;

        if (typingEl) {
            setTimeout(() => {
                typingEl.classList.add('linetyping');
                typingEl.style.width = '';
                typingEl.style.animation = '';
                typingEl.style.opacity = '';
            }, 30);
        }

        lineEls.forEach((el, index) => {
            const delay = 30 + (index + 1) * 60;
            setTimeout(() => {
                el.classList.add('line');
                el.style.opacity = '';
                el.style.transform = '';
                el.style.animation = '';
            }, delay);
        });
    }

    document.querySelectorAll('a[href="#install"]').forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(replayInstallAnimation, 200);
        });
    });

    document.querySelectorAll('a[href="#features"]').forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(replayInstallAnimation, 200);
        });
    });

    let lastReplayTime = 0;
    document.addEventListener('click', function(e) {
        const installSection = document.getElementById('install');
        if (!installSection) return;
        if (installSection.contains(e.target)) {
            const now = Date.now();
            if (now - lastReplayTime > 1500) {
                lastReplayTime = now;
                replayInstallAnimation();
            }
        }
    });

    // ===== VIDEO: INTERSECTION OBSERVER — PLAY/PAUSE ON VISIBILITY =====
    (function initVideos() {
        const wrappers = document.querySelectorAll('.video-wrapper');

        if (!wrappers.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                const indicator = entry.target.querySelector('.play-indicator');
                if (!video) return;

                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                    if (indicator) indicator.classList.add('is-playing');
                } else {
                    video.pause();
                    if (indicator) indicator.classList.remove('is-playing');
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '0px 0px -40px 0px'
        });

        wrappers.forEach(wrapper => {
            observer.observe(wrapper);

            const video = wrapper.querySelector('video');
            const indicator = wrapper.querySelector('.play-indicator');
            if (video && indicator) {
                video.addEventListener('play', () => {
                    indicator.classList.add('is-playing');
                });
                video.addEventListener('pause', () => {
                    indicator.classList.remove('is-playing');
                });
                video.addEventListener('ended', () => {
                    indicator.classList.remove('is-playing');
                });
            }
        });

        document.addEventListener('click', function() {
            wrappers.forEach(wrapper => {
                const video = wrapper.querySelector('video');
                if (video && video.paused) {
                    video.play().catch(() => {});
                }
            });
        }, { once: false });
    })();