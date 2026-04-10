document.addEventListener('DOMContentLoaded', function () {
    // Mobile hamburger menu toggle
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', function () {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x');
        });

        // Close menu after clicking a nav link
        navbar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
            });
        });
    }

    const targets = document.querySelectorAll(
        '.experience-item, .project-item, .skill-icon, .service'
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

    // Double rAF: let browser render the opacity:0 state first,
    // then start observing so the transition is actually visible
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            targets.forEach(el => observer.observe(el));
        });
    });
});
