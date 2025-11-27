import express from 'express';
import projectController from '../controllers/ProjectController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

class ProjectRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/projects', projectController.getAllProjects.bind(projectController));
        this.router.get('/projects/:id', projectController.getProjectById.bind(projectController));
        this.router.get('/architects', projectController.getArchitects.bind(projectController));

        this.router.post('/projects',
            authMiddleware.authenticateToken.bind(authMiddleware),
            upload.fields([
                { name: 'imagen_principal', maxCount: 1 },
                { name: 'imagenes_galeria', maxCount: 10 },
                { name: 'documentos', maxCount: 5 },
                { name: 'modelos3d', maxCount: 2 }
            ]),
            projectController.createProject.bind(projectController)
        );

        this.router.get('/user/projects',
            authMiddleware.authenticateToken.bind(authMiddleware),
            projectController.getUserProjects.bind(projectController)
        );

        this.router.put('/projects/:id',
            authMiddleware.authenticateToken.bind(authMiddleware),
            upload.fields([
                { name: 'imagen_principal', maxCount: 1 },
                { name: 'imagenes_galeria', maxCount: 10 },
                { name: 'documentos', maxCount: 5 },
                { name: 'modelos3d', maxCount: 2 }
            ]),
            projectController.updateProject.bind(projectController)
        );

        this.router.delete('/projects/:id',
            authMiddleware.authenticateToken.bind(authMiddleware),
            projectController.deleteProject.bind(projectController)
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ProjectRoutes();