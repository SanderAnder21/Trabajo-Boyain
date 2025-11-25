// src/controllers/AuthController.js

import database from '../../database.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

/**
 * Controlador para operaciones de autenticación.
 * Maneja el registro, login y verificación de usuarios.
 * 
 * @class AuthController
 */
class AuthController {
    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async register(req, res) {
        try {
            const { nombre, email, password, tipoCuenta } = req.body;

            // 1. Validación básica de datos
            if (!nombre || !email || !password || !tipoCuenta) {
                return res.status(400).json({ error: 'Faltan campos obligatorios.' });
            }

            // 2. Mapear 'tipoCuenta' a booleano
            const esArquitecto = tipoCuenta === 'arquitecto';

            // 3. Registrar el usuario en la BD
            const userId = await database.registerUser(nombre, email, password, esArquitecto);

            console.log(`👤 Usuario registrado exitosamente con ID: ${userId}`);

            // 4. Respuesta exitosa
            res.status(201).json({
                message: '¡Cuenta creada exitosamente!',
                userId: userId
            });

        } catch (error) {
            console.error("❌ Error al registrar usuario:", error.message);

            if (error.message.includes('email ya está registrado')) {
                return res.status(409).json({ error: error.message });
            }

            res.status(500).json({
                error: "Error interno del servidor durante el registro.",
                details: error.message
            });
        }
    }

    /**
     * Inicia sesión de un usuario.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Faltan credenciales (email y password).' });
            }

            // 1. Buscar usuario por email
            const user = await database.findUserByEmail(email);

            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }

            // 2. Comparar contraseña
            const match = await database.verifyPassword(password, user.password);

            if (!match) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }

            console.log(`🔑 Login exitoso para el usuario: ${user.email}`);

            // 3. Generar JWT
            const token = authMiddleware.generateToken({
                id: user.id,
                email: user.email,
                es_arquitecto: user.es_arquitecto
            });

            // 4. Respuesta exitosa
            const { password: _, ...userData } = user;

            res.status(200).json({
                message: 'Inicio de sesión exitoso.',
                token: token,
                user: userData
            });

        } catch (error) {
            console.error("❌ Error en el inicio de sesión:", error.message);
            res.status(500).json({
                error: "Error interno del servidor.",
                details: error.message
            });
        }
    }

    /**
     * Verifica si un token es válido.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {void}
     */
    verifyToken(req, res) {
        res.json({
            valid: true,
            user: req.user
        });
    }
    /**
     * Actualiza el perfil del usuario.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { nombre, bio, telefono, estado } = req.body;
            const avatarFile = req.file;

            console.log(`📝 Actualizando perfil para usuario ${userId}`);

            // 1. Preparar datos personales
            const personalData = {
                nombre: nombre,
                bio: bio
            };

            // Si hay nuevo avatar, añadir la ruta
            if (avatarFile) {
                // Convertir ruta de sistema a URL web (reemplazar backslashes en Windows)
                const avatarUrl = '/' + avatarFile.path.replace(/\\/g, '/');
                personalData.avatar = avatarUrl;
            }

            // 2. Actualizar datos personales
            await database.updateUserPersonalData(userId, personalData);

            // 3. Si es arquitecto y hay datos de contacto, actualizar
            if (req.user.es_arquitecto && (telefono || estado)) {
                await database.updateUserContactData(userId, {
                    telefono: telefono,
                    estado: estado
                });
            }

            // 4. Obtener usuario actualizado para devolverlo
            const updatedUser = await database.findUserById(userId);
            const { password: _, ...userData } = updatedUser;

            res.json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                user: userData
            });

        } catch (error) {
            console.error('❌ Error actualizando perfil:', error);
            res.status(500).json({
                error: 'Error al actualizar el perfil',
                details: error.message
            });
        }
    }
}

export default new AuthController();
