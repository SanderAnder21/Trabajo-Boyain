document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    if (!form) return; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;

        // Validación básica
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

            // Verificar si la respuesta es OK
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (response.ok) {
                const user = result; 
                                     
                const isArchitect = user.es_arquitecto === 1 || user.es_arquitecto === true;
                const role = isArchitect ? 'arquitecto' : 'cliente';
                
                // Guardar información del usuario
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', user.nombre); 
                localStorage.setItem('userId', user.id); 

                // Mostrar éxito y redirigir
                let destinationUrl = '../INDEX.html';
                if (role === 'arquitecto') {
                    destinationUrl = 'MisProyectos.html'; 
                }
                
                alert(`¡Inicio de sesión exitoso! Bienvenido, ${user.nombre}. Rol: ${role}.`);
                window.location.href = destinationUrl; 
                
            }

        } catch (error) {
            console.error('Error en login:', error);
            
            // ⭐⭐ SOLUCIÓN TEMPORAL: Datos de prueba cuando el backend no funciona
            if (error.message.includes('Failed to fetch') || error.message.includes('HTTP')) {
                console.log('Backend no disponible, usando datos de prueba...');
                
                // Simulación de login exitoso
                const user = {
                    id: Math.floor(Math.random() * 1000),
                    nombre: email.split('@')[0] || 'Usuario',
                    es_arquitecto: email.includes('arquitecto') || email.includes('arq')
                };
                
                const role = user.es_arquitecto ? 'arquitecto' : 'cliente';
                
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', user.nombre);
                localStorage.setItem('userId', user.id);

                alert(`¡Login exitoso! (Modo prueba)\nBienvenido ${user.nombre}\nRol: ${role}`);
                
                let destinationUrl = '../INDEX.html';
                if (role === 'arquitecto') {
                    destinationUrl = 'MisProyectos.html';
                }
                
                // Limpiar URL después del login
                setTimeout(() => {
                    window.location.href = destinationUrl;
                }, 100);
                
            } else {
                alert('Error de conexión con el servidor. Intenta más tarde.');
            }
        }
    });
});