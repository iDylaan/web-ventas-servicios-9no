// Peticion del carrito de compras
$(document).ready(function () {
    $('#checkout-btn').click(async function () {

        // Mostrar Loader
        $('#bar-loader').css('display', 'block');

        // Obtener carrito de compras
        const carritoJSON = localStorage.getItem('carrito');

        // Convertir la cadena JSON a un objeto de JavaScript
        const carrito = carritoJSON ? JSON.parse(carritoJSON) : [];

        try {
            const response = await fetch('/tienda/checkout', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({  
                    'productos': carrito
                })
            })

            if (!response.ok) {
                throw new Error('Error en el servidor');
            }

            window.location.href = CHECKOUT_URL;

        } catch (error) {
            console.log(error);
        }
    });
});