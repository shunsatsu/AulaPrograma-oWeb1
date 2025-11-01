// Módulo de Acessibilidade WCAG 2.1 AA
// Funcionalidades: navegação por teclado, modo escuro, alto contraste, controle de fonte

// Variáveis globais
let fontSize = 16;
let isHighContrast = false;
let isDarkMode = false;

// Inicializar funcionalidades de acessibilidade
function initAccessibility() {
    setupAccessibilityControls();
    setupKeyboardNavigation();
    loadAccessibilityPreferences();
    setupFocusManagement();
    announceToScreenReader('Página carregada. Use Tab para navegar ou pressione Alt+A para controles de acessibilidade.');
}

// Configurar controles de acessibilidade
function setupAccessibilityControls() {
    const toggleButton = document.querySelector('.accessibility-toggle');
    const controlsPanel = document.querySelector('.accessibility-controls');
    
    if (toggleButton && controlsPanel) {
        toggleButton.addEventListener('click', () => {
            const isVisible = controlsPanel.classList.contains('show');
            controlsPanel.classList.toggle('show');
            toggleButton.setAttribute('aria-expanded', !isVisible);
            
            if (!isVisible) {
                announceToScreenReader('Painel de acessibilidade aberto');
                controlsPanel.querySelector('button').focus();
            }
        });
        
        // Fechar painel com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && controlsPanel.classList.contains('show')) {
                controlsPanel.classList.remove('show');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.focus();
            }
        });
        
        // Atalho Alt+A para abrir controles
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                toggleButton.click();
            }
        });
    }
}

// Modo escuro
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Salvar preferência
    localStorage.setItem('accessibility-dark-mode', isDarkMode);
    
    // Anunciar mudança
    announceToScreenReader(isDarkMode ? 'Modo escuro ativado' : 'Modo escuro desativado');
}

// Alto contraste
function toggleHighContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
    
    // Salvar preferência
    localStorage.setItem('accessibility-high-contrast', isHighContrast);
    
    // Anunciar mudança
    announceToScreenReader(isHighContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
}

// Aumentar fonte
function increaseFontSize() {
    if (fontSize < 24) {
        fontSize += 2;
        document.documentElement.style.fontSize = fontSize + 'px';
        localStorage.setItem('accessibility-font-size', fontSize);
        announceToScreenReader(`Fonte aumentada para ${fontSize} pixels`);
    }
}

// Diminuir fonte
function decreaseFontSize() {
    if (fontSize > 12) {
        fontSize -= 2;
        document.documentElement.style.fontSize = fontSize + 'px';
        localStorage.setItem('accessibility-font-size', fontSize);
        announceToScreenReader(`Fonte diminuída para ${fontSize} pixels`);
    }
}

// Carregar preferências salvas
function loadAccessibilityPreferences() {
    // Carregar modo escuro
    const savedDarkMode = localStorage.getItem('accessibility-dark-mode');
    if (savedDarkMode === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
    
    // Carregar alto contraste
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    if (savedHighContrast === 'true') {
        isHighContrast = true;
        document.body.classList.add('high-contrast');
    }
    
    // Carregar tamanho da fonte
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    if (savedFontSize) {
        fontSize = parseInt(savedFontSize);
        document.documentElement.style.fontSize = fontSize + 'px';
    }
}

// Configurar navegação por teclado
function setupKeyboardNavigation() {
    // Navegação por teclas
    document.addEventListener('keydown', (e) => {
        // H - Ir para próximo heading
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            navigateToNextHeading();
        }
        
        // L - Ir para próximo link
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            navigateToNextLink();
        }
        
        // B - Ir para próximo botão
        if (e.altKey && e.key === 'b') {
            e.preventDefault();
            navigateToNextButton();
        }
        
        // M - Ir para main content
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                announceToScreenReader('Navegado para conteúdo principal');
            }
        }
    });
    
    // Melhorar navegação em menu mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Focar primeiro item do menu quando abrir
                setTimeout(() => {
                    const firstLink = navMenu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }, 100);
            }
        });
        
        // Navegação por setas no menu
        navMenu.addEventListener('keydown', (e) => {
            const links = navMenu.querySelectorAll('a');
            const currentIndex = Array.from(links).indexOf(document.activeElement);
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % links.length;
                links[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
                links[prevIndex].focus();
            }
        });
    }
}

// Navegação para próximo heading
function navigateToNextHeading() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const currentFocus = document.activeElement;
    
    let nextHeading = headings[0]; // Padrão para primeiro heading
    
    for (let i = 0; i < headings.length; i++) {
        if (headings[i] === currentFocus && i < headings.length - 1) {
            nextHeading = headings[i + 1];
            break;
        }
    }
    
    if (nextHeading) {
        nextHeading.setAttribute('tabindex', '-1');
        nextHeading.focus();
        announceToScreenReader(`Heading nível ${nextHeading.tagName.charAt(1)}: ${nextHeading.textContent}`);
    }
}

// Navegação para próximo link
function navigateToNextLink() {
    const links = document.querySelectorAll('a[href]');
    const currentFocus = document.activeElement;
    
    let nextLink = links[0];
    
    for (let i = 0; i < links.length; i++) {
        if (links[i] === currentFocus && i < links.length - 1) {
            nextLink = links[i + 1];
            break;
        }
    }
    
    if (nextLink) {
        nextLink.focus();
        announceToScreenReader(`Link: ${nextLink.textContent || nextLink.getAttribute('aria-label')}`);
    }
}

// Navegação para próximo botão
function navigateToNextButton() {
    const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
    const currentFocus = document.activeElement;
    
    let nextButton = buttons[0];
    
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i] === currentFocus && i < buttons.length - 1) {
            nextButton = buttons[i + 1];
            break;
        }
    }
    
    if (nextButton) {
        nextButton.focus();
        announceToScreenReader(`Botão: ${nextButton.textContent || nextButton.getAttribute('aria-label')}`);
    }
}

// Gerenciar foco
function setupFocusManagement() {
    // Garantir que elementos com role sejam focáveis
    document.querySelectorAll('[role="button"], [role="menuitem"]').forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });
    
    // Trap focus em modais
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                trapFocus(e, modal);
            }
        });
    });
}

// Função para "prender" foco em um container (modal, menu, etc.)
function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

// Anunciar informações para leitores de tela
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remover depois de 1 segundo
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Validar contraste de cores (utilitário para desenvolvimento)
function checkColorContrast(foreground, background) {
    // Converter cores hex para RGB
    const getRGB = hex => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return [r, g, b];
    };
    
    // Calcular luminância relativa
    const getLuminance = rgb => {
        const [r, g, b] = rgb.map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const fgLum = getLuminance(getRGB(foreground));
    const bgLum = getLuminance(getRGB(background));
    
    const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
    
    return {
        ratio: ratio.toFixed(2),
        AA: ratio >= 4.5,
        AAA: ratio >= 7
    };
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    initAccessibility();
}

// Exportar para uso global
window.toggleDarkMode = toggleDarkMode;
window.toggleHighContrast = toggleHighContrast;
window.increaseFontSize = increaseFontSize;
window.decreaseFontSize = decreaseFontSize;
window.announceToScreenReader = announceToScreenReader;