// JS/controllers/ProjectDetailController.js

import { BasePage } from './BasePage.js';
import { Project } from '../models/Project.js';
import { Architect } from '../models/Architect.js';

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
    }

    getProjectIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        // Retorna el ID del URL o null/undefined si no está.
        return urlParams.get('id');
    }

    init() {
        console.log(`✨ ProjectDetailController: Inicializando para ID: ${this.projectId}`);

        if (!this.projectId) {
            this.uiService.showAlert('ID de proyecto no encontrado en la URL.', true);
            this.uiService.redirect('Proyectos.html');
            return;
        }

        this.loadProjectDetails();
        this.setupFileTabs(); // Maneja las pestañas de Imágenes, PDF, 3D
        this.setupEventListeners();
    }

    async loadProjectDetails() {
        try {
            // Llama al DataService para obtener el proyecto (Se asume la existencia de getProjectById)
            // Ya que DataService solo tiene getProjects(), lo simulamos buscando en la lista completa:
            const allProjects = await this.dataService.getProjects();
            const rawData = allProjects.find(p => p.id === parseInt(this.projectId));

            if (!rawData) {
                this.uiService.showAlert('El proyecto solicitado no existe.', true);
                this.uiService.redirect('Proyectos.html');
                return;
            }
            
            // Creación del Modelo Project
            this.project = Project.fromData(rawData);
            this.renderProject();

        } catch (error) {
            console.error('Error cargando detalles del proyecto:', error);
            this.uiService.showAlert('Error al cargar la información del proyecto.', true);
        }
    }

    renderProject() {
        if (!this.project) return;
        
        document.title = `${this.project.title} - PortArq`;
        
        // --- Header e Info Principal ---
        document.getElementById('projectTitle').textContent = this.project.title;
        document.getElementById('projectMainImage').src = this.project.image;
        document.getElementById('projectFullDescription').innerHTML = this.formatDescription(this.project.fullDescription || this.project.description);

        // Renderizar etiquetas
        this.renderTags();

        // Renderizar detalles técnicos (Ubicación, Área, etc.)
        this.renderProjectDetails();
        
        // Renderizar archivos y media
        this.renderFiles(); 
        
        // --- Arquitecto ---
        const architect = Architect.fromData(this.project.architect); 
        this.renderArchitectInfo(architect);
        
        // --- Estadísticas y Rating ---
        document.getElementById('projectRating').textContent = this.project.rating.toFixed(1);
        document.getElementById('projectDate').textContent = this.project.getFormattedDate();
        this.setupRating();
    }

    renderArchitectInfo(architect) {
        const architectLink = `PerfilArquitecto.html?id=${architect.id}`;
        
        // Actualiza el HTML del bloque de arquitecto
        const architectInfo = document.querySelector('.architect-info');
        if (architectInfo) {
             architectInfo.innerHTML = `
                <a href="${architectLink}">
                    <img id="architectAvatar" src="${architect.avatar}" alt="${architect.name}" class="architect-avatar-large">
                </a>
                <div class="architect-details">
                    <a href="${architectLink}" style="text-decoration: none; color: inherit;">
                        <h3 id="architectName">${architect.name}</h3>
                    </a>
                    <p id="architectSpecialty" class="architect-specialty">${architect.specialty}</p>
                    <button class="contact-architect">Contactar Arquitecto</button>
                </div>
            `;
            // Re-adjuntar listener de contacto al nuevo botón
            architectInfo.querySelector('.contact-architect')?.addEventListener('click', () => {
                this.contactArchitect(architect);
            });
        }
    }

    renderTags() {
        const tagsContainer = document.getElementById('projectTagsFull');
        if (!tagsContainer) return;

        const allTags = this.project.tags; // Usar el array de tags del modelo
        tagsContainer.innerHTML = allTags.map(tag =>
            `<span class="project-tag-large">${tag}</span>`
        ).join('');
    }

    renderProjectDetails() {
        // Renderiza el grid de detalles técnicos bajo la descripción
        const descriptionElement = document.getElementById('projectFullDescription');
        if (!descriptionElement || descriptionElement.nextElementSibling?.classList.contains('project-details-grid')) return;

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'project-details-grid';
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <strong>Ubicación:</strong> ${this.project.location}
            </div>
            <div class="detail-item">
                <strong>Área Construida:</strong> ${this.project.area}
            </div>
            <div class="detail-item">
                <strong>Presupuesto:</strong> ${this.project.budget}
            </div>
            <div class="detail-item">
                <strong>Duración:</strong> ${this.project.duration}
            </div>
        `;

        descriptionElement.parentNode.insertBefore(detailsContainer, descriptionElement.nextSibling);
    }
    
    // --- Gestión de Archivos y Pestañas ---

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
        // Llama a las funciones de renderizado de media
        this.renderImages();
        this.renderPDFs();
        this.render3DModels();

        // Ocultar pestañas que no tienen contenido
        this.hideEmptyTabs();
    }
    
    renderImages() {
        const imagesGrid = document.getElementById('imagesGrid');
        const images = this.project.images;
        
        if (!imagesGrid) return;
        
        if (images && images.length > 0) {
            imagesGrid.innerHTML = images.map((image, index) => `
                <div class="image-item" data-src="${image}" data-alt="Imagen ${index + 1}">
                    <img src="${image}" alt="Imagen ${index + 1} del proyecto" loading="lazy">
                    <div class="image-overlay">
                        <span class="zoom-icon">🔍</span>
                    </div>
                </div>
            `).join('');

            // Adjuntar listener de modal (delegación de eventos si fuera un grid grande)
            document.querySelectorAll('.image-item').forEach(item => {
                item.addEventListener('click', () => {
                    const src = item.dataset.src;
                    const alt = item.dataset.alt;
                    this.openImageModal(src, alt); // Implementación simplificada
                });
            });

        } else {
            imagesGrid.innerHTML = `<div class="no-files-message"><p>No hay imágenes disponibles para este proyecto.</p></div>`;
        }
    }

    renderPDFs() {
        const pdfPane = document.getElementById('pdfs-pane');
        const pdfs = this.project.pdfs;
        
        if (!pdfPane) return;

        if (pdfs && pdfs.length > 0) {
            pdfPane.innerHTML = ''; // Limpiar mensaje de no-files si existe

            // 1. Crear el selector si hay múltiples PDFs
            if (pdfs.length > 1) {
                const pdfSelector = document.createElement('div');
                pdfSelector.className = 'pdf-selector';
                pdfSelector.innerHTML = `
                    <label for="pdfSelect">Seleccionar documento:</label>
                    <select id="pdfSelect">
                        ${pdfs.map((pdf, index) =>
                    `<option value="${pdf}">Documento ${index + 1}</option>`
                ).join('')}
                    </select>
                `;
                pdfPane.appendChild(pdfSelector);

                pdfSelector.querySelector('#pdfSelect').addEventListener('change', (e) => {
                    document.getElementById('pdfFrame').src = e.target.value;
                });
            }

            // 2. Crear el visor
            const pdfViewer = document.createElement('div');
            pdfViewer.className = 'pdf-viewer';
            pdfViewer.innerHTML = `<iframe id="pdfFrame" src="${pdfs[0]}"></iframe>`;
            pdfPane.appendChild(pdfViewer);

        } else {
            pdfPane.innerHTML = `<div class="no-files-message"><p>No hay documentos PDF disponibles para este proyecto.</p></div>`;
        }
    }
    
    render3DModels() {
        const pane3d = document.getElementById('3d-pane');
        const model3d = this.project.model3d;

        if (!pane3d) return;

        if (model3d && model3d.hasModel) {
            // El HTML de ProyectoDetalle.html ya tiene el tag <model-viewer>
            // Aseguramos que la fuente sea correcta si se usa un script 3D específico
            const modelViewer = pane3d.querySelector('model-viewer');
            if (modelViewer) {
                 modelViewer.setAttribute('src', model3d.file);
            }
        } else {
            pane3d.innerHTML = `<div class="no-files-message"><p>No hay modelos 3D disponibles para este proyecto.</p></div>`;
        }
    }

    hideEmptyTabs() {
        const tabs = document.querySelectorAll('.files-tabs .file-tab');

        tabs.forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            const pane = document.getElementById(`${tabName}-pane`);
            
            // Un panel se considera vacío si solo contiene el mensaje de no-files
            const isEmpty = pane?.querySelector('.no-files-message'); 

            if (isEmpty) {
                tab.style.display = 'none';
            }
        });
        
        // Si la pestaña activa por defecto fue ocultada, activa la siguiente disponible
        const activeTab = document.querySelector('.files-tabs .file-tab.active');
        if (activeTab && activeTab.style.display === 'none') {
            const firstVisibleTab = document.querySelector('.files-tabs .file-tab:not([style*="display: none"])');
            if (firstVisibleTab) {
                firstVisibleTab.click(); // Simular clic en la primera pestaña visible
            }
        }
    }
    
    // --- Calificaciones y Comentarios ---

    setupRating() {
        const stars = document.querySelectorAll('.star-rating .star');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.dataset.value;
                this.sendRating(rating);
                // Bloquea el rating visualmente después del voto
                document.querySelector('.star-rating').classList.add('disabled');
            });
        });

        // Manejar envío de comentarios
        const commentForm = document.getElementById('commentForm');
        commentForm?.addEventListener('submit', this.handleCommentSubmit.bind(this));
    }
    
    async sendRating(rating) {
        const userId = this.authService.getUserData()?.id;
        if (!userId) {
            this.uiService.showAlert('Debes iniciar sesión para calificar.', true);
            document.querySelector('.star-rating').classList.remove('disabled'); // Desbloquear
            return;
        }
        
        // Lógica de envío al backend (DataService debe tener este método)
        try {
            // Suponiendo un método en DataService para enviar la calificación
            // const result = await this.dataService.sendRating(this.projectId, rating);
            
            // Simulación
            console.log(`Enviando calificación ${rating} para proyecto ${this.projectId}`);
            const result = { newAverageRating: 4.85, totalVotes: 16 };
            
            // Actualizar la UI
            document.getElementById('projectRating').textContent = result.newAverageRating.toFixed(1);
            document.getElementById('projectRatingLabel').textContent = `(${result.totalVotes} Votos)`;
            this.uiService.showAlert('¡Gracias por tu calificación!');

        } catch (error) {
            console.error('Error al enviar la calificación:', error);
            this.uiService.showAlert(error.message, true);
            document.querySelector('.star-rating').classList.remove('disabled');
        }
    }
    
    handleCommentSubmit(e) {
        e.preventDefault();
        const commentText = document.getElementById('commentText').value.trim();
        
        if (!commentText) {
             this.uiService.showAlert('El comentario no puede estar vacío.', true);
             return;
        }
        
        const userData = this.authService.getUserData();
        if (!userData) {
            this.uiService.showAlert('Debes iniciar sesión para dejar un comentario.', true);
            return;
        }

        // Lógica de envío al backend (DataService debe tener este método)
        try {
            // Simulación
            console.log(`Comentario de ${userData.nombre} para proyecto ${this.projectId}: ${commentText}`);
            this.addCommentToUI(userData.nombre, commentText);
            document.getElementById('commentForm').reset();
            this.uiService.showAlert('Comentario enviado y pendiente de moderación.', false);

        } catch (error) {
            console.error('Error al enviar el comentario:', error);
            this.uiService.showAlert(error.message, true);
        }
    }
    
    addCommentToUI(authorName, text) {
        const list = document.getElementById('commentsList');
        if (!list) return;

        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.innerHTML = `
            <div class="comment-header">
                <span class="comment-avatar">${authorName.charAt(0).toUpperCase()}</span>
                <span class="comment-author">${authorName}</span>
                <span class="comment-date">Justo ahora</span>
            </div>
            <p class="comment-text">${text}</p>
        `;
        list.prepend(newComment); // Añadir al inicio de la lista
    }


    // --- Utilidades ---
    
    formatDescription(text) {
        // Convierte el markdown simple (como el que se usa en el projectDetail.js original) a HTML
        if (!text) return '';
        
        // Reemplazar encabezados de Markdown (##) con <h4>
        let html = text.replace(/## (.*?)\n/g, '\n<h4>$1</h4>\n');
        
        // Reemplazar saltos de línea con etiquetas de párrafo
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        // Envolver en párrafo inicial si no es un encabezado
        if (!html.startsWith('<p>')) {
            html = `<p>${html}</p>`;
        }
        return html;
    }

    setupEventListeners() {
        // Configurar modal de contacto
        const contactBtn = document.querySelector('.contact-architect');
        const contactModal = document.getElementById('contactModal');
        const closeModalBtn = contactModal?.querySelector('.close-contact-modal');
        
        contactBtn?.addEventListener('click', () => {
            const architect = Architect.fromData(this.project.architect);
            this.contactArchitect(architect);
        });

        closeModalBtn?.addEventListener('click', () => this.closeContactModal());
        contactModal?.addEventListener('click', (e) => {
            if (e.target === contactModal) this.closeContactModal();
        });
        
        // Nota: La lógica del modal de imagen se dejará como una función simple auxiliar
    }

    contactArchitect(architect) {
        const modal = document.getElementById('contactModal');
        if (!modal) return; 

        // Rellenar datos del modal
        document.getElementById('modalArchitectAvatar').src = architect.avatar;
        document.getElementById('modalArchitectName').textContent = architect.name;
        document.getElementById('modalArchitectSpecialty').textContent = architect.specialty;
        document.getElementById('modalArchitectEmail').textContent = architect.contact;
        document.getElementById('modalArchitectEmail').href = `mailto:${architect.contact}`;
        document.getElementById('modalArchitectBio').textContent = architect.bio || 'No hay biografía disponible.';

        modal.style.display = 'flex';
    }

    closeContactModal() {
        document.getElementById('contactModal').style.display = 'none';
    }

    openImageModal(src, alt) {
        // Esta es una implementación simplificada de modal de imagen (usarías un componente en la realidad)
        this.uiService.showAlert(`Abriendo imagen: ${alt} (src: ${src})`);
    }
}