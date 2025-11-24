export class Chatbot {
    #apiEndpoint;
    #isOpen;
    #messageHistory;
    #isProcessing;

    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.#apiEndpoint = options.apiEndpoint || 'http://localhost:3000/api/chat';
        this.#isOpen = false;
        this.#messageHistory = [];
        this.#isProcessing = false;
        
        // Configuración que se adapta a tu CSS
        this.config = {
            welcomeMessage: options.welcomeMessage || 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte con tus proyectos arquitectónicos hoy?',
            ...options
        };

        this.#init();
    }

    #init() {
        // Verificar si ya existe el chatbot para no duplicar
        if (!document.getElementById('chatbot-container')) {
            this.#render();
        }
        
        this.#cacheDOM();
        this.#attachEvents();
    }

    #cacheDOM() {
        this.chatContainer = document.getElementById('chatbot-container');
        this.toggleBtn = document.getElementById('chatbot-toggle-btn');
        this.closeBtn = document.getElementById('chatbot-close-btn');
        this.messagesArea = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send-btn');
    }

    #render() {
        const html = `
            <div id="chatbot-container" class="chatbot-container">
                <div class="chatbot-header">
                    <h3>Asistente PortArq</h3>
                    <button id="chatbot-close-btn" class="close-chat">✖</button>
                </div>
                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="message bot-message">
                        ${this.config.welcomeMessage}
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-input" class="message-input" placeholder="Escribe tu consulta..." />
                    <button id="chatbot-send-btn" class="send-btn">➤</button>
                </div>
            </div>
            <button id="chatbot-toggle-btn" class="burbuja-flotante">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
            </button>
        `;

        const wrapper = document.getElementById(this.containerId) || document.body;
        wrapper.insertAdjacentHTML('beforeend', html);
    }

    #attachEvents() {
        // Abrir/Cerrar chatbot
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.toggle());

        // Enviar mensajes
        this.sendBtn.addEventListener('click', () => this.#handleUserMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.#isProcessing) {
                this.#handleUserMessage();
            }
        });

        // Validar input en tiempo real
        this.inputField.addEventListener('input', () => this.#validateInput());
    }

    #validateInput() {
        const hasText = this.inputField.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.#isProcessing;
        
        // Cambiar estilo visual del botón
        if (this.sendBtn.disabled) {
            this.sendBtn.style.background = '#666';
            this.sendBtn.style.cursor = 'not-allowed';
        } else {
            this.sendBtn.style.background = '#000';
            this.sendBtn.style.cursor = 'pointer';
        }
    }

    async #handleUserMessage() {
        const text = this.inputField.value.trim();
        if (!text || this.#isProcessing) return;

        this.#isProcessing = true;
        this.#validateInput();

        // Guardar en historial
        this.#messageHistory.push({ 
            role: 'user', 
            content: text, 
            timestamp: new Date() 
        });
        
        // Mostrar mensaje del usuario
        this.addMessage(text, 'user');
        this.inputField.value = '';
        this.#validateInput();

        // Mostrar indicador de escritura
        this.#showTypingIndicator();

        try {
            const response = await this.#fetchBotResponse(text);
            this.#messageHistory.push({ 
                role: 'bot', 
                content: response, 
                timestamp: new Date() 
            });
            
            this.#removeTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error chatbot:', error);
            this.#removeTypingIndicator();
            this.addMessage("Lo siento, tuve un problema de conexión. Intenta más tarde.", 'bot');
        } finally {
            this.#isProcessing = false;
            this.#validateInput();
        }
    }

    async #fetchBotResponse(message) {
        // Simulación de respuesta (reemplaza con tu API real)
        return new Promise(resolve => {
            setTimeout(() => {
                const responses = [
                    `He recibido tu consulta sobre: "${message}". Como asistente arquitectónico, puedo ayudarte con diseño, planos, materiales de construcción y más.`,
                    `Entiendo tu interés en "${message}". ¿Te gustaría que profundice en algún aspecto específico del proyecto?`,
                    `Consulta sobre "${message}" registrada. Puedo asistirte con conceptos de diseño, cálculos estructurales o referencias de proyectos similares.`
                ];
                resolve(responses[Math.floor(Math.random() * responses.length)]);
            }, 1500);
        });

        /* 
        // Código para API real:
        try {
            const response = await fetch(this.#apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message,
                    history: this.#messageHistory.slice(-6)
                })
            });
            
            if (!response.ok) throw new Error('Error en API');
            const data = await response.json();
            return data.reply;
        } catch (error) {
            return "Lo siento, el servicio no está disponible en este momento.";
        }
        */
    }

    // Métodos públicos
    toggle() {
        this.#isOpen = !this.#isOpen;
        
        if (this.#isOpen) {
            this.chatContainer.classList.add('active');
            this.toggleBtn.style.display = 'none';
            this.inputField.focus();
        } else {
            this.chatContainer.classList.remove('active');
            this.toggleBtn.style.display = 'block';
        }
    }

    addMessage(text, sender = 'bot') {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', `${sender}-message`);
        msgDiv.textContent = text;
        
        this.messagesArea.appendChild(msgDiv);
        this.#scrollToBottom();
    }

    clearChat() {
        this.messagesArea.innerHTML = `
            <div class="message bot-message">
                ${this.config.welcomeMessage}
            </div>
        `;
        this.#messageHistory = [];
    }

    // Método para obtener estadísticas del chat
    getChatStats() {
        return {
            totalMessages: this.#messageHistory.length,
            userMessages: this.#messageHistory.filter(m => m.role === 'user').length,
            botMessages: this.#messageHistory.filter(m => m.role === 'bot').length
        };
    }

    #showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'chat-typing';
        typingDiv.classList.add('message', 'bot-message', 'typing');
        typingDiv.textContent = 'Escribiendo...';
        this.messagesArea.appendChild(typingDiv);
        this.#scrollToBottom();
    }

    #removeTypingIndicator() {
        const typing = document.getElementById('chat-typing');
        if (typing) typing.remove();
    }

    #scrollToBottom() {
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }

    // Método para destruir el chatbot y limpiar
    destroy() {
        if (this.chatContainer) {
            this.chatContainer.remove();
        }
        if (this.toggleBtn) {
            this.toggleBtn.remove();
        }
    }
}