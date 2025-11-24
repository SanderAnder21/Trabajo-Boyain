// JS/models/User.js

/**
 * Clase que representa a un Usuario (Cliente o Arquitecto).
 * Encapsula la información personal y de autenticación.
 */
export class User {
    /**
     * @param {Object} data - Objeto de datos del usuario, típicamente del backend o localStorage.
     */
    constructor(data) {
        // Datos básicos de la cuenta
        this.id = data.id || null;
        this.nombre = data.nombre || 'Usuario Anónimo';
        this.email = data.email || '';
        this.role = data.es_arquitecto ? 'arquitecto' : 'cliente'; // Define el rol basado en el campo del backend
        this.isAuthenticated = !!data.token || (data.id !== null);
        
        // Datos de perfil (pueden ser nulos para clientes)
        this.avatar = data.avatar || 'https://placehold.co/150x150/f0f0f0/666?text=U';
        this.biografia = data.biografia || 'Sin biografía.';
        
        // Datos específicos del arquitecto
        this.especialidad = data.especialidad || null;
        this.titulacion = data.titulacion || null;
        this.telefono = data.telefono || null;
        this.experiencia = data.experiencia || null;
        this.ubicacion = data.ubicacion || null;
    }

    /**
     * Verifica si el usuario es un arquitecto.
     * @returns {boolean}
     */
    isArchitect() {
        return this.role === 'arquitecto';
    }

    /**
     * Crea una instancia de User desde un objeto simple de datos.
     * @param {Object} data - Objeto plano con datos de usuario.
     * @returns {User}
     */
    static fromData(data) {
        return new User(data);
    }
}