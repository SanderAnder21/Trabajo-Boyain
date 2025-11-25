// JS/controllers/MisProyectosController.js

import { BasePage } from './BasePage.js';
import FavoritesController from './FavoritesController.js';

/**
 * Controlador para la página Mis Proyectos.
 * Maneja la visualización de proyectos publicados y guardados (favoritos).
 */
export class MisProyectosController extends BasePage {

    constructor(authService, uiService) {
        super(authService, uiService);
        this.favoritesController = new FavoritesController();
    }

    async init() {
        // Verificar autenticación
        if (!this.authService.isAuthenticated()) {
            this.uiService.redirect('IniciarSesion.html');
            return;
        }

        this.setupTabs();
        await this.loadMyProjects();
        await this.loadFavorites();
    }

    setupTabs() {
        // Lógica de pestañas (reemplaza la función global openTab si es necesario, 
        // o se integra con ella si ya existe en el HTML)
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.openTab(e, tabName);
            });
        });
    }

    openTab(evt, tabName) {
        // Ocultar todos los contenidos
        const tabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = "none";
            tabContents[i].classList.remove("active");
        }

        // Quitar clase active de todos los botones
        const tabLinks = document.getElementsByClassName("tab-link");
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }

        // Mostrar el tab actual y activar botón
        document.getElementById(tabName).style.display = "block";
        document.getElementById(tabName).classList.add("active");
        evt.currentTarget.className += " active";
    }

    async loadMyProjects() {
        // TODO: Implementar carga de proyectos propios del usuario
        // Por ahora se deja estático o se puede conectar con UploadProjectController.loadUserProjects
        console.log('Cargando proyectos propios...');
    }

    async loadFavorites() {
        console.log('Cargando favoritos...');
        await this.favoritesController.loadFavoritesList();
    }
}
