document.addEventListener('DOMContentLoaded', function () {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Actualizar el precio total cuando se cambia la cantidad
    function updatePriceTotal() {
        document.querySelectorAll('.cart-item').forEach(function (item) {
            const quantityInput = item.querySelector('.quantity');
            const priceUnit = parseFloat(item.querySelector('.price-unit').textContent);
            const priceTotalElement = item.querySelector('.price-total');

            let quantity = parseInt(quantityInput.value);
            let priceTotal = quantity * priceUnit;

            // Actualizar el texto del precio total
            priceTotalElement.textContent = priceTotal.toFixed(2);
        });
    }

    // Función para actualizar la cantidad en el input y en localStorage
    function updateQuantity(productId, newQuantity) {
        const productInCart = carrito.find(p => p.id === productId);
        if (productInCart) {
            productInCart.cantidad = newQuantity;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            updatePriceTotal();
        }
    }

    // Configurar la cantidad inicial y los manejadores de eventos para cada item del carrito
    document.querySelectorAll('.cart-item').forEach(function (item) {
        const productId = parseInt(item.dataset.productoId);
        const quantityInput = item.querySelector('.quantity');
        const quantityUpButton = item.querySelector('.quantity-up');
        const quantityDownButton = item.querySelector('.quantity-down');

        // Buscar el producto en el arreglo del carrito por su id
        const productInCart = carrito.find(producto => producto.id === productId);

        // Si hay información del carrito en localStorage, usar esa cantidad
        if (productInCart) {
            quantityInput.value = productInCart.cantidad;
        }

        // Evento de cambio de cantidad
        quantityInput.addEventListener('input', function () {
            updateQuantity(productId, parseInt(this.value));
        });

        // Eventos de clic para los botones de incrementar y disminuir la cantidad
        quantityUpButton.addEventListener('click', function () {
            updateQuantity(productId, parseInt(quantityInput.value));
        });

        quantityDownButton.addEventListener('click', function () {
            updateQuantity(productId, parseInt(quantityInput.value));
        });
    });

    // Actualizar los precios totales iniciales
    updatePriceTotal();
});
