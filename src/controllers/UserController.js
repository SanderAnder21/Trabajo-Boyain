// src/controllers/UserController.js

import database from '../../database.js';

/**
 * Controlador para operaciones de usuario.
 * Maneja la obtención y actualización de datos de perfil.
 * 
 * @class UserController
 */
class UserController {
    /**
     * Obtiene el perfil del usuario autenticado.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async getProfile(req, res) {
        try {
            const user = await database.findUserById(req.user.id);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const { password, ...userData } = user;
            res.json(userData);

        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    /**
     * Actualiza los datos personales del usuario.
     * Disponible para todos los usuarios (clientes y arquitectos).
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async updatePersonalData(req, res) {
        try {
            const { nombre, fechaNacimiento, bio } = req.body;

            await database.updateUserPersonalData(req.user.id, {
                nombre,
                fechaNacimiento,
                bio
            });

            res.json({ message: 'Datos personales actualizados exitosamente' });

        } catch (error) {
            console.error('Error actualizando datos personales:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    /**
     * Actualiza los datos de contacto del arquitecto.
     * Solo disponible para usuarios con rol de arquitecto.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async updateContactData(req, res) {
        try {
            const { telefono, estado, direccion } = req.body;

            await database.updateUserContactData(req.user.id, {
                telefono,
                estado,
                direccion
            });

            res.json({ message: 'Datos de contacto actualizados exitosamente' });

        } catch (error) {
            console.error('Error actualizando datos de contacto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

export default new UserController();
