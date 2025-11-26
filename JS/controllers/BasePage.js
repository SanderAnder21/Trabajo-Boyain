

/**
 * Clase base para controladores de página.
 * Proporciona funcionalidad común para todos los controladores.
 */
export class BasePage {
    constructor(authService, uiService) {
        this.authService = authService;
        this.uiService = uiService;
    }

    /**
     * Método de inicialización que debe ser sobrescrito por las clases hijas.
     */
    async init() {
        throw new Error('El método init() debe ser implementado por la clase hija');
    }
}
