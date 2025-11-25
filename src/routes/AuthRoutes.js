import express from 'express';
import authController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

/**
 * Clase que define las rutas de autenticación.
 * Encapsula todos los endpoints relacionados con auth.
 * 
 * @class AuthRoutes
 */
class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    /**
     * Inicializa todas las rutas de autenticación.
     * @private
     */
    initializeRoutes() {
        // Ruta para registrar un nuevo usuario
        this.router.post('/register', (req, res) => authController.register(req, res));

        // Ruta para el inicio de sesión
        this.router.post('/login', (req, res) => authController.login(req, res));

        // Ruta para verificar token (requiere autenticación)
        this.router.get(
            '/verify-token',
            (req, res, next) => authMiddleware.authenticateToken(req, res, next),
            (req, res) => authController.verifyToken(req, res)
        );

        // Ruta para actualizar perfil (requiere autenticación y soporta avatar)
        this.router.put(
            '/update-profile',
            (req, res, next) => authMiddleware.authenticateToken(req, res, next),
            upload.single('avatar'),
            (req, res) => authController.updateProfile(req, res)
        );
    }

    /**
     * Obtiene el router de Express configurado.
     * @returns {Router} Router de Express
     */
    getRouter() {
        return this.router;
    }
}

export default new AuthRoutes();
