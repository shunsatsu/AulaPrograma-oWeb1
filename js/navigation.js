// Módulo de Navegação
// Responsável pelo menu mobile e navegação

// Configuração do menu mobile
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle do menu ao clicar no botão hamburger
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevenir scroll do body quando menu está aberto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Fechar menu ao clicar fora dele
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Fechar menu ao redimensionar a tela
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Configuração do botão voltar ao topo
function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        let ticking = false;
        
        // Função otimizada para scroll com throttling
        function updateScrollButton() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
            ticking = false;
        }
        
        // Mostrar/ocultar botão baseado na rolagem com performance otimizada
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollButton);
                ticking = true;
            }
        }, { passive: true });

        // Scroll suave ao clicar no botão
        scrollToTopBtn.addEventListener('click', () => {
            // Adicionar feedback visual
            scrollToTopBtn.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                scrollToTopBtn.style.transform = '';
            }, 150);
            
            // Scroll para o topo
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Configurar navegação suave
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Exportar funções para uso global
window.NavigationModule = {
    setupMobileMenu,
    setupScrollToTop,
    setupSmoothScroll
};