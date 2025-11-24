export class UIService {
    constructor() {
        this.navbar = document.querySelector('.nav');
    }

    /**
     * Inicializa el efecto de scroll en el menú
     */
    setupScrollBehavior() {
        if (!this.navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('active');
            } else {
                this.navbar.classList.remove('active');
            }
        });
    }

    /**
     * Utilidad para mostrar/ocultar elementos
     */
    toggleElement(elementId, show) {
        const el = document.getElementById(elementId);
        if (el) {
            el.style.display = show ? 'block' : 'none';
        }
    }
}