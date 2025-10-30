// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

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
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effect to experience, project, and writing items
const experienceItems = document.querySelectorAll('.experience-item');
const projectItems = document.querySelectorAll('.project-item');
const writingItems = document.querySelectorAll('.writing-item');

function addHoverEffect(items) {
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            items.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.5';
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

// Make experience, project, and writing items clickable
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
