import database from '../../database.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

class AuthController {
    async register(req, res) {
        try {
            const { nombre, email, password, tipoCuenta } = req.body;

            if (!nombre || !email || !password || !tipoCuenta) {
                return res.status(400).json({ error: 'Faltan campos obligatorios.' });
            }

            const esArquitecto = tipoCuenta === 'arquitecto';

            const userId = await database.registerUser(nombre, email, password, esArquitecto);

            console.log(` Usuario registrado exitosamente con ID: ${userId}`);

            res.status(201).json({
                message: '¡Cuenta creada exitosamente!',
                userId: userId
            });

        } catch (error) {
            console.error(" Error al registrar usuario:", error.message);

            if (error.message.includes('email ya está registrado')) {
                return res.status(409).json({ error: error.message });
            }

            res.status(500).json({
                error: "Error interno del servidor durante el registro.",
                details: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Faltan credenciales (email y password).' });
            }

            const user = await database.findUserByEmail(email);

            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }
            const match = await database.verifyPassword(password, user.password);

            if (!match) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }

            console.log(` Login exitoso para el usuario: ${user.email}`);

            const token = authMiddleware.generateToken({
                id: user.id,
                email: user.email,
                es_arquitecto: user.es_arquitecto
            });

            const { password: _, ...userData } = user;

            res.status(200).json({
                message: 'Inicio de sesión exitoso.',
                token: token,
                user: userData
            });

        } catch (error) {
            console.error(" Error en el inicio de sesión:", error.message);
            res.status(500).json({
                error: "Error interno del servidor.",
                details: error.message
            });
        }
    }

    verifyToken(req, res) {
        res.json({
            valid: true,
            user: req.user
        });
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { nombre, bio, telefono, estado } = req.body;
            const avatarFile = req.file;

            console.log(`Actualizando perfil para usuario ${userId}`);

            const personalData = {
                nombre: nombre,
                bio: bio
            };

            if (avatarFile) {
                const avatarUrl = '/' + avatarFile.path.replace(/\\/g, '/');
                personalData.avatar = avatarUrl;
            }

            await database.updateUserPersonalData(userId, personalData);

            if (req.user.es_arquitecto && (telefono || estado)) {
                await database.updateUserContactData(userId, {
                    telefono: telefono,
                    estado: estado
                });
            }

            const updatedUser = await database.findUserById(userId);
            const { password: _, ...userData } = updatedUser;

            res.json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                user: userData
            });

        } catch (error) {
            console.error(' Error actualizando perfil:', error);
            res.status(500).json({
                error: 'Error al actualizar el perfil',
                details: error.message
            });
        }
    }
}

export default new AuthController();