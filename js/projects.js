// Módulo de Projetos
// Responsável pela funcionalidade de filtros e modal de projetos

// Configurar filtros de projetos
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Configurar modal de projetos
function setupProjectModal() {
    const modal = document.getElementById('projectModal');
    const joinButtons = document.querySelectorAll('.project-join');
    const closeBtn = document.querySelector('.close');
    
    if (modal && joinButtons.length > 0) {
        joinButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.getAttribute('data-project');
                const selectedProjectInput = document.getElementById('selectedProject');
                if (selectedProjectInput) {
                    selectedProjectInput.value = projectId;
                }
                modal.style.display = 'block';
            });
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Fechar modal (função auxiliar)
function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Scroll para seção de projetos
function scrollToProjects() {
    const projectsSection = document.querySelector('.projects-container');
    if (projectsSection) {
        projectsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Exportar funções para uso global
window.ProjectsModule = {
    setupProjectFilters,
    setupProjectModal,
    closeModal,
    scrollToProjects
};