const paypayCeck = document.getElementById('method-paypal');

paypayCeck.addEventListener('change', e => {
    if (e.target.checked) {
        document.getElementById('paypal__container').style.display = 'block';
    } else {
        document.getElementById('paypal__container').style.display = 'none';
    }
})

// PROCESO DE PAGO CON PAYPAL
paypal.Buttons({
    style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'sharp',
        label: 'buynow'
    },
    fundingSource: paypal.FUNDING.PAYPAL,
    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    currency_code: 'MXN',
                    value: CHECKOUT_TOTAL
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const productosRecibidos = PRODUCTS; // Asumiendo que esto es un arreglo de objetos producto

            // Comprobar si todos los productos en el carrito están presentes en los productos recibidos con las mismas cantidades
            const esCarritoValido = carrito.every(itemCarrito => {
                const productoCorrespondiente = productosRecibidos.find(
                    prodRecibido => prodRecibido.id === itemCarrito.id
                );
                return productoCorrespondiente && productoCorrespondiente.cantidad === itemCarrito.cantidad;
            });

            if (esCarritoValido) {
                localStorage.setItem("carrito", JSON.stringify([]))
            }

            document.getElementById('bar-loader').style.display = 'block';

            fetch(BUY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: USER_ID,
                    products: PRODUCTS
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json();
                })
                .then(result => {
                    window.location.href = MIS_COMPRAS_URL;
                })
                .catch(e => {
                    toastr.error('No se pudo completar tu compra 😞', 'Ups...');
                })
        });
    }
}).render('#paypal-button-container');