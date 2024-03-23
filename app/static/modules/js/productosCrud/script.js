// Selectores1
const imgInput = document.querySelector('#imgInput');
const nameInput = document.querySelector('#nameInput');
const informacionInput = document.querySelector('#informacionInput');
const descripcionInput = document.querySelector('#descripcionInput');
const breveDescInput = document.querySelector('#breveDescInput');
const precioInput = document.querySelector('#precioInput');
const formNuevoPro = document.querySelector('#myForm');
const btnGuerdaNP = document.querySelector('#btnGuerdaNP');
const readDataBtns = document.querySelectorAll('.readDataBtn');
const customCloseBtns = document.querySelectorAll(".custom-close");
const btnCloseModal = document.querySelector("#readDataModal .btn-close");



// Event Listeners
function eventListeners() {
    formNuevoPro.addEventListener('submit', function (e) {
        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en nuevoProducto()
    });

    btnGuerdaNP.addEventListener("click", nuevoProducto)
    // Asignar evento al botón readDataBtn
    readDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del producto desde el atributo data del botón
            const id_producto = this.dataset.productId;
            console.log('Se hizo clic en el botón readDataBtn con ID de producto:', id_producto);

            // Obtener la información del producto y mostrar el modal
            infoProduct(id_producto);
        });
    });
    // Evento para abrir el modal customModal
    openModalBtn.addEventListener("click", function () {
        customModal.style.display = "block";
    });

    customCloseBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            customModal.style.display = "none";
        });
    });

    // Evento para cerrar el modal readDataModal
    btnCloseModal.addEventListener("click", function () {
        customCloseBtn.click(); // Simular clic en el botón de cierre original
    });

}

// Variables
const formModel = {
    titulo: '',
    descripcion: '',
    descripcion_corta: '',
    info: '',
    precio: '',
}

// Funciones
async function nuevoProducto(e) {
    e.preventDefault();

    try {
        // Asignar los valores de los campos del formulario al objeto formModel
        formModel.titulo = nameInput.value;
        formModel.descripcion = descripcionInput.value;
        formModel.descripcion_corta = breveDescInput.value;
        formModel.info = informacionInput.value;
        // Convertir el valor del precio a número antes de asignarlo a formModel.precio
        formModel.precio = parseFloat(precioInput.value);

        // Verificar si los campos obligatorios están llenos
        if (!formModel.titulo || !formModel.descripcion || !formModel.descripcion_corta || !formModel.info || !formModel.precio) {
            throw new Error('Faltan campos obligatorios');
        }

        // Mostrar los datos que se van a enviar en la solicitud AJAX
        console.log('Datos enviados:', formModel);

        const response = await fetch('/productos_crud/nuevo', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formModel)
        })

        if (!response.ok) {
            throw new Error('Ocurrió un error inesperado en el servidor');
        }

        const result = await response.json();
        if (result.success) {
            if (imgInput.files && imgInput.files[0]) {

                // Distructuring de la data
                const { data: { id_producto } } = result;
                console.log(id_producto);

                // File
                const file = imgInput.files[0]
                console.log(file);

                console.log('Dentro de la carga de la imagen')
                const formData = new FormData();
                formData.append('imagen', file, file.name);

                console.log('Imagen cargada al formData')

                if (id_producto) {
                    console.log('Antes de empezar el registro')
                    const response = await fetch('/productos_crud/imagen_producto/' + id_producto, {
                        method: 'POST',
                        body: formData
                    })

                    if (!response.ok) {
                        throw new Error('No se pudo cargar la imagen');
                    }

                    const result = await response.json();

                    if (result) {
                        window.location.reload();
                    }
                    console.log(result);
                }
            } else {
                window.location.reload();
            }
            console.log("success");
        } else {
            throw new Error(result.error.msg)
        }
    } catch (error) {
        console.error(error);
    }
}


/* async function infoProduct(id_producto) {
    try {
        const response = await fetch('/productos_crud/obtener_producto/' + id_producto);

        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
            // Convertir la respuesta a formato JSON
            const data = await response.json();
            // Mostrar la información en la consola
            console.log(data);
            // Aquí puedes hacer algo más con la respuesta, como procesarla o mostrarla en la interfaz de usuario
        } else {
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error('Error al obtener la información del producto');
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        console.error(error);
    }
}  */


async function infoProduct(id_producto) {
    try {
        const response = await fetch('/productos_crud/obtener_productos/' + id_producto, {
            method: 'GET',
        });

        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
            // Convertir la respuesta a formato JSON
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            // Llenar el modal con la información del producto
            //fillModal(data);
            /* const readDataModal = new bootstrap.Modal(document.getElementById('readDataModal'));
            readDataModal.show(); */

            const exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            exampleModal.show();

        } else {
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error('Error al obtener la información del producto');
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        console.error(error);
    }
}
async function fillModal(data) {
    // Llenar los campos del formulario con la información del producto
    nameInput.value = data.nombre;
    informacionInput.value = data.informacion;
    descripcionInput.value = data.descripcion;
    breveDescInput.value = data.breveDescripcion;
    precioInput.value = data.precio;

    // Mostrar el modal
    const readDataModal = new bootstrap.Modal(document.getElementById('readDataModal'));
    readDataModal.show();
}


eventListeners();