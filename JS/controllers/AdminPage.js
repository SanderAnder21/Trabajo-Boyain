// JS/controllers/AdminPage.js

import { BasePage } from './BasePage.js';
import { User } from '../models/User.js'; // Usamos el modelo User

/**
 * Controlador para la página de Administración de Cuenta (AdministrarCuenta.html).
 * Encargado de cargar datos, gestionar formularios y la navegación lateral.
 */
export class AdminPage extends BasePage {
    
    /**
     * @param {import('../services/AuthService').AuthService} authService 
     * @param {import('../services/UIService').UIService} uiService 
     * @param {import('../services/DataService').DataService} dataService 
     */
    constructor(authService, uiService, dataService) {
        // La clase BasePage ya maneja la inyección de authService y uiService
        super(authService, uiService);
        this.dataService = dataService; // Inyección de DataService
        this.currentUser = null;
        this.currentSectionId = 'personal'; 
    }

    /**
     * Implementación del método init() para la página de administración (Polimorfismo).
     */
    init() {
        console.log('✨ AdminPage: Inicializando controlador.');
        
        if (!this.authService.checkAuthStatus()) {
            this.uiService.redirect('IniciarSesion.html');
            return;
        }

        const userData = this.authService.getUserData();
        if (!userData) {
            // Esto no debería pasar si checkAuthStatus es true, pero es un buen guard
            this.uiService.redirect('IniciarSesion.html');
            return;
        }

        // Crear una instancia del modelo User para encapsular los datos
        this.currentUser = User.fromData(userData);
        
        // 1. Aplicar clase de rol al body (para CSS)
        document.body.className = this.currentUser.role;
        
        // 2. Cargar datos en los formularios
        this.loadUserData();
        
        // 3. Configurar navegación lateral (sidebar)
        this.setupNavigationMenu();
        
        // 4. Configurar manejadores de formularios
        this.setupFormHandlers();

        // Si el usuario es cliente, forzar a la sección "personal" si la URL intenta ir a una de arquitecto
        this.handleClientNavigationRestriction();
    }

    loadUserData() {
        if (!this.currentUser) return;
        
        // --- Sección Personal ---
        this.setInputValue('nombre', this.currentUser.nombre);
        this.setInputValue('bio', this.currentUser.biografia);
        this.setProfileImage(this.currentUser.avatar);

        // --- Sección Contacto (Solo Arquitectos) ---
        if (this.currentUser.isArchitect()) {
            this.setInputValue('email', this.currentUser.email);
            this.setInputValue('telefono', this.currentUser.telefono);
            this.setInputValue('estado', this.currentUser.ubicacion);
            // El campo 'direccion' no está en el modelo, pero se cargaría si existiera
        }
    }
    
    setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element && value !== null) {
            element.value = value;
        }
    }

    setProfileImage(url) {
        const img = document.getElementById('profilePicturePreview');
        if (img) {
            img.src = url || '../IMG/default-avatar.jpg';
        }
    }

    setupNavigationMenu() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.admin-section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Quitar 'active' de todos los links y secciones
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                // Activar el link y la sección objetivo
                link.classList.add('active');
                this.currentSectionId = link.getAttribute('data-section');
                document.getElementById(this.currentSectionId).classList.add('active');
            });
        });
    }

    handleClientNavigationRestriction() {
        if (!this.currentUser.isArchitect()) {
            const currentLink = document.querySelector('.sidebar-nav .nav-link.active');
            // Si el link activo es una sección solo para arquitectos
            if (currentLink && currentLink.closest('li').classList.contains('architect-only')) {
                // Forzar a la sección "personal"
                this.switchToSection('personal');
            } else {
                // Si ya está en una sección permitida, activar esa
                const initialSection = document.querySelector('.admin-section.active');
                if (initialSection) {
                    this.currentSectionId = initialSection.id;
                }
            }
        }
    }
    
    switchToSection(sectionId) {
         // Encuentra el link y la sección y fuerza el click (para aplicar estilos)
         const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
         if(targetLink) {
             targetLink.click();
         }
    }

    setupFormHandlers() {
        // --- 1. Formulario Personal (PUT /api/user/personal) ---
        const personalForm = document.querySelector('.personal-form');
        if (personalForm) {
            personalForm.addEventListener('submit', this.handlePersonalSubmit.bind(this));
        }

        // --- 2. Formulario Contacto (PUT /api/user/contact) ---
        const contactForm = document.querySelector('.contact-form');
        if (contactForm && this.currentUser.isArchitect()) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // --- 3. Formulario Seguridad (PUT /api/user/security) ---
        const securityForm = document.querySelector('.security-form');
        if (securityForm) {
            // Nota: La ruta /api/user/security no está en app.js, pero se asume su existencia
            securityForm.addEventListener('submit', this.handleSecuritySubmit.bind(this));
        }
        
        // --- 4. Manejo de Foto de Perfil ---
        const profileInput = document.getElementById('profilePictureInput');
        if (profileInput) {
            profileInput.addEventListener('change', this.handleProfilePictureChange.bind(this));
        }
        
        // --- 5. Manejo de Suscripción/Pago (Modales y Tabs) ---
        // (Lógica compleja que se puede delegar a un SubscriptionController o dejar aquí temporalmente)
        this.setupPaymentHandlers();
    }
    
    // --- MANEJADORES DE SUBMIT ---

    async handlePersonalSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            nombre: form.nombre.value.trim(),
            bio: form.bio.value.trim(),
            fechaNacimiento: form.fechaNacimiento.value // Aunque la DB solo usa nombre y bio, pasamos todo
        };
        
        try {
            // Llama al servicio de datos para actualizar (Abstracción)
            const result = await this.dataService.updatePersonalData(data);
            this.uiService.showAlert(result.message);
            // Actualizar la vista (aunque DataService actualiza localStorage)
            this.currentUser = User.fromData(this.authService.getUserData());
        } catch (error) {
            console.error('Error actualizando datos personales:', error);
            this.uiService.showAlert(error.message, true);
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            telefono: form.telefono.value.trim(),
            estado: form.estado.value.trim(),
            direccion: form.direccion.value.trim()
        };
        
        try {
            const result = await this.dataService.updateContactData(data);
            this.uiService.showAlert(result.message);
        } catch (error) {
            console.error('Error actualizando datos de contacto:', error);
            this.uiService.showAlert(error.message, true);
        }
    }
    
    async handleSecuritySubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        const currentPassword = form.currentPassword.value;
        const newPassword = form.newPassword.value;
        const confirmPassword = form.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            this.uiService.showAlert('La nueva contraseña y la confirmación no coinciden.', true);
            return;
        }

        // Aquí se llama al DataService, pero tu backend (app.js) aún no tiene esta ruta implementada
        // Se deja la llamada para cuando la implementes en Node.js
        try {
            // await this.dataService.updateSecurityData({ currentPassword, newPassword });
            
            // Simulación temporal
            console.log('Llamada a PUT /api/user/security simulada.');
            this.uiService.showAlert('Contraseña actualizada exitosamente (Simulación)');
            form.reset();
        } catch (error) {
            console.error('Error actualizando seguridad:', error);
            this.uiService.showAlert(error.message, true);
        }
    }

    handleProfilePictureChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.uiService.showAlert('Por favor selecciona una imagen válida.', true);
            return;
        }
        
        // Simulación de carga de la imagen
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setProfileImage(e.target.result);
            // Aquí iría la llamada al dataService para subir el archivo
            // this.dataService.uploadProfilePicture(file);
            this.uiService.showAlert('Imagen de perfil lista para guardar (presiona Guardar Cambios)');
        };
        reader.readAsDataURL(file);
    }
    
    setupPaymentHandlers() {
        const modal = document.getElementById('paymentModal');
        const closeModalBtn = modal?.querySelector('.close-modal');
        const selectPlanBtns = document.querySelectorAll('.btn-select-plan');
        const payTabs = document.querySelectorAll('.payment-tab');
        const cardPaymentForm = document.getElementById('cardPayment');
        const cashPaymentForm = document.getElementById('cashPayment');
        const btnActualizarPago = document.getElementById('btn-actualizar-pago');

        if (!modal) return; // Salir si no estamos en AdministrarCuenta.html

        // --- Manejo del Modal de Pago ---
        const openModal = (planName) => {
            modal.style.display = 'block';
            modal.setAttribute('data-plan', planName);
        };

        const closeModal = () => {
            modal.style.display = 'none';
            modal.removeAttribute('data-plan');
        };

        closeModalBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Abrir modal desde botones de plan
        selectPlanBtns.forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.plan));
        });
        
        // Abrir modal desde el botón de actualizar pago
        btnActualizarPago?.addEventListener('click', () => openModal(null));


        // --- Manejo de Pestañas de Pago (Tarjeta/Efectivo) ---
        const activatePaymentTab = (tabName) => {
            payTabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector(`.payment-tab[data-tab="${tabName}"]`).classList.add('active');
            
            cardPaymentForm.classList.remove('active');
            cashPaymentForm.classList.remove('active');
            
            if (tabName === 'tarjeta') {
                cardPaymentForm.classList.add('active');
            } else if (tabName === 'efectivo') {
                cashPaymentForm.classList.add('active');
            }
        };

        payTabs.forEach(tab => {
            tab.addEventListener('click', () => activatePaymentTab(tab.dataset.tab));
        });

        // Inicializar pestaña
        activatePaymentTab('tarjeta');
        
        // --- Manejo de Formulario de Tarjeta ---
        const cardForm = document.getElementById('cardForm');
        cardForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.uiService.showAlert(`Procesando pago del plan ${modal.dataset.plan || 'Actual'} con tarjeta... (Simulación)`, false);
            closeModal();
            // Lógica real de pago iría aquí
        });

        // --- Manejo de Botón de Copiar Referencia ---
        const copyBtn = document.querySelector('.btn-copy');
        copyBtn?.addEventListener('click', () => {
            const refNumber = document.getElementById('referenceNumber').textContent;
            
            // Reemplazo de execCommand para evitar warnings en IFrames
            try {
                // Usando navigator.clipboard (moderno)
                navigator.clipboard.writeText(refNumber).then(() => {
                    this.uiService.showAlert('¡Referencia copiada al portapapeles!');
                }).catch(() => {
                    // Fallback para entornos restrictivos
                    const tempInput = document.createElement('textarea');
                    tempInput.value = refNumber;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    this.uiService.showAlert('¡Referencia copiada al portapapeles!');
                });
            } catch (err) {
                 this.uiService.showAlert('No se pudo copiar automáticamente. Inténtalo manualmente.', true);
            }
        });
        
        // Aseguramos que el botón de efectivo siempre esté deshabilitado hasta recibir el pago
        const confirmCashBtn = document.querySelector('.btn-confirm-cash');
        confirmCashBtn?.addEventListener('click', () => {
            if (confirmCashBtn.classList.contains('active')) {
                this.uiService.showAlert('Pago confirmado. ¡Suscripción activada!', false);
                closeModal();
            } else {
                 this.uiService.showAlert('El pago aún no se ha recibido o verificado.', true);
            }
        });
        
        // Simulación de activación de botón después de un tiempo (para demo)
        setTimeout(() => {
            confirmCashBtn?.classList.add('active');
            confirmCashBtn.textContent = 'Confirmar que pagué';
        }, 10000); // 10 segundos para la simulación
    }
}