import database from '../../database.js';

class UserController {
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