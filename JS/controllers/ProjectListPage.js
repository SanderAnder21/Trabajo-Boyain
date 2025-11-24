import { BasePage } from './BasePage.js';
import { DataService } from '../services/DataService.js';
import { Project } from '../models/Project.js';

/**
 * Controlador para la página de Lista de Proyectos.
 */
export class ProjectListPage extends BasePage {
    constructor() {
        super(); // Inicializa navbar y footer
        this.dataService = new DataService();
        this.currentFilter = 'Todos';
    }

    /**
     * Sobrescribimos bindEvents para agregar la lógica de filtros
     */
    bindEvents() {
        super.bindEvents(); // Mantener eventos del padre (logout, etc)

        // Eventos de botones de filtro
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.#handleFilterClick(e));
        });

        // Carga inicial de datos
        this.loadAndRenderProjects();
    }

    /**
     * Maneja el click en los filtros
     */
    #handleFilterClick(e) {
        // 1. Visual: Cambiar clase activa
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // 2. Lógica: Obtener filtro y recargar
        this.currentFilter = e.target.dataset.filter; // Asegúrate que el HTML tenga data-filter="Residencial"
        this.loadAndRenderProjects();
    }

    /**
     * Carga datos del servicio y renderiza
     */
    async loadAndRenderProjects() {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        // Mostrar spinner de carga (opcional)
        grid.innerHTML = '<div class="loader">Cargando proyectos...</div>';

        try {
            // Obtener datos crudos
            const rawData = await this.dataService.getProjectsByCategory(this.currentFilter);

            // Convertir a objetos Modelo
            const projects = rawData.map(data => new Project(data));

            // Renderizar
            this.#renderGrid(projects, grid);

        } catch (error) {
            console.error(error);
            grid.innerHTML = '<p class="error">Hubo un error cargando los proyectos.</p>';
        }
    }

    /**
     * Genera el HTML final
     */
    #renderGrid(projects, container) {
        if (projects.length === 0) {
            container.innerHTML = '<p class="no-results">No se encontraron proyectos en esta categoría.</p>';
            return;
        }

        // Usamos el método del modelo para generar la tarjeta
        container.innerHTML = projects.map(project => project.toHTMLCard()).join('');
        
        // Aquí podrías añadir animaciones de entrada si quisieras
    }
}