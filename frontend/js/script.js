document.addEventListener('DOMContentLoaded', function() {
    
    // 1. VALIDACIÓN DEL FORMULARIO DE CONTACTO - DESHABILITADA
    // (Ahora se maneja en contacto.html con fetch)
    
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