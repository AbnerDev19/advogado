document.addEventListener('DOMContentLoaded', () => {
    // Definir o ano atual automaticamente no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

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
    // Lógica do Tema Claro/Escuro (Claro por Padrão)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootHtml = document.documentElement; // Pega a tag <html>

    if (themeToggleBtn) {
        // Verifica se há um tema salvo no LocalStorage
        const savedTheme = localStorage.getItem('adv_theme');
        
        // Força o tema Claro por padrão. Só não aplica se o utilizador já salvou expressamente como 'dark'.
        if (savedTheme === 'dark') {
            rootHtml.removeAttribute('data-theme'); // Deixa no escuro (padrão nativo do CSS)
        } else {
            rootHtml.setAttribute('data-theme', 'light'); // Aplica o claro
        }

        // Evento de clique no botão de troca
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyLight = rootHtml.getAttribute('data-theme') === 'light';

            if (isCurrentlyLight) {
                // Muda para Escuro
                rootHtml.removeAttribute('data-theme');
                localStorage.setItem('adv_theme', 'dark');
            } else {
                // Muda para Claro
                rootHtml.setAttribute('data-theme', 'light');
                localStorage.setItem('adv_theme', 'light');
            }
        });
    }
});
// ==========================================
    // Lógica do Formulário de Contato (CRM)
    // ==========================================
    const leadForm = document.getElementById('lead-form');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btnSubmit = leadForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;

            // Coleta dos dados para estruturação no banco de dados (ex: Firebase Firestore)
            const leadData = {
                nome: document.getElementById('client-name').value,
                contato: document.getElementById('client-contact').value,
                motivo: document.getElementById('client-reason').value,
                status: 'pendente', // Status inicial para o CRM (pendente, em andamento, concluido)
                data_criacao: new Date().toISOString()
            };

            // Simulação de requisição
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Processando...';

            console.log('Payload preparado para envio ao banco de dados:', leadData);

            setTimeout(() => {
                alert('Solicitação recebida com sucesso. A equipe retornará em breve.');
                leadForm.reset();
                btnSubmit.disabled = false;
                btnSubmit.textContent = originalText;
            }, 1200);
        });
    }
