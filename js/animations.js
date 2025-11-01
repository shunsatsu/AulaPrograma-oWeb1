// Módulo de Animações e Efeitos Visuais
// Responsável por animações, estatísticas e efeitos da interface

// Animação das estatísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                animateNumber(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        if (stat.hasAttribute('data-target')) {
            observer.observe(stat);
        }
    });
}

// Animar números das estatísticas
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 segundos
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, stepTime);
}

// Animação de fade-in para elementos ao scroll (otimizada)
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .stat-card, .step');
    
    // Configuração otimizada do Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px' // Otimização para trigger antecipado
    });
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// Efeito parallax suave no hero (otimizado)
function setupParallaxEffect() {
    const heroImages = document.querySelectorAll('.hero-image img, .about-image img');
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = Math.max(-50, Math.min(50, scrolled * -0.1)); // Limitado entre -50px e 50px
        
        heroImages.forEach(image => {
            const rect = image.getBoundingClientRect();
            const container = image.closest('.hero-image, .about-image');
            
            // Só aplicar parallax se a imagem estiver visível e dentro do container
            if (rect.top < window.innerHeight && rect.bottom > 0 && container) {
                image.style.transform = `translate3d(0, ${rate}px, 0)`;
                image.style.position = 'relative';
                image.style.zIndex = '1';
            }
        });
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// Efeito de hover suave nos cards
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .project-card, .contact-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Exportar funções para uso global
window.AnimationsModule = {
    animateStats,
    animateNumber,
    setupScrollAnimations,
    setupParallaxEffect,
    setupCardHoverEffects
};