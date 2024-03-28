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

        // Establecer todos los campos como no válidos (is-invalid)
        document.querySelectorAll('.form-control').forEach(element => {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        });

        // Validar el campo 'Nombre del producto'
        if (formModel.titulo) {
            nameInput.classList.remove('is-invalid');
            nameInput.classList.add('is-valid');
        } else {
            nameInput.classList.remove('is-valid');
            nameInput.classList.add('is-invalid');
        }

        // Validar el campo 'Descripción'
        if (formModel.descripcion) {
            descripcionInput.classList.remove('is-invalid');
            descripcionInput.classList.add('is-valid');
        } else {
            descripcionInput.classList.remove('is-valid');
            descripcionInput.classList.add('is-invalid');
        }

        // Validar el campo 'Descripción breve'
        if (formModel.descripcion_corta) {
            breveDescInput.classList.remove('is-invalid');
            breveDescInput.classList.add('is-valid');
        } else {
            breveDescInput.classList.remove('is-valid');
            breveDescInput.classList.add('is-invalid');
        }

        // Validar el campo 'Información'
        if (formModel.info) {
            informacionInput.classList.remove('is-invalid');
            informacionInput.classList.add('is-valid');
        } else {
            informacionInput.classList.remove('is-valid');
            informacionInput.classList.add('is-invalid');
        }

        // Validar el campo 'Precio'
        if (formModel.precio) {
            precioInput.classList.remove('is-invalid');
            precioInput.classList.add('is-valid');
        } else {
            precioInput.classList.remove('is-valid');
            precioInput.classList.add('is-invalid');
        }


        if (!formModel.titulo || !formModel.descripcion || !formModel.descripcion_corta || !formModel.info || !formModel.precio) {

            throw new Error('Faltan campos obligatorios');
        }
        btnGuerdaNP.disabled = true;
        // Mostrar los datos que se van a enviar en la solicitud AJAX
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
                // File
                const file = imgInput.files[0]
                const formData = new FormData();
                formData.append('imagen', file, file.name);
                if (id_producto) {
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
                }
            } else {
                window.location.reload();
            }
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

        // Establecer todos los campos como no válidos (is-invalid)
        document.querySelectorAll('.form-control').forEach(element => {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        });

        // Validar el campo 'Nombre del producto'
        if (editformModel.titulo) {
            editnameInput.classList.remove('is-invalid');
            editnameInput.classList.add('is-valid');
        } else {
            editnameInput.classList.remove('is-valid');
            editnameInput.classList.add('is-invalid');
        }

        // Validar el campo 'Descripción'
        if (editformModel.descripcion) {
            editdescripcionInput.classList.remove('is-invalid');
            editdescripcionInput.classList.add('is-valid');
        } else {
            editdescripcionInput.classList.remove('is-valid');
            editdescripcionInput.classList.add('is-invalid');
        }

        // Validar el campo 'Descripción breve'
        if (editformModel.descripcion_corta) {
            editbreveDescInput.classList.remove('is-invalid');
            editbreveDescInput.classList.add('is-valid');
        } else {
            editbreveDescInput.classList.remove('is-valid');
            editbreveDescInput.classList.add('is-invalid');
        }

        // Validar el campo 'Información'
        if (editformModel.info) {
            editinformacionInput.classList.remove('is-invalid');
            editinformacionInput.classList.add('is-valid');
        } else {
            editinformacionInput.classList.remove('is-valid');
            editinformacionInput.classList.add('is-invalid');
        }

        // Validar el campo 'Precio'
        if (editformModel.precio) {
            editprecioInput.classList.remove('is-invalid');
            editprecioInput.classList.add('is-valid');
        } else {
            editprecioInput.classList.remove('is-valid');
            editprecioInput.classList.add('is-invalid');
        }

        // Verificar si los campos obligatorios están llenos
        if (!editformModel.titulo || !editformModel.descripcion || !editformModel.descripcion_corta || !editformModel.info || !editformModel.precio) {
            throw new Error('Faltan campos obligatorios');
        }

        btnActualizaP.disabled = true;
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

async function editaModal(data) {
    editnameInput.value = data.titulo;
    editinformacionInput.value = data.info;
    editdescripcionInput.value = data.descripcion;
    editbreveDescInput.value = data.descripcion_previa;
    editprecioInput.value = data.precio;
    editproductParagraph.textContent = data.titulo;
    editIDproducto.value = data.id;

    // Mostrar el modal
    var editformModal = new bootstrap.Modal(document.getElementById('editformModal'), {
        backdrop: 'static',
        keyboard: false
    });
    editformModal.show();
}

async function infoProduct(id_producto) {
    let data = null;
    PRODUCTOS.forEach(producto => {
        if (parseInt(producto.id) === parseInt(id_producto)) {
            data = producto;
        }
    })

    leeModal(data);
}

async function eliminaProduct(id_producto) {
    eliminaDataBtn.disabled = true;
    const confirma = confirm("¿Estás seguro de eliminar este producto?");
    
    if(!confirma){
        eliminaDataBtn.disabled = false;
        return;
    }
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
    finally {
        // Habilitar el botón nuevamente después de que se haya completado el proceso
        eliminaDataBtn.disabled = false;
    }
}

async function leeModal(data) {
    lecturanameInput.value = data.titulo;
    lecturainformacionInput.value = data.info;
    lecturadescripcionInput.value = data.descripcion;
    lecturabreveDescInput.value = data.descripcion_previa;
    lecturaprecioInput.value = data.precio;
    lecturaproductParagraph.textContent = data.titulo;

    // Mostrar el modal
    var leerModal = new bootstrap.Modal(document.getElementById('leerModal'), {
        backdrop: 'static',
        keyboard: false
    });
    leerModal.show();
}

async function editProduct(id_producto) {
    let data = null;

    PRODUCTOS.forEach(producto => {
        if (parseInt(producto.id) === parseInt(id_producto)) {
            data = producto;
        }
    })

    editaModal(data);
}

function validarNumero(input) {
    // Obtener el valor actual del input
    let valor = input.value;

    // Remover caracteres no permitidos y repetidos
    valor = valor.replace(/[^\d.-]+|(?<=\.\d*)\./g, ''); // Remover caracteres que no sean dígitos, punto o signo negativo, y puntos repetidos
    valor = valor.replace(/^-{2,}/g, '-'); // Mantener solo un guion "-" si hay más de uno al principio
    valor = valor.replace(/-{2,}/g, ''); // Remover dos o más guiones "-" consecutivos después del primer carácter

    // Verificar si el valor es negativo, si lo es, eliminar el signo "-" si no está al principio
    if (valor.indexOf('-') !== 0) {
        valor = valor.replace(/-/g, '');
    }

    // Verificar si solo se ingresó un punto decimal
    if (valor === '.') {
        valor = '0.'; // Agregar un "0" antes del punto decimal
    }

    // Verificar si el valor comienza con un punto decimal
    if (valor.indexOf('.') === 0) {
        valor = '0' + valor; // Agregar un "0" antes del punto decimal si es necesario
    }

    // Actualizar el valor del input solo si ha habido cambios
    if (valor !== input.value) {
        input.value = valor;
    }
}

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
            // Obtener la información del producto y mostrar el modal
            infoProduct(id_producto);
        });
    });

    editDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del producto desde el atributo data del botón
            const id_producto = this.dataset.productId;
            // Obtener la información del producto y mostrar el modal
            editProduct(id_producto);
        });
    });

    eliminaDataBtn.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del producto desde el atributo data del botón
            const id_producto = this.dataset.productId;
            // Obtener la información del producto y mostrar el modal
            eliminaProduct(id_producto);
        });
    });


}


eventListeners();