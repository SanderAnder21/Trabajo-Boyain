import { Chatbot } from './components/ChatBot.js';
import { BasePage } from './controllers/BasePage.js';
import { LoginPage } from './controllers/LoginPage.js';
import { RegisterPage } from './controllers/RegisterPage.js';
import { ProjectListPage } from './controllers/ProjectListPage.js';
import { ProjectDetailPage } from './controllers/ProjectDetailPage.js';
import { ArchitectProfilePage } from './controllers/ArchitectProfilePage.js';
import { AdminPage } from './controllers/AdminPage.js'; // <--- NUEVO

document.addEventListener('DOMContentLoaded', () => {
    
    new Chatbot('chatbot-ui'); 

    const path = window.location.pathname.toLowerCase();

    if (path.includes('iniciarsesion.html')) {
        new LoginPage();
    } 
    else if (path.includes('crearcuenta.html')) {
        new RegisterPage();
    }
    else if (path.includes('proyectos.html')) {
        new ProjectListPage();
    }
    else if (path.includes('proyectodetalle.html')) {
        new ProjectDetailPage();
    }
    else if (path.includes('perfilarquitecto.html') || path.includes('misproyectos.html')) {
        new ArchitectProfilePage();
    }
    else if (path.includes('administrarcuenta.html')) { // <--- NUEVO
        new AdminPage();
    }
    else {
        new BasePage();
    }
});