import { BasePage } from './BasePage.js';

/**
 * Controlador de la página de Registro.
 */
export class RegisterPage extends BasePage {
    constructor() {
        super();
    }

    bindEvents() {
        super.bindEvents();

        const registerForm = document.getElementById('register-form');
        // Asegúrate de que tu <form> en HTML tenga id="register-form"

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.#handleRegisterSubmit(e));
        }
    }

    async #handleRegisterSubmit(e) {
        e.preventDefault();

        // Referencias a los inputs
        const name = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const roleSelect = document.getElementById('rol');
        const role = roleSelect ? roleSelect.value : 'cliente'; // Default a cliente

        // Validaciones de UI
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Preparar objeto de datos
        const userData = {
            nombre: name,
            email: email,
            password: password,
            rol: role
        };

        // Enviar al servicio
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.textContent = 'Creando cuenta...';
            submitBtn.disabled = true;

            await this.authService.register(userData);
            // Si tiene éxito, el servicio redirige o muestra alert.
            
        } catch (error) {
            console.error("Error en registro UI:", error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}