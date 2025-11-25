// src/controllers/RatingController.js

import database from '../../database.js';

/**
 * Controlador para gestionar calificaciones y comentarios de proyectos.
 * 
 * @class RatingController
 */
class RatingController {
    /**
     * Agrega o actualiza una calificación de un proyecto.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async addRating(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;
            const { puntuacion, comentario } = req.body;

            // Validaciones
            if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
                return res.status(400).json({
                    error: 'La puntuación debe ser entre 1 y 5'
                });
            }

            // Verificar que el proyecto existe
            const project = await database.findProjectById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }

            // Verificar si el usuario ya calificó este proyecto
            const existingRating = await database.getUserRating(userId, projectId);

            let result;
            if (existingRating) {
                // Actualizar calificación existente
                result = await database.updateRating(userId, projectId, puntuacion, comentario);
                console.log(`✅ Usuario ${userId} actualizó calificación del proyecto ${projectId}`);
            } else {
                // Crear nueva calificación
                result = await database.addRating(userId, projectId, puntuacion, comentario);
                console.log(`✅ Usuario ${userId} calificó proyecto ${projectId} con ${puntuacion} estrellas`);
            }

            // Actualizar rating promedio del proyecto
            await database.updateProjectAverageRating(projectId);

            res.status(existingRating ? 200 : 201).json({
                success: true,
                message: existingRating ? 'Calificación actualizada' : 'Calificación agregada',
                ratingId: result.insertId || existingRating.id
            });

        } catch (error) {
            console.error('❌ Error agregando calificación:', error);
            res.status(500).json({
                error: 'Error al agregar calificación',
                details: error.message
            });
        }
    }

    /**
     * Obtiene todas las calificaciones de un proyecto.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async getProjectRatings(req, res) {
        try {
            const { projectId } = req.params;

            const ratings = await database.getProjectRatings(projectId);

            res.json({
                success: true,
                ratings: ratings,
                total: ratings.length
            });

        } catch (error) {
            console.error('❌ Error obteniendo calificaciones:', error);
            res.status(500).json({
                error: 'Error al obtener calificaciones',
                details: error.message
            });
        }
    }

    /**
     * Obtiene la calificación del usuario para un proyecto específico.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async getUserRating(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;

            const rating = await database.getUserRating(userId, projectId);

            res.json({
                success: true,
                rating: rating || null,
                hasRated: !!rating
            });

        } catch (error) {
            console.error('❌ Error obteniendo calificación del usuario:', error);
            res.status(500).json({
                error: 'Error al obtener calificación',
                details: error.message
            });
        }
    }

    /**
     * Elimina una calificación.
     * 
     * @param {Request} req - Objeto de solicitud de Express
     * @param {Response} res - Objeto de respuesta de Express
     * @returns {Promise<void>}
     */
    async deleteRating(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;

            const result = await database.deleteRating(userId, projectId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Calificación no encontrada' });
            }

            // Actualizar rating promedio del proyecto
            await database.updateProjectAverageRating(projectId);

            res.json({
                success: true,
                message: 'Calificación eliminada'
            });

        } catch (error) {
            console.error('❌ Error eliminando calificación:', error);
            res.status(500).json({
                error: 'Error al eliminar calificación',
                details: error.message
            });
        }
    }
}

export default new RatingController();
