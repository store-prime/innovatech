document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
  
    if (contactForm) {
      // Cambiar el tipo de botón a "button" para evitar el envío del formulario
      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.type = 'button';
      }
    }
  
    // Obtener el botón y añadir el evento onclick
    const whatsappButton = document.getElementById('whatsappButton');
    if (whatsappButton) {
      whatsappButton.addEventListener('click', enviarMensajeWhatsapp);
    }
  
    function enviarMensajeWhatsapp() {
      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const mensaje = document.getElementById('mensaje').value;
  
      // Validar los datos (opcional)
      if (nombre.trim() === '') {
        alert('Por favor, introduce tu nombre.');
        return;
      }
      if (!validateEmail(email)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
      }
      if (mensaje.trim() === '') {
        alert('Por favor, introduce un mensaje.');
        return;
      }
  
      // Construir la URL de wa.me
      const numeroWhatsapp = '+573503388373'; // Reemplaza con tu número de WhatsApp
      const url = `https://wa.me/${numeroWhatsapp}?text=Hola,%20mi%20nombre%20es%20${nombre}.%20Mi%20correo%20es%20${email}.%20${mensaje}`;
  
      // Redirigir al usuario a la URL de WhatsApp
      window.open(url, '_blank');
    }
  
    // Función para validar el formato del correo electrónico
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  });