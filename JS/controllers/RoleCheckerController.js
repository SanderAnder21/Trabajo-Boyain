/**
 * Controlador para verificar el estado de autenticación y gestionar el menú de usuario.
 * Maneja la visibilidad de elementos según el estado de login y el rol del usuario.
 * 
 * @class RoleCheckerController
 */
class RoleCheckerController {
    constructor() {
        this.userIcon = null;
        this.dropdownMenu = null;
        this.isAuthenticated = false;
        this.userData = null;
    }

    /**
     * Inicializa el controlador.
     */
    init() {
        console.log('🔧 RoleCheckerController: Inicializando');

        this.userIcon = document.getElementById('userIcon');
        this.dropdownMenu = document.getElementById('dropdownMenu');

        this.setupDropdownMenu();
        this.checkAuthStatus();
        this.setupTabSystem();

        console.log('✅ RoleCheckerController inicializado');
    }

    /**
     * Configura el menú desplegable del usuario.
     * @private
     */
    setupDropdownMenu() {
        if (!this.userIcon || !this.dropdownMenu) {
            console.log('ℹ️ Menú desplegable no encontrado en esta página');
            return;
        }

        // Toggle del menú al hacer click en el icono
        this.userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            this.dropdownMenu.classList.toggle('show');
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.userIcon.contains(e.target) && !this.dropdownMenu.contains(e.target)) {
                this.dropdownMenu.classList.remove('show');
            }
        });
    }

    /**
     * Verifica el estado de autenticación del usuario.
     * @private
     */
    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('userData');

        if (token && userDataStr) {
            try {
                this.userData = JSON.parse(userDataStr);
                this.isAuthenticated = true;
                this.setLoggedInState();
            } catch (e) {
                console.error('Error parsing user data:', e);
                this.setLoggedOutState();
            }
        } else {
            this.setLoggedOutState();
        }
    }

    /**
     * Configura la UI para usuario autenticado.
     * @private
     */
    setLoggedInState() {
        const elements = this.getMenuElements();

        if (elements.loginLink) elements.loginLink.style.display = 'none';
        if (elements.logoutLink) {
            elements.logoutLink.style.display = 'block';
            elements.logoutLink.addEventListener('click', (e) => this.handleLogout(e));
        }
        if (elements.adminCuentaLink) elements.adminCuentaLink.style.display = 'block';
        if (elements.subirProyectoLink) elements.subirProyectoLink.style.display = 'block';
        if (elements.navMisProyectosLink) elements.navMisProyectosLink.style.display = 'block';
        if (elements.userIconText) {
            elements.userIconText.textContent = this.userData.nombre || 'Mi Cuenta';
        }

        console.log('✅ Usuario autenticado:', this.userData.nombre);
    }

    /**
     * Configura la UI para usuario no autenticado.
     * @private
     */
    setLoggedOutState() {
        const elements = this.getMenuElements();

        if (elements.loginLink) elements.loginLink.style.display = 'block';
        if (elements.logoutLink) elements.logoutLink.style.display = 'none';
        if (elements.adminCuentaLink) elements.adminCuentaLink.style.display = 'none';
        if (elements.subirProyectoLink) elements.subirProyectoLink.style.display = 'none';
        if (elements.navMisProyectosLink) elements.navMisProyectosLink.style.display = 'none';
        if (elements.userIconText) elements.userIconText.textContent = 'Iniciar Sesión';

        this.isAuthenticated = false;
        this.userData = null;
    }

    /**
     * Obtiene referencias a los elementos del menú.
     * @returns {Object} Objeto con referencias a elementos del DOM
     * @private
     */
    getMenuElements() {
        return {
            loginLink: document.getElementById('loginLink'),
            logoutLink: document.getElementById('logoutLink'),
            adminCuentaLink: document.getElementById('adminCuentaLink'),
            subirProyectoLink: document.getElementById('subirProyectoLink'),
            userIconText: document.getElementById('userIconText'),
            navMisProyectosLink: document.getElementById('navMisProyectosLink')
        };
    }

    /**
     * Maneja el evento de logout.
     * @param {Event} e - Evento de click
     * @private
     */
    handleLogout(e) {
        e.preventDefault();

        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');

        console.log('👋 Usuario deslogueado');

        // Redirigir a la página principal
        window.location.href = '../INDEX.html';
    }

    /**
     * Configura el sistema de pestañas (tabs).
     * @private
     */
    setupTabSystem() {
        const tabLinks = document.querySelectorAll('.tab-link');

        if (tabLinks.length === 0) {
            return; // No hay sistema de tabs en esta página
        }

        // Configurar event listeners para los tabs
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => this.openTab(e));
        });

        // Mostrar primera pestaña activa por defecto
        this.initializeTabs();
    }

    /**
     * Inicializa las pestañas mostrando solo la activa.
     * @private
     */
    initializeTabs() {
        const activeTab = document.querySelector('.tab-content.active');
        const allTabs = document.querySelectorAll('.tab-content:not(.active)');

        allTabs.forEach(tab => {
            tab.style.display = 'none';
        });

        if (activeTab) {
            activeTab.style.display = 'block';
        }
    }

    /**
     * Abre una pestaña específica.
     * @param {Event} evt - Evento de click
     * @private
     */
    openTab(evt) {
        const tabName = evt.currentTarget.getAttribute('data-tab');

        if (!tabName) {
            console.warn('⚠️ No se encontró el atributo data-tab');
            return;
        }

        // Ocultar todo el contenido de pestañas
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // Quitar clase "active" de todos los botones
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar pestaña actual
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.style.display = 'block';
            targetTab.classList.add('active');
        }

        evt.currentTarget.classList.add('active');
    }

    /**
     * Verifica si el usuario está autenticado.
     * @returns {boolean} True si está autenticado
     */
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    /**
     * Obtiene los datos del usuario actual.
     * @returns {Object|null} Datos del usuario o null
     */
    getCurrentUser() {
        return this.userData;
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const roleChecker = new RoleCheckerController();
    roleChecker.init();
});

export default RoleCheckerController;
