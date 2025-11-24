// JS/controllers/ArchitectProfileController.js

import { BasePage } from './BasePage.js';
import { Architect } from '../models/Architect.js';
import { Project } from '../models/Project.js';

/**
 * Controlador para la página de Perfil de Arquitecto (PerfilArquitecto.html).
 * Maneja la carga y renderizado del perfil público y sus proyectos.
 */
export class ArchitectProfileController extends BasePage {
    
    /**
     * @param {import('../services/AuthService').AuthService} authService 
     * @param {import('../services/UIService').UIService} uiService 
     * @param {import('../services/DataService').DataService} dataService 
     */
    constructor(authService, uiService, dataService) {
        super(authService, uiService);
        this.dataService = dataService;
        this.architectId = this.getArchitectIdFromURL();
        this.architect = null;
    }

    getArchitectIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        // Retorna el ID del URL o el ID 1 como fallback si no hay ID (igual que el archivo original)
        return urlParams.get('id') || 1; 
    }

    init() {
        console.log(`✨ ArchitectProfileController: Inicializando para ID: ${this.architectId}`);
        this.loadArchitectData();
    }

    async loadArchitectData() {
        try {
            // Simulación de obtener el perfil de un arquitecto
            // Se asume un método `getArchitectById` en DataService (que ahora mismo no existe)
            
            // Simulación: Buscamos un arquitecto simulado de la lista de proyectos (o usaremos uno dummy)
            const allProjects = await this.dataService.getProjects();
            const project = allProjects.find(p => p.architect.id === parseInt(this.architectId));
            
            const rawData = project ? project.architect : { id: this.architectId, nombre: 'Arquitecto Desconocido' };
            
            this.architect = Architect.fromData(rawData);

            this.renderArchitectInfo();
            this.renderArchitectProjects(allProjects);

        } catch (error) {
            console.error('Error cargando datos del arquitecto:', error);
            this.uiService.showAlert('Error al cargar el perfil del arquitecto.', true);
        }
    }

    renderArchitectInfo() {
        if (!this.architect) return; 

        document.title = `${this.architect.name} - PortArq`; 

        document.getElementById('perfil-avatar').src = this.architect.avatar;
        document.getElementById('perfil-avatar').alt = this.architect.name;
        document.getElementById('perfil-nombre').textContent = this.architect.name;
        document.getElementById('perfil-especialidad').textContent = this.architect.specialty;
        
        const emailElement = document.getElementById('perfil-email');
        if (emailElement) {
            emailElement.textContent = this.architect.contact;
            emailElement.href = `mailto:${this.architect.contact}`;
        }
        
        document.getElementById('perfil-bio').textContent = this.architect.bio;

        // Renderizar redes sociales
        const redesContainer = document.getElementById('perfil-redes');
        if (redesContainer) {
            redesContainer.innerHTML = ''; 
            // Esto asume que el Architect Model incluye un objeto `social`
            const social = this.architect.social || {};
            if (social.linkedin) redesContainer.innerHTML += `<a href="${social.linkedin}" target="_blank">LinkedIn</a>`;
            if (social.instagram) redesContainer.innerHTML += `<a href="${social.instagram}" target="_blank">Instagram</a>`;
            if (social.behance) redesContainer.innerHTML += `<a href="${social.behance}" target="_blank">Behance</a>`;
        }
    }

    renderArchitectProjects(allProjects) {
        const grid = document.getElementById('proyectosArquitecto'); 
        if (!grid) return;

        // Filtramos solo los proyectos de este arquitecto
        const architectProjects = allProjects.filter(project => 
            project.architect.id === this.architect.id
        );

        if (architectProjects.length === 0) {
            grid.innerHTML = "<p>Este arquitecto aún no tiene proyectos publicados.</p>";
            return;
        }

        // Reutilizamos el renderizado simple de tarjeta para la sección de proyectos del perfil
        grid.innerHTML = architectProjects.map(projectData => {
            const project = Project.fromData(projectData);

            return `
                <a href="ProyectoDetalle.html?id=${project.id}" class="project-card">
                    <div class="project-image-container">
                        <img src="${project.image}" alt="${project.title}" class="project-image">
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-meta">
                            <div class="project-rating">
                                <span class="star">⭐</span>
                                <span>${project.rating.toFixed(1)}</span>
                            </div>
                            <span>${project.getFormattedDate()}</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }
}