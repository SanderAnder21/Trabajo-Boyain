import database from '../../database.js';

class FavoriteController {
    async addFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;

            const project = await database.findProjectById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }

            const exists = await database.isFavorite(userId, projectId);
            if (exists) {
                return res.status(400).json({ error: 'El proyecto ya está en favoritos' });
            }

            await database.addFavorite(userId, projectId);

            console.log(`Usuario ${userId} agregó proyecto ${projectId} a favoritos`);

            res.status(201).json({
                success: true,
                message: 'Proyecto agregado a favoritos'
            });

        } catch (error) {
            console.error('Error agregando a favoritos:', error);
            res.status(500).json({
                error: 'Error al agregar a favoritos',
                details: error.message
            });
        }
    }

    async removeFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;

            const result = await database.removeFavorite(userId, projectId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Favorito no encontrado' });
            }

            console.log(`Usuario ${userId} quitó proyecto ${projectId} de favoritos`);

            res.json({
                success: true,
                message: 'Proyecto quitado de favoritos'
            });

        } catch (error) {
            console.error('Error quitando de favoritos:', error);
            res.status(500).json({
                error: 'Error al quitar de favoritos',
                details: error.message
            });
        }
    }

    async getUserFavorites(req, res) {
        try {
            const userId = req.user.id;

            const favorites = await database.getUserFavorites(userId);

            res.json({
                success: true,
                favorites: favorites
            });

        } catch (error) {
            console.error('Error obteniendo favoritos:', error);
            res.status(500).json({
                error: 'Error al obtener favoritos',
                details: error.message
            });
        }
    }

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
            console.error('Error verificando favorito:', error);
            res.status(500).json({
                error: 'Error al verificar favorito',
                details: error.message
            });
        }
    }
}

export default new FavoriteController();