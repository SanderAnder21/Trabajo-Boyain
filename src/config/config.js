class Config {
    constructor() {
        if (Config.instance) {
            return Config.instance;
        }
        this.PORT = process.env.PORT || 3000;

        this.OPENAI_API_KEY = process.env.OPENROUTER_API_KEY || "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";
        this.OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";
        this.OPENAI_MODEL = process.env.OPENAI_MODEL || "deepseek/deepseek-chat";
        this.JWT_SECRET = process.env.JWT_SECRET || "pMi_Pr0y3ct0_P0rtArq_2024_S3cr3t_K3y_Sup3r_S3gur4_123456789";
        this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

        this.DB_HOST = process.env.DB_HOST || 'localhost';
        this.DB_USER = process.env.DB_USER || 'root';
        this.DB_PASSWORD = process.env.DB_PASSWORD || 'parkerox@1010';
        this.DB_NAME = process.env.DB_NAME || 'plataforma_arquitectos';

        this.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

        Config.instance = this;
    }

    getPort() {
        return this.PORT;
    }

    getOpenAIConfig() {
        return {
            apiKey: this.OPENAI_API_KEY,
            baseURL: this.OPENAI_BASE_URL,
            model: this.OPENAI_MODEL
        };
    }

    getJWTConfig() {
        return {
            secret: this.JWT_SECRET,
            expiration: this.JWT_EXPIRATION
        };
    }

    getDatabaseConfig() {
        return {
            host: this.DB_HOST,
            user: this.DB_USER,
            password: this.DB_PASSWORD,
            database: this.DB_NAME
        };
    }

    getCorsOrigin() {
        return this.CORS_ORIGIN;
    }

    validate() {
        const required = [
            { key: 'OPENROUTER_API_KEY', value: this.OPENAI_API_KEY },
            { key: 'JWT_SECRET', value: this.JWT_SECRET },
            { key: 'DB_PASSWORD', value: this.DB_PASSWORD }
        ];

        const missing = required.filter(({ value }) => !value || value.includes('FALLBACK-KEY'));

        if (missing.length > 0) {
            throw new Error(
                `Configuración incompleta. Faltan o son de prueba: ${missing.map(m => m.key).join(', ')}. Verifica tu archivo .env`
            );
        }

        console.log('Configuración validada correctamente');
    }
}

export default new Config();