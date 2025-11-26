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
        try {
            console.log('[DataService] Obteniendo proyectos con filtros:', filters);
            
            const queryParams = new URLSearchParams();
            if (filters.tipo) queryParams.append('tipo', filters.tipo);
            if (filters.estilo) queryParams.append('estilo', filters.estilo);
            
            const url = `${this.API_URL}/projects${queryParams.toString() ? `?${queryParams}` : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });
            
            const result = await this.handleResponse(response);
            return result.projects || [];
            
        } catch (error) {
            console.error('❌ Error obteniendo proyectos:', error);
            throw error;
        }
    }
    
    /**
     * Obtiene los proyectos de un usuario (para MisProyectos.html).
     * @param {number} userId 
     * @returns {Promise<Array<Object>>}
     */
    async getUserProjects(userId) {
    try {
        console.log(`[DataService] Obteniendo proyectos reales para usuario ID: ${userId}`);
        
        // ✅ URL CORREGIDA - usar /api/user/projects en lugar de /api/projects/user
        const response = await fetch(`${this.API_URL}/user/projects`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        
        const result = await this.handleResponse(response);
        console.log('📊 Proyectos del usuario recibidos:', result);
        
        return result.projects || [];
        
    } catch (error) {
        console.error('❌ Error obteniendo proyectos del usuario:', error);
        throw error;
    }
}

    /**
     * Obtiene un proyecto específico por ID
     * @param {number} projectId 
     * @returns {Promise<Object>}
     */
    async getProjectById(projectId) {
        try {
            console.log(`[DataService] Obteniendo proyecto ID: ${projectId}`);
            
            const response = await fetch(`${this.API_URL}/projects/${projectId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });
            
            const result = await this.handleResponse(response);
            return result.project || null;
            
        } catch (error) {
            console.error('❌ Error obteniendo proyecto:', error);
            throw error;
        }
    }

    /**
     * Sube un nuevo proyecto.
     * @param {FormData} formData 
     * @returns {Promise<Object>}
     */
    async uploadProject(formData) {
        try {
            if (!this.token) throw new Error('Se requiere autenticación para subir proyectos.');
            
            console.log('[DataService] Subiendo proyecto...');
            
            const response = await fetch(`${this.API_URL}/projects`, {
                method: 'POST',
                headers: this.getAuthHeaders(false),
                body: formData
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('❌ Error subiendo proyecto:', error);
            throw error;
        }
    }

    /**
     * Elimina un proyecto
     * @param {number} projectId 
     * @returns {Promise<Object>}
     */
    async deleteProject(projectId) {
        try {
            console.log(`[DataService] Eliminando proyecto ID: ${projectId}`);
            
            const response = await fetch(`${this.API_URL}/projects/${projectId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('❌ Error eliminando proyecto:', error);
            throw error;
        }
    }
    
    // --- MÉTODOS DE PERFIL DE USUARIO ---
    
    /**
     * Actualiza la información personal del usuario.
     * @param {Object} data - { nombre, bio, fechaNacimiento }
     * @returns {Promise<Object>}
     */
    async updatePersonalData(data) {
        try {
            if (!this.token) throw new Error('Se requiere autenticación.');
            
            console.log('[DataService] Actualizando datos personales:', data);
            
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
            
        } catch (error) {
            console.error('❌ Error actualizando datos personales:', error);
            throw error;
        }
    }
    
    /**
     * Actualiza la información de contacto del arquitecto.
     * @param {Object} data - { telefono, estado, direccion }
     * @returns {Promise<Object>}
     */
    async updateContactData(data) {
        try {
            if (!this.token) throw new Error('Se requiere autenticación.');
            
            console.log('[DataService] Actualizando datos de contacto:', data);
            
            const response = await fetch(`${this.API_URL}/user/contact`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data)
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('❌ Error actualizando datos de contacto:', error);
            throw error;
        }
    }
}