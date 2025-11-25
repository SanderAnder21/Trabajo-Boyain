// src/services/OpenAIService.js

import OpenAI from 'openai';
import config from '../config/config.js';

/**
 * Servicio para interactuar con la API de OpenAI.
 * Encapsula toda la lógica de comunicación con OpenAI.
 * 
 * @class OpenAIService
 */
class OpenAIService {
    /**
     * Constructor del servicio OpenAI.
     * Inicializa el cliente de OpenAI con la configuración.
     */
    constructor() {
        const openAIConfig = config.getOpenAIConfig();

        this.client = new OpenAI({
            apiKey: openAIConfig.apiKey,
            baseURL: openAIConfig.baseURL,
        });

        this.model = openAIConfig.model;

        console.log('🔑 OpenAI Service inicializado');
    }

    /**
     * Envía un mensaje al chatbot y obtiene una respuesta.
     * 
     * @param {string} message - Mensaje del usuario
     * @param {number} [maxTokens=500] - Número máximo de tokens en la respuesta
     * @returns {Promise<string>} Respuesta del chatbot
     * @throws {Error} Si hay un error en la comunicación con OpenAI
     */
    async sendMessage(message, maxTokens = 500) {
        try {
            if (!message || typeof message !== 'string') {
                throw new Error('El mensaje debe ser una cadena de texto válida');
            }

            console.log('📨 Enviando mensaje a OpenAI:', message.substring(0, 50) + '...');

            const chat = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: message }],
                max_tokens: maxTokens
            });

            const response = chat.choices[0].message.content;

            console.log('🤖 Respuesta recibida de OpenAI');

            return response;

        } catch (error) {
            console.error('❌ Error en OpenAI Service:', error.message);

            // Manejo de errores específicos de OpenAI
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

    /**
     * Envía múltiples mensajes en una conversación.
     * 
     * @param {Array<{role: string, content: string}>} messages - Array de mensajes
     * @param {number} [maxTokens=500] - Número máximo de tokens en la respuesta
     * @returns {Promise<string>} Respuesta del chatbot
     * @throws {Error} Si hay un error en la comunicación con OpenAI
     */
    async sendConversation(messages, maxTokens = 500) {
        try {
            if (!Array.isArray(messages) || messages.length === 0) {
                throw new Error('Los mensajes deben ser un array no vacío');
            }

            console.log(`📨 Enviando conversación con ${messages.length} mensajes a OpenAI`);

            const chat = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                max_tokens: maxTokens
            });

            const response = chat.choices[0].message.content;

            console.log('🤖 Respuesta de conversación recibida');

            return response;

        } catch (error) {
            console.error('❌ Error en conversación con OpenAI:', error.message);
            throw new Error(`Error al comunicarse con OpenAI: ${error.message}`);
        }
    }

    /**
     * Verifica si el servicio está configurado correctamente.
     * 
     * @returns {boolean} True si está configurado correctamente
     */
    isConfigured() {
        return !!this.client && !!this.model;
    }
}

// Exportar instancia única del servicio
export default new OpenAIService();
