document.addEventListener("DOMContentLoaded", function () {
  function initCart() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Actualiza el precio total del carrito
    function updateCartPriceTotal() {
        const cartTotals = document.querySelector(".cart-totals");
        const subtotalTarget = cartTotals.querySelector("#subtotal");
        const ivaTarget = cartTotals.querySelector("#iva");
        const totalTarget = cartTotals.querySelector("#total");

        const cartItems = document.querySelectorAll(".cart-item");

        let subtotal = 0.0;
        cartItems.forEach(cartItem => {
            const itemTotal = parseFloat(cartItem.querySelector(".price-total").textContent);
            subtotal += itemTotal;
        })

        // Agregar el subtotal
        subtotalTarget.textContent = subtotal.toFixed(2);

        // Calcular IVA
        const iva = subtotal * 0.16;
        ivaTarget.textContent = iva.toFixed(2);

        // Calcular el total
        const total = subtotal + iva;
        totalTarget.textContent = total.toFixed(2);

    }

    // Actualizar el precio total cuando se cambia la cantidad
    function updatePriceTotal() {
      document.querySelectorAll(".cart-item").forEach(function (item) {
        const quantityInput = item.querySelector(".quantity");
        const priceUnit = parseFloat(
          item.querySelector(".price-unit").textContent
        );
        const priceTotalElement = item.querySelector(".price-total");

        let quantity = parseInt(quantityInput.value);
        let priceTotal = quantity * priceUnit;

        // Actualizar el texto del precio total
        priceTotalElement.textContent = priceTotal.toFixed(2);
      });
    }

    // Función para actualizar la cantidad en el input y en localStorage
    function updateQuantity(productId, newQuantity) {
      let quantity = newQuantity;
      if (newQuantity < 1) {
        quantity = 1;
      }
      if (newQuantity > 20) {
        quantity = 20;
      }
      const productInCart = carrito.find((p) => p.id === productId);
      if (productInCart) {
        productInCart.cantidad = quantity;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        updatePriceTotal();
      }
    }

    // Configurar la cantidad inicial y los manejadores de eventos para cada item del carrito
    document.querySelectorAll(".cart-item").forEach(function (item) {
      const productId = parseInt(item.dataset.productoId);
      const quantityInput = item.querySelector(".quantity");
      const quantityUpButton = item.querySelector(".quantity-up");
      const quantityDownButton = item.querySelector(".quantity-down");
      const closeButton = item.querySelector(".close");

      // Buscar el producto en el arreglo del carrito por su id
      const productInCart = carrito.find(
        (producto) => producto.id === productId
      );

      // Si hay información del carrito en localStorage, usar esa cantidad
      if (productInCart) {
        quantityInput.value = productInCart.cantidad;
      }

      // Evento de cambio de cantidad
      quantityInput.addEventListener("input", function () {
        let quantityValue = parseInt(this.value) || 0;
        quantityValue = quantityValue < 1 ? 1 : quantityValue;
        quantityValue = quantityValue > 20 ? 20 : quantityValue;

        this.value = quantityValue;

        updateQuantity(productId, quantityValue);
        updateCartPriceTotal();
      });

      // Eventos de clic para los botones de incrementar y disminuir la cantidad
      quantityUpButton.addEventListener("click", function () {
        updateQuantity(productId, parseInt(quantityInput.value));
        updateCartPriceTotal();
      });

      quantityDownButton.addEventListener("click", function () {
        updateQuantity(productId, parseInt(quantityInput.value));
        updateCartPriceTotal();
      });

      closeButton.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        const productoId = parseInt(cartItem.dataset.productoId);

        // Eliminar el producto del localStorage
        const nuevoCarrito = eliminarProductoDelCarrito(productoId);

        // Eliminar la fila del producto del DOM
        cartItem.remove();

        // Actualizar la URL
        removeProductIdFromUrl(productId);

        // Actualizar el precio total después de eliminar el producto
        updatePriceTotal();

        // Verificar si es necesario mostrar el mensaje de carrito vacío
        if (nuevoCarrito.length === 0) {
          document.querySelector("table").style.display = "none"; // Oculta la tabla
          // Mostrar el mensaje de que el carrito está vacío
          document.getElementById("mensaje-carrito-vacio").style.display =
            "block";
        }

        initCart();
      });
    });

    // Actualizar los precios totales iniciales
    updatePriceTotal();
    // Actualizar el calculo total del carrito
    updateCartPriceTotal();

    function removeProductIdFromUrl(productId) {
      let url = new URL(window.location.href);
      let searchParams = new URLSearchParams(url.search);
      let ids = searchParams.get("ids");

      // Convertir los IDs de la URL en un array, remover el ID y convertir de vuelta en una cadena
      if (ids) {
        ids = ids
          .split(",")
          .filter((id) => parseInt(id) !== productId)
          .join(",");
        searchParams.set("ids", ids);
        url.search = searchParams.toString();

        // Actualizar la URL sin recargar la página
        window.history.pushState({}, "", url);
      }
    }

    // Función para remover un producto del carrito basado en su ID y actualizar el localStorage
    function eliminarProductoDelCarrito(productoId) {
      // Recuperar el carrito de localStorage y convertirlo de JSON a un objeto JavaScript
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      // Filtrar el carrito para eliminar el producto con el ID específico
      const nuevoCarrito = carrito.filter(
        (producto) => producto.id !== productoId
      );

      // Convertir el carrito actualizado a una cadena JSON y guardarlo en localStorage
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

      return nuevoCarrito;
    }
  }

  initCart();
});
