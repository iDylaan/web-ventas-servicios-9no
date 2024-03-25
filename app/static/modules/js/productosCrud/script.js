// Selectores1
const imgInput = document.querySelector('#imgInput');
const nameInput = document.querySelector('#nameInput');
const informacionInput = document.querySelector('#informacionInput');
const descripcionInput = document.querySelector('#descripcionInput');
const breveDescInput = document.querySelector('#breveDescInput');
const precioInput = document.querySelector('#precioInput');
const lecturaproductParagraph = document.querySelector('#lecturaproductParagraph');
const lecturanameInput = document.querySelector('#lecturanameInput');
const lecturainformacionInput = document.querySelector('#lecturainformacionInput');
const lecturadescripcionInput = document.querySelector('#lecturadescripcionInput');
const lecturabreveDescInput = document.querySelector('#lecturabreveDescInput');
const lecturaprecioInput = document.querySelector('#lecturaprecioInput');
const editproductParagraph = document.querySelector('#editproductParagraph');
const editIDproducto = document.querySelector('#editIDproducto');
const editnameInput = document.querySelector('#editnameInput');
const editinformacionInput = document.querySelector('#editinformacionInput');
const editdescripcionInput = document.querySelector('#editdescripcionInput');
const editbreveDescInput = document.querySelector('#editbreveDescInput');
const editprecioInput = document.querySelector('#editprecioInput');
const formNuevoPro = document.querySelector('#formNuevoPro');
const formEditPro = document.querySelector('#formEditPro');
const btnCloseModal = document.querySelector("#readDataModal .btn-close");
const btnGuerdaNP = document.querySelector('#btnGuerdaNP');
const btnActualizaP = document.querySelector('#btnActualizaP');
const leerDataBtns = document.querySelectorAll('.leerDataBtn');
const editDataBtns = document.querySelectorAll('.editDataBtn');
const eliminaDataBtn = document.querySelectorAll('.eliminaDataBtn');



// Event Listeners
function eventListeners() {
    formNuevoPro.addEventListener('submit', function (e) {
        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en nuevoProducto()
    });

    btnGuerdaNP.addEventListener("click", nuevoProducto)

    formEditPro.addEventListener('submit', function (e) {
        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en actualizaProducto()
    });

    btnActualizaP.addEventListener("click", actualizaProducto)


    // Asignar evento al botón readDataBtn
    leerDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del producto desde el atributo data del botón
            const id_producto = this.dataset.productId;
            console.log('Se hizo clic en el botón leerDataBtns con ID de producto:', id_producto);

            // Obtener la información del producto y mostrar el modal
            infoProduct(id_producto);
        });
    });

    editDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del producto desde el atributo data del botón
            const id_producto = this.dataset.productId;
            console.log('Se hizo clic en el botón editDataBtns con ID de producto:', id_producto);

            // Obtener la información del producto y mostrar el modal
            editProduct(id_producto);
        });
    });

    eliminaDataBtn.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del producto desde el atributo data del botón
            const id_producto = this.dataset.productId;
            console.log('Se hizo clic en el botón editDataBtns con ID de producto:', id_producto);

            // Obtener la información del producto y mostrar el modal
            eliminaProduct(id_producto);
        });
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

const editformModel = {
    id: '',
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

async function actualizaProducto(e) {
    e.preventDefault();

    try {
        // Asignar los valores de los campos del formulario al objeto editformModel
        editformModel.id = editIDproducto.value;
        editformModel.titulo = editnameInput.value;
        editformModel.descripcion = editdescripcionInput.value;
        editformModel.descripcion_corta = editbreveDescInput.value;
        editformModel.info = editinformacionInput.value;
        // Convertir el valor del precio a número antes de asignarlo a editformModel.precio
        editformModel.precio = parseFloat(editprecioInput.value);

        // Verificar si los campos obligatorios están llenos
        if (!editformModel.titulo || !editformModel.descripcion || !editformModel.descripcion_corta || !editformModel.info || !editformModel.precio) {
            throw new Error('Faltan campos obligatorios');
        }

        // Mostrar los datos que se van a enviar en la solicitud AJAX
        console.log('Datos enviados:', editformModel);

        const response = await fetch('/productos_crud/editar/' + editformModel.id, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editformModel)
        })

        if (!response.ok) {
            throw new Error('Ocurrió un error inesperado en el servidor');
        }

        // Si se logró editar el producto, cargar la imagen si está seleccionada
        if (imgInput.files && imgInput.files[0]) {
            const file = imgInput.files[0];
            const formData = new FormData();
            formData.append('imagen', file, file.name);

            const responseImg = await fetch('/productos_crud/imagen_producto/' + editformModel.id, {
                method: 'POST',
                body: formData
            });

            if (!responseImg.ok) {
                throw new Error('No se pudo cargar la imagen');
            }

            // Si se cargó la imagen correctamente, recargar la página
            window.location.reload();
        } else {
            // Si no se seleccionó una imagen, simplemente recargar la página
            window.location.reload();
        }
    } catch (error) {
        console.error(error);
    }
}


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
            leeModal(data);
        } else {
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error('Error al obtener la información del producto');
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        console.error(error);
    }
}

async function eliminaProduct(id_producto) {
    try {
        const response = await fetch('/productos_crud/eliminar/' + id_producto, {
            method: 'POST',
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        
        const result = await response.json();
        
        // Si se eliminó el producto correctamente, recargar la página
        if (result.success) {
            window.location.reload();
        } else {
            throw new Error('Error al eliminar el producto');
        }
    } catch (error) {
        console.error(error);
    }
}



async function leeModal(data) {
    console.log('ID del producto:', data.id);
    console.log('Nombre del producto:', data.titulo);
    console.log('Descripción breve:', data.descripcion_previa);
    console.log('Descripción detallada:', data.descripcion);
    console.log('Información:', data.info);
    console.log('Precio:', data.precio);

    // Pequeño retraso para asegurar que los elementos del formulario estén disponibles
    await new Promise(resolve => setTimeout(resolve, 100));

    lecturanameInput.value = data.titulo;
    lecturainformacionInput.value = data.info;
    lecturadescripcionInput.value = data.descripcion;
    lecturabreveDescInput.value = data.descripcion_previa;
    lecturaprecioInput.value = data.precio;
    lecturaproductParagraph.textContent = data.titulo;

    // Obtener la imagen del producto y asignarla al elemento img
    const productImage = document.getElementById('productImage');
    productImage.src = `/productos_crud/imagen_producto/${data.id}`;

    // Mostrar el modal
    var leerModal = new bootstrap.Modal(document.getElementById('leerModal'), {
        backdrop: 'static',
        keyboard: false
    });
    leerModal.show();
}

async function editProduct(id_producto) {
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
            editaModal(data);
        } else {
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error('Error al obtener la información del producto');
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        console.error(error);
    }
}

async function editaModal(data) {
    console.log('ID del producto:', data.id);
    console.log('Nombre del producto:', data.titulo);
    console.log('Descripción breve:', data.descripcion_previa);
    console.log('Descripción detallada:', data.descripcion);
    console.log('Información:', data.info);
    console.log('Precio:', data.precio);

    // Pequeño retraso para asegurar que los elementos del formulario estén disponibles
    await new Promise(resolve => setTimeout(resolve, 100));

    editnameInput.value = data.titulo;
    editinformacionInput.value = data.info;
    editdescripcionInput.value = data.descripcion;
    editbreveDescInput.value = data.descripcion_previa;
    editprecioInput.value = data.precio;
    editproductParagraph.textContent = data.titulo;
    editIDproducto.value = data.id;


    // Obtener la imagen del producto y asignarla al elemento img
    const productImage = document.getElementById('productImage');
    productImage.src = `/productos_crud/imagen_producto/${data.id}`;

    // Mostrar el modal
    var editformModal = new bootstrap.Modal(document.getElementById('editformModal'), {
        backdrop: 'static',
        keyboard: false
    });
    editformModal.show();
}

eventListeners();