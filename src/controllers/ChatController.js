import openAIService from '../services/OpenAIService.js';

class ChatController {
    async sendMessage(req, res) {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'El mensaje es requerido' });
            }

            console.log('📨 Mensaje recibido:', message);

            const botResponse = await openAIService.sendMessage(message);

            console.log('🤖 Respuesta del bot enviada');

            res.json({ response: botResponse });

        } catch (error) {
            console.error("❌ Error en el chat:", error.message);
            res.status(500).json({
                error: "Error en el servidor",
                details: error.message
            });
        }
    }

    async sendConversation(req, res) {
        try {
            const { messages } = req.body;

            if (!messages || !Array.isArray(messages)) {
                return res.status(400).json({ error: 'Se requiere un array de mensajes' });
            }

            console.log(`Conversación recibida con ${messages.length} mensajes`);

            const botResponse = await openAIService.sendConversation(messages);

            console.log('Respuesta de conversación enviada');

            res.json({ response: botResponse });

        } catch (error) {
            console.error(" Error en la conversación:", error.message);
            res.status(500).json({
                error: "Error en el servidor",
                details: error.message
            });
        }
    }
}

export default new ChatController();