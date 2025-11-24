/**
 * Clase Modelo para un Proyecto Arquitectónico.
 * Representa la entidad de datos.
 */
export class Project {
    constructor(data) {
        this.id = data.id;
        this.title = data.nombre || data.title; // Adaptable a tu API
        this.description = data.descripcion || "Sin descripción";
        this.image = data.imagen || 'img/default-project.jpg';
        this.category = data.tipo || 'General'; // Residencial, Comercial, etc.
        this.architectId = data.arquitecto_id;
        this.date = new Date(data.fecha);
        this.status = data.estado || 'En progreso';
        this.location = data.ubicacion;
    }

    /**
     * Getter para obtener la fecha formateada
     */
    get formattedDate() {
        return this.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    }

    /**
     * Método para generar su propia tarjeta HTML
     * (Esto es útil para mantener la lógica de visualización cerca del dato)
     */
    toHTMLCard() {
        return `
            <div class="project-card" data-category="${this.category}">
                <div class="card-image">
                    <img src="${this.image}" alt="${this.title}" loading="lazy">
                    <span class="card-badge ${this.status === 'Finalizado' ? 'completed' : 'progress'}">
                        ${this.status}
                    </span>
                </div>
                <div class="card-content">
                    <span class="card-category">${this.category}</span>
                    <h3>${this.title}</h3>
                    <p class="card-location">📍 ${this.location}</p>
                    <p class="card-desc">${this.description.substring(0, 100)}...</p>
                    <div class="card-footer">
                        <span class="card-date">📅 ${this.formattedDate}</span>
                        <a href="ProyectoDetalle.html?id=${this.id}" class="btn-detail">Ver Detalles</a>
                    </div>
                </div>
            </div>
        `;
    }
}