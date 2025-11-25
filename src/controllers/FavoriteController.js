// src/controllers/FavoriteController.js

import database from '../../database.js';

/**
 * Controlador para gestionar favoritos de proyectos.
 * Permite a los usuarios guardar proyectos como favoritos.
 * 
 * @class FavoriteController
 */
class FavoriteController {
    /**
     * Agrega un proyecto a favoritos del usuario.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async addFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;

            // Verificar que el proyecto existe
            const project = await database.findProjectById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }

            // Verificar si ya está en favoritos
            const exists = await database.isFavorite(userId, projectId);
            if (exists) {
                return res.status(400).json({ error: 'El proyecto ya está en favoritos' });
            }

            // Agregar a favoritos
            await database.addFavorite(userId, projectId);

            console.log(`✅ Usuario ${userId} agregó proyecto ${projectId} a favoritos`);

            res.status(201).json({
                success: true,
                message: 'Proyecto agregado a favoritos'
            });

        } catch (error) {
            console.error('❌ Error agregando a favoritos:', error);
            res.status(500).json({
                error: 'Error al agregar a favoritos',
                details: error.message
            });
        }
    }

    /**
     * Quita un proyecto de favoritos del usuario.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async removeFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;

            // Quitar de favoritos
            const result = await database.removeFavorite(userId, projectId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Favorito no encontrado' });
            }

            console.log(`✅ Usuario ${userId} quitó proyecto ${projectId} de favoritos`);

            res.json({
                success: true,
                message: 'Proyecto quitado de favoritos'
            });

        } catch (error) {
            console.error('❌ Error quitando de favoritos:', error);
            res.status(500).json({
                error: 'Error al quitar de favoritos',
                details: error.message
            });
        }
    }

    /**
     * Obtiene todos los proyectos favoritos del usuario.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async getUserFavorites(req, res) {
        try {
            const userId = req.user.id;

            const favorites = await database.getUserFavorites(userId);

            res.json({
                success: true,
                favorites: favorites
            });

        } catch (error) {
            console.error('❌ Error obteniendo favoritos:', error);
            res.status(500).json({
                error: 'Error al obtener favoritos',
                details: error.message
            });
        }
    }

    /**
     * Verifica si un proyecto está en favoritos del usuario.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async checkFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;

            const isFavorite = await database.isFavorite(userId, projectId);

            res.json({
                success: true,
                isFavorite: isFavorite
            });

        } catch (error) {
            console.error('❌ Error verificando favorito:', error);
            res.status(500).json({
                error: 'Error al verificar favorito',
                details: error.message
            });
        }
    }
}

export default new FavoriteController();
