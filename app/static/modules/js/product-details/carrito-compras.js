// Selectores
const cantidadProductos = document.querySelector('#cantidad-input');
const btnAgregarAlCarrito = document.querySelector('.btn-agregar-al-carrito');

// Variables
let cantidad = parseInt(cantidadProductos.value);

// Listeners
cantidadProductos.addEventListener('input', e => { cantidad = parseInt(e.target.value) })
btnAgregarAlCarrito.addEventListener('click', agregarAlCarrito);

// Funciones
function agregarAlCarrito(e) {
    e.preventDefault();
    // Obtener el id del producto
    const productoId = parseInt(this.getAttribute('data-id'));

    // Intentar leer el carrito actual desde el localStorage
    let carrito = localStorage.getItem('carrito');

    // Verificar si el carrito existe, si no, inicializarlo como un arreglo vacío
    if (carrito) {
        carrito = JSON.parse(carrito);
    } else {
        carrito = [];
    }

    // Valida si el objeto ya esta en el carrito, si es asi suma las cantidades, de lo contrario agrega el nuevo item
    let productoExistente = false;
    carrito.forEach(item => {
        if (item.id === productoId) {
            productoExistente = true;
            item.cantidad += cantidad;
        }
    })
    if (!productoExistente) {
        carrito.push({ id: productoId, cantidad: cantidad });

        // Actualizar el valor del header
        const headerCartItemsCount = document.querySelector('#cart-header-count');
        if (headerCartItemsCount) {
            headerCartItemsCount.textContent = carrito.length;
        } else {
            const cartItems = document.createElement('span');
            cartItems.id = 'cart-header-count';
            cartItems.textContent = carrito.length === 0 ? '' : carrito.length;
            document.body.addEventListener('DOMContentLoaded', document.querySelector('#cart-header').appendChild(cartItems))
        }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
}