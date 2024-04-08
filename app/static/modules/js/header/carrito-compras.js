const headerCartLi = document.querySelector('#cart-header');

let carrito = localStorage.getItem('carrito');

if (carrito) {
    carrito = JSON.parse(carrito);
} else {
    carrito = [];
}

const cartItems = document.createElement('span');
cartItems.id = 'cart-header-count';
cartItems.textContent = carrito.length === 0 ? '' : carrito.length;

document.body.addEventListener('DOMContentLoaded', headerCartLi.appendChild(cartItems))



document.getElementById('cart-header').addEventListener('click', function(e) {
    e.preventDefault();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Como 'carrito' es un arreglo de objetos y cada objeto tiene un ID de producto
    const ids = carrito.map(item => item.id).join(',');

    // Construir la URL con los IDs como parámetro
    const url = `${carrito_de_compras_url}?ids=${encodeURIComponent(ids)}`;

    // Navegar a la nueva URL
    window.location.href = url;
});
