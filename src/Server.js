// src/Server.js

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';
import database from '../database.js';
import authRoutes from './routes/AuthRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import chatRoutes from './routes/ChatRoutes.js';
import projectRoutes from './routes/ProjectRoutes.js';
import favoriteRoutes from './routes/FavoriteRoutes.js';
import ratingRoutes from './routes/RatingRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clase principal del servidor.
 * Encapsula la configuración y el inicio del servidor Express.
 * 
 * @class Server
 */
class Server {
    constructor() {
        this.app = express();
        this.port = config.getPort();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeStaticFiles();
        this.initializeErrorHandling();
    }

    /**
     * Inicializa los middlewares globales de Express.
     * @private
     */
    initializeMiddlewares() {
        // CORS
        this.app.use(cors({
            origin: config.getCorsOrigin()
        }));

        // Body parsers
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        console.log('✅ Middlewares inicializados');
    }

    /**
     * Registra todas las rutas de la aplicación.
     * @private
     */
    initializeRoutes() {
        // Rutas de autenticación
        this.app.use('/api', authRoutes.getRouter());

        // Rutas de usuario
        this.app.use('/api/user', userRoutes.getRouter());

        // Rutas de chat
        this.app.use('/api', chatRoutes.getRouter());

        // Rutas de proyectos
        this.app.use('/api', projectRoutes.getRouter());

        // Rutas de favoritos
        this.app.use('/api', favoriteRoutes.getRouter());

        // Rutas de calificaciones
        this.app.use('/api', ratingRoutes.getRouter());

        // Ruta principal
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'INDEX.html'));
        });

        console.log('✅ Rutas registradas');
    }

    /**
     * Configura el servicio de archivos estáticos.
     * @private
     */
    initializeStaticFiles() {
        // Servir archivos estáticos desde el directorio raíz
        this.app.use(express.static(path.join(__dirname, '..')));

        console.log('✅ Archivos estáticos configurados');
    }

    /**
     * Inicializa el manejo global de errores.
     * @private
     */
    initializeErrorHandling() {
        // Middleware de manejo de errores 404
        this.app.use((req, res, next) => {
            res.status(404).json({
                error: 'Ruta no encontrada',
                path: req.path
            });
        });

        // Middleware de manejo de errores generales
        this.app.use((err, req, res, next) => {
            console.error('❌ Error no manejado:', err);

            res.status(err.status || 500).json({
                error: 'Error interno del servidor',
                message: err.message,
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
            });
        });

        console.log('✅ Manejo de errores configurado');
    }

    /**
     * Inicializa la base de datos.
     * @returns {Promise<void>}
     */
    async initializeDatabase() {
        try {
            await database.connect();
            await database.createTables();
            console.log('✅ Base de datos inicializada correctamente');
        } catch (error) {
            console.error('❌ Error iniciando la base de datos:', error.message);
            throw error;
        }
    }

    /**
     * Inicia el servidor en el puerto configurado.
     * @returns {Promise<void>}
     */
    async start() {
        try {
            // Validar configuración
            config.validate();

            // Inicializar base de datos
            await this.initializeDatabase();

            // Iniciar servidor
            this.app.listen(this.port, () => {
                console.log('');
                console.log('🚀 ========================================');
                console.log(`✅ Servidor ejecutándose en http://localhost:${this.port}`);
                console.log('🚀 ========================================');
                console.log('');
            });

        } catch (error) {
            console.error('❌ Error fatal al iniciar el servidor:', error.message);
            process.exit(1);
        }
    }

    /**
     * Obtiene la instancia de la aplicación Express.
     * Útil para testing.
     * @returns {Express} Aplicación Express
     */
    getApp() {
        return this.app;
    }
}

export default Server;
