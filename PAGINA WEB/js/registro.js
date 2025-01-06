import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ridmnzwzsiohoxpihttg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZG1uend6c2lvaG94cGlodHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMTE3MjEsImV4cCI6MjA1MTY4NzcyMX0.yqeSX9cALIu-N29jekTnjdwselZyp4tqiZw7tXldPEI';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {
  const registrationForm = document.getElementById('registrationForm');

  if (registrationForm) {
    registrationForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

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

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      // Registrar al usuario con Supabase
      const { user, error } = await supabase.auth.signUpWithEmailAndPassword({
        email: email,
        password: password,
      });

      if (error) {
        // Registro fallido
        alert(error.message);
      } else {
        // Registro exitoso
        alert('Registro exitoso. Redirigiendo a la página de autenticación...');
        // Redirigir a la página de autenticación
        window.location.href = 'autenticacion.html'; 
      }
    });
  }

  // Mostrar/ocultar contraseña
  const showPasswordButton = document.getElementById('showPassword');
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

  // Mostrar/ocultar contraseña de confirmación
  const showConfirmPasswordButton = document.getElementById('showConfirmPassword');
  if (showConfirmPasswordButton) {
    showConfirmPasswordButton.addEventListener('click', function() {
      const confirmPasswordField = document.getElementById('confirmPassword');
      if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        showConfirmPasswordButton.textContent = "Ocultar";
      } else {
        confirmPasswordField.type = "password";
        showConfirmPasswordButton.textContent = "Mostrar";
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});