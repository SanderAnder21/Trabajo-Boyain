import { BasePage } from './BasePage.js';

/**
 * Controlador para la página de Subir Proyecto (SubirProyecto.html).
 * Maneja el formulario de subida, la validación de archivos y la comunicación con DataService.
 */
export class UploadProjectController extends BasePage {

    /**
     * @param {import('../services/AuthService').AuthService} authService 
     * @param {import('../services/UIService').UIService} uiService 
     * @param {import('../services/DataService').DataService} dataService 
     */
    constructor(authService, uiService, dataService) {
        super(authService, uiService);
        this.dataService = dataService;
        this.currentUser = null;
    }

    init() {
        console.log('✨ UploadProjectController: Inicializando controlador.');

        if (!this.authService.checkAuthStatus() || this.authService.getUserRole() !== 'arquitecto') {
            this.uiService.showAlert('Debes ser arquitecto para subir proyectos.', true);
            this.uiService.redirect('IniciarSesion.html');
            return;
        }

        this.currentUser = this.authService.getUserData();

        this.setupTagCounters();
        this.setupFormHandler();

        this.loadExistingProjects();
    }

    // --- Lógica de Contadores y Validaciones de Tags ---

    setupTagCounters() {
        const tagCheckboxes = document.querySelectorAll('input[name="tags"]');
        const styleCheckboxes = document.querySelectorAll('input[name="styles"]');

        tagCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.updateTagCount.bind(this));
        });
        styleCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.updateStyleCount.bind(this));
        });

        // Inicializar contadores
        this.updateTagCount();
        this.updateStyleCount();
    }

    updateTagCount() {
        const selectedTags = document.querySelectorAll('input[name="tags"]:checked').length;
        const tagCountElement = document.getElementById('tagCount');
        const submitBtn = document.querySelector('.btn-submit');

        if (tagCountElement) tagCountElement.textContent = selectedTags;

        // Validar si al menos 1 está seleccionado
        if (selectedTags < 1) {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.6';
            }
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        }
    }

    updateStyleCount(e) {
        const maxStyles = 3;
        const selectedStyles = document.querySelectorAll('input[name="styles"]:checked').length;
        const styleTagCountElement = document.getElementById('styleTagCount');

        if (styleTagCountElement) styleTagCountElement.textContent = `${selectedStyles}/${maxStyles}`;

        if (selectedStyles > maxStyles) {
            // Si el evento fue disparado por un cambio, desmarcar el último
            if (e) e.target.checked = false;
            this.uiService.showAlert(`Máximo ${maxStyles} estilos arquitectónicos permitidos.`, true);

            // Recalcular después de la corrección
            this.updateStyleCount();
        }
    }

    // Lógica de Formulario 

    setupFormHandler() {
        const form = document.getElementById('projectForm');
        form?.addEventListener('submit', this.handleProjectSubmit.bind(this));
    }

    async handleProjectSubmit(e) {
        e.preventDefault();
        const form = e.target;

        // 1. Validaciones básicas
        const selectedTags = document.querySelectorAll('input[name="tags"]:checked');
        const selectedStyles = document.querySelectorAll('input[name="styles"]:checked');
        const coverImage = document.getElementById('projectCoverImage').files[0];

        if (selectedTags.length === 0) {
            this.uiService.showAlert('Selecciona al menos 1 etiqueta técnica.', true);
            return;
        }
        if (!coverImage) {
            this.uiService.showAlert('Debes seleccionar una imagen de portada.', true);
            return;
        }

        // 2. Recolección de datos
        const formData = new FormData(form);

        // Agregar el ID del arquitecto si no está implícito en el token
        formData.append('architectId', this.currentUser.id);

        // Enviar la lista de estilos y tags como arrays
        formData.delete('tags');
        formData.delete('styles');
        selectedTags.forEach(tag => formData.append('tags[]', tag.value));
        selectedStyles.forEach(style => formData.append('styles[]', style.value));

        try {
            this.uiService.showAlert('Subiendo proyecto, por favor espera...');
            // Llama a DataService para manejar la subida (Abstracción)
            const result = await this.dataService.uploadProject(formData);

            this.uiService.showAlert(`¡Proyecto "${result.title || form.projectName.value}" subido correctamente!`, false);
            form.reset();
            this.updateTagCount(); // Resetear contadores
            this.updateStyleCount();

            // Recargar lista de proyectos existentes
            this.loadExistingProjects();

        } catch (error) {
            console.error('Error al subir proyecto:', error);
            this.uiService.showAlert(error.message, true);
        }
    }

    // Lógica de Proyectos Existentes 

    async loadExistingProjects() {
        const projectsListContainer = document.getElementById('projectsList');
        if (!projectsListContainer || !this.currentUser) return;

        try {
            // Asume que DataService puede filtrar por ID de usuario
            const userProjects = await this.dataService.getUserProjects(this.currentUser.id);

            this.renderExistingProjects(projectsListContainer, userProjects);

        } catch (error) {
            console.error('Error cargando proyectos existentes:', error);
            projectsListContainer.innerHTML = `<div class="no-projects"><p>Error al cargar tus proyectos.</p></div>`;
        }
    }

    renderExistingProjects(container, projects) {
        container.innerHTML = '';
        if (projects.length === 0) {
            container.innerHTML = `<div class="no-projects"><p>No hay proyectos subidos aún.</p></div>`;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-files">
                    <small>Subido: ${new Date(project.date).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    }
}