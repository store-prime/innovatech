import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ridmnzwzsiohoxpihttg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZG1uend6c2lvaG94cGlodHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMTE3MjEsImV4cCI6MjA1MTY4NzcyMX0.yqeSX9cALIu-N29jekTnjdwselZyp4tqiZw7tXldPEI';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {
  const authForm = document.getElementById('authForm');

  if (authForm) {
    authForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Validación básica del correo electrónico
      if (!validateEmail(email)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
      }

      // Validación básica de la contraseña
      if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      // Autenticar al usuario con Supabase
      const { user, error } = await supabase.auth.signInWithEmailAndPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert(error.message);
      } else {
        alert('Autenticación exitosa. Redirigiendo a la página principal...');
        window.location.href = 'index.html'; 
      }
    });
  }

  // Manejar el enlace "Regístrate aquí"
  const signUpLink = document.getElementById('signUpLink');
  if (signUpLink) {
    signUpLink.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = 'registro.html'; 
    });
  }

  // Manejar el enlace "¿Olvidaste tu contraseña?"
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async function(event) {
      event.preventDefault();
      const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
      if (email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
          alert(error.message);
        } else {
          alert('Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.');
        }
      }
    });
  }

  // Mostrar/ocultar contraseña
  const showPasswordButton = document.getElementById('showPassword'); // Asegúrate de que el ID es correcto
  if (showPasswordButton) {
    showPasswordButton.addEventListener('click', function() {
      const passwordField = document.getElementById('password');
      if (passwordField.type === "password") {
        passwordField.type = "text";
        showPasswordButton.textContent = "Ocultar";
      } else {
        passwordField.type = "password";
        showPasswordButton.textContent = "Mostrar";
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});