import express from 'express';
import chatController from '../controllers/ChatController.js';

class ChatRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/chat', (req, res) => chatController.sendMessage(req, res));

        this.router.post('/conversation', (req, res) => chatController.sendConversation(req, res));
    }

    getRouter() {
        return this.router;
    }
}

export default new ChatRoutes();