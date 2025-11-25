// src/middlewares/AuthMiddleware.js

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Clase que encapsula los middlewares de autenticación.
 * Proporciona métodos para verificar tokens JWT y roles de usuario.
 * 
 * @class AuthMiddleware
 */
class AuthMiddleware {
    constructor() {
        this.jwtConfig = config.getJWTConfig();
    }

    /**
     * Middleware para autenticar tokens JWT.
     * Verifica que el token sea válido y lo decodifica.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @param {Function} next - Función next de Express
     * @returns {void}
     */
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        jwt.verify(token, this.jwtConfig.secret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token inválido o expirado' });
            }
            req.user = user;
            next();
        });
    }

    /**
     * Middleware para verificar que el usuario sea arquitecto.
     * Debe usarse después de authenticateToken.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @param {Function} next - Función next de Express
     * @returns {void}
     */
    requireArchitect(req, res, next) {
        if (!req.user || !req.user.es_arquitecto) {
            return res.status(403).json({
                error: 'Acceso denegado. Se requiere cuenta de arquitecto.'
            });
        }
        next();
    }

    /**
     * Middleware para verificar que el usuario sea cliente.
     * Debe usarse después de authenticateToken.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @param {Function} next - Función next de Express
     * @returns {void}
     */
    requireClient(req, res, next) {
        if (!req.user || req.user.es_arquitecto) {
            return res.status(403).json({
                error: 'Acceso denegado. Se requiere cuenta de cliente.'
            });
        }
        next();
    }

    /**
     * Genera un token JWT para un usuario.
     * 
     * @param {Object} userData - Datos del usuario
     * @param {number} userData.id - ID del usuario
     * @param {string} userData.email - Email del usuario
     * @param {boolean} userData.es_arquitecto - Si es arquitecto
     * @returns {string} Token JWT generado
     */
    generateToken(userData) {
        return jwt.sign(
            {
                id: userData.id,
                email: userData.email,
                es_arquitecto: userData.es_arquitecto
            },
            this.jwtConfig.secret,
            { expiresIn: this.jwtConfig.expiration }
        );
    }

    /**
     * Verifica un token JWT sin usarlo como middleware.
     * 
     * @param {string} token - Token a verificar
     * @returns {Object|null} Datos del usuario decodificados o null si es inválido
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtConfig.secret);
        } catch (error) {
            return null;
        }
    }
}

// Exportar instancia única
export default new AuthMiddleware();
