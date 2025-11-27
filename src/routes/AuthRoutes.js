import express from 'express';
import authController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/register', (req, res) => authController.register(req, res));

        this.router.post('/login', (req, res) => authController.login(req, res));

        this.router.get(
            '/verify-token',
            (req, res, next) => authMiddleware.authenticateToken(req, res, next),
            (req, res) => authController.verifyToken(req, res)
        );

        this.router.put(
            '/update-profile',
            (req, res, next) => authMiddleware.authenticateToken(req, res, next),
            upload.single('avatar'),
            (req, res) => authController.updateProfile(req, res)
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new AuthRoutes();