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