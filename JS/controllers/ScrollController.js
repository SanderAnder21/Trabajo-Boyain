// JS/controllers/ScrollController.js

/**
 * Controlador para el botón de scroll down.
 * Maneja el desplazamiento suave a secciones de la página.
 * 
 * @class ScrollController
 */
class ScrollController {
    constructor() {
        this.scrollButtons = [];
    }

    /**
     * Inicializa el controlador de scroll.
     */
    init() {
        console.log('🔧 ScrollController: Inicializando');

        this.scrollButtons = document.querySelectorAll('.btn-scroll-down');

        if (this.scrollButtons.length === 0) {
            console.log('ℹ️ No se encontraron botones de scroll');
            return;
        }

        this.setupEventListeners();

        console.log(`✅ ScrollController inicializado con ${this.scrollButtons.length} botón(es)`);
    }

    /**
     * Configura los event listeners para los botones de scroll.
     * @private
     */
    setupEventListeners() {
        this.scrollButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleScroll(e));
        });
    }

    /**
     * Maneja el evento de click en el botón de scroll.
     * @param {Event} e - Evento de click
     * @private
     */
    handleScroll(e) {
        e.preventDefault();

        const targetId = e.currentTarget.getAttribute('href');

        if (!targetId) {
            console.warn('⚠️ No se encontró el atributo href en el botón');
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (!targetElement) {
            console.warn(`⚠️ No se encontró el elemento con id: ${targetId}`);
            return;
        }

        this.scrollToElement(targetElement);
    }

    /**
     * Realiza el scroll suave hacia el elemento objetivo.
     * @param {HTMLElement} element - Elemento al que hacer scroll
     * @private
     */
    scrollToElement(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const scrollController = new ScrollController();
    scrollController.init();
});

export default ScrollController;
