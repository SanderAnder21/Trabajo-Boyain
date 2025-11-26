import { AuthService } from '../services/AuthService.js';
import { UIService } from '../services/UIService.js';

/**
 * Controlador para la página de registro.
 * Maneja el formulario de registro y la creación de nuevas cuentas.
 * 
 * @class RegistroController
 */
class RegistroController {
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
        this.form = document.getElementById('registroForm');

        if (!this.form) {
            console.error('❌ No se encontró el formulario de registro');
            return;
        }

        console.log('✅ RegistroController inicializado');
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
     * Maneja el envío del formulario de registro.
     * 
     * @param {Event} e - Evento de submit
     * @private
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const tipoCuenta = document.getElementById('tipoCuenta').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        console.log('📝 Datos del formulario:', { nombre, email, tipoCuenta });

        // Validaciones
        if (!this.validateForm(nombre, email, password, confirmPassword)) {
            return;
        }

        try {
            console.log('🚀 Enviando datos al servidor...');

            // Intentar registro con el servicio de autenticación
            const result = await this.authService.register({
                nombre,
                email,
                password,
                tipoCuenta
            });

            console.log('✅ Registro exitoso:', result);
            this.uiService.showAlert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');

            // Redirigir a la página de login
            setTimeout(() => {
                window.location.href = 'IniciarSesion.html';
            }, 1000);

        } catch (error) {
            console.error('❌ Error en registro:', error);

            // Manejar errores específicos
            if (error.message.includes('email ya está registrado')) {
                this.uiService.showAlert('Este email ya está registrado. Por favor usa otro email.');
            } else if (error.message.includes('Failed to fetch')) {
                this.handleOfflineMode(nombre, email, tipoCuenta);
            } else {
                this.uiService.showAlert('Error al crear la cuenta: ' + error.message);
            }
        }
    }

    /**
     * Valida los datos del formulario.
     * 
     * @param {string} nombre - Nombre del usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @param {string} confirmPassword - Confirmación de contraseña
     * @returns {boolean} True si los datos son válidos
     * @private
     */
    validateForm(nombre, email, password, confirmPassword) {
        if (!nombre || !email || !password || !confirmPassword) {
            this.uiService.showAlert('Por favor completa todos los campos');
            return false;
        }

        if (password !== confirmPassword) {
            this.uiService.showAlert('Las contraseñas no coinciden');
            return false;
        }

        if (password.length < 6) {
            this.uiService.showAlert('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        return true;
    }

    /**
     * Maneja el modo offline/prueba cuando el backend no está disponible.
     * 
     * @param {string} nombre - Nombre del usuario
     * @param {string} email - Email del usuario
     * @param {string} tipoCuenta - Tipo de cuenta (cliente/arquitecto)
     * @private
     */
    handleOfflineMode(nombre, email, tipoCuenta) {
        console.log('🌐 Backend no disponible, usando modo prueba...');

        const user = {
            id: Math.floor(Math.random() * 1000),
            nombre: nombre,
            email: email,
            es_arquitecto: tipoCuenta === 'arquitecto'
        };

        // Guardar datos en localStorage
        localStorage.setItem('userRole', tipoCuenta);
        localStorage.setItem('userName', user.nombre);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userData', JSON.stringify(user));

        this.uiService.showAlert(`¡Registro exitoso! (Modo prueba)\\nBienvenido ${user.nombre}\\nRol: ${tipoCuenta}`);

        setTimeout(() => {
            window.location.href = 'IniciarSesion.html';
        }, 1000);
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const controller = new RegistroController();
    controller.init();
});

export default RegistroController;
