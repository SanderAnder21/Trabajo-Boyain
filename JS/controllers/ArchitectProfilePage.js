import { BasePage } from './BasePage.js';
import { DataService } from '../services/DataService.js';
import { Architect } from '../models/Architect.js';
import { Project } from '../models/Project.js';

export class ArchitectProfilePage extends BasePage {
    constructor() {
        super();
        this.dataService = new DataService();
    }

    bindEvents() {
        super.bindEvents();
        this.loadProfile();
    }

    async loadProfile() {
        // Lógica dual:
        // 1. Si hay "?id=X" en la URL, mostramos ese arquitecto (Vista pública)
        // 2. Si no, intentamos mostrar el perfil del usuario logueado (Vista privada)
        
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get('id');
        
        let architectData;

        if (urlId) {
            architectData = await this.dataService.getArchitectById(urlId);
        } else {
            // Verificamos si es un usuario logueado y es arquitecto
            const user = this.authService.getCurrentUser();
            if (user && user.rol === 'arquitecto') {
                // En un caso real, harías fetch al backend con el token del usuario
                // Aquí simulamos que el usuario del localStorage tiene los datos
                architectData = { ...user, id: user.id || 101 }; 
            } else {
                alert('Debes iniciar sesión como arquitecto para ver tu perfil.');
                window.location.href = 'IniciarSesion.html';
                return;
            }
        }

        if (architectData) {
            const architect = new Architect(architectData);
            this.renderProfile(architect);
            this.loadProjects(architect.id);
        }
    }

    renderProfile(architect) {
        const container = document.getElementById('profile-container');
        if (container) {
            container.innerHTML = architect.toHTMLProfile();
        }
    }

    async loadProjects(architectId) {
        const projectsGrid = document.getElementById('architect-projects-grid');
        if (!projectsGrid) return;

        const rawProjects = await this.dataService.getProjectsByArchitect(architectId);
        const projects = rawProjects.map(p => new Project(p));

        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p>Este arquitecto aún no ha subido proyectos.</p>';
            return;
        }

        // Reutilizamos el método del modelo Project para generar las cards
        projectsGrid.innerHTML = projects.map(p => p.toHTMLCard()).join('');
    }
}