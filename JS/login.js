document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    if (!form) return; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;

        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            const apiUrl = 'http://localhost:3000/api/login'; 
            
            console.log('Intentando conectar con:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (response.ok) {
                const user = result.user; 
                
                //DETECCIÓN CORRECTA DEL ROL
                let role = 'cliente'; // Por defecto
                
                if (user.es_arquitecto !== undefined) {
                    // Del servidor - convertir a booleano seguro
                    const isArchitect = Boolean(user.es_arquitecto);
                    role = isArchitect ? 'arquitecto' : 'cliente';
                }
                
                // Guardar datos
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', user.nombre); 
                localStorage.setItem('userId', user.id);
                localStorage.setItem('userData', JSON.stringify(user));
                
                let destinationUrl = '../INDEX.html';
                if (role === 'arquitecto') {
                    destinationUrl = 'MisProyectos.html'; 
                }
                
                alert(`¡Inicio de sesión exitoso! Bienvenido, ${user.nombre}. Rol: ${role}.`);
                window.location.href = destinationUrl; 
            }

        } catch (error) {
            console.error('Error en login:', error);
            
            if (error.message.includes('Failed to fetch') || error.message.includes('HTTP')) {
                console.log('Backend no disponible, usando datos de prueba...');
                
                // MODO PRUEBA
                let role = 'cliente';
                let userNombre = email.split('@')[0] || 'Usuario';
                
                // SOLO es arquitecto si el email contiene EXACTAMENTE "arquitecto"
                if (email.toLowerCase().includes('arquitecto')) {
                    role = 'arquitecto';
                }
                
                const user = {
                    id: Math.floor(Math.random() * 1000),
                    nombre: userNombre,
                    es_arquitecto: role === 'arquitecto'
                };
                
                // Guardar datos
                localStorage.setItem('authToken', 'token-simulado-' + Date.now());
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', user.nombre);
                localStorage.setItem('userId', user.id);
                localStorage.setItem('userData', JSON.stringify(user));

                alert(`¡Login exitoso! (Modo prueba)\nBienvenido ${user.nombre}\nRol: ${role}`);
                
                let destinationUrl = '../INDEX.html';
                if (role === 'arquitecto') {
                    destinationUrl = 'MisProyectos.html';
                }
                
                setTimeout(() => {
                    window.location.href = destinationUrl;
                }, 100);
                
            } else {
                alert('Error de conexión con el servidor. Intenta más tarde.');
            }
        }
    });
});