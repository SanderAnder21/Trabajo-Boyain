import { AuthService } from './services/AuthService.js';
import { UIService } from './services/UIService.js';
import { ProfileController } from './controllers/ProfileController.js';

document.addEventListener('DOMContentLoaded', () => {
    const authService = new AuthService();
    const uiService = new UIService();
    const controller = new ProfileController(authService, uiService);

    controller.init();
    uiService.setupDropdown();
});
