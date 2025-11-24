// JS/models/Architect.js

/**
 * Clase que representa a un Arquitecto (Perfil público).
 * Extiende la información básica del User para propósitos de visualización.
 */
export class Architect {
    /**
     * @param {Object} data - Objeto de datos del arquitecto.
     */
    constructor(data) {
        this.id = data.id;
        this.name = data.nombre || 'Arquitecto';
        this.avatar = data.avatar || 'https://placehold.co/150x150/333/fff?text=A';
        this.specialty = data.especialidad || 'Arquitectura General';
        this.experience = data.experiencia || 'No especificado';
        this.bio = data.biografia || 'Especialista en diseño y gestión de proyectos.';
        
        // Contacto y redes (públicos)
        this.contact = data.email || null; // Usamos el email como contacto principal
        this.social = data.social || { linkedin: null, instagram: null, behance: null }; 
    }

    /**
     * Crea una URL para el perfil público.
     * @returns {string}
     */
    getProfileUrl() {
        return `PerfilArquitecto.html?id=${this.id}`;
    }

    static fromData(data) {
        return new Architect(data);
    }
}