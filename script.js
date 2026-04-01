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

    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealItems.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }

    // ==========================================
    // Lógica do Tema Claro/Escuro (Dark Mode Toggle)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootHtml = document.documentElement; // Pega a tag <html>

    if (themeToggleBtn) {
        // Verifica se há um tema salvo no LocalStorage
        const savedTheme = localStorage.getItem('adv_theme');
        
        // Verifica a preferência do sistema operacional
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

        // Aplica o tema claro se salvo, ou se for a preferência do sistema (e nada foi salvo)
        if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
            rootHtml.setAttribute('data-theme', 'light');
        }

        // Evento de clique no botão
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = rootHtml.getAttribute('data-theme');
            let targetTheme = 'light';

            if (currentTheme === 'light') {
                targetTheme = 'dark';
                rootHtml.removeAttribute('data-theme'); // Remove para voltar ao Dark (padrão)
            } else {
                rootHtml.setAttribute('data-theme', 'light');
            }

            // Salva a escolha no navegador do usuário
            localStorage.setItem('adv_theme', targetTheme);
        });
    }
});