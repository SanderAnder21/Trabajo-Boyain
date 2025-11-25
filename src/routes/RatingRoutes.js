// src/routes/RatingRoutes.js

import express from 'express';
import ratingController from '../controllers/RatingController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

/**
 * Clase para gestionar las rutas de calificaciones.
 * 
 * @class RatingRoutes
 */
class RatingRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    /**
     * Inicializa todas las rutas de calificaciones.
     * @private
     */
    initializeRoutes() {
        // Rutas públicas
        this.router.get('/projects/:projectId/ratings',
            ratingController.getProjectRatings.bind(ratingController)
        );

        // Rutas protegidas (requieren autenticación)
        this.router.post('/projects/:projectId/rating',
            authMiddleware.verifyToken.bind(authMiddleware),
            ratingController.addRating.bind(ratingController)
        );

        this.router.get('/projects/:projectId/rating/user',
            authMiddleware.verifyToken.bind(authMiddleware),
            ratingController.getUserRating.bind(ratingController)
        );

        this.router.delete('/projects/:projectId/rating',
            authMiddleware.verifyToken.bind(authMiddleware),
            ratingController.deleteRating.bind(ratingController)
        );
    }

    /**
     * Obtiene el router de Express.
     * @returns {Router} Router de Express
     */
    getRouter() {
        return this.router;
    }
}

export default new RatingRoutes();
