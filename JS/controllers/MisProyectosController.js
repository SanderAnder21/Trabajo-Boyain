
import { BasePage } from './BasePage.js';
import FavoritesController from './FavoritesController.js';
import { DataService } from '../services/DataService.js';

/**
 * Controlador para la página Mis Proyectos.
 * Maneja la visualización de proyectos publicados y guardados (favoritos).
 */
export class MisProyectosController extends BasePage {

    constructor(authService, uiService) {
        super(authService, uiService);
        this.dataService = new DataService();
        this.favoritesController = new FavoritesController();
        this.currentUser = null;
    }

    async init() {
        console.log('🚀 MisProyectosController: Inicializando...');

        // Verificar autenticación
        if (!this.authService.isAuthenticated()) {
            this.uiService.redirect('IniciarSesion.html');
            return;
        }

        this.currentUser = this.authService.getUserData();
        console.log('👤 Usuario actual:', this.currentUser);

        this.setupRoleBasedUI();
        this.setupTabs();
        await this.loadMyProjects();
        await this.loadFavorites();
        this.setupEventListeners();

        console.log('✅ MisProyectosController: Inicializado correctamente');
    }

    /**
     * Configura la UI basada en el rol del usuario
     */
    setupRoleBasedUI() {
        const userRole = this.authService.getUserRole();
        console.log('👤 Rol detectado:', userRole);

        if (userRole === 'cliente') {
            this.setupClientUI();
        }
    }

    /**
     * Configura la interfaz para clientes
     */
    setupClientUI() {
        console.log('👤 Configurando UI para cliente');

        // Cambiar título
        const pageTitle = document.querySelector('.mis-proyectos-container h2');
        if (pageTitle) pageTitle.textContent = 'Mis Favoritos';

        // Cambiar texto de pestañas
        const tabPublicados = document.querySelector('.tab-link[onclick*="publicados"]');
        if (tabPublicados) tabPublicados.textContent = 'Mis Proyectos Favoritos';

        const tabTitle = document.querySelector('#publicados h3');
        if (tabTitle) tabTitle.textContent = 'Mis Proyectos Favoritos';

        const tabDescription = document.querySelector('#publicados p');
        if (tabDescription) {
            tabDescription.textContent = 'Estos son los proyectos de arquitectos que has guardado como favoritos.';
        }
    }

    setupTabs() {
        // Ya existe la función global openTab en el HTML, así que la usamos
        console.log('📑 Configurando pestañas...');
    }

    async loadMyProjects() {
        try {
            console.log('📦 Cargando proyectos del usuario...');

            const userProjects = await this.dataService.getUserProjects(this.currentUser.id);
            console.log('📊 Proyectos recibidos del servicio:', userProjects);

            if (userProjects && userProjects.length > 0) {
                this.renderMyProjects(userProjects);
            } else {
                this.showNoProjectsMessage();
            }

        } catch (error) {
            console.error('❌ Error cargando proyectos:', error);
            this.showErrorLoadingProjects();
        }
    }

    /**
     * Renderiza los proyectos del usuario en la interfaz
     */
    renderMyProjects(projects) {
        const projectsGrid = document.getElementById('projects-grid-publicados');
        if (!projectsGrid) {
            console.error('❌ No se encontró el contenedor projects-grid-publicados');
            return;
        }

        // Limpiar contenido existente
        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });

        console.log(`✅ Mostrando ${projects.length} proyectos del usuario`);
    }

    /**
     * Crea una tarjeta de proyecto para la interfaz
     */
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';

        card.innerHTML = `
            <img src="${project.imagen_principal || '../IMG/project1.jpg'}" alt="${project.titulo}" onerror="this.src='../IMG/project1.jpg'">
            <div class="project-info">
                <h4>${project.titulo || 'Proyecto sin título'}</h4>
                <p>Por: ${this.currentUser.nombre || 'Tu nombre'}</p>
                <div class="project-stats">
                    <span>❤️ ${project.total_vistas || 0}</span>
                    <span>👁️ ${project.total_vistas || 0}</span>
                </div>
                <div class="project-meta">
                    <small>Tipo: ${this.getProjectTypeLabel(project.tipo)}</small>
                    <small>${project.ubicacion || 'Ubicación no especificada'}</small>
                </div>
            </div>
        `;

        // Hacer la tarjeta clickeable para ver detalles
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            this.viewProjectDetails(project.id);
        });

        return card;
    }

    /**
     * Obtiene la etiqueta legible del tipo de proyecto
     */
    getProjectTypeLabel(type) {
        const types = {
            'residencial': 'Residencial',
            'comercial': 'Comercial',
            'restauracion': 'Restauración',
            'institucional': 'Institucional'
        };
        return types[type] || type || 'No especificado';
    }

    /**
     * Muestra mensaje cuando no hay proyectos
     */
    showNoProjectsMessage() {
        const projectsGrid = document.getElementById('projects-grid-publicados');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="no-projects-message">
                    <h3>📝 Aún no tienes proyectos publicados</h3>
                    <p>Comienza compartiendo tu primer proyecto con la comunidad.</p>
                    <button class="btn-create-project" onclick="window.location.href='SubirProyecto.html'">
                        Crear mi primer proyecto
                    </button>
                </div>
            `;
        }
    }

    /**
     * Muestra mensaje de error al cargar proyectos
     */
    showErrorLoadingProjects() {
        const projectsGrid = document.getElementById('projects-grid-publicados');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Error al cargar proyectos</h3>
                    <p>No pudimos cargar tus proyectos. Intenta recargar la página.</p>
                    <button class="btn-reload" onclick="window.reloadPage()">Reintentar</button>
                </div>
            `;
        }
    }

    async loadFavorites() {
        console.log('💖 Cargando favoritos...');
        // Por ahora solo log, implementaremos esto después
        const favoritesGrid = document.getElementById('projects-grid-guardados');
        if (favoritesGrid) {
            favoritesGrid.innerHTML = `
                <div class="no-projects-message">
                    <h3>⭐ Funcionalidad en desarrollo</h3>
                    <p>Próximamente podrás ver tus proyectos favoritos aquí.</p>
                </div>
            `;
        }
    }

    /**
     * Configura event listeners adicionales
     */
    setupEventListeners() {
    }

    /**
     * Navega a la página de detalles del proyecto
     */
    viewProjectDetails(projectId) {
        window.location.href = `Proyectos.html?project=${projectId}`;
    }
}