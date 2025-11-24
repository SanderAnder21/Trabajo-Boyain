import { DOMUtils } from '../utils/DOMUtils.js';
import { PageController } from './PageController.js';
import { ArchitectService } from '../services/ArchitectService.js';
import { ProjectService } from '../services/ProjectService.js';

/**
 * Controlador de Perfil de Arquitecto
 */
export class ArchitectController extends PageController {
    constructor() {
        super();
        this.architectService = new ArchitectService();
        this.projectService = new ProjectService();
    }

    async init() {
        super.init();
        console.log('👤 ArchitectController inicializado');
        
        const urlParams = new URLSearchParams(window.location.search);
        const architectId = urlParams.get('id');
        
        if (!architectId) {
            this.showError('ID de arquitecto no especificado');
            return;
        }
        
        await this.loadArchitectProfile(architectId);
    }

    async loadArchitectProfile(architectId) {
        try {
            this.showLoading('Cargando perfil...');
            
            const architect = await this.architectService.getArchitectById(architectId);
            
            if (!architect) {
                throw new Error('Arquitecto no encontrado');
            }
            
            this.renderProfile(architect);
            await this.loadArchitectProjects(architectId);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error cargando perfil:', error);
            this.hideLoading();
            this.showError('Error al cargar el perfil');
        }
    }

    renderProfile(architect) {
        // Información básica
        const avatarElement = DOMUtils.getElementById('perfil-avatar');
        const nameElement = DOMUtils.getElementById('perfil-nombre');
        const specialtyElement = DOMUtils.getElementById('perfil-especialidad');
        const emailElement = DOMUtils.getElementById('perfil-email');
        const bioElement = DOMUtils.getElementById('perfil-bio');
        
        if (avatarElement) avatarElement.src = architect.avatar;
        if (nameElement) nameElement.textContent = architect.name;
        if (specialtyElement) specialtyElement.textContent = architect.specialty;
        if (bioElement) bioElement.textContent = architect.bio;
        
        if (emailElement) {
            emailElement.textContent = architect.contact;
            emailElement.href = `mailto:${architect.contact}`;
        }
        
        // Redes sociales
        const redesContainer = DOMUtils.getElementById('perfil-redes');
        if (redesContainer) {
            redesContainer.innerHTML = this.renderSocialLinks(architect.social);
        }
    }

    renderSocialLinks(social) {
        if (!social || Object.keys(social).length === 0) {
            return '';
        }
        
        let html = '';
        if (social.linkedin) {
            html += `<a href="${social.linkedin}" target="_blank">LinkedIn</a>`;
        }
        if (social.instagram) {
            html += `<a href="${social.instagram}" target="_blank">Instagram</a>`;
        }
        if (social.behance) {
            html += `<a href="${social.behance}" target="_blank">Behance</a>`;
        }
        
        return html;
    }

    async loadArchitectProjects(architectId) {
        try {
            const projects = await this.projectService.getProjectsByArchitect(architectId);
            this.renderProjects(projects);
        } catch (error) {
            console.error('Error cargando proyectos del arquitecto:', error);
        }
    }

    renderProjects(projects) {
        const grid = DOMUtils.getElementById('proyectosArquitecto');
        
        if (!grid) return;
        
        if (projects.length === 0) {
            grid.innerHTML = '<p>Este arquitecto aún no tiene proyectos publicados.</p>';
            return;
        }
        
        grid.innerHTML = projects.map(project => project.toCard()).join('');
    }
}