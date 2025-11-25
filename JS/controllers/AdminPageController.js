// JS/controllers/AdminPageController.js

import { AuthService } from '../services/AuthService.js';
import { UIService } from '../services/UIService.js';
import { User } from '../models/User.js';

/**
 * Controlador para la página de administración de cuenta.
 * Maneja la navegación entre secciones, formularios y actualización de datos.
 * 
 * @class AdminPageController
 */
class AdminPageController {
    constructor() {
        this.authService = new AuthService();
        this.uiService = new UIService();
        this.currentUser = null;
        this.userRole = null;
    }

    /**
     * Inicializa el controlador.
     */
    async init() {
        console.log('✨ AdminPageController: Inicializando');

        // Verificar autenticación
        if (!this.authService.checkAuthStatus()) {
            alert('Debes iniciar sesión para acceder a esta página');
            window.location.href = 'IniciarSesion.html';
            return;
        }

        // Cargar datos del usuario
        await this.loadUserData();

        // Aplicar rol al body
        document.body.className = this.userRole;
        console.log('🎯 Rol aplicado al body:', this.userRole);

        // Configurar navegación y formularios
        this.setupNavigation();
        this.setupDropdown();
        this.setupFormHandlers();
        this.handleClientNavigation();

        console.log('✅ AdminPageController inicializado correctamente');
    }

    /**
     * Carga los datos del usuario desde localStorage o API.
     * @private
     */
    async loadUserData() {
        const userDataStr = localStorage.getItem('userData');
        this.userRole = localStorage.getItem('userRole') || 'cliente';

        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            this.currentUser = User.fromData(userData);
            this.populateFormFields(userData);
        }
    }

    /**
     * Rellena los campos del formulario con los datos del usuario.
     * @param {Object} userData - Datos del usuario
     * @private
     */
    populateFormFields(userData) {
        const fields = {
            'nombre': userData.nombre || '',
            'email': userData.email || '',
            'bio': userData.biografia || '',
            'telefono': userData.telefono || '',
            'estado': userData.ubicacion || ''
        };

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            }
        });
    }

    /**
     * Configura la navegación entre secciones.
     * @private
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.admin-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remover active de todos
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                // Agregar active al clickeado
                link.classList.add('active');
                const targetSection = link.getAttribute('data-section');
                const section = document.getElementById(targetSection);
                if (section) {
                    section.classList.add('active');
                }
            });
        });
    }

    /**
     * Configura el menú desplegable del usuario.
     * @private
     */
    setupDropdown() {
        const userIcon = document.getElementById('userIcon');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (userIcon && dropdownMenu) {
            userIcon.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownMenu.classList.toggle('show');
            });

            window.addEventListener('click', (e) => {
                if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
    }

    /**
     * Maneja la navegación para clientes (oculta secciones de arquitecto).
     * @private
     */
    handleClientNavigation() {
        if (this.userRole !== 'arquitecto') {
            const activeSection = document.querySelector('.admin-section.active');

            if (activeSection && activeSection.classList.contains('architect-only')) {
                this.switchToSection('personal');
            }
        }
    }

    /**
     * Cambia a una sección específica.
     * @param {string} sectionId - ID de la sección
     * @private
     */
    switchToSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`[data-section="${sectionId}"]`);

        if (targetSection && targetLink) {
            targetSection.classList.add('active');
            targetLink.classList.add('active');
        }
    }

    /**
     * Configura los manejadores de formularios.
     * @private
     */
    setupFormHandlers() {
        // Formulario de datos personales
        const personalForm = document.querySelector('.personal-form');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => this.handlePersonalDataSubmit(e));
        }

        // Formulario de contacto (solo arquitectos)
        const contactForm = document.querySelector('.contact-form');
        if (contactForm && this.userRole === 'arquitecto') {
            contactForm.addEventListener('submit', (e) => this.handleContactDataSubmit(e));
        }

        // Formulario de seguridad
        const securityForm = document.querySelector('.security-form');
        if (securityForm) {
            securityForm.addEventListener('submit', (e) => this.handleSecurityDataSubmit(e));
        }

        // Preview de imagen de perfil
        this.setupProfilePicturePreview();
    }

    /**
     * Configura el preview de la imagen de perfil.
     * @private
     */
    setupProfilePicturePreview() {
        const profileInput = document.getElementById('profilePictureInput');
        const profilePreview = document.getElementById('profilePicturePreview');

        if (profileInput && profilePreview) {
            profileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];

                if (!file) return;

                // Validar tipo
                if (!file.type.startsWith('image/')) {
                    alert('Por favor selecciona una imagen válida');
                    return;
                }

                // Validar tamaño (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('La imagen no debe superar los 5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePreview.src = e.target.result;
                };
                reader.onerror = () => {
                    alert('Error al leer la imagen');
                };
                reader.readAsDataURL(file);
            });
        }
    }

    /**
     * Maneja el envío del formulario de datos personales.
     * @param {Event} e - Evento de submit
     * @private
     */
    async handlePersonalDataSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            nombre: formData.get('nombre'),
            bio: formData.get('bio')
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/user/personal', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Datos personales actualizados exitosamente');

                // Actualizar localStorage
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                userData.nombre = data.nombre;
                userData.biografia = data.bio;
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar datos personales');
        }
    }

    /**
     * Maneja el envío del formulario de datos de contacto.
     * @param {Event} e - Evento de submit
     * @private
     */
    async handleContactDataSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            telefono: formData.get('telefono'),
            estado: formData.get('estado')
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/user/contact', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Datos de contacto actualizados exitosamente');
            } else if (response.status === 403) {
                alert('No tienes permisos para actualizar datos de contacto');
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar datos de contacto');
        }
    }

    /**
     * Maneja el envío del formulario de seguridad.
     * @param {Event} e - Evento de submit
     * @private
     */
    async handleSecurityDataSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword')
        };

        if (data.newPassword !== data.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/user/security', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Contraseña actualizada exitosamente');
                e.target.reset();
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar contraseña');
        }
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const adminPage = new AdminPageController();
    adminPage.init();
});

export default AdminPageController;
