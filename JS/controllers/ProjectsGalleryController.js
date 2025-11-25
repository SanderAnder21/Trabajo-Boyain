// JS/controllers/ProjectsGalleryController.js

/**
 * Controlador para la galería de proyectos.
 * Maneja la carga y visualización de proyectos en la página de exploración.
 * 
 * @class ProjectsGalleryController
 */
class ProjectsGalleryController {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilters = {
            search: '',
            style: '',
            type: '',
            sort: 'newest'
        };
    }

    /**
     * Inicializa el controlador.
     */
    async init() {
        console.log('🎨 ProjectsGalleryController inicializado');

        await this.loadProjects();
        this.setupEventListeners();
        this.displayProjects(this.projects);
    }

    /**
     * Carga todos los proyectos desde el servidor.
     * @private
     */
    async loadProjects() {
        try {
            console.log('📂 Cargando proyectos...');

            const response = await fetch('/api/projects');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al cargar proyectos');
            }

            this.projects = data.projects || [];
            this.filteredProjects = [...this.projects];

            console.log(`✅ ${this.projects.length} proyectos cargados`);

        } catch (error) {
            console.error('❌ Error cargando proyectos:', error);
            this.projects = [];
            this.filteredProjects = [];
        }
    }

    /**
     * Configura los event listeners.
     * @private
     */
    setupEventListeners() {
        // Búsqueda
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Filtro de estilo
        const styleFilter = document.getElementById('filterStyle');
        if (styleFilter) {
            styleFilter.addEventListener('change', (e) => {
                this.currentFilters.style = e.target.value;
                this.applyFilters();
            });
        }

        // Filtro de tipo
        const typeFilter = document.getElementById('filterType');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.currentFilters.type = e.target.value;
                this.applyFilters();
            });
        }

        // Ordenamiento
        const sortFilter = document.getElementById('filterSort');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.applyFilters();
            });
        }
    }

    /**
     * Aplica los filtros a los proyectos.
     * @private
     */
    applyFilters() {
        let filtered = [...this.projects];

        // Filtro de búsqueda
        if (this.currentFilters.search) {
            filtered = filtered.filter(project =>
                project.titulo.toLowerCase().includes(this.currentFilters.search) ||
                project.descripcion.toLowerCase().includes(this.currentFilters.search) ||
                project.arquitecto_nombre.toLowerCase().includes(this.currentFilters.search)
            );
        }

        // Filtro de tipo
        if (this.currentFilters.type) {
            filtered = filtered.filter(project =>
                project.tipo === this.currentFilters.type
            );
        }

        // Ordenamiento
        switch (this.currentFilters.sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.total_vistas || 0) - (a.total_vistas || 0));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating_promedio || 0) - (a.rating_promedio || 0));
                break;
        }

        this.filteredProjects = filtered;
        this.displayProjects(this.filteredProjects);
    }

    /**
     * Muestra los proyectos en la galería.
     * @param {Array} projects - Array de proyectos a mostrar
     * @private
     */
    displayProjects(projects) {
        const grid = document.getElementById('projectsGrid');

        if (!grid) {
            console.error('❌ No se encontró el grid de proyectos');
            return;
        }

        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron proyectos que coincidan con tu búsqueda.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = projects.map(project => this.createProjectCard(project)).join('');
    }

    /**
     * Crea una tarjeta HTML para un proyecto.
     * @param {Object} project - Datos del proyecto
     * @returns {string} HTML de la tarjeta
     * @private
     */
    createProjectCard(project) {
        const imageUrl = project.imagen_principal || '../IMG/project-placeholder.jpg';
        const rating = project.rating_promedio || 0;
        const views = project.total_vistas || 0;

        return `
            <a href="ProyectoDetalle.html?id=${project.id}" class="project-card">
                <div class="project-image">
                    <img src="${imageUrl}" alt="${project.titulo}" onerror="this.src='../IMG/project-placeholder.jpg'">
                    <div class="project-overlay">
                        <span class="project-type">${this.getTypeLabel(project.tipo)}</span>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.titulo}</h3>
                    <p class="project-description">${project.descripcion}</p>
                    <div class="project-meta">
                        <div class="architect-info">
                            <img src="${project.arquitecto_avatar}" alt="${project.arquitecto_nombre}" class="architect-avatar">
                            <span class="architect-name">${project.arquitecto_nombre}</span>
                        </div>
                        <div class="project-stats">
                            <span class="rating">⭐ ${rating.toFixed(1)}</span>
                            <span class="views">👁️ ${views}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    /**
     * Obtiene la etiqueta legible del tipo de proyecto.
     * @param {string} type - Tipo de proyecto
     * @returns {string} Etiqueta legible
     * @private
     */
    getTypeLabel(type) {
        const labels = {
            'residencial': 'Residencial',
            'comercial': 'Comercial',
            'restauracion': 'Restauración',
            'institucional': 'Institucional',
            'industrial': 'Industrial'
        };
        return labels[type] || type;
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si estamos en la página de proyectos
    if (document.getElementById('projectsGrid')) {
        const controller = new ProjectsGalleryController();
        controller.init();
    }
});

export default ProjectsGalleryController;
