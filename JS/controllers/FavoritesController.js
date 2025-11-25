// JS/controllers/FavoritesController.js

import { AuthService } from '../services/AuthService.js';
import { UIService } from '../services/UIService.js';

/**
 * Controlador para gestionar favoritos en el frontend.
 * Maneja la interacción con el botón de favoritos y la lista de guardados.
 * 
 * @class FavoritesController
 */
class FavoritesController {
    constructor() {
        this.authService = new AuthService();
        this.uiService = new UIService();
    }

    /**
     * Inicializa el controlador en la página de detalles.
     * @param {number} projectId - ID del proyecto actual
     */
    async initDetail(projectId) {
        if (!this.authService.isAuthenticated()) {
            return;
        }

        await this.checkFavoriteStatus(projectId);
        this.setupFavoriteButton(projectId);
    }

    /**
     * Verifica si el proyecto es favorito y actualiza la UI.
     * @param {number} projectId 
     * @private
     */
    async checkFavoriteStatus(projectId) {
        try {
            const token = this.authService.getToken();
            const response = await fetch(`/api/favorites/${projectId}/check`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.isFavorite) {
                this.updateButtonState(true);
            }
        } catch (error) {
            console.error('Error verificando favorito:', error);
        }
    }

    /**
     * Configura el botón de favoritos.
     * @param {number} projectId 
     * @private
     */
    setupFavoriteButton(projectId) {
        const btn = document.getElementById('btnFavorite');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            if (!this.authService.isAuthenticated()) {
                this.uiService.showAlert('Inicia sesión para guardar favoritos');
                return;
            }

            const isFavorite = btn.classList.contains('active');
            if (isFavorite) {
                await this.removeFavorite(projectId);
            } else {
                await this.addFavorite(projectId);
            }
        });
    }

    /**
     * Agrega a favoritos.
     * @param {number} projectId 
     */
    async addFavorite(projectId) {
        try {
            const token = this.authService.getToken();
            const response = await fetch(`/api/favorites/${projectId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                this.updateButtonState(true);
                this.uiService.showAlert('Proyecto guardado en favoritos');
            }
        } catch (error) {
            console.error('Error agregando favorito:', error);
        }
    }

    /**
     * Quita de favoritos.
     * @param {number} projectId 
     */
    async removeFavorite(projectId) {
        try {
            const token = this.authService.getToken();
            const response = await fetch(`/api/favorites/${projectId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                this.updateButtonState(false);
                this.uiService.showAlert('Proyecto eliminado de favoritos');
            }
        } catch (error) {
            console.error('Error quitando favorito:', error);
        }
    }

    /**
     * Actualiza el estado visual del botón.
     * @param {boolean} isFavorite 
     */
    updateButtonState(isFavorite) {
        const btn = document.getElementById('btnFavorite');
        if (!btn) return;

        if (isFavorite) {
            btn.classList.add('active');
            btn.innerHTML = '❤️ Guardado';
            btn.style.backgroundColor = '#ff4757';
            btn.style.color = 'white';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍 Guardar';
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }
    }

    /**
     * Carga la lista de favoritos en MisProyectos.html
     */
    async loadFavoritesList() {
        try {
            const token = this.authService.getToken();
            const response = await fetch('/api/user/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            this.displayFavorites(data.favorites);
        } catch (error) {
            console.error('Error cargando lista de favoritos:', error);
        }
    }

    /**
     * Muestra los favoritos en el grid.
     * @param {Array} favorites 
     */
    displayFavorites(favorites) {
        const grid = document.getElementById('favoritesGrid');
        if (!grid) return;

        if (!favorites || favorites.length === 0) {
            grid.innerHTML = '<p>No tienes proyectos guardados aún.</p>';
            return;
        }

        grid.innerHTML = favorites.map(project => `
            <a href="ProyectoDetalle.html?id=${project.id}" class="project-card">
                <div class="project-image">
                    <img src="${project.imagen_principal || '../IMG/project-placeholder.jpg'}" alt="${project.titulo}">
                </div>
                <div class="project-info">
                    <h3>${project.titulo}</h3>
                    <p>${project.arquitecto_nombre}</p>
                    <div class="project-stats">
                        <span>⭐ ${project.rating_promedio || 0}</span>
                        <span>👁️ ${project.total_vistas || 0}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }
}

export default FavoritesController;
