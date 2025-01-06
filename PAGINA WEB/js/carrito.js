// carrito.js

// Almacenamiento del carrito en localStorage
var cart = [];

// Intenta obtener el carrito de localStorage
try {
  var cartStorage = localStorage.getItem('cart');
  if (cartStorage) {
    cart = JSON.parse(cartStorage);
  }
} catch (error) {
  console.error("Error al obtener el carrito de localStorage:", error);
}

// Función para agregar producto al carrito (modificada)
function addToCart(productName, productos) {
  var product = productos.find(function(p) {
    return p.nombre === productName;
  });
  if (product) {
    // Buscamos si el producto ya está en el carrito
    var existingProductIndex = cart.findIndex(function(item) {
      return item.product && item.product.nombre === productName;
    });
    if (existingProductIndex !== -1) {
      // Si el producto ya existe, aumentamos la cantidad
      cart[existingProductIndex].quantity++;
    } else {
      // Si el producto no existe, lo añadimos con cantidad 1
      cart.push({
        product: product,
        quantity: 1
      });
    }
    // Guardar el carrito en localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }

    // Llamar a updateCart solo si estamos en la página carrito.html
    if (window.location.pathname.endsWith('carrito.html')) { 
      updateCart(); 
    }
  } else {
    console.error("Producto no encontrado:", productName);
  }
}

// Función para actualizar el carrito
function updateCart() {
  // Verificar si la página actual es carrito.html
  if (!window.location.pathname.endsWith('carrito.html')) {
    return; // Si no es carrito.html, no hacer nada
  }

  console.log("Actualizando carrito...");

  var cartItems = document.querySelector('.cart-items');

  if (!cartItems) {
    console.error("Elemento .cart-items no encontrado");
    return;
  }

  cartItems.innerHTML = ''; // Limpiar el carrito antes de actualizarlo

  if (cart.length === 0) {
    var emptyMessage = "<p>Tu carrito está vacío.</p>";
    cartItems.innerHTML = emptyMessage;
    return;
  }
  cart.forEach(function(item, index) {
    var product = item.product;
    // Verificar si product y product.oldPrice están definidos
    var priceHtml = "<p class='price'>";
    if (product && product.oldPrice) {
      priceHtml += "<span class='old-price'>$" + product.oldPrice.toLocaleString('es-CO') + "</span> ";
    }
    priceHtml += "$" + product.precio.toLocaleString('es-CO') + "</p>";

    // Asegúrate de que el botón "Eliminar" tenga el atributo data-index correcto:
    var cartItem = `
      <div class='cart-item'>
        <img src='${item.product.imagen}' alt='${item.product.nombre}'>
        <div class='cart-item-details'>
          <h3>${item.product.nombre}</h3>
          <p>${item.product.descripcion}</p>
          ${priceHtml}
          <p>Cantidad: ${item.quantity}</p>
          <button class='btn remove-from-cart' data-index='${index}'>Eliminar</button> 
        </div>
      </div>`;
    cartItems.innerHTML += cartItem;
  });

  updateCartSummary();
}

// Función para mostrar los métodos de pago
function mostrarMetodosDePago() {
  // Mostrar la sección de métodos de pago
  document.getElementById('metodosDePago').style.display = 'block';
}

// Función para actualizar el resumen del carrito
function updateCartSummary() {
  var subtotal = cart.reduce(function(acc, item) {
    return acc + (item.product.precio * item.quantity);
  }, 0);
  var iva = subtotal * 0.19;
  var total = subtotal + iva;
  document.getElementById('cart-subtotal').textContent = "$" + subtotal.toLocaleString('es-CO');
  document.getElementById('cart-iva').textContent = "$" + iva.toLocaleString('es-CO');
  document.getElementById('cart-total').textContent = "$" + total.toLocaleString('es-CO');

  // Renderizar el botón de PayPal
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: (total / 4800).toFixed(2) 
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Pago exitoso con PayPal. ID de transacción: ' + details.id);
        // Limpiar el carrito y actualizar la vista
        cart = [];
        localStorage.removeItem('cart');
        updateCart();
      });
    }
  }).render('#paypal-button-container');
}

// Eliminar producto del carrito
function removeFromCart(index) {
  console.log("removeFromCart llamado con índice:", index); 
  console.log("Carrito antes de eliminar:", cart); 

  if (index >= 0 && index < cart.length) { // Verificar que el índice sea válido
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    // Guardar el carrito en localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
    updateCart();

    console.log("Carrito después de eliminar:", cart); 
  } else {
    console.error("Índice de producto inválido:", index);
  }
}

// Función para simular el proceso de pago
function procesarPago(metodoPago) {
  if (metodoPago === 'contraentrega') {
    // Pago contra entrega
    alert('Has seleccionado pago contra entrega. Tu pedido será procesado.');
    // Limpiar el carrito y actualizar la vista
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
  } else if (metodoPago === 'transferencia') {
    // Transferencia bancaria
    document.getElementById('datosBancarios').style.display = 'block';
    alert('Has seleccionado transferencia bancaria. Por favor, realiza la transferencia a la cuenta indicada.');
    // ... (código para limpiar el carrito y actualizar la vista - opcional) ...
  } else if (metodoPago === 'pagar') {
    alert('Proceder con el pago');
  } else {
    // ... (código para otros métodos de pago) ...
  }
}

export { addToCart, updateCart, updateCartSummary, removeFromCart, procesarPago, mostrarMetodosDePago };
