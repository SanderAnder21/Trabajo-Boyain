// JS/login.js - CÓDIGO CORREGIDO Y FUNCIONAL
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    if (!form) return; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;

        try {
            // ⭐⭐⭐ CAMBIO CLAVE: USAR LA URL COMPLETA DEL BACKEND ⭐⭐⭐
            // Tu app.js corre en el puerto 3000
            const apiUrl = 'http://localhost:3000/api/login'; 
            
            const response = await fetch(apiUrl, { // Usar la URL completa aquí
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                // ... (Lógica de roles, guardar en localStorage) ...
                const user = result; // Aquí no es result.user, sino result completo.
                                     // Ver el punto 2 para corregir esto.
                
                const isArchitect = user.es_arquitecto === 1 || user.es_arquitecto === true;
                const role = isArchitect ? 'arquitecto' : 'cliente';
                
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