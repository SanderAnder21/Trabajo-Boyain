// database.js
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

class Database {
    constructor() {
        this.connection = null;
    }

    async registerUser(nombre, email, password, es_arquitecto) {
        const hashedPassword = await this.hashPassword(password);
        
        // Convertir el booleano JavaScript a un valor MySQL (0 o 1)
        const isArchitect = es_arquitecto ? 1 : 0; 

        // 2. Consulta SQL para insertar
        const sql = `
            INSERT INTO usuarios (nombre, email, password, es_arquitecto) 
            VALUES (?, ?, ?, ?)
        `;
        
        try {
            const [result] = await this.query(sql, [nombre, email, hashedPassword, isArchitect]);
            return result.insertId; 
        } catch (error) {
            // Manejo de error si el email ya existe (UNIQUE constraint)
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El email ya está registrado.');
            }
            throw error;
        }
    }

    async connect() {
        try {
            // PRIMERO conecta a MySQL general
            this.connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                // Asegúrate de que esta contraseña es correcta
                password: 'parkerox@1010' 
            });
            
            console.log('✅ Conectado a MySQL');
            
            // CREA solo la base de datos
            await this.connection.execute('CREATE DATABASE IF NOT EXISTS plataforma_arquitectos');
            console.log('✅ Base de datos creada/verificada: plataforma_arquitectos');
            
            // Ahora sí usa la base de datos
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

            // 5. TABLA PROYECTO_ETIQUETAS
            await this.query(`
                CREATE TABLE IF NOT EXISTS proyecto_etiquetas (
                    proyecto_id INT NOT NULL,
                    etiqueta_id INT NOT NULL,
                    PRIMARY KEY (proyecto_id, etiqueta_id),
                    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
                    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id)
                )
            `);
            console.log('✅ Tabla proyecto_etiquetas creada');

            // 6. TABLA FAVORITOS
            await this.query(`
                CREATE TABLE IF NOT EXISTS favoritos (
                    usuario_id INT NOT NULL,
                    proyecto_id INT NOT NULL,
                    fecha_guardado DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (usuario_id, proyecto_id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Tabla favoritos creada');

            // 7. TABLA CALIFICACIONES
            await this.query(`
                CREATE TABLE IF NOT EXISTS calificaciones (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    usuario_id INT NOT NULL,
                    proyecto_id INT NOT NULL,
                    puntuacion INT CHECK (puntuacion >= 1 AND puntuacion <= 5),
                    comentario TEXT,
                    fecha_calificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_calificacion (usuario_id, proyecto_id)
                )
            `);
            console.log('✅ Tabla calificaciones creada');

            // 8. INSERTAR ETIQUETAS PREDEFINIDAS
            await this.query(`
                INSERT IGNORE INTO etiquetas (nombre, tipo) VALUES
                ('plano2d', 'tecnica'),
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

    // ⭐ MÉTODO DE LOGIN - BUSCAR USUARIO POR EMAIL
    async findUserByEmail(email) {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        const [rows] = await this.query(sql, [email]);
        return rows[0]; 
    }

    // ⭐ MÉTODO DE LOGIN - VERIFICAR CONTRASEÑA
    async verifyPassword(inputPassword, storedHash) {
        // Usa el 'bcrypt' importado al inicio del archivo
        return await bcrypt.compare(inputPassword, storedHash);
    }
}

export default new Database();