// JS/components/Chatbot.js


export class Chatbot {
    constructor() {
        this.chatContainer = null;
        this.messagesContainer = null;
        this.inputElement = null;
        this.sendButton = null;

        document.addEventListener('DOMContentLoaded', this.init.bind(this));
    }


    init() {
        const bubble = document.querySelector('.burbuja-flotante');
        if (!bubble) {
            console.error('❌ Chatbot: No se encontró la burbuja flotante. Saltando inicialización.');
            return;
        }

        this.renderChatStructure();
        this.setupDOMReferences();
        this.setupEventListeners(bubble);

        this.addMessage('¡Hola! Soy PortArq Assistant. ¿En qué puedo ayudarte con tu proyecto o cuenta?', 'bot');
        console.log('✅ Chatbot inicializado.');
    }


    renderChatStructure() {
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
    }


    setupDOMReferences() {
        this.chatContainer = document.querySelector('.chatbot-container');
        this.messagesContainer = this.chatContainer.querySelector('.chatbot-messages');
        this.inputElement = this.chatContainer.querySelector('.message-input');
        this.sendButton = this.chatContainer.querySelector('.send-btn');
    }

    /**
     * Configura los manejadores de eventos para la burbuja, el cierre y el envío de mensajes.
     * @param {HTMLElement} bubble - La burbuja flotante.
     */
    setupEventListeners(bubble) {

        bubble.addEventListener('click', () => this.toggleChat());

        this.chatContainer.querySelector('.close-chat').addEventListener('click', () => this.toggleChat(false));

        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    /**
     * Muestra u oculta el contenedor del chat.
     * @param {boolean} [forceState] - Si se proporciona, fuerza a abrir (true) o cerrar (false).
     */
    toggleChat(forceState) {
        const isOpen = this.chatContainer.classList.contains('active');
        const newState = forceState !== undefined ? forceState : !isOpen;

        this.chatContainer.classList.toggle('active', newState);

        if (newState) {
            this.inputElement.focus();
            this.scrollToBottom();
        }
    }


    async sendMessage() {
        const message = this.inputElement.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.inputElement.value = '';
        this.sendButton.disabled = true;
        this.inputElement.disabled = true;

        this.addTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            this.removeTypingIndicator();
            this.addMessage(data.response, 'bot');

        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Error al conectar con el asistente. Intenta más tarde.', 'bot');
            console.error('❌ Error en el chat:', error);
        } finally {
            this.sendButton.disabled = false;
            this.inputElement.disabled = false;
            this.inputElement.focus();
        }
    }

    /**
     * Añade una burbuja de mensaje al contenedor.
     * @param {string} text 
     * @param {'user' | 'bot'} sender 
     */
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }


    addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.textContent = 'Escribiendo...';
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }


    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            this.messagesContainer.removeChild(indicator);
        }
    }

    /**
     * Desplaza el contenedor de mensajes hacia abajo.
     */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}