// JS/login.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    if (!form) return; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert('¡Inicio de sesión exitoso! Bienvenido, ' + result.nombre + '.');
                window.location.href = '../INDEX.html'; 
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