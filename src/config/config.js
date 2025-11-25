// src/config/config.js

/**
 * Clase de Configuración Centralizada (Patrón Singleton).
 * Maneja todas las variables de entorno y constantes de la aplicación.
 * * @class Config
 */
class Config {
    constructor() {
        if (Config.instance) {
            return Config.instance;
        }

        // Configuración del servidor
        this.PORT = process.env.PORT || 3000;

        // 🚨 CORRECCIÓN CLAVE: Leemos OPENROUTER_API_KEY desde el .env
        this.OPENAI_API_KEY = process.env.OPENROUTER_API_KEY || "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";

        // La URL y Modelo de OpenRouter están CORRECTOS
        this.OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";
        this.OPENAI_MODEL = process.env.OPENAI_MODEL || "deepseek/deepseek-chat";

        // Configuración de JWT
        this.JWT_SECRET = process.env.JWT_SECRET || "pMi_Pr0y3ct0_P0rtArq_2024_S3cr3t_K3y_Sup3r_S3gur4_123456789";
        this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

        // Configuración de Base de Datos
        this.DB_HOST = process.env.DB_HOST || 'localhost';
        this.DB_USER = process.env.DB_USER || 'root';
        this.DB_PASSWORD = process.env.DB_PASSWORD || 'parkerox@1010';
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
            { key: 'OPENROUTER_API_KEY', value: this.OPENAI_API_KEY }, // Usamos la variable de config para la validación
            { key: 'JWT_SECRET', value: this.JWT_SECRET },
            { key: 'DB_PASSWORD', value: this.DB_PASSWORD }
        ];

        const missing = required.filter(({ value }) => !value || value.includes('FALLBACK-KEY')); // Incluye chequeo de fallback key

        if (missing.length > 0) {
            throw new Error(
                `Configuración incompleta. Faltan o son de prueba: ${missing.map(m => m.key).join(', ')}. Verifica tu archivo .env`
            );
        }

        console.log('✅ Configuración validada correctamente');
    }
}

// Exportar instancia única (Singleton)
export default new Config();