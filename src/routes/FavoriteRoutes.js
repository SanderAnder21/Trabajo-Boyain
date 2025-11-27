import express from 'express';
import favoriteController from '../controllers/FavoriteController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

class FavoriteRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(authMiddleware.authenticateToken.bind(authMiddleware));

        this.router.post('/favorites/:projectId',
            favoriteController.addFavorite.bind(favoriteController)
        );

        this.router.delete('/favorites/:projectId',
            favoriteController.removeFavorite.bind(favoriteController)
        );

        this.router.get('/user/favorites',
            favoriteController.getUserFavorites.bind(favoriteController)
        );

        this.router.get('/favorites/:projectId/check',
            favoriteController.checkFavorite.bind(favoriteController)
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new FavoriteRoutes();