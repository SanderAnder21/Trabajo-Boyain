import { AuthService } from './services/AuthService.js';
import { UIService } from './services/UIService.js';
import { MisProyectosController } from './controllers/MisProyectosController.js';

document.addEventListener('DOMContentLoaded', () => {
    const authService = new AuthService();
    const uiService = new UIService();
    const controller = new MisProyectosController(authService, uiService);

    controller.init();
    uiService.setupDropdown();
});
