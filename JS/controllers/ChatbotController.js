
/**
 * Controlador para el chatbot flotante.
 * Maneja la interfaz del chat y la comunicación con el backend.
 * 
 * @class ChatbotController
 */
class ChatbotController {
    constructor() {
        this.chatContainer = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.bubble = null;
    }

    /**
     * Inicializa el controlador del chatbot.
     */
    init() {
        console.log('🔧 ChatBot: Inicializando controlador');

        this.bubble = document.querySelector('.burbuja-flotante');

        if (!this.bubble) {
            console.error('❌ No se encontró la burbuja flotante');
            return;
        }

        this.createChatInterface();
        this.setupEventListeners();

        console.log('✅ ChatBot inicializado correctamente');
    }

    /**
     * Crea la interfaz HTML del chatbot.
     * @private
     */
    createChatInterface() {
        const chatHTML = `
            <div class="chatbot-container">
                <div class="chatbot-header">
                    <h3>PortArq Assistant</h3>
                    <button class="close-chat">×</button>
                </div>
                <div class="chatbot-messages"></div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Escribe tu mensaje..." class="message-input">
                    <button class="send-btn">Enviar</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);

        this.chatContainer = document.querySelector('.chatbot-container');
        this.messagesContainer = document.querySelector('.chatbot-messages');
        this.inputField = document.querySelector('.message-input');
    }

    /**
     * Configura los event listeners del chatbot.
     * @private
     */
    setupEventListeners() {
        // Toggle del chat al hacer click en la burbuja
        this.bubble.addEventListener('click', (e) => this.toggleChat(e));

        // Cerrar el chat
        const closeBtn = this.chatContainer.querySelector('.close-chat');
        closeBtn.addEventListener('click', (e) => this.closeChat(e));

        // Enviar mensaje con botón
        const sendBtn = this.chatContainer.querySelector('.send-btn');
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Enviar mensaje con Enter
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    /**
     * Alterna la visibilidad del chat.
     * @param {Event} e - Evento de click
     * @private
     */
    toggleChat(e) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = this.chatContainer.classList.contains('active');

        if (isOpen) {
            this.chatContainer.classList.remove('active');
        } else {
            this.chatContainer.classList.add('active');
            this.inputField.focus();
        }
    }

    /**
     * Cierra el chat.
     * @param {Event} e - Evento de click
     * @private
     */
    closeChat(e) {
        e.stopPropagation();
        this.chatContainer.classList.remove('active');
    }

    /**
     * Envía un mensaje al chatbot.
     * @private
     */
    async sendMessage() {
        const message = this.inputField.value.trim();

        if (!message) return;

        console.log('📤 Enviando mensaje:', message);

        this.addMessage(message, 'user');
        this.inputField.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            this.addMessage(data.response, 'bot');

        } catch (error) {
            this.addMessage('Error al conectar con el servidor', 'bot');
            console.error('❌ Error:', error);
        }
    }

    /**
     * Agrega un mensaje al contenedor de mensajes.
     * @param {string} text - Texto del mensaje
     * @param {string} sender - 'user' o 'bot'
     * @private
     */
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new ChatbotController();
    chatbot.init();
});

export default ChatbotController;
