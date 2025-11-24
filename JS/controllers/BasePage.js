import { AuthService } from '../services/AuthService.js';

/**
 * Clase BasePage (Controlador Padre)
 * Aplica el pilar de Herencia: Todas las páginas heredarán de esta clase
 * para tener automáticamente el navbar, footer y scroll configurados.
 */
export class BasePage {
    constructor() {
        // Instanciamos el servicio de autenticación para usarlo en toda la app
        this.authService = new AuthService();

        // Ejecutamos la inicialización cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Método principal de arranque.
     * Las clases hijas pueden sobrescribir esto (Polimorfismo) si necesitan algo más,
     * pero siempre deben llamar a super.init().
     */
    init() {
        this.setupScrollEffect(); // Reemplaza a scrollDown.js
        this.renderNavigation();  // Reemplaza a rolChecker.js
        this.bindGlobalEvents();
    }

    /**
     * Maneja el efecto visual del Navbar al hacer scroll.
     */
    setupScrollEffect() {
        const nav = document.querySelector('.nav'); // Asegúrate de que tu <nav> tenga esta clase o sea la etiqueta nav
        
        if (!nav) return;

        window.addEventListener('scroll', () => {
            // Si bajamos más de 50px, añadimos la clase 'active' o 'scrolled'
            if (window.scrollY > 50) {
                nav.classList.add('active'); 
            } else {
                nav.classList.remove('active');
            }
        });
    }

    /**
     * Controla qué enlaces del menú se ven según el rol del usuario.
     * (Lógica centralizada para reemplazar scripts sueltos de roles).
     */
    renderNavigation() {
        const user = this.authService.getCurrentUser();
        const role = user ? user.rol : null; // Asumimos que guardas el rol como 'rol'

        // Referencias a los elementos del menú (Ajusta los IDs según tu HTML)
        const elements = {
            loginLink: document.getElementById('login-item'),      // Link a Iniciar Sesión
            registerLink: document.getElementById('register-item'), // Link a Crear Cuenta
            logoutBtn: document.getElementById('logout-item'),      // Botón Cerrar Sesión
            adminPanel: document.getElementById('admin-panel-link'), // Link a Administrar Cuentas
            architectProfile: document.getElementById('profile-link'), // Link a Mi Perfil/Proyectos
            subirProyecto: document.getElementById('upload-link')    // Link a Subir Proyecto
        };

        // 1. Resetear estado (Ocultar todo lo sensible por defecto)
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'none';
        if (elements.adminPanel) elements.adminPanel.style.display = 'none';
        if (elements.architectProfile) elements.architectProfile.style.display = 'none';
        if (elements.subirProyecto) elements.subirProyecto.style.display = 'none';

        if (user) {
            // --- USUARIO LOGUEADO ---
            
            // Ocultar login/registro
            if (elements.loginLink) elements.loginLink.style.display = 'none';
            if (elements.registerLink) elements.registerLink.style.display = 'none';
            
            // Mostrar cerrar sesión
            if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';

            // Mostrar enlaces según ROL
            if (role === 'admin') {
                if (elements.adminPanel) elements.adminPanel.style.display = 'block';
            } 
            else if (role === 'arquitecto') {
                if (elements.architectProfile) elements.architectProfile.style.display = 'block';
                if (elements.subirProyecto) elements.subirProyecto.style.display = 'block';
            }
            // Cliente (si existe lógica específica para cliente, agrégala aquí)

        } else {
            // --- USUARIO INVITADO (NO LOGUEADO) ---
            if (elements.loginLink) elements.loginLink.style.display = 'block';
            if (elements.registerLink) elements.registerLink.style.display = 'block';
        }
    }

    /**
     * Eventos globales como el Logout
     */
    bindGlobalEvents() {
        const logoutBtn = document.getElementById('logout-item');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.authService.logout();
            });
        }
    }
}