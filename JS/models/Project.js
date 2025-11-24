// JS/models/Project.js

/**
 * Clase que representa un Proyecto Arquitectónico.
 * Encapsula los detalles, archivos y metadatos de un proyecto.
 */
export class Project {
    /**
     * @param {Object} data - Objeto de datos del proyecto.
     */
    constructor(data) {
        this.id = data.id;
        this.title = data.titulo || 'Proyecto sin título';
        this.description = data.descripcion || 'Sin descripción breve.';
        this.fullDescription = data.descripcion_completa || 'Sin descripción completa.';
        
        // Archivos y metadata
        this.image = data.imagen_principal || 'https://placehold.co/400x250/000/fff?text=Proyecto';
        this.images = data.images || []; // URLs de la galería
        this.pdfs = data.pdfs || [];     // URLs de los planos
        this.model3d = data.model3d || null; // Objeto { file, format, hasModel }
        
        // Detalles técnicos
        this.type = data.tipo || 'residencial';
        this.location = data.ubicacion || 'Desconocida';
        this.area = data.area_construida || 'N/A';
        this.budget = data.presupuesto || 'N/A';
        this.duration = data.duracion || 'N/A';
        
        // Metadatos de la plataforma
        this.rating = data.rating_promedio || 0;
        this.views = data.total_vistas || 0;
        this.date = data.fecha_publicacion || new Date().toISOString().split('T')[0];
        this.tags = data.tags || []; // Etiquetas de estilo y técnicas
        
        // Referencia al arquitecto (debe ser una instancia de Architect o un objeto simple)
        this.architect = data.architect || {}; 
    }

    /**
     * Devuelve una etiqueta formateada para la UI (ej. para ProjectDetail.js).
     * @returns {string}
     */
    getFormattedDate() {
        try {
            const date = new Date(this.date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('es-ES', options);
        } catch (e) {
            return this.date;
        }
    }

    static fromData(data) {
        return new Project(data);
    }
}