import { AuthService } from '../services/AuthService.js';
import { UIService } from '../services/UIService.js';

/**
 * Controlador para gestionar calificaciones en el frontend.
 * Maneja el sistema de estrellas y comentarios.
 * 
 * @class RatingController
 */
class RatingController {
    constructor() {
        this.authService = new AuthService();
        this.uiService = new UIService();
        this.currentRating = 0;
    }

    /**
     * Inicializa el controlador en la página de detalles.
     * @param {number} projectId 
     */
    async init(projectId) {
        this.projectId = projectId;
        this.setupStars();
        this.setupForm();
        await this.loadRatings();

        if (this.authService.isAuthenticated()) {
            await this.checkUserRating();
        }
    }

    /**
     * Configura la interactividad de las estrellas.
     * @private
     */
    setupStars() {
        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.dataset.value);
                this.highlightStars(value);
            });

            star.addEventListener('mouseout', () => {
                this.highlightStars(this.currentRating);
            });

            star.addEventListener('click', () => {
                this.currentRating = parseInt(star.dataset.value);
                this.highlightStars(this.currentRating);
            });
        });
    }

    /**
     * Resalta las estrellas hasta el valor indicado.
     * @param {number} value 
     */
    highlightStars(value) {
        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= value) {
                star.classList.remove('far'); // Estrella vacía
                star.classList.add('fas');    // Estrella llena
                star.style.color = '#ffd700';
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.style.color = '#ccc';
            }
        });
    }

    /**
     * Configura el formulario de comentarios.
     * @private
     */
    setupForm() {
        const form = document.getElementById('ratingForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.authService.isAuthenticated()) {
                this.uiService.showAlert('Inicia sesión para calificar');
                return;
            }

            if (this.currentRating === 0) {
                this.uiService.showAlert('Selecciona una puntuación');
                return;
            }

            const comentario = document.getElementById('commentInput').value;
            await this.submitRating(this.currentRating, comentario);
        });
    }

    /**
     * Envía la calificación al servidor.
     * @param {number} rating 
     * @param {string} comment 
     */
    async submitRating(rating, comment) {
        try {
            const token = this.authService.getToken();
            const response = await fetch(`/api/projects/${this.projectId}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ puntuacion: rating, comentario: comment })
            });

            if (response.ok) {
                this.uiService.showAlert('¡Gracias por tu calificación!');
                document.getElementById('commentInput').value = '';
                await this.loadRatings(); // Recargar lista
            } else {
                const data = await response.json();
                this.uiService.showAlert(data.error || 'Error al calificar');
            }
        } catch (error) {
            console.error('Error enviando calificación:', error);
        }
    }

    /**
     * Carga las calificaciones del proyecto.
     */
    async loadRatings() {
        try {
            const response = await fetch(`/api/projects/${this.projectId}/ratings`);
            const data = await response.json();

            this.displayRatings(data.ratings);
            this.updateAverageRating(data.ratings);
        } catch (error) {
            console.error('Error cargando calificaciones:', error);
        }
    }

    /**
     * Muestra las calificaciones en la lista.
     * @param {Array} ratings 
     */
    displayRatings(ratings) {
        const container = document.getElementById('commentsList');
        if (!container) return;

        if (ratings.length === 0) {
            container.innerHTML = '<p class="no-comments">Sé el primero en calificar este proyecto.</p>';
            return;
        }

        container.innerHTML = ratings.map(rating => `
            <div class="comment-card">
                <div class="comment-header">
                    <img src="${rating.usuario_avatar}" alt="${rating.usuario_nombre}" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">${rating.usuario_nombre}</span>
                        <span class="comment-date">${new Date(rating.fecha_calificacion).toLocaleDateString()}</span>
                    </div>
                    <div class="user-rating">
                        ${this.generateStarsHtml(rating.puntuacion)}
                    </div>
                </div>
                <p class="comment-text">${rating.comentario || ''}</p>
            </div>
        `).join('');
    }

    /**
     * Genera HTML estático de estrellas.
     * @param {number} rating 
     */
    generateStarsHtml(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                html += '<i class="fas fa-star" style="color: #ffd700;"></i>';
            } else {
                html += '<i class="far fa-star" style="color: #ccc;"></i>';
            }
        }
        return html;
    }

    /**
     * Verifica si el usuario ya calificó.
     */
    async checkUserRating() {
        try {
            const token = this.authService.getToken();
            const response = await fetch(`/api/projects/${this.projectId}/rating/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.rating) {
                this.currentRating = data.rating.puntuacion;
                this.highlightStars(this.currentRating);
                document.getElementById('commentInput').value = data.rating.comentario || '';
                // Cambiar botón a "Actualizar"
                const btn = document.querySelector('#ratingForm button');
                if (btn) btn.textContent = 'Actualizar Calificación';
            }
        } catch (error) {
            console.error('Error verificando calificación:', error);
        }
    }

    updateAverageRating(ratings) {
        if (!ratings.length) return;
        const sum = ratings.reduce((acc, curr) => acc + curr.puntuacion, 0);
        const avg = (sum / ratings.length).toFixed(1);

        const avgElement = document.getElementById('averageRating');
        if (avgElement) avgElement.textContent = avg;

        const countElement = document.getElementById('ratingCount');
        if (countElement) countElement.textContent = `(${ratings.length} calificaciones)`;
    }
}

export default RatingController;
