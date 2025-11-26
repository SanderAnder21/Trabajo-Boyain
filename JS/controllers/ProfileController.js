
import { BasePage } from './BasePage.js';

/**
 * Controlador para la página de Administración de Cuenta.
 * Maneja la visualización y actualización del perfil de usuario.
 */
export class ProfileController extends BasePage {

    constructor(authService, uiService) {
        super(authService, uiService);
        this.userData = null;
    }

    async init() {
        if (!this.authService.isAuthenticated()) {
            this.uiService.redirect('IniciarSesion.html');
            return;
        }

        this.userData = this.authService.getUserData();
        this.loadProfileData();
        this.setupEventListeners();
        this.setupImagePreview();
        this.setupTabs();
    }

    loadProfileData() {
        // Cargar datos en el formulario personal con validaciones
        const nombreInput = document.getElementById('nombre');
        const bioInput = document.getElementById('bio');
        const avatarImg = document.getElementById('profilePicturePreview');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const estadoInput = document.getElementById('estado');

        if (nombreInput) nombreInput.value = this.userData.nombre || '';
        if (bioInput) bioInput.value = this.userData.biografia || '';

        // Cargar avatar
        if (avatarImg && this.userData.avatar) {
            avatarImg.src = this.userData.avatar;
        }

        // Cargar datos de contacto
        if (emailInput) emailInput.value = this.userData.email || '';
        if (telefonoInput) telefonoInput.value = this.userData.telefono || '';
        if (estadoInput) estadoInput.value = this.userData.ubicacion || '';
    }

    setupEventListeners() {
        // Formulario Personal
        const personalForm = document.querySelector('.personal-form');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => this.handlePersonalSubmit(e));
        }

        // Formulario Contacto
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    setupImagePreview() {
        const input = document.getElementById('profilePictureInput');
        const preview = document.getElementById('profilePicturePreview');

        if (input && preview) {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupTabs() {
        const links = document.querySelectorAll('.sidebar-nav .nav-link');
        const sections = document.querySelectorAll('.admin-section');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remover active de links y secciones
                links.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                // Activar actual
                link.classList.add('active');
                const targetId = link.getAttribute('data-section');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    async handlePersonalSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('bio', document.getElementById('bio').value);

        const fileInput = document.getElementById('profilePictureInput');
        if (fileInput.files[0]) {
            formData.append('avatar', fileInput.files[0]);
        }

        try {
            const response = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.authService.getToken()}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.uiService.showAlert('Perfil actualizado correctamente', false);
                this.authService.updateUserData(data.user);
            } else {
                this.uiService.showAlert(data.error || 'Error al actualizar perfil', true);
            }

        } catch (error) {
            console.error('Error:', error);
            this.uiService.showAlert('Error de conexión', true);
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();

        const data = {
            telefono: document.getElementById('telefono').value,
            estado: document.getElementById('estado').value
        };

        try {
            const response = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authService.getToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.uiService.showAlert('Datos de contacto actualizados', false);
                this.authService.updateUserData(result.user);
            } else {
                this.uiService.showAlert(result.error || 'Error al actualizar contacto', true);
            }

        } catch (error) {
            console.error('Error:', error);
            this.uiService.showAlert('Error de conexión', true);
        }
    }
}
