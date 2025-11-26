import { AuthService } from '../services/AuthService.js';
import { UIService } from '../services/UIService.js';

/**
 * Controlador para la página de subir proyectos.
 * Maneja el formulario de creación de proyectos y la gestión de archivos.
 * 
 * @class UploadProjectController
 */
class UploadProjectController {
    constructor() {
        this.authService = new AuthService();
        this.uiService = new UIService();
        this.form = null;
        this.selectedTags = [];
        this.selectedStyles = [];
        this.maxStyles = 3;
        this.maxTags = 4;
    }

    /**
     * Inicializa el controlador.
     */
    init() {
        // Verificar autenticación
        if (!this.authService.isAuthenticated()) {
            this.uiService.showAlert('Debes iniciar sesión para subir proyectos');
            window.location.href = 'IniciarSesion.html';
            return;
        }

        this.form = document.getElementById('projectForm');

        if (!this.form) {
            console.error('❌ No se encontró el formulario de proyecto');
            return;
        }

        console.log('✅ UploadProjectController inicializado');
        this.setupEventListeners();
        this.loadUserProjects();
    }

    /**
     * Configura los event listeners del formulario.
     * @private
     */
    setupEventListeners() {
        // Submit del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Contadores de etiquetas técnicas
        const tagCheckboxes = document.querySelectorAll('input[name="tags"]');
        tagCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateTagCount());
        });

        // Contadores de estilos arquitectónicos
        const styleCheckboxes = document.querySelectorAll('input[name="styles"]');
        styleCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateStyleCount());
        });

        // Preview de imagen de portada
        const coverImageInput = document.getElementById('projectCoverImage');
        if (coverImageInput) {
            coverImageInput.addEventListener('change', (e) => this.previewCoverImage(e));
        }
    }

    /**
     * Actualiza el contador de etiquetas técnicas.
     * @private
     */
    updateTagCount() {
        const checkedTags = document.querySelectorAll('input[name="tags"]:checked');
        const tagCountElement = document.getElementById('tagCount');

        if (tagCountElement) {
            tagCountElement.textContent = checkedTags.length;
        }

        // Limitar a 4 etiquetas
        if (checkedTags.length >= this.maxTags) {
            document.querySelectorAll('input[name="tags"]:not(:checked)').forEach(checkbox => {
                checkbox.disabled = true;
            });
        } else {
            document.querySelectorAll('input[name="tags"]').forEach(checkbox => {
                checkbox.disabled = false;
            });
        }

        this.selectedTags = Array.from(checkedTags).map(cb => cb.value);
    }

    /**
     * Actualiza el contador de estilos arquitectónicos.
     * @private
     */
    updateStyleCount() {
        const checkedStyles = document.querySelectorAll('input[name="styles"]:checked');
        const styleCountElement = document.getElementById('styleTagCount');

        if (styleCountElement) {
            styleCountElement.textContent = `${checkedStyles.length}/${this.maxStyles}`;
        }

        // Limitar a 3 estilos
        if (checkedStyles.length >= this.maxStyles) {
            document.querySelectorAll('input[name="styles"]:not(:checked)').forEach(checkbox => {
                checkbox.disabled = true;
            });
        } else {
            document.querySelectorAll('input[name="styles"]').forEach(checkbox => {
                checkbox.disabled = false;
            });
        }

        this.selectedStyles = Array.from(checkedStyles).map(cb => cb.value);
    }

    /**
     * Previsualiza la imagen de portada.
     * @param {Event} e - Evento de cambio
     * @private
     */
    previewCoverImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                console.log('📷 Imagen de portada cargada:', file.name);
                // Aquí podrías mostrar una preview si quisieras
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Maneja el envío del formulario.
     * @param {Event} e - Evento de submit
     * @private
     */
    async handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        // Campos de texto
        formData.append('titulo', document.getElementById('projectName').value);
        formData.append('descripcion', document.getElementById('projectDescription').value);
        formData.append('descripcion_completa', document.getElementById('projectFullDescription').value);
        formData.append('ubicacion', document.getElementById('projectLocation').value);
        formData.append('tipo', document.getElementById('projectType').value);
        formData.append('area_construida', document.getElementById('projectArea').value);
        formData.append('presupuesto', document.getElementById('projectBudget').value);
        formData.append('duracion', document.getElementById('projectDuration').value);

        // Etiquetas y estilos (se envían, aunque el backend actual quizás no los guarde todos aún)
        this.selectedTags.forEach(tag => formData.append('etiquetas_tecnicas', tag));
        this.selectedStyles.forEach(style => formData.append('estilos_arquitectonicos', style));

        // Archivos
        const coverInput = document.getElementById('projectCoverImage');
        if (coverInput.files[0]) {
            formData.append('imagen_principal', coverInput.files[0]);
        }

        const galleryInput = document.getElementById('projectGalleryImages');
        for (let i = 0; i < galleryInput.files.length; i++) {
            formData.append('imagenes_galeria', galleryInput.files[i]);
        }

        const pdfInput = document.getElementById('projectPDFs');
        for (let i = 0; i < pdfInput.files.length; i++) {
            formData.append('documentos', pdfInput.files[i]);
        }

        const modelInput = document.getElementById('projectModel3D');
        for (let i = 0; i < modelInput.files.length; i++) {
            formData.append('modelos3d', modelInput.files[i]);
        }

        // Validaciones básicas antes de enviar
        if (!this.validateForm({ titulo: formData.get('titulo'), descripcion: formData.get('descripcion') })) {
            return;
        }

        try {
            console.log('🚀 Enviando proyecto al servidor...');
            this.uiService.showAlert('Subiendo archivos, por favor espera...', false);

            const token = this.authService.getToken();

            // ✅ URL CORREGIDA - Usar URL completa
            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // NO establecer Content-Type, el navegador lo pone con boundary para FormData
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear el proyecto');
            }

            console.log('✅ Proyecto creado:', data);
            this.uiService.showAlert('¡Proyecto subido exitosamente!');

            // Limpiar formulario
            this.form.reset();
            this.selectedTags = [];
            this.selectedStyles = [];
            this.updateTagCount();
            this.updateStyleCount();

            // Limpiar preview si existe
            const preview = document.getElementById('coverPreview'); // Si existiera
            if (preview) preview.src = '';

            // Recargar lista de proyectos
            this.loadUserProjects();

        } catch (error) {
            console.error('❌ Error al subir proyecto:', error);
            this.uiService.showAlert('Error al subir el proyecto: ' + error.message, true);
        }
    }

    /**
     * Valida los datos del formulario.
     * @param {Object} data - Datos del formulario
     * @returns {boolean} True si es válido
     * @private
     */
    validateForm(data) {
        if (!data.titulo || data.titulo.trim() === '') {
            this.uiService.showAlert('El nombre del proyecto es requerido');
            return false;
        }

        if (!data.descripcion || data.descripcion.trim() === '') {
            this.uiService.showAlert('La descripción es requerida');
            return false;
        }

        if (this.selectedTags.length === 0) {
            this.uiService.showAlert('Debes seleccionar al menos una etiqueta técnica');
            return false;
        }

        if (this.selectedStyles.length === 0) {
            this.uiService.showAlert('Debes seleccionar al menos un estilo arquitectónico');
            return false;
        }

        return true;
    }

    /**
     * Carga los proyectos del usuario.
     * @private
     */
    async loadUserProjects() {
        try {
            const token = this.authService.getToken();

            // ✅ URL CORREGIDA - Usar endpoint correcto
            const response = await fetch('http://localhost:3000/api/user/projects', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al cargar proyectos');
            }

            console.log('📂 Proyectos del usuario:', data);
            this.displayUserProjects(data.projects || []);

        } catch (error) {
            console.error('❌ Error cargando proyectos:', error);
            this.displayUserProjects([]); // Mostrar lista vacía en caso de error
        }
    }

    /**
     * Muestra los proyectos del usuario en la lista.
     * @param {Array} projects - Array de proyectos
     * @private
     */
    displayUserProjects(projects) {
        const projectsList = document.getElementById('projectsList');

        if (!projectsList) return;

        if (!projects || projects.length === 0) {
            projectsList.innerHTML = `
                <div class="no-projects">
                    <p>No hay proyectos subidos aún.</p>
                </div>
            `;
            return;
        }

        projectsList.innerHTML = projects.map(project => `
            <div class="project-card" data-id="${project.id}">
                <h3>${project.titulo || 'Proyecto sin título'}</h3>
                <div class="project-meta">
                    <small>Subido: ${new Date(project.fecha_publicacion || project.fecha_creacion).toLocaleDateString()}</small>
                    <small>Vistas: ${project.total_vistas || 0}</small>
                </div>
                <p class="project-description">${project.descripcion || 'Sin descripción'}</p>
                <div class="project-actions">
                    <button class="btn-editar" onclick="editProject(${project.id})">Editar</button>
                    <button class="btn-eliminar" onclick="deleteProject(${project.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
    }
}

// Funciones globales para los botones
window.editProject = function (projectId) {
    alert(`Editar proyecto ${projectId} - Función en desarrollo`);
};

window.deleteProject = async function (projectId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        return;
    }

    try {
        const authService = new AuthService();
        const token = authService.getToken();

        // ✅ URL CORREGIDA
        const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al eliminar');
        }

        alert('Proyecto eliminado exitosamente');
        location.reload();

    } catch (error) {
        console.error('❌ Error eliminando proyecto:', error);
        alert('Error al eliminar el proyecto: ' + error.message);
    }
};

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const controller = new UploadProjectController();
    controller.init();
});

export default UploadProjectController;