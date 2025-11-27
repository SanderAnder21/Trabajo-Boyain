import express from 'express';
import userController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        const authenticate = (req, res, next) => authMiddleware.authenticateToken(req, res, next);
        const requireArchitect = (req, res, next) => authMiddleware.requireArchitect(req, res, next);

        this.router.get(
            '/profile',
            authenticate,
            (req, res) => userController.getProfile(req, res)
        );

        this.router.put(
            '/personal',
            authenticate,
            (req, res) => userController.updatePersonalData(req, res)
        );

        this.router.put(
            '/contact',
            authenticate,
            requireArchitect,
            (req, res) => userController.updateContactData(req, res)
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new UserRoutes();