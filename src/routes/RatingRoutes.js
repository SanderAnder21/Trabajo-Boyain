import express from 'express';
import ratingController from '../controllers/RatingController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

class RatingRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/projects/:projectId/ratings',
            ratingController.getProjectRatings.bind(ratingController)
        );

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

    getRouter() {
        return this.router;
    }
}

export default new RatingRoutes();