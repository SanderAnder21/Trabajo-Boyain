// src/config/config.js

/**
 * Clase de Configuración Centralizada (Patrón Singleton).
 * Maneja todas las variables de entorno y constantes de la aplicación.
 * 
 * @class Config
 * @example
 * import config from './config/config.js';
 * const port = config.getPort();
 */
class Config {
    constructor() {
        if (Config.instance) {
            return Config.instance;
        }

        // Configuración del servidor
        this.PORT = process.env.PORT || 3000;

        // Configuración de OpenAI
        this.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";
        this.OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";
        this.OPENAI_MODEL = process.env.OPENAI_MODEL || "deepseek/deepseek-chat";

        // Configuración de JWT
        this.JWT_SECRET = process.env.JWT_SECRET || "portarq-secret-key-2024";
        this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

        // Configuración de Base de Datos
        this.DB_HOST = process.env.DB_HOST || 'localhost';
        this.DB_USER = process.env.DB_USER || 'root';
        this.DB_PASSWORD = process.env.DB_PASSWORD || 'qwerty';
        this.DB_NAME = process.env.DB_NAME || 'plataforma_arquitectos';

        // Configuración de CORS
        this.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

        Config.instance = this;
    }

    /**
     * Obtiene el puerto del servidor.
     * @returns {number}
     */
    getPort() {
        return this.PORT;
    }

    /**
     * Obtiene la configuración de OpenAI.
     * @returns {{apiKey: string, baseURL: string, model: string}}
     */
    getOpenAIConfig() {
        return {
            apiKey: this.OPENAI_API_KEY,
            baseURL: this.OPENAI_BASE_URL,
            model: this.OPENAI_MODEL
        };
    }

    /**
     * Obtiene la configuración de JWT.
     * @returns {{secret: string, expiration: string}}
     */
    getJWTConfig() {
        return {
            secret: this.JWT_SECRET,
            expiration: this.JWT_EXPIRATION
        };
    }

    /**
     * Obtiene la configuración de la base de datos.
     * @returns {{host: string, user: string, password: string, database: string}}
     */
    getDatabaseConfig() {
        return {
            host: this.DB_HOST,
            user: this.DB_USER,
            password: this.DB_PASSWORD,
            database: this.DB_NAME
        };
    }

    /**
     * Obtiene la configuración de CORS.
     * @returns {string}
     */
    getCorsOrigin() {
        return this.CORS_ORIGIN;
    }

    /**
     * Valida que todas las configuraciones críticas estén presentes.
     * @throws {Error} Si falta alguna configuración crítica
     */
    validate() {
        const required = [
            { key: 'OPENAI_API_KEY', value: this.OPENAI_API_KEY },
            { key: 'JWT_SECRET', value: this.JWT_SECRET },
            { key: 'DB_PASSWORD', value: this.DB_PASSWORD }
        ];

        const missing = required.filter(({ value }) => !value);

        if (missing.length > 0) {
            throw new Error(
                `Configuración incompleta. Faltan: ${missing.map(m => m.key).join(', ')}`
            );
        }

        console.log('✅ Configuración validada correctamente');
    }
}

// Exportar instancia única (Singleton)
export default new Config();
