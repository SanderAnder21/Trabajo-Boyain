/**
 * Servicio de Autenticación
 * Aplica Encapsulamiento: Maneja toda la lógica de conexión con el servidor,
 * tokens y almacenamiento de sesión (localStorage) en un solo lugar.
 */
export class AuthService {
    #apiBaseUrl; // Url base privada

    constructor() {
        // Ajusta esto si tu servidor backend corre en otro puerto
        this.#apiBaseUrl = 'http://localhost:3000'; 
    }

    /**
     * Inicia sesión contra el servidor
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<boolean>} true si fue exitoso
     */
    async login(email, password) {
        try {
            const response = await fetch(`${this.#apiBaseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.user) {
                this.#saveSession(data.user);
                return true;
            } else {
                throw new Error(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            alert(error.message); // Feedback simple al usuario
            return false;
        }
    }

    /**
     * Registra un nuevo usuario
     * @param {Object} userData Objeto con nombre, email, password, rol
     */
    async register(userData) {
        try {
            const response = await fetch(`${this.#apiBaseUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Cuenta creada con éxito. Por favor inicia sesión.');
                window.location.href = 'IniciarSesion.html';
                return true;
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Error al registrar');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            alert(error.message);
            return false;
        }
    }

    /**
     * Cierra la sesión y limpia datos
     */
    logout() {
        localStorage.removeItem('user_session');
        // Opcional: Llamar al backend para invalidar sesión si fuera necesario
        window.location.href = 'IniciarSesion.html';
    }

    /**
     * Obtiene el usuario actual desde el almacenamiento local
     * @returns {Object|null}
     */
    getCurrentUser() {
        const session = localStorage.getItem('user_session');
        return session ? JSON.parse(session) : null;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} role 'admin', 'arquitecto', 'cliente'
     * @returns {boolean}
     */
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.rol === role;
    }

    /**
     * Método de protección de rutas.
     * Úsalo al inicio de páginas que requieren login.
     */
    requireAuth(requiredRole = null) {
        const user = this.getCurrentUser();

        if (!user) {
            window.location.href = 'IniciarSesion.html';
            return false;
        }

        if (requiredRole && user.rol !== requiredRole) {
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = 'INDEX.html'; // Redirigir a home o 403
            return false;
        }

        return true;
    }

    // --- Métodos Privados (Helpers) ---

    #saveSession(user) {
        // Guardamos el usuario en localStorage.
        // IMPORTANTE: En un entorno real, nunca guardes contraseñas aquí.
        // El backend debería devolver un token y datos básicos del usuario.
        localStorage.setItem('user_session', JSON.stringify(user));
    }
}