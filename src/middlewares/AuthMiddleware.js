import jwt from 'jsonwebtoken';
import config from '../config/config.js';

class AuthMiddleware {
    constructor() {
        this.jwtConfig = config.getJWTConfig();
    }

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

    requireArchitect(req, res, next) {
        if (!req.user || !req.user.es_arquitecto) {
            return res.status(403).json({
                error: 'Acceso denegado. Se requiere cuenta de arquitecto.'
            });
        }
        next();
    }

    requireClient(req, res, next) {
        if (!req.user || req.user.es_arquitecto) {
            return res.status(403).json({
                error: 'Acceso denegado. Se requiere cuenta de cliente.'
            });
        }
        next();
    }

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

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtConfig.secret);
        } catch (error) {
            return null;
        }
    }
}

export default new AuthMiddleware();