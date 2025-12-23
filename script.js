document.addEventListener('DOMContentLoaded', function() {
    
    // 1. VALIDACIÓN DEL FORMULARIO DE CONTACTO

    const formulario = document.querySelector('form[action="procesar_formulario"]');
    
    if (formulario) {
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            let esValido = true;
            
            // Limpiar errores previos
            limpiarErrores();
            
            // Validar campos
            if (nombre === '') {
                mostrarError('nombre', 'Por favor ingresa tu nombre');
                esValido = false;
            }
            
            if (email === '') {
                mostrarError('email', 'Por favor ingresa tu email');
                esValido = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                mostrarError('email', 'Ingresa un email válido');
                esValido = false;
            }
            
            if (mensaje === '') {
                mostrarError('mensaje', 'Por favor escribe tu mensaje');
                esValido = false;
            } else if (mensaje.length < 10) {
                mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
                esValido = false;
            }
            
            // Si es válido, mostrar éxito
            if (esValido) {
                mostrarExito();
                setTimeout(() => {
                    formulario.reset();
                }, 2000);
            }
        });
        
        function mostrarError(campoId, mensaje) {
            const campo = document.getElementById(campoId);
            const errorDiv = document.createElement('div');
            
            errorDiv.className = 'error-validacion';
            errorDiv.textContent = mensaje;
            campo.parentNode.appendChild(errorDiv);
            campo.style.borderColor = '#e74c3c';
        }
        
        function limpiarErrores() {
            document.querySelectorAll('.error-validacion').forEach(error => {
                error.remove();
            });
            
            ['nombre', 'email', 'mensaje'].forEach(id => {
                const campo = document.getElementById(id);
                if (campo) campo.style.borderColor = '';
            });
        }
        
        function mostrarExito() {
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = 'exito-validacion';
            mensajeDiv.innerHTML = `
                <div style="
                    background: #2ecc71;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                    text-align: center;
                ">
                    <strong>✓ Mensaje enviado correctamente</strong>
                    <p style="margin: 5px 0 0 0;">Gracias por contactarnos.</p>
                </div>
            `;
            
            formulario.parentNode.insertBefore(mensajeDiv, formulario.nextSibling);
            
            setTimeout(() => {
                mensajeDiv.remove();
            }, 5000);
        }
    }
    

    // 2. SCROLL SUAVE PARA DESTINOS
    const enlacesDestinos = document.querySelectorAll('a.card[href^="#"]');
    
    if (enlacesDestinos.length > 0) {
        enlacesDestinos.forEach(enlace => {
            enlace.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href !== '#') {
                    const destinoId = href.substring(1);
                    const destinoElemento = document.getElementById(destinoId);
                    
                    if (destinoElemento) {
                        destinoElemento.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Botón "Volver" con scroll suave
        const botonesVolver = document.querySelectorAll('a.volver');
        botonesVolver.forEach(boton => {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    
    // 3. EFECTOS HOVER BÁSICOS
    const tarjetas = document.querySelectorAll('.card, .info-card');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        });
        
        tarjeta.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // 4. EFECTO EN BOTONES
    const botones = document.querySelectorAll('button, .btn');
    botones.forEach(boton => {
        boton.addEventListener('mouseenter', function() {
            this.style.opacity = '0.9';
            this.style.transform = 'translateY(-2px)';
        });
        
        boton.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            this.style.transform = 'translateY(0)';
        });
    });
});