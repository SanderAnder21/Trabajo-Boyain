// JS/services/DataService.js

/**
 * Servicio de Datos (DataService).
 * Encapsula todas las peticiones HTTP (GET, POST, PUT) relacionadas con 
 * Proyectos y Perfiles de Usuario (excluyendo Auth).
 */
export class DataService {
    /**
     * @param {string} baseURL - La URL base de la API.
     */
    constructor() {
        this.API_URL = 'http://localhost:3000/api'; 
        // Generar token para uso interno. En un entorno real, usaría un Auth service.
        this.token = localStorage.getItem('authToken');
    }

    /**
     * Crea los headers con el token de autorización si está disponible.
     * @param {boolean} isJson - Indica si el Content-Type debe ser 'application/json'.
     * @returns {Object}
     */
    getAuthHeaders(isJson = true) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        if (isJson) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    }

    /**
     * Función genérica para manejar respuestas HTTP.
     * @param {Response} response 
     * @returns {Promise<Object>}
     * @throws {Error}
     */
    async handleResponse(response) {
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `Error HTTP ${response.status}: Fallo en la operación.`);
        }
        return result;
    }

    // --- MÉTODOS DE PROYECTOS ---

    /**
     * Obtiene una lista de proyectos.
     * @returns {Promise<Array<Object>>}
     */
    async getProjects(filters = {}) {
        // Simulación: en el backend real, esta ruta manejaría los filtros
        console.log('[DataService] Obteniendo proyectos con filtros:', filters);
        
        // Simulación temporal de datos mientras se implementa la ruta GET /api/projects
        // Reemplaza esto con una llamada real al backend cuando esté lista.
        return [
            { id: 1, title: "Casa Moderna", architect: { id: 1, name: "María González", avatar: "https://..."}, description: "...", image: "https://...", rating: 4.8, views: 124, date: "2024-01-15", styles: ['moderno'], type: 'residencial', fileType: 'images' },
            { id: 2, title: "Edificio Corporativo", architect: { id: 2, name: "Carlos Rodríguez", avatar: "https://..."}, description: "...", image: "https://...", rating: 4.6, views: 89, date: "2024-01-10", styles: ['industrial'], type: 'comercial', fileType: 'pdf' }
            // ... más proyectos
        ];
    }
    
    /**
     * Obtiene los proyectos de un usuario (para MisProyectos.html).
     * @param {number} userId 
     * @returns {Promise<Array<Object>>}
     */
    async getUserProjects(userId) {
        console.log(`[DataService] Obteniendo proyectos para usuario ID: ${userId}`);
        // Implementación real:
        // const response = await fetch(`${this.API_URL}/user/${userId}/projects`, { headers: this.getAuthHeaders() });
        // return this.handleResponse(response);
        
        // Retorna simulación por ahora
        return this.getProjects();
    }

    /**
     * Sube un nuevo proyecto.
     * @param {FormData} formData 
     * @returns {Promise<Object>}
     */
    async uploadProject(formData) {
        if (!this.token) throw new Error('Se requiere autenticación para subir proyectos.');
        
        // Nota: No se pasa Content-Type: application/json con FormData
        const response = await fetch(`${this.API_URL}/projects`, {
            method: 'POST',
            headers: this.getAuthHeaders(false), // Importante: isJson = false
            body: formData
        });
        
        return this.handleResponse(response);
    }
    
    // --- MÉTODOS DE PERFIL DE USUARIO ---
    
    /**
     * Actualiza la información personal del usuario.
     * @param {Object} data - { nombre, bio, fechaNacimiento }
     * @returns {Promise<Object>}
     */
    async updatePersonalData(data) {
        if (!this.token) throw new Error('Se requiere autenticación.');
        
        const response = await fetch(`${this.API_URL}/user/personal`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        const result = await this.handleResponse(response);
        
        // Actualizar localStorage tras la actualización exitosa
        const userData = JSON.parse(localStorage.getItem('userData'));
        localStorage.setItem('userData', JSON.stringify({ ...userData, ...data }));
        
        return result;
    }
    
    /**
     * Actualiza la información de contacto del arquitecto.
     * @param {Object} data - { telefono, estado, direccion }
     * @returns {Promise<Object>}
     */
    async updateContactData(data) {
        if (!this.token) throw new Error('Se requiere autenticación.');
        
        // Usamos la ruta protegida de tu app.js
        const response = await fetch(`${this.API_URL}/user/contact`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        return this.handleResponse(response);
    }
}