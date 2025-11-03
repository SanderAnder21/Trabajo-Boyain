document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 ChatBot: DOM cargado');
    
    // Verificar que la burbuja existe
    const bubble = document.querySelector('.burbuja-flotante');
    console.log('🔧 Burbuja encontrada:', bubble);
    
    if (!bubble) {
        console.error('❌ No se encontró la burbuja flotante');
        return;
    }

    // Crear el HTML del chatbot (sin estilos inline)
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
    
    // Agregar el chatbot al body
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    const chatContainer = document.querySelector('.chatbot-container');
    console.log('🔧 Chat container creado:', chatContainer);

    // Evento para la burbuja
    bubble.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🟡 Burbuja CLICKEADA - función ejecutada');
        
        const isOpen = chatContainer.classList.contains('active');
        console.log('🟡 Chat está abierto:', isOpen);
        
        if (isOpen) {
            chatContainer.classList.remove('active');
        } else {
            chatContainer.classList.add('active');
            chatContainer.querySelector('.message-input').focus();
        }
    });
    
    // Evento para cerrar
    chatContainer.querySelector('.close-chat').addEventListener('click', function(e) {
        e.stopPropagation();
        chatContainer.classList.remove('active');
    });
    
    // Evento para enviar mensaje
    chatContainer.querySelector('.send-btn').addEventListener('click', sendMessage);
    chatContainer.querySelector('.message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    async function sendMessage() {
        const input = chatContainer.querySelector('.message-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        console.log('📤 Enviando mensaje:', message);
        addMessage(message, 'user');
        input.value = '';
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            addMessage(data.response, 'bot');
            
        } catch (error) {
            addMessage('Error al conectar con el servidor', 'bot');
            console.error('❌ Error:', error);
        }
    }
    
    function addMessage(text, sender) {
        const messagesContainer = chatContainer.querySelector('.chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    console.log('✅ ChatBot inicializado correctamente');
});