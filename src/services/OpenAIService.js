import OpenAI from 'openai';
import config from '../config/config.js';

class OpenAIService {
    constructor() {
        const openAIConfig = config.getOpenAIConfig();

        this.client = new OpenAI({
            apiKey: openAIConfig.apiKey,
            baseURL: openAIConfig.baseURL,
        });

        this.model = openAIConfig.model;

        console.log('OpenAI Service inicializado');
    }

    async sendMessage(message, maxTokens = 500) {
        try {
            if (!message || typeof message !== 'string') {
                throw new Error('El mensaje debe ser una cadena de texto válida');
            }

            console.log('Enviando mensaje a OpenAI:', message.substring(0, 50) + '...');

            const chat = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: message }],
                max_tokens: maxTokens
            });

            const response = chat.choices[0].message.content;

            console.log('Respuesta recibida de OpenAI');

            return response;

        } catch (error) {
            console.error('Error en OpenAI Service:', error.message);

            if (error.status === 401) {
                throw new Error('Error de autenticación con OpenAI. Verifica la API key.');
            } else if (error.status === 429) {
                throw new Error('Límite de tasa excedido. Intenta de nuevo más tarde.');
            } else if (error.status === 500) {
                throw new Error('Error del servidor de OpenAI. Intenta de nuevo más tarde.');
            }

            throw new Error(`Error al comunicarse con OpenAI: ${error.message}`);
        }
    }

    async sendConversation(messages, maxTokens = 500) {
        try {
            if (!Array.isArray(messages) || messages.length === 0) {
                throw new Error('Los mensajes deben ser un array no vacío');
            }

            console.log(`Enviando conversación con ${messages.length} mensajes a OpenAI`);

            const chat = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                max_tokens: maxTokens
            });

            const response = chat.choices[0].message.content;

            console.log('Respuesta de conversación recibida');

            return response;

        } catch (error) {
            console.error('Error en conversación con OpenAI:', error.message);
            throw new Error(`Error al comunicarse con OpenAI: ${error.message}`);
        }
    }

    isConfigured() {
        return !!this.client && !!this.model;
    }
}

export default new OpenAIService();