/**
 * MAIN.JS - Punto de Entrada Principal
 * Arquitectura: Programación Orientada a Objetos
 */

import { Config } from './config/Config.js';
import { DOMUtils } from './utils/DOMUtils.js';
import { AuthService } from './services/AuthService.js';
import { ProjectService } from './services/ProjectService.js';
import { PageController } from './controllers/PageController.js';
import { AuthController } from './controllers/AuthController.js';
import { ProjectController } from './controllers/ProjectController.js';

/**
 * Aplicación Principal
 */
class PortArqApp {
    constructor() {
        this.authService = new AuthService();
        this.projectService = new ProjectService();
        this.currentController = null;
        
        console.log('🚀 PortArq App iniciada');
    }

    async init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('✅ DOM listo');
        
        // Determinar qué controlador usar según la página actual
        const page = this.getCurrentPage();
        console.log('📄 Página actual:', page);
        
        // Inicializar controlador apropiado
        this.initializeController(page);
        
        // Inicializar elementos comunes (navbar, footer, chatbot)
        this.initializeCommonElements();
        
        console.log('🎉 Aplicación lista');
    }

    getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        const fileName = path.split('/').pop() || 'index.html';
        
        // Mapeo de archivos a identificadores de página
        const pageMap = {
            'index.html': 'home',
            'iniciarsesion.html': 'login',
            'crearcuenta.html': 'register',
            'proyectos.html': 'projects',
            'proyectodetalle.html': 'project-detail',
            'misproyectos.html': 'my-projects',
            'subirproyecto.html': 'upload-project',
            'administrarcuenta.html': 'account',
            'perfilarquitecto.html': 'architect-profile',
            'contactanos.html': 'contact'
        };
        
        return pageMap[fileName] || 'home';
    }

    initializeController(page) {
        switch (page) {
            case 'login':
                this.currentController = new AuthController(this.authService, 'login');
                break;
                
            case 'register':
                this.currentController = new AuthController(this.authService, 'register');
                break;
                
            case 'projects':
                this.currentController = new ProjectController(this.projectService, 'list');
                break;
                
            case 'project-detail':
                this.currentController = new ProjectController(this.projectService, 'detail');
                break;
                
            case 'my-projects':
                this.currentController = new ProjectController(this.projectService, 'my-projects');
                break;
                
            case 'upload-project':
                this.currentController = new ProjectController(this.projectService, 'upload');
                break;
                
            case 'account':
            case 'architect-profile':
            case 'contact':
            case 'home':
            default:
                this.currentController = new PageController(this.authService);
                break;
        }
        
        // Inicializar el controlador
        if (this.currentController && typeof this.currentController.init === 'function') {
            this.currentController.init();
        }
    }

    initializeCommonElements() {
        this.initializeNavigation();
        this.initializeDropdown();
        this.initializeScrollEffect();
        this.initializeChatbot();
    }

    initializeNavigation() {
        const user = this.authService.getCurrentUser();
        const isAuthenticated = this.authService.isAuthenticated();
        
        // Referencias a elementos del menú
        const loginLink = DOMUtils.getElementById('loginLink');
        const adminLink = DOMUtils.getElementById('adminCuentaLink');
        const uploadLink = DOMUtils.getElementById('subirProyectoLink');
        const logoutLink = DOMUtils.getElementById('logoutLink');
        const myProjectsNav = DOMUtils.getElementById('navMisProyectosLink');
        
        if (isAuthenticated && user) {
            // Usuario logueado
            DOMUtils.hide(loginLink);
            DOMUtils.show(adminLink);
            DOMUtils.show(logoutLink);
            DOMUtils.show(myProjectsNav);
            
            if (user.isArchitect()) {
                DOMUtils.show(uploadLink);
            } else {
                DOMUtils.hide(uploadLink);
            }
            
            // Configurar logout
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.authService.logout();
                });
            }
            
        } else {
            // Usuario no logueado
            DOMUtils.show(loginLink);
            DOMUtils.hide(adminLink);
            DOMUtils.hide(uploadLink);
            DOMUtils.hide(logoutLink);
            DOMUtils.hide(myProjectsNav);
        }
    }

    initializeDropdown() {
        const userIcon = DOMUtils.getElementById('userIcon');
        const dropdown = DOMUtils.getElementById('dropdownMenu');
        
        if (!userIcon || !dropdown) return;
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            DOMUtils.toggleClass(dropdown, 'show');
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
                DOMUtils.removeClass(dropdown, 'show');
            }
        });
    }

    initializeScrollEffect() {
        const btnScrollDown = DOMUtils.querySelector('.btn-scroll-down');
        
        if (btnScrollDown) {
            btnScrollDown.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btnScrollDown.getAttribute('href');
                DOMUtils.scrollToElement(targetId.replace('#', ''));
            });
        }
        
        // Efecto del navbar al hacer scroll
        window.addEventListener('scroll', () => {
            const nav = DOMUtils.querySelector('nav');
            if (nav) {
                if (window.scrollY > 50) {
                    DOMUtils.addClass(nav, 'scrolled');
                } else {
                    DOMUtils.removeClass(nav, 'scrolled');
                }
            }
        });
    }

    initializeChatbot() {
        const chatBubble = DOMUtils.querySelector('.burbuja-flotante');
        
        if (!chatBubble) return;
        
        // Crear contenedor del chatbot si no existe
        if (!DOMUtils.getElementById('chatbot-container')) {
            this.createChatbotHTML();
        }
        
        const chatContainer = DOMUtils.querySelector('.chatbot-container');
        const closeBtn = DOMUtils.querySelector('.close-chat');
        const sendBtn = DOMUtils.querySelector('.send-btn');
        const input = DOMUtils.querySelector('.message-input');
        
        // Toggle chatbot
        chatBubble.addEventListener('click', () => {
            DOMUtils.toggleClass(chatContainer, 'active');
            if (chatContainer.classList.contains('active')) {
                input?.focus();
            }
        });
        
        // Cerrar chatbot
        closeBtn?.addEventListener('click', () => {
            DOMUtils.removeClass(chatContainer, 'active');
        });
        
        // Enviar mensaje
        const sendMessage = () => {
            const message = input?.value.trim();
            if (!message) return;
            
            this.addChatMessage(message, 'user');
            input.value = '';
            
            // Simular respuesta del bot
            setTimeout(() => {
                this.addChatMessage('Gracias por tu mensaje. ¿En qué más puedo ayudarte?', 'bot');
            }, 1000);
        };
        
        sendBtn?.addEventListener('click', sendMessage);
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    createChatbotHTML() {
        const html = `
            <div class="chatbot-container">
                <div class="chatbot-header">
                    <h3>Asistente PortArq</h3>
                    <button class="close-chat">×</button>
                </div>
                <div class="chatbot-messages">
                    <div class="message bot-message">
                        ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Escribe tu mensaje..." class="message-input">
                    <button class="send-btn">Enviar</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }

    addChatMessage(text, sender) {
        const messagesContainer = DOMUtils.querySelector('.chatbot-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Inicializar la aplicación
const app = new PortArqApp();
app.init();

// Exportar instancia para uso global si es necesario
window.PortArqApp = app;