// src/routes/UserRoutes.js

import express from 'express';
import userController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

/**
 * Clase que define las rutas de usuario.
 * Encapsula todos los endpoints relacionados con perfiles de usuario.
 * 
 * @class UserRoutes
 */
class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    /**
     * Inicializa todas las rutas de usuario.
     * @private
     */
    initializeRoutes() {
        // Todas las rutas de usuario requieren autenticación
        const authenticate = (req, res, next) => authMiddleware.authenticateToken(req, res, next);
        const requireArchitect = (req, res, next) => authMiddleware.requireArchitect(req, res, next);

        // Ruta para obtener perfil del usuario
        this.router.get(
            '/profile',
            authenticate,
            (req, res) => userController.getProfile(req, res)
        );

        // Ruta para actualizar datos personales (todos los usuarios)
        this.router.put(
            '/personal',
            authenticate,
            (req, res) => userController.updatePersonalData(req, res)
        );

        // Ruta para actualizar datos de contacto (SOLO ARQUITECTOS)
        this.router.put(
            '/contact',
            authenticate,
            requireArchitect,
            (req, res) => userController.updateContactData(req, res)
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

export default new UserRoutes();
