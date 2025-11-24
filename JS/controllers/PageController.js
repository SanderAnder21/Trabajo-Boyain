import { DOMUtils } from '../utils/DOMUtils.js';

/**
 * Controlador de Página Base
 * Maneja funcionalidades comunes de todas las páginas
 */
export class PageController {
    constructor(authService) {
        this.authService = authService;
    }

    init() {
        console.log('🎯 PageController inicializado');
        this.setupTabs();
        this.setupForms();
    }

    setupTabs() {
        const tabLinks = DOMUtils.querySelectorAll('.tab-link');
        
        if (tabLinks.length === 0) return;
        
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target);
            });
        });
    }

    switchTab(clickedTab) {
        // Remover clase active de todos los tabs
        const allTabs = DOMUtils.querySelectorAll('.tab-link');
        const allContent = DOMUtils.querySelectorAll('.tab-content');
        
        allTabs.forEach(tab => DOMUtils.removeClass(tab, 'active'));
        allContent.forEach(content => {
            DOMUtils.removeClass(content, 'active');
            content.style.display = 'none';
        });
        
        // Activar tab clickeado
        DOMUtils.addClass(clickedTab, 'active');
        
        // Mostrar contenido correspondiente
        const targetId = clickedTab.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (targetId) {
            const targetContent = DOMUtils.getElementById(targetId);
            if (targetContent) {
                DOMUtils.addClass(targetContent, 'active');
                targetContent.style.display = 'block';
            }
        }
    }

    setupForms() {
        // Configurar validación básica de formularios
        const forms = DOMUtils.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }

    showLoading(message = 'Cargando...') {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = DOMUtils.querySelector('.loading-overlay');
        if (loading) {
            loading.remove();
        }
    }

    showError(message) {
        alert(message);
    }

    showSuccess(message) {
        alert(message);
    }
}