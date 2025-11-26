// src/routes/FavoriteRoutes.js

import express from 'express';
import favoriteController from '../controllers/FavoriteController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

/**
 * Clase para gestionar las rutas de favoritos.
 * Todas las rutas requieren autenticación.
 * 
 * @class FavoriteRoutes
 */
class FavoriteRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    /**
     * Inicializa todas las rutas de favoritos.
     * @private
     */
    initializeRoutes() {
        // Todas las rutas requieren autenticación
        // ✅ ESTO ES CORRECTO:
this.router.use(authMiddleware.authenticateToken.bind(authMiddleware));

        // Agregar a favoritos
        this.router.post('/favorites/:projectId',
            favoriteController.addFavorite.bind(favoriteController)
        );

        // Quitar de favoritos
        this.router.delete('/favorites/:projectId',
            favoriteController.removeFavorite.bind(favoriteController)
        );

        // Obtener favoritos del usuario
        this.router.get('/user/favorites',
            favoriteController.getUserFavorites.bind(favoriteController)
        );

        // Verificar si un proyecto está en favoritos
        this.router.get('/favorites/:projectId/check',
            favoriteController.checkFavorite.bind(favoriteController)
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

export default new FavoriteRoutes();
