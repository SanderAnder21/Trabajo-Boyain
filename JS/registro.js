// ESTE CÓDIGO NUEVO va en registro.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    
    if (!form) {
        console.error('❌ No se encontró el formulario de registro');
        return;
    }

    console.log('✅ Formulario de registro encontrado');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const tipoCuenta = document.getElementById('tipoCuenta').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        console.log('📝 Datos del formulario:', { nombre, email, tipoCuenta });

        // Validaciones
        if (!nombre || !email || !password || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const apiUrl = 'http://localhost:3000/api/register';
            
            console.log('🚀 Enviando datos al servidor...');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    nombre, 
                    email, 
                    password, 
                    tipoCuenta 
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ Registro exitoso:', result);
                alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                window.location.href = 'IniciarSesion.html';
            } else {
                console.error('❌ Error del servidor:', result);
                throw new Error(result.error || 'Error en el registro');
            }

        } catch (error) {
            console.error('💥 Error en registro:', error);
            
            if (error.message.includes('email ya está registrado')) {
                alert('Este email ya está registrado. Por favor usa otro email.');
            } else if (error.message.includes('Failed to fetch')) {
                console.log('🌐 Backend no disponible, usando modo prueba...');
                
                // MODO PRUEBA (para desarrollo)
                const user = {
                    id: Math.floor(Math.random() * 1000),
                    nombre: nombre,
                    email: email,
                    es_arquitecto: tipoCuenta === 'arquitecto'
                };
                
                localStorage.setItem('userRole', tipoCuenta);
                localStorage.setItem('userName', user.nombre);
                localStorage.setItem('userId', user.id);
                localStorage.setItem('userData', JSON.stringify(user));

                alert(`¡Registro exitoso! (Modo prueba)\nBienvenido ${user.nombre}\nRol: ${tipoCuenta}`);
                
                window.location.href = 'IniciarSesion.html';
            } else {
                alert('Error al crear la cuenta: ' + error.message);
            }
        }
    });
});