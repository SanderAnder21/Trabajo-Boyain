document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    if (!form) return; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;

        try {
            const apiUrl = 'http://localhost:3000/api/login'; 
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                const user = result; 
                                     
                const isArchitect = user.es_arquitecto === 1 || user.es_arquitecto === true;
                const role = isArchitect ? 'arquitecto' : 'cliente';
                
                // Guardar información del usuario (INCLUYENDO el rol clave)
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
                
            } else {
                alert(`Error al iniciar sesión: ${result.error || 'Credenciales incorrectas.'}`);
                console.error('Error de login:', result.details || result.error);
            }

        } catch (error) {
            alert('Error de conexión con el servidor.'); 
            console.error('Error de red:', error);
        }
    });
});