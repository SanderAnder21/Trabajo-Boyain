import { BasePage } from './BasePage.js';
import { Project } from '../models/Project.js';
import { Architect } from '../models/Architect.js';

/**
 * Controlador para las páginas de listado de Proyectos (Proyectos.html) y Mis Proyectos (MisProyectos.html).
 * Maneja las pestañas, filtros, búsquedas y el renderizado de tarjetas.
 */
export class ProjectListPage extends BasePage {

    /**
     * @param {import('../services/AuthService').AuthService} authService 
     * @param {import('../services/UIService').UIService} uiService 
     * @param {import('../services/DataService').DataService} dataService 
     */
    constructor(authService, uiService, dataService) {
        super(authService, uiService);
        this.dataService = dataService;
        this.projects = [];
        this.architects = [];
        this.isMisProyectosPage = window.location.pathname.includes('MisProyectos.html');
    }

    init() {
        console.log(`✨ ProjectListPage: Inicializando controlador para ${this.isMisProyectosPage ? 'Mis Proyectos' : 'Proyectos'}.`);

        // Determinar la pestaña inicial para el UIService
        const defaultTab = this.isMisProyectosPage ? 'publicados' : 'explore-projects';
        this.uiService.setupTabs(defaultTab);

        this.loadInitialData();
        this.setupFilters();
    }

    async loadInitialData() {
        try {
            this.projects = await this.dataService.getProjects();

            this.architects = this.simulateArchitects();

            this.renderContent();

        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            this.uiService.showAlert('No se pudieron cargar los datos de proyectos.', true);
        }
    }

    simulateArchitects() {
        const rawArchitects = [
            { id: 1, nombre: "María González", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", especialidad: "Arquitectura Residencial" },
            { id: 2, nombre: "Carlos Rodríguez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", especialidad: "Arquitectura Comercial" }
        ];
        return rawArchitects.map(data => Architect.fromData(data));
    }

    renderContent() {
        if (!this.isMisProyectosPage) {
            this.renderProjectsGrid(document.getElementById('projectsGrid'), this.projects);
            this.renderArchitectsGrid(document.getElementById('architectsGrid'), this.architects);
        } else {
            const userProjects = this.projects.filter(p => p.architect.id === this.authService.getUserData()?.id);
            this.renderProjectsGrid(document.getElementById('publicados').querySelector('.projects-grid'), userProjects);
        }
    }


    renderProjectsGrid(container, projectList) {
        if (!container) return;

        if (projectList.length === 0) {
            container.innerHTML = `<div class="no-projects"><p>No hay proyectos disponibles en esta categoría.</p></div>`;
            return;
        }

        container.innerHTML = projectList.map(projectData => {
            const project = Project.fromData(projectData);

            const architect = Architect.fromData(project.architect);

            return this.createProjectCard(project, architect);
        }).join('');
    }

    createProjectCard(project, architect) {
        const fileIcon = this.getFileTypeIcon(project.fileType);

        return `
            <a href="ProyectoDetalle.html?id=${project.id}" class="project-card">
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='../IMG/default-project.jpg'">
                    <div class="file-type-badge">${fileIcon}</div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    
                    <div class="project-architect">
                        <img src="${architect.avatar}" alt="${architect.name}" class="architect-avatar" onerror="this.src='../IMG/default-avatar.jpg'">
                        <span class="architect-name">${architect.name}</span>
                    </div>
                    
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="project-meta">
                        <div class="project-rating">
                            <span class="star">⭐</span>
                            <span>${project.rating.toFixed(1)}</span>
                            <span>(${project.views} vistas)</span>
                        </div>
                        <span>${project.getFormattedDate()}</span>
                    </div>
                </div>
            </a>
        `;
    }

    getFileTypeIcon(fileType) {
        const icons = {
            'images': '🖼️',
            'pdf': '📄',
            '3d': '🎮'
        };
        return icons[fileType] || '📁';
    }

    // --- Renderizado de Arquitectos ---

    renderArchitectsGrid(container, architectList) {
        if (!container) return;

        if (architectList.length === 0) {
            container.innerHTML = `<div class="no-projects"><p>No se encontraron arquitectos con estos criterios.</p></div>`;
            return;
        }

        container.innerHTML = architectList.map(architect => `
            <a href="${architect.getProfileUrl()}" class="architect-card">
                <img src="${architect.avatar}" alt="${architect.name}" class="architect-avatar">
                <h3 class="architect-name">${architect.name}</h3>
                <p class="architect-specialty">${architect.specialty}</p>
            </a>
        `).join('');
    }


    setupFilters() {
        if (this.isMisProyectosPage) return;

        // Elementos de filtros de Proyectos.html
        const searchInput = document.getElementById('projectSearch');
        const styleFilter = document.getElementById('filterStyle');
        const typeFilter = document.getElementById('filterType');
        const sortFilter = document.getElementById('filterSort');
        const architectSearch = document.getElementById('architectSearch');

        if (searchInput) searchInput.addEventListener('input', () => this.filterProjects());
        if (styleFilter) styleFilter.addEventListener('change', () => this.filterProjects());
        if (typeFilter) typeFilter.addEventListener('change', () => this.filterProjects());
        if (sortFilter) sortFilter.addEventListener('change', () => this.filterProjects());

        if (architectSearch) architectSearch.addEventListener('input', () => this.filterArchitects());
    }

    filterProjects() {
        const searchTerm = document.getElementById('projectSearch')?.value.toLowerCase() || '';
        const styleFilter = document.getElementById('filterStyle')?.value || '';
        const typeFilter = document.getElementById('filterType')?.value || '';
        const sortFilter = document.getElementById('filterSort')?.value || 'newest';

        let filtered = this.projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                project.architect.name.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm);

            // Los estilos están en un array de strings en el modelo
            const matchesStyle = !styleFilter || (project.styles && project.styles.includes(styleFilter));
            const matchesType = !typeFilter || project.type === typeFilter;

            return matchesSearch && matchesStyle && matchesType;
        });

        this.sortProjects(filtered, sortFilter);
        this.renderProjectsGrid(document.getElementById('projectsGrid'), filtered);
    }

    filterArchitects() {
        const searchTerm = document.getElementById('architectSearch')?.value.toLowerCase() || '';

        let filtered = this.architects.filter(architect => {
            return architect.name.toLowerCase().includes(searchTerm) ||
                architect.specialty.toLowerCase().includes(searchTerm);
        });

        this.renderArchitectsGrid(document.getElementById('architectsGrid'), filtered);
    }

    sortProjects(projectList, sortBy) {
        switch (sortBy) {
            case 'newest':
                projectList.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                projectList.sort((a, b) => b.views - a.views);
                break;
            case 'rating':
                projectList.sort((a, b) => b.rating - a.rating);
                break;
        }
    }
}