import { BasePage } from './BasePage.js';

/**
 * Controlador de la página de Login.
 * HERENCIA: Hereda de BasePage para tener navbar y footer funcionales.
 */
export class LoginPage extends BasePage {
    constructor() {
        super(); // Inicializa la clase padre (BasePage)
    }

    /**
     * POLIMORFISMO: Sobrescribimos bindEvents para añadir
     * los eventos específicos de este formulario.
     */
    bindEvents() {
        // 1. Llamamos a los eventos base (logout, scroll, etc.)
        super.bindEvents();

        // 2. Lógica específica del Login
        const loginForm = document.getElementById('login-form'); 
        // Asegúrate de que tu <form> en HTML tenga id="login-form"

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.#handleLoginSubmit(e));
        }
    }

    // Método privado para manejar el envío (Encapsulamiento de la lógica de UI)
    async #handleLoginSubmit(e) {
        e.preventDefault();

        // Obtener datos del DOM
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación básica de UI
        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Llamada al servicio (Abstracción)
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Ingresando...';
            submitBtn.disabled = true;

            // Usamos el authService que heredamos de BasePage
            const success = await this.authService.login(email, password);

            if (success) {
                // Redirección basada en el rol (opcional, o ir directo al index)
                window.location.href = 'INDEX.html';
            }
        } catch (error) {
            // El error ya se muestra en el alert del service, pero aquí podemos limpiar inputs
            passwordInput.value = '';
            console.error(error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}