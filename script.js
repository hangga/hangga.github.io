// Theme Toggle
// const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

// themeToggle.addEventListener('click', () => {
//     const currentTheme = htmlElement.getAttribute('data-theme');
//     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

//     htmlElement.setAttribute('data-theme', newTheme);
//     localStorage.setItem('theme', newTheme);
// });

// Spotlight effect that follows the cursor
const spotlight = document.querySelector('.spotlight');

document.addEventListener('mousemove', (e) => {
    spotlight.style.opacity = '1';
    spotlight.style.left = e.clientX - 300 + 'px';
    spotlight.style.top = e.clientY - 300 + 'px';
});

document.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
});

// Scroll spy for navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// Smooth scroll for navigation links
// navLinks.forEach(link => {
//     link.addEventListener('click', (e) => {
//         e.preventDefault();
//         const targetId = link.getAttribute('href');
//         const targetSection = document.querySelector(targetId);

//         if (targetSection) {
//             targetSection.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     });
// });

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetSection = document.querySelector(link.getAttribute('href'));

        if (!targetSection) return;

        const start = window.pageYOffset;
        const end = targetSection.offsetTop;
        const duration = 200;
        const startTime = performance.now();

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const eased = easeOutCubic(progress);

            window.scrollTo(0, start + (end - start) * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    });
});

// Add hover effect to experience, project, and writing items
const experienceItems = document.querySelectorAll('.experience-item');
const projectItems = document.querySelectorAll('.project-item');
const writingItems = document.querySelectorAll('.writing-item');
const certificationItems = document.querySelectorAll('.certificating-item');
const teachingItems = document.querySelectorAll('.teaching-item');



function addHoverEffect(items) {
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            items.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.4';
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            items.forEach(otherItem => {
                otherItem.style.opacity = '1';
            });
        });
    });
}

addHoverEffect(experienceItems);
addHoverEffect(projectItems);
addHoverEffect(writingItems);
addHoverEffect(certificationItems)
addHoverEffect(teachingItems)

// Make experience, project, and writing items clickable

certificationItems.forEach(item => {
    item.addEventListener('click', () => {
        const link = item.querySelector('.certificating-link');
        if (link) {
            window.open(link.href, '_blank');
        }
    });
});

experienceItems.forEach(item => {
    item.addEventListener('click', () => {
        const link = item.querySelector('.experience-link');
        if (link) {
            window.open(link.href, '_blank');
        }
    });
});

projectItems.forEach(item => {
    item.addEventListener('click', () => {
        const link = item.querySelector('.project-link');
        if (link) {
            window.open(link.href, '_blank');
        }
    });
});

writingItems.forEach(item => {
    item.addEventListener('click', () => {
        const link = item.querySelector('.writing-link');
        if (link) {
            window.open(link.href, '_blank');
        }
    });
});

teachingItems.forEach(item => {
    item.addEventListener('click', () => {
        const link = item.querySelector('.teaching-link');
        if (link) {
            window.open(link.href, '_blank');
        }
    });
});
