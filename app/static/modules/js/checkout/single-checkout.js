// Peticion del carrito de compras
$(document).ready(function () {

    let cantidad = 1;
    const id = parseInt(PRODUCT_ID) || 0;

    $('#cantidad-input').on('input', function() {
        cantidad = parseInt($(this).val()) || 1;
    });

    $('#buy-btn').click(async function () {
        const producto = [ { id, cantidad } ]
        
        // Mostrar Loader
        $('#bar-loader').css('display', 'block');

        try {
            const response = await fetch('/tienda/checkout', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'productos': producto
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