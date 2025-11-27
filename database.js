// database.js
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

/**
 * Clase Database para gestionar todas las operaciones de base de datos.
 * Implementa el patrón Singleton para mantener una única conexión.
 */
class Database {
    constructor() {
        this.connection = null;
    }

    async registerUser(nombre, email, password, es_arquitecto) {
        const hashedPassword = await this.hashPassword(password);
        const isArchitect = es_arquitecto ? 1 : 0;
        const sql = `INSERT INTO usuarios (nombre, email, password, es_arquitecto) VALUES (?, ?, ?, ?)`;

        try {
            const [result] = await this.query(sql, [nombre, email, hashedPassword, isArchitect]);
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El email ya está registrado.');
            }
            throw error;
        }
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'parkerox@1010'
            });

            console.log('✅ Conectado a MySQL');
            await this.connection.execute('CREATE DATABASE IF NOT EXISTS plataforma_arquitectos');
            console.log('✅ Base de datos creada/verificada: plataforma_arquitectos');
            await this.connection.changeUser({ database: 'plataforma_arquitectos' });
            console.log('✅ Usando base de datos: plataforma_arquitectos');
            return this.connection;
        } catch (error) {
            console.error('❌ Error conectando a la BD:', error.message);
            throw error;
        }
    }

    async createTables() {
        try {
            console.log('🔄 Creando tablas...');

            // 1. TABLA USUARIOS
            await this.query(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    nombre VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    es_arquitecto BOOLEAN DEFAULT FALSE,
                    avatar VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    biografia TEXT,
                    especialidad VARCHAR(100),
                    titulacion VARCHAR(100),
                    telefono VARCHAR(20),
                    experiencia VARCHAR(50),
                    ubicacion VARCHAR(100),
                    suscripcion_activa BOOLEAN DEFAULT FALSE,
                    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Tabla usuarios creada');

            // 2. TABLA PROYECTOS
            await this.query(`
                CREATE TABLE IF NOT EXISTS proyectos (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    usuario_id INT NOT NULL,
                    titulo VARCHAR(200) NOT NULL,
                    descripcion TEXT,
                    descripcion_completa TEXT,
                    imagen_principal VARCHAR(255),
                    tipo ENUM('residencial', 'comercial', 'restauracion', 'institucional') DEFAULT 'residencial',
                    ubicacion VARCHAR(200),
                    area_construida VARCHAR(50),
                    presupuesto VARCHAR(50),
                    duracion VARCHAR(50),
                    fecha_creacion DATE,
                    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                    rating_promedio DECIMAL(3,2) DEFAULT 0,
                    total_vistas INT DEFAULT 0,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Tabla proyectos creada');

            // 3. TABLA IMÁGENES_PROYECTO
            await this.query(`
                CREATE TABLE IF NOT EXISTS imagenes_proyecto (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    proyecto_id INT NOT NULL,
                    url_imagen VARCHAR(255) NOT NULL,
                    descripcion VARCHAR(200),
                    orden INT DEFAULT 0,
                    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Tabla imagenes_proyecto creada');

            // 4. TABLA ETIQUETAS
            await this.query(`
                CREATE TABLE IF NOT EXISTS etiquetas (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    nombre VARCHAR(50) UNIQUE NOT NULL,
                    tipo ENUM('tecnica', 'estilo') NOT NULL
                )
            `);
            console.log('✅ Tabla etiquetas creada');

            // 5. TABLA FAVORITOS
            await this.query(`
                CREATE TABLE IF NOT EXISTS favoritos (
                    usuario_id INT NOT NULL,
                    proyecto_id INT NOT NULL,
                    fecha_guardado DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (usuario_id, proyecto_id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Tabla favoritos creada');

            // 6. TABLA CALIFICACIONES
            await this.query(`
                CREATE TABLE IF NOT EXISTS calificaciones (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    usuario_id INT NOT NULL,
                    proyecto_id INT NOT NULL,
                    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
                    comentario TEXT,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Tabla calificaciones creada');

            // 7. TABLA ARCHIVOS_PROYECTO
            await this.query(`
                CREATE TABLE IF NOT EXISTS archivos_proyecto (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    proyecto_id INT NOT NULL,
                    url_archivo VARCHAR(255) NOT NULL,
                    nombre_archivo VARCHAR(255),
                    tipo_archivo ENUM('pdf', 'modelo3d', 'otro') NOT NULL,
                    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Tabla archivos_proyecto creada');

            // 8. INSERTAR ETIQUETAS
            await this.query(`
                INSERT IGNORE INTO etiquetas (nombre, tipo) VALUES
                ('modelo3d', 'tecnica'), 
                ('proyectoConstruido', 'tecnica'),
                ('maqueta', 'tecnica'),
                ('Imágenes', 'tecnica'),
                ('Planos PDF', 'tecnica'),
                ('Documentación Técnica', 'tecnica'),
                ('Modelo 3D', 'tecnica'),
                ('Interactivo', 'tecnica'),
                ('Restauración', 'tecnica'),
                ('Patrimonio', 'tecnica'),
                ('minimalista', 'estilo'),
                ('moderno', 'estilo'),
                ('contemporaneo', 'estilo'),
                ('colonial', 'estilo'),
                ('rustico', 'estilo'),
                ('industrial', 'estilo'),
                ('sostenible', 'estilo'),
                ('gotico', 'estilo'),
                ('tradicional', 'estilo')
            `);
            console.log('✅ Etiquetas predeterminadas insertadas');

            console.log('🎉 Todas las tablas creadas exitosamente');

        } catch (error) {
            console.error('❌ Error creando tablas:', error);
            throw error;
        }
    }

    async query(sql, params = []) {
        if (!this.connection) {
            await this.connect();
        }
        return await this.connection.execute(sql, params);
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async findUserByEmail(email) {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        const [rows] = await this.query(sql, [email]);
        return rows[0];
    }

    async verifyPassword(inputPassword, storedHash) {
        return await bcrypt.compare(inputPassword, storedHash);
    }

    async findUserById(userId) {
        const sql = `SELECT * FROM usuarios WHERE id = ?`;
        const [rows] = await this.query(sql, [userId]);
        return rows[0];
    }

async findUserById(userId) {
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    const [rows] = await this.query(sql, [userId]);
    return rows[0];
}

// ⭐ AGREGA ESTOS MÉTODOS AQUÍ ⭐

/**
 * Actualiza los datos personales del usuario
 * @param {number} userId - ID del usuario
 * @param {Object} personalData - Datos personales {nombre, bio, avatar}
 * @returns {Promise<Object>}
 */
async updateUserPersonalData(userId, personalData) {
    try {
        const fields = [];
        const values = [];
        
        if (personalData.nombre !== undefined) {
            fields.push('nombre = ?');
            values.push(personalData.nombre);
        }
        
        if (personalData.bio !== undefined) {
            fields.push('biografia = ?');
            values.push(personalData.bio);
        }
        
        if (personalData.avatar !== undefined) {
            fields.push('avatar = ?');
            values.push(personalData.avatar);
        }
        
        if (fields.length === 0) {
            throw new Error('No hay datos para actualizar');
        }
        
        values.push(userId);
        const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
        
        const [result] = await this.query(sql, values);
        
        if (result.affectedRows === 0) {
            throw new Error('Usuario no encontrado');
        }
        
        console.log(`✅ Datos personales actualizados para usuario ${userId}`);
        return { success: true, affectedRows: result.affectedRows };
        
    } catch (error) {
        console.error('❌ Error actualizando datos personales:', error);
        throw error;
    }
}

/**
 * Actualiza los datos de contacto del usuario (solo arquitectos)
 * @param {number} userId - ID del usuario
 * @param {Object} contactData - Datos de contacto {telefono, estado}
 * @returns {Promise<Object>}
 */
async updateUserContactData(userId, contactData) {
    try {
        const fields = [];
        const values = [];
        
        if (contactData.telefono !== undefined) {
            fields.push('telefono = ?');
            values.push(contactData.telefono);
        }
        
        if (contactData.estado !== undefined) {
            fields.push('ubicacion = ?');
            values.push(contactData.estado);
        }
        
        if (fields.length === 0) {
            throw new Error('No hay datos de contacto para actualizar');
        }
        
        values.push(userId);
        const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ? AND es_arquitecto = 1`;
        
        const [result] = await this.query(sql, values);
        
        if (result.affectedRows === 0) {
            throw new Error('Usuario no encontrado o no es arquitecto');
        }
        
        console.log(`✅ Datos de contacto actualizados para usuario ${userId}`);
        return { success: true, affectedRows: result.affectedRows };
        
    } catch (error) {
        console.error('❌ Error actualizando datos de contacto:', error);
        throw error;
    }
}

// ⭐ FIN DE MÉTODOS AGREGADOS ⭐

async findProjectById(projectId) {
    const sql = 'SELECT * FROM proyectos WHERE id = ?';
    const [rows] = await this.query(sql, [projectId]);
    return rows[0];
}

    async findProjectById(projectId) {
        const sql = 'SELECT * FROM proyectos WHERE id = ?';
        const [rows] = await this.query(sql, [projectId]);
        return rows[0];
    }

    // Métodos de Favoritos
    async addFavorite(userId, projectId) {
        const sql = 'INSERT INTO favoritos (usuario_id, proyecto_id) VALUES (?, ?)';
        return await this.query(sql, [userId, projectId]);
    }

    async removeFavorite(userId, projectId) {
        const sql = 'DELETE FROM favoritos WHERE usuario_id = ? AND proyecto_id = ?';
        return await this.query(sql, [userId, projectId]);
    }

    async isFavorite(userId, projectId) {
        const sql = 'SELECT * FROM favoritos WHERE usuario_id = ? AND proyecto_id = ?';
        const [rows] = await this.query(sql, [userId, projectId]);
        return rows.length > 0;
    }

    async getUserFavorites(userId) {
        const sql = `
            SELECT p.*, u.nombre as arquitecto_nombre, u.avatar as arquitecto_avatar
            FROM proyectos p
            INNER JOIN favoritos f ON p.id = f.proyecto_id
            INNER JOIN usuarios u ON p.usuario_id = u.id
            WHERE f.usuario_id = ?
            ORDER BY f.fecha_guardado DESC
        `;
        const [rows] = await this.query(sql, [userId]);
        return rows;
    }

    // Métodos de Calificaciones
    async addRating(userId, projectId, puntuacion, comentario) {
        const sql = `INSERT INTO calificaciones (usuario_id, proyecto_id, puntuacion, comentario) VALUES (?, ?, ?, ?)`;
        return await this.query(sql, [userId, projectId, puntuacion, comentario]);
    }

    async updateRating(userId, projectId, puntuacion, comentario) {
        const sql = `UPDATE calificaciones SET puntuacion = ?, comentario = ?, fecha_calificacion = CURRENT_TIMESTAMP WHERE usuario_id = ? AND proyecto_id = ?`;
        return await this.query(sql, [puntuacion, comentario, userId, projectId]);
    }

    async deleteRating(userId, projectId) {
        const sql = 'DELETE FROM calificaciones WHERE usuario_id = ? AND proyecto_id = ?';
        return await this.query(sql, [userId, projectId]);
    }

    async getUserRating(userId, projectId) {
        const sql = 'SELECT * FROM calificaciones WHERE usuario_id = ? AND proyecto_id = ?';
        const [rows] = await this.query(sql, [userId, projectId]);
        return rows[0];
    }

    async getProjectRatings(projectId) {
        const sql = `
            SELECT c.*, u.nombre as usuario_nombre, u.avatar as usuario_avatar
            FROM calificaciones c
            INNER JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.proyecto_id = ?
            ORDER BY c.fecha_calificacion DESC
        `;
        const [rows] = await this.query(sql, [projectId]);
        return rows;
    }

    async updateProjectAverageRating(projectId) {
        const sqlAvg = `SELECT AVG(puntuacion) as promedio FROM calificaciones WHERE proyecto_id = ?`;
        const [rows] = await this.query(sqlAvg, [projectId]);
        const promedio = rows[0].promedio || 0;
        const sqlUpdate = `UPDATE proyectos SET rating_promedio = ? WHERE id = ?`;
        await this.query(sqlUpdate, [promedio, projectId]);
    }
}

const database = new Database();
export default database;