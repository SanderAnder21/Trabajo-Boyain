import { Config } from '../config/Config.js';
import { DOMUtils } from '../utils/DOMUtils.js';
import { PageController } from './PageController.js';

/**
 * Controlador de Proyectos
 * Maneja listado, detalle, búsqueda y subida de proyectos
 */
export class ProjectController extends PageController {
    constructor(projectService, mode = 'list') {
        super();
        this.projectService = projectService;
        this.mode = mode; // 'list', 'detail', 'my-projects', 'upload'
        this.currentProjects = [];
        this.currentFilters = {
            search: '',
            type: '',
            style: '',
            sort: 'newest'
        };
    }

    init() {
        super.init();
        console.log(`📁 ProjectController modo: ${this.mode}`);
        
        switch (this.mode) {
            case 'list':
                this.initProjectsList();
                break;
            case 'detail':
                this.initProjectDetail();
                break;
            case 'my-projects':
                this.initMyProjects();
                break;
            case 'upload':
                this.initUploadProject();
                break;
        }
    }

    // ========== LISTA DE PROYECTOS ==========
    async initProjectsList() {
        await this.loadProjects();
        this.setupFilters();
        this.renderProjects();
    }

    async loadProjects() {
        try {
            this.showLoading('Cargando proyectos...');
            this.currentProjects = await this.projectService.getAllProjects();
            this.hideLoading();
        } catch (error) {
            console.error('Error cargando proyectos:', error);
            this.hideLoading();
            this.showError('Error al cargar proyectos');
        }
    }

    setupFilters() {
        const searchInput = DOMUtils.getElementById('projectSearch');
        const styleFilter = DOMUtils.getElementById('filterStyle');
        const typeFilter = DOMUtils.getElementById('filterType');
        const sortFilter = DOMUtils.getElementById('filterSort');
        
        // Búsqueda
        if (searchInput) {
            searchInput.addEventListener('input', async (e) => {
                this.currentFilters.search = e.target.value;
                await this.applyFilters();
            });
        }
        
        // Filtro de estilo
        if (styleFilter) {
            styleFilter.addEventListener('change', async (e) => {
                this.currentFilters.style = e.target.value;
                await this.applyFilters();
            });
        }
        
        // Filtro de tipo
        if (typeFilter) {
            typeFilter.addEventListener('change', async (e) => {
                this.currentFilters.type = e.target.value;
                await this.applyFilters();
            });
        }
        
        // Ordenamiento
        if (sortFilter) {
            sortFilter.addEventListener('change', async (e) => {
                this.currentFilters.sort = e.target.value;
                await this.applyFilters();
            });
        }
    }

    async applyFilters() {
        let filtered = [...this.currentProjects];
        
        // Aplicar búsqueda
        if (this.currentFilters.search) {
            filtered = await this.projectService.searchProjects(this.currentFilters.search);
        }
        
        // Aplicar filtros adicionales
        if (this.currentFilters.type || this.currentFilters.style) {
            filtered = await this.projectService.filterProjects(this.currentFilters);
        }
        
        // Aplicar ordenamiento
        filtered = this.projectService.sortProjects(filtered, this.currentFilters.sort);
        
        this.renderProjects(filtered);
    }

    renderProjects(projects = this.currentProjects) {
        const grid = DOMUtils.getElementById('projectsGrid');
        
        if (!grid) {
            console.warn('⚠️ Grid de proyectos no encontrado');
            return;
        }
        
        if (projects.length === 0) {
            grid.innerHTML = '<p class="no-results">No se encontraron proyectos</p>';
            return;
        }
        
        grid.innerHTML = projects.map(project => project.toCard()).join('');
    }

    // ========== DETALLE DE PROYECTO ==========
    async initProjectDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (!projectId) {
            this.showError('ID de proyecto no especificado');
            window.location.href = Config.ROUTES.PROJECTS;
            return;
        }
        
        await this.loadProjectDetail(projectId);
    }

    async loadProjectDetail(projectId) {
        try {
            this.showLoading('Cargando proyecto...');
            const project = await this.projectService.getProjectById(projectId);
            
            if (!project) {
                throw new Error('Proyecto no encontrado');
            }
            
            this.renderProjectDetail(project);
            this.hideLoading();
        } catch (error) {
            console.error('Error cargando detalle:', error);
            this.hideLoading();
            this.showError('Error al cargar el proyecto');
        }
    }

    renderProjectDetail(project) {
        // Título
        DOMUtils.setTextContent('projectTitle', project.titulo);
        
        // Imagen principal
        const mainImage = DOMUtils.getElementById('projectMainImage');
        if (mainImage) mainImage.src = project.imagen;
        
        // Descripción
        DOMUtils.setHTML('projectFullDescription', project.descripcionCompleta || project.descripcion);
        
        // Información del arquitecto
        if (project.arquitecto) {
            const architectAvatar = DOMUtils.getElementById('architectAvatar');
            const architectName = DOMUtils.getElementById('architectName');
            const architectSpecialty = DOMUtils.getElementById('architectSpecialty');
            
            if (architectAvatar) architectAvatar.src = project.arquitecto.avatar;
            if (architectName) architectName.textContent = project.arquitecto.name || project.arquitecto.nombre;
            if (architectSpecialty) architectSpecialty.textContent = project.arquitecto.specialty || project.arquitecto.especialidad;
        }
        
        // Rating y fecha
        DOMUtils.setTextContent('projectRating', project.rating.toFixed(1));
        DOMUtils.setTextContent('projectDate', project.getFormattedDate());
        
        // Galería de imágenes
        this.renderProjectImages(project);
        
        // Botón de contacto
        this.setupContactButton();
    }

    renderProjectImages(project) {
        const imagesGrid = DOMUtils.getElementById('imagesGrid');
        
        if (!imagesGrid) return;
        
        if (!project.hasImages()) {
            imagesGrid.innerHTML = '<p class="no-files-message">No hay imágenes disponibles</p>';
            return;
        }
        
        imagesGrid.innerHTML = project.imagenes.map((img, index) => `
            <div class="image-item" data-index="${index}">
                <img src="${img}" alt="Imagen ${index + 1} - ${project.titulo}">
                <div class="image-overlay">
                    <span class="zoom-icon">🔍</span>
                </div>
            </div>
        `).join('');
        
        // Agregar click handlers para las imágenes
        const imageItems = imagesGrid.querySelectorAll('.image-item');
        imageItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = item.getAttribute('data-index');
                const imgSrc = project.imagenes[index];
                this.openImageModal(imgSrc, `${project.titulo} - Imagen ${parseInt(index) + 1}`);
            });
        });
    }

    openImageModal(src, caption) {
        // Crear modal si no existe
        let modal = DOMUtils.getElementById('imageModal');
        
        if (!modal) {
            const modalHTML = `
                <div id="imageModal" class="image-modal">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <img id="modalImage" src="" alt="">
                        <div class="modal-caption"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = DOMUtils.getElementById('imageModal');
            
            // Setup close button
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Set content and show
        const modalImg = DOMUtils.getElementById('modalImage');
        const modalCaption = modal.querySelector('.modal-caption');
        
        modalImg.src = src;
        modalCaption.textContent = caption;
        modal.style.display = 'block';
    }

    setupContactButton() {
        const contactBtn = DOMUtils.querySelector('.contact-architect');
        
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                alert('Funcionalidad de contacto en desarrollo');
            });
        }
    }

    // ========== MIS PROYECTOS ==========
    async initMyProjects() {
        // Verificar autenticación
        if (!this.authService.isAuthenticated()) {
            alert('Debes iniciar sesión para ver tus proyectos');
            window.location.href = Config.ROUTES.LOGIN;
            return;
        }
        
        const userId = this.authService.getCurrentUser()?.id;
        if (userId) {
            await this.loadUserProjects(userId);
        }
    }

    async loadUserProjects(userId) {
        try {
            this.showLoading('Cargando tus proyectos...');
            const projects = await this.projectService.getProjectsByArchitect(userId);
            this.renderProjects(projects);
            this.hideLoading();
        } catch (error) {
            console.error('Error cargando proyectos del usuario:', error);
            this.hideLoading();
        }
    }

    // ========== SUBIR PROYECTO ==========
    initUploadProject() {
        // Verificar que sea arquitecto
        if (!this.authService.requireArchitect()) {
            return;
        }
        
        const form = DOMUtils.getElementById('projectForm');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleUploadProject(e);
            });
        }
        
        this.setupTagCounters();
    }

    setupTagCounters() {
        const tagCheckboxes = DOMUtils.querySelectorAll('input[name="tags"]');
        const tagCount = DOMUtils.getElementById('tagCount');
        
        if (tagCheckboxes && tagCount) {
            tagCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const selected = document.querySelectorAll('input[name="tags"]:checked').length;
                    tagCount.textContent = selected;
                });
            });
        }
    }

    async handleUploadProject(e) {
        alert('Funcionalidad de subir proyecto en desarrollo');
    }
}