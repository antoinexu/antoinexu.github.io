document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', function () {
            const isOpen = navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x');
            menuIcon.setAttribute('aria-expanded', String(isOpen));
        });

        navbar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
                menuIcon.setAttribute('aria-expanded', 'false');
            });
        });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const targets = document.querySelectorAll(
        '.experience-item, .experience-tags, .project-item, .skill-category, .metric-card'
    );

    targets.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            targets.forEach(el => observer.observe(el));
        });
    });
});
