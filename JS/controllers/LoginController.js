
import { AuthService } from '../services/AuthService.js';
import { UIService } from '../services/UIService.js';

/**
 * Controlador para la página de inicio de sesión.
 * Maneja el formulario de login y la autenticación de usuarios.
 * 
 * @class LoginController
 */
class LoginController {
    constructor() {
        this.authService = new AuthService();
        this.uiService = new UIService();
        this.form = null;
    }

    /**
     * Inicializa el controlador.
     * Configura los event listeners del formulario.
     */
    init() {
        this.form = document.getElementById('loginForm');

        if (!this.form) {
            console.error('❌ No se encontró el formulario de login');
            return;
        }

        console.log('✅ LoginController inicializado');
        this.setupEventListeners();
    }

    /**
     * Configura los event listeners del formulario.
     * @private
     */
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
     * Maneja el envío del formulario de login.
     * 
     * @param {Event} e - Evento de submit
     * @private
     */
    async handleSubmit(e) {
        e.preventDefault();

        const email = this.form.email.value;
        const password = this.form.password.value;

        // Validación básica
        if (!email || !password) {
            this.uiService.showAlert('Por favor completa todos los campos');
            return;
        }

        try {
            console.log('🔐 Intentando login...');

            // Intentar login con el servicio de autenticación
            const result = await this.authService.login(email, password);

            const { user, role } = result;

            // Determinar URL de destino según el rol
            let destinationUrl = '../INDEX.html';
            if (role === 'arquitecto') {
                destinationUrl = 'MisProyectos.html';
            }

            this.uiService.showAlert(`¡Inicio de sesión exitoso! Bienvenido, ${user.nombre}. Rol: ${role}.`);

            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = destinationUrl;
            }, 500);

        } catch (error) {
            console.error('❌ Error en login:', error);

            if (error.message.includes('Failed to fetch') || error.message.includes('HTTP')) {
                this.handleOfflineMode(email);
            } else {
                this.uiService.showAlert(error.message || 'Error de conexión con el servidor. Intenta más tarde.');
            }
        }
    }

    /**
     * Maneja el modo offline/prueba cuando el backend no está disponible.
     * 
     * @param {string} email - Email del usuario
     * @private
     */
    handleOfflineMode(email) {
        console.log('🌐 Backend no disponible, usando modo prueba...');

        let role = 'cliente';
        let userNombre = email.split('@')[0] || 'Usuario';

        // SOLO es arquitecto si el email contiene EXACTAMENTE "arquitecto"
        if (email.toLowerCase().includes('arquitecto')) {
            role = 'arquitecto';
        }

        const user = {
            id: Math.floor(Math.random() * 1000),
            nombre: userNombre,
            email: email,
            es_arquitecto: role === 'arquitecto'
        };

        // Guardar sesión simulada
        const token = 'token-simulado-' + Date.now();
        this.authService.saveSession(token, role, user);

        this.uiService.showAlert(`¡Login exitoso! (Modo prueba)\\nBienvenido ${user.nombre}\\nRol: ${role}`);

        let destinationUrl = '../INDEX.html';
        if (role === 'arquitecto') {
            destinationUrl = 'MisProyectos.html';
        }

        setTimeout(() => {
            window.location.href = destinationUrl;
        }, 500);
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const controller = new LoginController();
    controller.init();
});

export default LoginController;
