// Importar las funciones del carrito desde carrito.js
import { addToCart, updateCart, updateCartSummary, removeFromCart, procesarPago } from './carrito.js';

// Polyfill para forEach en navegadores antiguos (IE11)
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// Lista de productos (con la propiedad 'categoria')
var productos = [
  {
    nombre: 'Laptop Gamer ASUS ROG',
    imagen: 'img/producto1.jpg',
    descripcion: 'Procesador Intel Core i7, 16GB RAM, 1TB SSD, NVIDIA GeForce RTX 3060.',
    precio: 4000000,
    categoria: 'Computadoras',
    oldPrice: 4500000
  },
  {
    nombre: 'Smartphone Samsung Galaxy S23',
    imagen: 'img/producto2.jpg',
    descripcion: 'Pantalla AMOLED de 6.8 pulgadas, cámara de 108MP, batería de 5000 mAh.',
    precio: 3800000,
    categoria: 'Celulares'
  },
  {
    nombre: 'Tablet Apple iPad Air',
    imagen: 'img/producto3.jpg',
    descripcion: 'Pantalla Liquid Retina de 10.9 pulgadas, chip M1, 64GB de almacenamiento.',
    precio: 2500000,
    categoria: 'Tablets'
  },
  {
    nombre: 'Audífonos Sony WH-1000XM5',
    imagen: 'img/producto4.jpg',
    descripcion: 'Cancelación de ruido activa, sonido de alta fidelidad, autonomía de 30 horas.',
    precio: 1600000,
    categoria: 'Audio'
  },
  {
    nombre: 'Smartwatch Apple Watch Series 8',
    imagen: 'img/producto5.jpg',
    descripcion: 'Sensor de temperatura, ECG, detección de caídas, resistencia al agua.',
    precio: 1800000,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Monitor LG UltraWide 34WP65C',
    imagen: 'img/producto6.jpg',
    descripcion: 'Pantalla IPS de 34 pulgadas, resolución 2560x1080, HDR10, FreeSync.',
    precio: 1400000,
    categoria: 'Monitores'
  },
  {
    nombre: 'Teclado mecánico Razer Huntsman',
    imagen: 'img/producto7.jpg',
    descripcion: 'Switches ópticos, iluminación RGB, teclas programables, diseño ergonómico.',
    precio: 500000,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Mouse Logitech G502 HERO',
    imagen: 'img/producto8.jpg',
    descripcion: 'Sensor HERO 25K, 11 botones programables, peso ajustable, iluminación RGB.',
    precio: 300000,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Impresora HP LaserJet Pro MFP M148dw',
    imagen: 'img/producto9.jpg',
    descripcion: 'Impresión láser monocromática, escáner, copiadora, conexión inalámbrica.',
    precio: 700000,
    categoria: 'Impresoras'
  },
  {
    nombre: 'Disco duro externo WD My Passport 4TB',
    imagen: 'img/producto10.jpg',
    descripcion: '4TB de capacidad, USB 3.2 Gen 1, diseño compacto y portátil.',
    precio: 450000,
    categoria: 'Almacenamiento'
  }
];

// Función para mostrar los productos en la grid (en productos.html)
function mostrarProductos(productosAMostrar) {
  if (window.location.pathname !== '/productos.html') {
    return;
  }
  var productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = '';
  productosAMostrar.forEach(function(producto) {
    var priceHtml = "<p class='price'>";
    if (producto.oldPrice) {
      priceHtml += "<span class='old-price'>$" + producto.oldPrice.toLocaleString('es-CO') + "</span> ";
    }
    priceHtml += "$" + producto.precio.toLocaleString('es-CO') + "</p>";
    var productElement = "<div class='product'>" +
      "<div class='product-card'>" +
      "<div class='product-card-front'>" +
      "<img src='" + producto.imagen + "' alt='" + producto.nombre + "'>" +
      "<h3>" + producto.nombre + "</h3>" +
      "</div>" +
      "<div class='product-card-back'>" +
      "<p>" + producto.descripcion + "</p>" +
      priceHtml +
      "<a href='#' class='btn add-to-cart' data-nombre='" + producto.nombre + "'>Añadir al carrito</a>" +
      "</div>" +
      "</div>" +
      "</div>";
    productGrid.innerHTML += productElement;
  });
  var loading = document.querySelector('.loading');
  if (loading) {
    loading.style.display = 'none';
  }
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
  var productosFiltrados = productos.filter(function(producto) {
    if (categoria === "Todas") {
      return true;
    } else {
      return producto.categoria === categoria;
    }
  });
  mostrarProductos(productosFiltrados);
}

// Función para filtrar productos por precio
function filtrarPorPrecio(precioMaximo) {
  var productosFiltrados = productos.filter(function(producto) {
    return producto.precio <= precioMaximo;
  });
  mostrarProductos(productosFiltrados);
}

// Función para simular la paginación (debes implementarla)
function mostrarPagina(pagina) {
  console.log("Mostrar página:", pagina);
  // Implementa la lógica para mostrar la página correspondiente
}

// Eventos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Mostrar productos al cargar la página
  mostrarProductos(productos);

  // Delegación de eventos para agregar al carrito
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
      event.preventDefault();
      var productName = event.target.dataset.nombre;
      addToCart(productName, productos); // Pasar el array 'productos' como argumento
      console.log("Evento click en botón 'Añadir al carrito' ejecutado");
    }
  });

  // Delegación de eventos para eliminar del carrito
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-from-cart')) {
      // Obtener el índice del producto a eliminar (usando dataset.index)
      var productIndex = event.target.dataset.index; 
      removeFromCart(productIndex);
      console.log("Eliminando producto del carrito con índice:", productIndex);
    }
  });

  // Filtros (en productos.html)
  var filterCategory = document.querySelector('.filter-category ul');
  if (filterCategory) {
    filterCategory.addEventListener('click', function(event) {
      event.preventDefault();
      if (event.target.tagName === 'A') {
        var category = event.target.textContent.trim();
        filtrarPorCategoria(category);
      }
    });
  }
  var priceRange = document.querySelector('.price-range');
  var maxPrice = document.querySelector('.max-price');
  if (priceRange) {
    priceRange.addEventListener('input', function() {
      maxPrice.textContent = this.value;
      filtrarPorPrecio(this.value);
    });
  }

  // Paginación (en productos.html)
  var pagination = document.querySelector('.pagination');
  if (pagination) {
    pagination.addEventListener('click', function(event) {
      event.preventDefault();
      if (event.target.tagName === 'A') {
        var page = event.target.textContent;
        mostrarPagina(page);
      }
    });
  }

  // Actualizar el carrito en la página del carrito
  if (window.location.pathname === '/carrito.html') { 
    updateCart(); 
  }
});