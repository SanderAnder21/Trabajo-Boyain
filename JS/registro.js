// JS/registro.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    
    // Verificar si el formulario existe antes de añadir el listener
    if (!form) return; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Detiene el envío estándar del formulario
        
        // Obtener los valores de los campos
        const nombre = form.nombre.value;
        const email = form.email.value;
        const tipoCuenta = form.tipoCuenta.value;
        const password = form.password.value;
        const confirmPassword = form.confirm_password.value;

        // 1. Validación de contraseñas en el frontend
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden. Por favor, revísalas.');
            return;
        }

        // 2. Crear el objeto de datos a enviar
        const data = {
            nombre,
            email,
            password,
            tipoCuenta
        };

        try {
            // 3. Enviar la petición al backend
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // 4. Registro exitoso (código 201 Created)
                alert(result.message + ' Serás redirigido para iniciar sesión.');
                // Redirigir al usuario
                window.location.href = 'IniciarSesion.html'; 

            } else {
                // 5. Manejo de errores (ej. email duplicado - código 409, error del servidor - código 500)
                alert(`Error al crear la cuenta: ${result.error || 'Inténtalo de nuevo.'}`);
                console.error('Error del servidor:', result);
            }

        } catch (error) {
            // 6. Manejo de errores de red
            alert('Error de conexión con el servidor. Asegúrate de que Node.js esté ejecutándose.');
            console.error('Error de red:', error);
        }
    });
});