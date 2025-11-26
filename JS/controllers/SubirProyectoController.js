// JS/controllers/SubirProyectoController.js

import { AuthService } from '../services/AuthService.js';
import { UIService } from '../services/UIService.js';
import { DataService } from '../services/DataService.js';
import UploadProjectController from './UploadProjectController.js';

/**
 * Controlador principal para la página SubirProyecto.html
 * Se encarga de inicializar el UploadProjectController con sus dependencias
 * Y cargar los proyectos reales del usuario
 */
export class SubirProyectoController {
    constructor() {
        this.authService = new AuthService();
        this.uiService = new UIService();
        this.dataService = new DataService();
        this.currentUser = null;
    }

    async init() {
        console.log('🚀 SubirProyectoController: Inicializando...');
        
        // Verificar autenticación y rol
        if (!this.authService.isAuthenticated()) {
            this.uiService.redirect('IniciarSesion.html');
            return;
        }

        if (this.authService.getUserRole() !== 'arquitecto') {
            alert('❌ Solo los arquitectos pueden subir proyectos');
            this.uiService.redirect('../INDEX.html');
            return;
        }

        this.currentUser = this.authService.getUserData();

        // Inicializar el controlador específico de subida de proyectos
        const uploadController = new UploadProjectController(
            this.authService,
            this.uiService, 
            this.dataService
        );
        uploadController.init();

        // Cargar proyectos reales del usuario
        //await this.loadUserProjects();

        console.log('✅ SubirProyectoController: Inicializado correctamente');
    }

    /**
     * Carga los proyectos reales del usuario desde el backend
     */
    async loadUserProjects() {
        try {
            console.log('📦 Cargando proyectos reales del usuario...');
            
            const userProjects = await this.dataService.getUserProjects(this.currentUser.id);
            
            if (userProjects && userProjects.length > 0) {
                this.renderUserProjects(userProjects);
            } else {
                this.showNoProjectsMessage();
            }
            
        } catch (error) {
            console.error('❌ Error cargando proyectos:', error);
            this.showErrorLoadingProjects();
        }
    }

    /**
     * Renderiza los proyectos del usuario en la sección lateral
     */
    renderUserProjects(projects) {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        // Limpiar contenido estático
        projectsList.innerHTML = '';

        projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsList.appendChild(projectCard);
        });

        console.log(`✅ Mostrando ${projects.length} proyectos reales`);
    }

    /**
     * Crea una tarjeta de proyecto para la sección lateral
     */
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.innerHTML = `
            <h3>${project.titulo || 'Proyecto sin título'}</h3>
            <div class="project-meta">
                <small>Subido: ${new Date(project.fecha_publicacion).toLocaleDateString('es-ES')}</small>
                <small>Vistas: ${project.total_vistas || 0}</small>
            </div>
            <div class="project-tags">
                <span class="project-tag">${this.getProjectTypeLabel(project.tipo)}</span>
            </div>
            <p class="project-description">${project.descripcion || 'Sin descripción'}</p>
            <div class="project-actions">
                <button class="btn-editar" onclick="editProject(${project.id})">Editar</button>
                <button class="btn-eliminar" onclick="deleteProject(${project.id})">Eliminar</button>
            </div>
        `;

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
        const projectsList = document.getElementById('projectsList');
        if (projectsList) {
            projectsList.innerHTML = `
                <div class="no-projects">
                    <p>No hay proyectos subidos aún.</p>
                </div>
            `;
        }
    }

    /**
     * Muestra mensaje de error al cargar proyectos
     */
    showErrorLoadingProjects() {
        const projectsList = document.getElementById('projectsList');
        if (projectsList) {
            projectsList.innerHTML = `
                <div class="no-projects">
                    <p>Error al cargar proyectos.</p>
                </div>
            `;
        }
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    const controller = new SubirProyectoController();
    controller.init();
});