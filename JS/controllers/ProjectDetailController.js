// JS/controllers/ProjectDetailController.js

import { BasePage } from './BasePage.js';
import FavoritesController from './FavoritesController.js';
import RatingController from './RatingController.js';

/**
 * Controlador para la página de Detalle de Proyecto (ProyectoDetalle.html).
 * Maneja la carga de datos, la galería de archivos, el modal de contacto y las calificaciones.
 */
export class ProjectDetailController extends BasePage {

    /**
     * @param {import('../services/AuthService').AuthService} authService 
     * @param {import('../services/UIService').UIService} uiService 
     * @param {import('../services/DataService').DataService} dataService 
     */
    constructor(authService, uiService, dataService) {
        super(authService, uiService);
        this.dataService = dataService;
        this.projectId = this.getProjectIdFromURL();
        this.project = null;
        this.favoritesController = new FavoritesController();
        this.ratingController = new RatingController();
    }

    getProjectIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        console.log(`✨ ProjectDetailController: Inicializando para ID: ${this.projectId}`);

        if (!this.projectId) {
            this.uiService.showAlert('ID de proyecto no encontrado en la URL.', true);
            this.uiService.redirect('Proyectos.html');
            return;
        }

        await this.loadProjectDetails();
        this.setupFileTabs();
        this.setupEventListeners();

        // Inicializar controladores de favoritos y calificaciones
        if (this.projectId) {
            this.favoritesController.initDetail(this.projectId);
            this.ratingController.init(this.projectId);
        }
    }

    async loadProjectDetails() {
        try {
            // Cargar proyecto desde la API
            const response = await fetch(`/api/projects/${this.projectId}`);
            const data = await response.json();

            if (!response.ok) {
                this.uiService.showAlert('El proyecto solicitado no existe.', true);
                this.uiService.redirect('Proyectos.html');
                return;
            }

            this.project = data.project;
            this.renderProject();

        } catch (error) {
            console.error('Error cargando detalles del proyecto:', error);
            this.uiService.showAlert('Error al cargar la información del proyecto.', true);
        }
    }

    renderProject() {
        if (!this.project) return;

        document.title = `${this.project.titulo} - PortArq`;

        // --- Header e Info Principal ---
        document.getElementById('projectTitle').textContent = this.project.titulo;
        document.getElementById('projectMainImage').src = this.project.imagen_principal || '../IMG/project-placeholder.jpg';
        document.getElementById('projectFullDescription').innerHTML = this.formatDescription(this.project.descripcion_completa || this.project.descripcion);

        // Renderizar detalles técnicos
        this.renderProjectDetails();

        // Renderizar archivos y media
        this.renderFiles();

        // --- Arquitecto ---
        this.renderArchitectInfo();

        // --- Estadísticas ---
        document.getElementById('projectDate').textContent = new Date(this.project.fecha_publicacion).toLocaleDateString();
    }

    renderArchitectInfo() {
        const architectLink = `PerfilArquitecto.html?id=${this.project.usuario_id}`;

        const architectInfo = document.querySelector('.architect-info');
        if (architectInfo) {
            architectInfo.innerHTML = `
                <a href="${architectLink}">
                    <img id="architectAvatar" src="${this.project.arquitecto_avatar || '../IMG/default-avatar.png'}" alt="${this.project.arquitecto_nombre}" class="architect-avatar-large">
                </a>
                <div class="architect-details">
                    <a href="${architectLink}" style="text-decoration: none; color: inherit;">
                        <h3 id="architectName">${this.project.arquitecto_nombre}</h3>
                    </a>
                    <p id="architectSpecialty" class="architect-specialty">${this.project.arquitecto_especialidad || 'Arquitecto'}</p>
                    <button class="contact-architect">Contactar Arquitecto</button>
                </div>
            `;

            architectInfo.querySelector('.contact-architect')?.addEventListener('click', () => {
                this.contactArchitect();
            });
        }
    }

    renderProjectDetails() {
        const descriptionElement = document.getElementById('projectFullDescription');
        if (!descriptionElement || descriptionElement.nextElementSibling?.classList.contains('project-details-grid')) return;

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'project-details-grid';
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <strong>Ubicación:</strong> ${this.project.ubicacion || 'No especificada'}
            </div>
            <div class="detail-item">
                <strong>Área Construida:</strong> ${this.project.area_construida || 'No especificada'}
            </div>
            <div class="detail-item">
                <strong>Presupuesto:</strong> ${this.project.presupuesto || 'No especificado'}
            </div>
            <div class="detail-item">
                <strong>Duración:</strong> ${this.project.duracion || 'No especificada'}
            </div>
        `;

        descriptionElement.parentNode.insertBefore(detailsContainer, descriptionElement.nextSibling);
    }

    setupFileTabs() {
        const tabs = document.querySelectorAll('.files-tabs .file-tab');
        const panes = document.querySelectorAll('.files-content .file-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const tabName = tab.getAttribute('data-tab');
                document.getElementById(`${tabName}-pane`).classList.add('active');
            });
        });
    }

    renderFiles() {
        this.renderImages();
        this.renderPDFs();
        this.render3DModels();
        this.hideEmptyTabs();
    }

    renderImages() {
        const imagesGrid = document.getElementById('imagesGrid');
        const images = this.project.imagenes_galeria || [];

        if (!imagesGrid) return;

        if (images.length > 0) {
            imagesGrid.innerHTML = images.map((img, index) => `
                <div class="image-item" data-src="${img.url_imagen}" data-alt="Imagen ${index + 1}">
                    <img src="${img.url_imagen}" alt="Imagen ${index + 1}" loading="lazy">
                    <div class="image-overlay">
                        <span class="zoom-icon">🔍</span>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.image-item').forEach(item => {
                item.addEventListener('click', () => {
                    const src = item.dataset.src;
                    const alt = item.dataset.alt;
                    this.openImageModal(src, alt);
                });
            });

        } else {
            imagesGrid.innerHTML = `<div class="no-files-message"><p>No hay imágenes adicionales.</p></div>`;
        }
    }

    renderPDFs() {
        const pdfPane = document.getElementById('pdfs-pane');
        const pdfFiles = (this.project.archivos || []).filter(f => f.tipo_archivo === 'pdf');

        if (!pdfPane) return;

        if (pdfFiles.length > 0) {
            pdfPane.innerHTML = `
                <div class="pdf-list" style="display: grid; gap: 10px;">
                    ${pdfFiles.map(pdf => `
                        <div class="pdf-item" style="padding: 10px; background: #f5f5f5; border-radius: 5px; display: flex; align-items: center;">
                            <span style="font-size: 1.5rem; margin-right: 10px;">📄</span>
                            <a href="${pdf.url_archivo}" target="_blank" class="pdf-link" style="text-decoration: none; color: #333; font-weight: 500;">
                                ${pdf.nombre_archivo}
                            </a>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            pdfPane.innerHTML = `<div class="no-files-message"><p>No hay planos disponibles.</p></div>`;
        }
    }

    render3DModels() {
        const modelPane = document.getElementById('3d-pane');
        const modelFiles = (this.project.archivos || []).filter(f => f.tipo_archivo === 'modelo3d');

        if (!modelPane) return;

        if (modelFiles.length > 0) {
            // Tomamos el primero por ahora
            const modelUrl = modelFiles[0].url_archivo;
            modelPane.innerHTML = `
                <model-viewer 
                    src="${modelUrl}" 
                    alt="Modelo 3D del proyecto" 
                    auto-rotate 
                    camera-controls 
                    shadow-intensity="1"
                    style="width: 100%; height: 500px; background-color: #f0f0f0; border-radius: 8px;">
                </model-viewer>
                <p style="text-align: center; margin-top: 10px; color: #666;">${modelFiles[0].nombre_archivo}</p>
            `;
        } else {
            modelPane.innerHTML = `<div class="no-files-message"><p>No hay modelo 3D disponible.</p></div>`;
        }
    }

    hideEmptyTabs() {
        const pdfFiles = (this.project.archivos || []).filter(f => f.tipo_archivo === 'pdf');
        const modelFiles = (this.project.archivos || []).filter(f => f.tipo_archivo === 'modelo3d');
        const images = this.project.imagenes_galeria || [];

        if (images.length === 0) {
            const imagesTab = document.querySelector('.file-tab[data-tab="images"]');
            if (imagesTab) imagesTab.style.display = 'none';
        }
        if (pdfFiles.length === 0) {
            const pdfsTab = document.querySelector('.file-tab[data-tab="pdfs"]');
            if (pdfsTab) pdfsTab.style.display = 'none';
        }
        if (modelFiles.length === 0) {
            const modelTab = document.querySelector('.file-tab[data-tab="3d"]');
            if (modelTab) modelTab.style.display = 'none';
        }

        const activeTab = document.querySelector('.files-tabs .file-tab.active');
        if (activeTab && activeTab.style.display === 'none') {
            const firstVisibleTab = document.querySelector('.files-tabs .file-tab:not([style*="display: none"])');
            if (firstVisibleTab) {
                firstVisibleTab.click();
            }
        }
    }

    formatDescription(text) {
        if (!text) return '';
        let html = text.replace(/## (.*?)\n/g, '\n<h4>$1</h4>\n');
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        if (!html.startsWith('<p>')) {
            html = `<p>${html}</p>`;
        }
        return html;
    }

    setupEventListeners() {
        const contactBtn = document.querySelector('.contact-architect');
        const contactModal = document.getElementById('contactModal');
        const closeModalBtn = contactModal?.querySelector('.close-contact-modal');

        contactBtn?.addEventListener('click', () => this.contactArchitect());
        closeModalBtn?.addEventListener('click', () => this.closeContactModal());
        contactModal?.addEventListener('click', (e) => {
            if (e.target === contactModal) this.closeContactModal();
        });
    }

    contactArchitect() {
        const modal = document.getElementById('contactModal');
        if (!modal) return;

        document.getElementById('modalArchitectAvatar').src = this.project.arquitecto_avatar || '../IMG/default-avatar.png';
        document.getElementById('modalArchitectName').textContent = this.project.arquitecto_nombre;
        document.getElementById('modalArchitectSpecialty').textContent = this.project.arquitecto_especialidad || 'Arquitecto';

        const emailLink = document.getElementById('modalArchitectEmail');
        if (this.project.arquitecto_email) {
            emailLink.textContent = this.project.arquitecto_email;
            emailLink.href = `mailto:${this.project.arquitecto_email}`;
        } else {
            emailLink.textContent = 'No disponible';
            emailLink.removeAttribute('href');
        }

        document.getElementById('modalArchitectBio').textContent = this.project.arquitecto_biografia || 'No hay biografía disponible.';

        modal.style.display = 'flex';
    }

    closeContactModal() {
        document.getElementById('contactModal').style.display = 'none';
    }

    openImageModal(src, alt) {
        this.uiService.showAlert(`Abriendo imagen: ${alt}`);
    }
}