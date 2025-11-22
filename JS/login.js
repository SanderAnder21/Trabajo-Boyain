// JS/login.js - CÓDIGO CORREGIDO PARA INICIO DE SESIÓN DUAL

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
                // ⭐ INICIO DE LA LÓGICA DUAL ⭐
                const user = result.user; // Asumimos que el backend devuelve { message: ..., user: {...} }
                
                // Determinar el rol: El valor es 1 (true) o 0 (false) de la BD
                const isArchitect = user.es_arquitecto === 1 || user.es_arquitecto === true;
                const role = isArchitect ? 'arquitecto' : 'cliente';
                
                // Guardar datos cruciales en localStorage para persistencia
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', user.nombre); 
                localStorage.setItem('userId', user.id); 

                alert(`¡Inicio de sesión exitoso! Bienvenido, ${user.nombre}. Rol: ${role}.`);
                // ⭐ FIN DE LA LÓGICA DUAL ⭐
                
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