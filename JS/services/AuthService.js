// JS/services/AuthService.js

/**
 * Servicio de Autenticación (AuthService).
 * Maneja el Login, Registro, Logout y la persistencia de la sesión (Tokens y Rol) en localStorage.
 * Se comunica directamente con el backend de Node.js/Express.
 */
export class AuthService {
    constructor() {
        // La URL base del backend se define aquí (basada en tu app.js)
        this.API_URL = 'http://localhost:3000/api';
    }

    /**
     * Verifica si existe un token de autenticación.
     * @returns {boolean}
     */
    checkAuthStatus() {
        return !!localStorage.getItem('authToken');
    }

    /**
     * Obtiene el rol del usuario actual.
     * @returns {'arquitecto' | 'cliente' | null}
     */
    getUserRole() {
        return localStorage.getItem('userRole');
    }

    /**
     * Obtiene los datos completos del usuario desde localStorage.
     * @returns {Object | null}
     */
    getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    }

    /**
     * Verifica si el usuario está autenticado.
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.checkAuthStatus();
    }

    /**
     * Obtiene el token de autenticación.
     * @returns {string | null}
     */
    getToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Actualiza los datos del usuario en localStorage después de una modificación
     * @param {Object} newUserData - Nuevos datos del usuario
     */
    updateUserData(newUserData) {
        console.log('[AuthService] Actualizando datos de usuario:', newUserData);
        
        try {
            // Obtener datos actuales
            const currentData = this.getUserData() || {};
            
            // Combinar datos existentes con nuevos datos
            const updatedData = {
                ...currentData,
                ...newUserData
            };
            
            // Guardar en localStorage
            localStorage.setItem('userData', JSON.stringify(updatedData));
            
            // Actualizar rol si es necesario
            if (updatedData.es_arquitecto !== undefined) {
                const role = updatedData.es_arquitecto ? 'arquitecto' : 'cliente';
                localStorage.setItem('userRole', role);
            }
            
            // Actualizar nombre si existe
            if (updatedData.nombre) {
                localStorage.setItem('userName', updatedData.nombre);
            }
            
            console.log('[AuthService] Datos actualizados correctamente en localStorage');
            return true;
            
        } catch (error) {
            console.error('[AuthService] Error actualizando datos:', error);
            return false;
        }
    }

    /**
     * Intenta iniciar sesión contra la ruta /api/login del backend.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{token: string, user: Object, role: string}>}
     * @throws {Error} Si las credenciales son inválidas o hay error de conexión.
     */
    async login(email, password) {
        console.log(`[AuthService] Intentando login para: ${email}`);

        const response = await fetch(`${this.API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            // Lanza el error del backend (Credenciales inválidas, etc.)
            throw new Error(result.error || `Error HTTP ${response.status}: Fallo en el inicio de sesión.`);
        }

        const user = result.user;

        // Determinar el rol (usa el campo 'es_arquitecto' que devuelve el backend)
        const isArchitect = Boolean(user.es_arquitecto);
        const role = isArchitect ? 'arquitecto' : 'cliente';

        this.saveSession(result.token, role, user);
        return { token: result.token, user, role };
    }

    /**
     * Registra un nuevo usuario contra la ruta /api/register del backend.
     * @param {Object} data - { nombre, email, password, tipoCuenta }
     * @returns {Promise<{userId: number, message: string}>}
     * @throws {Error} Si el email ya está registrado o hay error de conexión.
     */
    async register(data) {
        console.log(`[AuthService] Intentando registro para: ${data.email}`);

        const response = await fetch(`${this.API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            // Lanza el error del backend (Email ya registrado, etc.)
            throw new Error(result.error || `Error HTTP ${response.status}: Fallo en el registro.`);
        }

        return result;
    }

    /**
     * Guarda la información de la sesión en localStorage.
     */
    saveSession(token, role, user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', user.nombre);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    /**
     * Cierra la sesión y limpia localStorage.
     */
    logout() {
        console.log('[AuthService] Sesión cerrada. Limpiando localStorage.');
        localStorage.clear();
    }

    /**
     * Verifica si el token actual es válido con el backend
     * @returns {Promise<{valid: boolean, user: Object|null}>}
     */
    async verifyToken() {
        const token = this.getToken();
        
        if (!token) {
            return { valid: false, user: null };
        }

        try {
            const response = await fetch(`${this.API_URL}/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return { valid: true, user: data.user };
            } else {
                // Token inválido - limpiar sesión
                this.logout();
                return { valid: false, user: null };
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            return { valid: false, user: null };
        }
    }
}