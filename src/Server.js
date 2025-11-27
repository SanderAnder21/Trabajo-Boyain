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

class Server {
    constructor() {
        this.app = express();
        this.port = config.getPort();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeStaticFiles();
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        this.app.use(cors({
            origin: config.getCorsOrigin()
        }));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        console.log('✅ Middlewares inicializados');
    }

    initializeRoutes() {
        this.app.use('/api', authRoutes.getRouter());

        this.app.use('/api/user', userRoutes.getRouter());

        this.app.use('/api', chatRoutes.getRouter());

        this.app.use('/api', projectRoutes.getRouter());

        this.app.use('/api', favoriteRoutes.getRouter());

        this.app.use('/api', ratingRoutes.getRouter());

        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'INDEX.html'));
        });

        console.log('✅ Rutas registradas');
    }

    initializeStaticFiles() {
        this.app.use(express.static(path.join(__dirname, '..')));

        console.log('✅ Archivos estáticos configurados');
    }

    initializeErrorHandling() {
        this.app.use((req, res, next) => {
            res.status(404).json({
                error: 'Ruta no encontrada',
                path: req.path
            });
        });

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

    async start() {
        try {
            config.validate();

            await this.initializeDatabase();

            this.app.listen(this.port, () => {
                console.log('');
                console.log(' ========================================');
                console.log(` Servidor ejecutándose en http://localhost:${this.port}`);
                console.log(' ========================================');
                console.log('');
            });

        } catch (error) {
            console.error('❌ Error fatal al iniciar el servidor:', error.message);
            process.exit(1);
        }
    }

    getApp() {
        return this.app;
    }
}

export default Server;