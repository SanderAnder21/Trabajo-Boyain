// JS/services/UIService.js

/**
 * Servicio de UI (User Interface Service).
 * Maneja la manipulación del DOM global (Navbar, Dropdown, Scroll) 
 * y elementos reutilizables (Pestañas).
 */
export class UIService {
    
    constructor() {
        this.setupScrollDown();
    }

    /**
     * Configura la visibilidad de los enlaces del navbar/dropdown basada en el estado de autenticación.
     * @param {{isAuthenticated: boolean, role: string|null, logoutHandler: function}} auth
     */
    setupAuthNavigation(auth) {
        const { isAuthenticated, role, logoutHandler } = auth;
        
        // Elementos de navegación
        const loginLink = document.getElementById('loginLink');
        const logoutLink = document.getElementById('logoutLink');
        const adminCuentaLink = document.getElementById('adminCuentaLink');
        const subirProyectoLink = document.getElementById('subirProyectoLink');
        const navMisProyectosLink = document.getElementById('navMisProyectosLink');

        // Mostrar/Ocultar enlaces
        if (loginLink) loginLink.style.display = isAuthenticated ? 'none' : 'block';
        if (logoutLink) logoutLink.style.display = isAuthenticated ? 'block' : 'none';
        if (adminCuentaLink) adminCuentaLink.style.display = isAuthenticated ? 'block' : 'none';
        
        const isArchitect = isAuthenticated && role === 'arquitecto';

        // Lógica específica para arquitectos
        if (subirProyectoLink) subirProyectoLink.style.display = isArchitect ? 'block' : 'none';
        
        // Mis Proyectos (solo visible para arquitectos en el nav principal)
        if (navMisProyectosLink) navMisProyectosLink.style.display = isArchitect ? 'list-item' : 'none';

        // Asignar evento de Logout
        if (logoutLink) {
            logoutLink.onclick = (e) => {
                e.preventDefault();
                logoutHandler();
                alert('Sesión cerrada exitosamente.');
                // Redirigir al home después del logout (asumiendo que el home está en el INDEX.html de la raíz)
                window.location.href = document.querySelector('nav1 a.logo').getAttribute('href') || '../INDEX.html'; 
            };
        }
        
        this.setupDropdown();
    }

    /**
     * Maneja la visibilidad del menú desplegable al hacer clic en el ícono.
     */
    setupDropdown() {
        const userIcon = document.getElementById('userIcon');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (userIcon && dropdownMenu) {
            userIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            window.addEventListener('click', (e) => {
                // Cerrar si se hace clic fuera del icono o del menú
                if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
    }

    /**
     * Maneja el scroll al hacer clic en el botón de flecha.
     */
    setupScrollDown() {
        const scrollBtn = document.querySelector('.btn-scroll-down');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = scrollBtn.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    /**
     * Implementa la lógica de pestañas (tabs) para Proyectos.html o MisProyectos.html
     * @param {string} defaultTabName - Nombre de la pestaña por defecto.
     */
    setupTabs(defaultTabName) {
        const tabsNavigation = document.querySelector('.tabs-navigation');
        if (!tabsNavigation) return;
        
        const tabLinks = tabsNavigation.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        const activateTab = (tabName) => {
            tabLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.tab === tabName);
            });

            tabContents.forEach(content => {
                content.classList.toggle('active', content.id === tabName);
                content.style.display = (content.id === tabName) ? 'block' : 'none';
            });
        };

        // Asignar data-tab a los botones que usan onclick="openTab..." para estandarizar
        tabLinks.forEach(link => {
            if (!link.dataset.tab && link.hasAttribute('onclick')) {
                const match = link.getAttribute('onclick').match(/'([^']+)'/);
                if (match) link.dataset.tab = match[1];
            }
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.currentTarget.dataset.tab;
                if (tabName) activateTab(tabName);
            });
        });

        // Activar la pestaña por defecto al cargar
        activateTab(defaultTabName || (tabLinks.length > 0 ? tabLinks[0].dataset.tab : null));
    }

    /**
     * Muestra un mensaje de alerta en la UI (Reemplazo de alert() nativo).
     * @param {string} message 
     * @param {boolean} isError 
     */
    showAlert(message, isError = false) {
        // En un proyecto real, se usaría un modal o un toast. Aquí usamos alert por simplicidad de ejemplo.
        if (isError) {
            alert(`[ERROR] ${message}`);
        } else {
            alert(message);
        }
    }

    /**
     * Redirige al usuario.
     * @param {string} path 
     */
    redirect(path) {
        window.location.href = path;
    }
}