// src/routes/ChatRoutes.js

import express from 'express';
import chatController from '../controllers/ChatController.js';

/**
 * Clase que define las rutas del chatbot.
 * Encapsula todos los endpoints relacionados con el chat.
 * 
 * @class ChatRoutes
 */
class ChatRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    /**
     * Inicializa todas las rutas del chatbot.
     * @private
     */
    initializeRoutes() {
        // Ruta para enviar un mensaje al chatbot
        this.router.post('/chat', (req, res) => chatController.sendMessage(req, res));

        // Ruta para enviar una conversación completa
        this.router.post('/conversation', (req, res) => chatController.sendConversation(req, res));
    }

    /**
     * Obtiene el router de Express configurado.
     * @returns {Router} Router de Express
     */
    getRouter() {
        return this.router;
    }
}

export default new ChatRoutes();
