import { BasePage } from './BasePage.js';
import { DataService } from '../services/DataService.js';
import { Project } from '../models/Project.js';

export class ProjectDetailPage extends BasePage {
    constructor() {
        super();
        this.dataService = new DataService();
    }

    bindEvents() {
        super.bindEvents();
        this.loadProjectDetails();
    }

    async loadProjectDetails() {
        // 1. Obtener el ID de la URL (ej: ?id=1)
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');

        if (!projectId) {
            alert('Proyecto no especificado');
            window.location.href = 'Proyectos.html';
            return;
        }

        try {
            const rawData = await this.dataService.getProjectById(projectId);
            if (!rawData) throw new Error('Proyecto no encontrado');

            const project = new Project(rawData);
            this.render(project);
            
        } catch (error) {
            console.error(error);
            document.getElementById('project-content').innerHTML = '<h1>Error al cargar el proyecto</h1>';
        }
    }

    render(project) {
        // Inyectar textos
        this.setText('project-title', project.title);
        this.setText('project-description', project.description);
        this.setText('project-category', project.category);
        this.setText('project-location', `📍 ${project.location}`);
        this.setText('project-date', `📅 ${project.formattedDate}`);

        // Inyectar imagen principal
        const mainImg = document.getElementById('main-project-image');
        if (mainImg) mainImg.src = project.image;

        // Botón de contactar
        const contactBtn = document.getElementById('contact-architect-btn');
        if (contactBtn) {
            contactBtn.onclick = () => {
                // Validar si está logueado antes de contactar
                if (this.authService.requireAuth()) {
                    alert(`Mensaje enviado al arquitecto del proyecto: ${project.title}`);
                }
            };
        }
    }

    // Helper para simplificar inyecciones de texto
    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
}