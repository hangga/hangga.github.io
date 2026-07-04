
        // Hamburger toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        // Close menu on link click (mobile)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });

        // Navbar shadow on scroll
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });

        // Smooth anchor scroll
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

        // Reset semua elemen animasi
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

        // Force reflow
        void codeBlock.offsetHeight;

        // Kembalikan animasi typing
        if (typingEl) {
            setTimeout(() => {
            typingEl.classList.add('linetyping');
            typingEl.style.width = '';
            typingEl.style.animation = '';
            typingEl.style.opacity = '';
            }, 30);
        }

        // Kembalikan animasi line dengan jeda bertahap
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

        // Jalankan ulang saat link "Install" diklik
        document.querySelectorAll('a[href="#install"]').forEach(link => {
            link.addEventListener('click', function () {
                setTimeout(replayInstallAnimation, 200);
            });
        });

        document.querySelectorAll('a[href="#features"]').forEach(link => {
            link.addEventListener('click', function () {
                setTimeout(replayInstallAnimation, 200);
            });
        });

        let lastReplayTime = 0;
        document.addEventListener('click', function(e) {
        const installSection = document.getElementById('install');
        if (!installSection) return;

            // Periksa apakah klik terjadi di dalam section .install
            if (installSection.contains(e.target)) {
                const now = Date.now();
                // Beri jeda 1,5 detik agar animasi tidak ke-spam saat klik cepat
                if (now - lastReplayTime > 1500) {
                lastReplayTime = now;
                replayInstallAnimation();
                }
            }
        });