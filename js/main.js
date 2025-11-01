// Arquivo principal de inicialização
// Coordena todos os módulos e inicializa a aplicação

// Dados simulados para armazenamento local
let volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
let projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    // Módulo de Navegação
    if (window.NavigationModule) {
        NavigationModule.setupMobileMenu();
        NavigationModule.setupScrollToTop();
        NavigationModule.setupSmoothScroll();
    }
    
    // Módulo de Formulários
    if (window.FormsModule) {
        FormsModule.setupInputMasks();
        FormsModule.setupForms();
    }
    
    // Módulo de Animações
    if (window.AnimationsModule) {
        AnimationsModule.animateStats();
        AnimationsModule.setupScrollAnimations();
        AnimationsModule.setupParallaxEffect();
        AnimationsModule.setupCardHoverEffects();
    }
    
    // Módulo de Projetos
    if (window.ProjectsModule) {
        ProjectsModule.setupProjectFilters();
        ProjectsModule.setupProjectModal();
    }
    
    // Inicialização específica da página
    initializePageSpecific();
}

// Inicialização específica por página
function initializePageSpecific() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            // Página inicial carregada
            break;
        case 'cadastro.html':
            // Página de cadastro carregada
            break;
        case 'projeto.html':
            // Página de projetos carregada
            break;
        case 'admin.html':
            if (typeof initializeAdmin === 'function') {
                initializeAdmin();
            }
            break;
    }
}

// Função utilitária para formatação de telefone (compatibilidade)
function formatPhone(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    event.target.value = value;
}

// Expor função para uso global
window.closeModal = function() {
    if (window.ProjectsModule) {
        ProjectsModule.closeModal();
    }
};

window.scrollToProjects = function() {
    if (window.ProjectsModule) {
        ProjectsModule.scrollToProjects();
    }
};

// Sistema de Voluntários - Aplicação inicializada com sucesso!