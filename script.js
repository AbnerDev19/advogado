document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);

    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }

            const headerOffset = header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset + 1;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
});
