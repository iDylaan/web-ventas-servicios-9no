// Selectores1
const usernameInput = document.querySelector("#usernameInput")
const emailInput = document.querySelector("#emailInput")
const passwordInput = document.querySelector("#passwordInput")
const radioUsuario = document.querySelector('#rolUs');
const radioAdmin = document.querySelector('#rolAdmin');

const lecturaUsuarioParagraph = document.querySelector('#lecturaUsuarioParagraph');
const lecturausernameInput = document.querySelector("#lecturausernameInput")
const lecturaemailInput = document.querySelector("#lecturaemailInput")
const lecturaradioUsuario = document.querySelector('#lecturarolUs');
const lecturaradioAdmin = document.querySelector('#lecturarolAdmin');

const editUsuarioParagraph = document.querySelector('#editUsuarioParagraph');
const editIDUsuario = document.querySelector('#editIDUsuario');
const editusernameInput = document.querySelector('#editusernameInput');
const editemailInput = document.querySelector('#editemailInput');
const editradioUsuario = document.querySelector('#editrolUs');
const editradioAdmin = document.querySelector('#editradioAdmin');

const formNuevoUsuario = document.querySelector('#formNuevoUsuario');
const formEditPro = document.querySelector('#formEditPro');
const btnCloseModal = document.querySelector("#readDataModal .btn-close");
const btnGuerdaNP = document.querySelector('#btnGuerdaNP');
const btnActualizaP = document.querySelector('#btnActualizaP');
const leerDataBtns = document.querySelectorAll('.leerDataBtn');
const editDataBtns = document.querySelectorAll('.editDataBtn');
const eliminaDataBtn = document.querySelectorAll('.eliminaDataBtn');
const verBtn = document.querySelector('#ver');
const icono = document.querySelector('#icono');


// Variables
const formModel = {
	nombre_usuario: "",
	email: "",
	password: "",
    admin: "",
}

const editformModel = {
    id: "",
	nombre_usuario: "",
	email: "",
	password: "",
    admin: "",
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
        editformModel.id = editIDUsuario.value;
        editformModel.titulo = editusernameInput.value;
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
            editusernameInput.classList.remove('is-invalid');
            editusernameInput.classList.add('is-valid');
        } else {
            editusernameInput.classList.remove('is-valid');
            editusernameInput.classList.add('is-invalid');
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

async function editaModal(data) {
    console.log('ID del Usuario:', data.id);
    console.log('Nombre del Usuario:', data.nombre_usuario);
    console.log('Correo:', data.email);
    console.log('Pasword:', data.password);
    console.log('Rol:', data.admin);

    // Pequeño retraso para asegurar que los elementos del formulario estén disponibles
    await new Promise(resolve => setTimeout(resolve, 100));

    editusernameInput.value = data.nombre_usuario;
    editemailInput.value = data.email;
    editUsuarioParagraph.textContent = data.nombre_usuario;
    editIDUsuario.value = data.id;


    // Seleccionar el radio correspondiente al rol del usuario
    if (data.admin === 0) {
        document.getElementById('editradioAdmin').checked = false;
    } else if (data.admin === 1) {
        document.getElementById('editradioAdmin').checked = true;
    }
    // Obtener la imagen del usuario y asignarla al elemento img
    const imageUrl = await obtenerImagenUsuario(data.id);
    if (imageUrl) {
        const UsuarioImage = document.getElementById('UsuarioImage');
        UsuarioImage.src = imageUrl;
    } else {
        console.error('No se pudo obtener la imagen del usuario');
        // Manejar la falta de imagen, si lo deseas
    }

    // Mostrar el modal
    var editformModal = new bootstrap.Modal(document.getElementById('editformModal'), {
        backdrop: 'static',
        keyboard: false
    });
    editformModal.show();
}

async function infoUsuario(id_usuario) {
    try {
        const response = await fetch('/usuarios_crud/obtener_usuarios/' + id_usuario, {
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
    eliminaDataBtn.disabled = true;
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

async function obtenerImagenUsuario(id_usuario) {
    try {
        const response = await fetch(`/usuarios_crud/imagen_usuario/${id_usuario}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('No se pudo obtener la imagen del usuario');
        }
        const imageData = await response.blob();
        const imageUrl = URL.createObjectURL(imageData);
        return imageUrl;
    } catch (error) {
        console.error(error);
        return null; // o podrías lanzar una excepción aquí si lo deseas
    }
}

async function leeModal(data) {
    console.log('ID del Usuario:', data.id);
    console.log('Nombre del Usuario:', data.nombre_usuario);
    console.log('Correo:', data.email);
    console.log('Rol:', data.admin);

    // Pequeño retraso para asegurar que los elementos del formulario estén disponibles
    await new Promise(resolve => setTimeout(resolve, 100));

    lecturausernameInput.value = data.nombre_usuario;
    lecturaemailInput.value = data.email;
    lecturaUsuarioParagraph.textContent = data.nombre_usuario;

    // Seleccionar el radio correspondiente al rol del usuario
    if (data.admin === 0) {
        document.getElementById('lecturarolAdmin').checked = false;
    } else if (data.admin === 1) {
        document.getElementById('lecturarolAdmin').checked = true;
    }
    // Obtener la imagen del usuario y asignarla al elemento img
    const imageUrl = await obtenerImagenUsuario(data.id);
    if (imageUrl) {
        const UsuarioImage = document.getElementById('UsuarioImage');
        UsuarioImage.src = imageUrl;
    } else {
        console.error('No se pudo obtener la imagen del usuario');
        // Manejar la falta de imagen, si lo deseas
    }

    // Mostrar el modal
    var leerModal = new bootstrap.Modal(document.getElementById('leerModal'), {
        backdrop: 'static',
        keyboard: false
    });
    leerModal.show();
}


async function editUsuario(id_usuario) {
    try {
        
        const response = await fetch('/usuarios_crud/obtener_usuarios/' + id_usuario, {
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

// Función para alternar la visibilidad de la contraseña
function funncionver() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icono.textContent = 'visibility_off';
    } else {
        passwordInput.type = 'password';
        icono.textContent = 'visibility';
    }
}

// Event Listeners
function eventListeners() {
    
    verBtn.addEventListener('click', funncionver);

    formNuevoUsuario.addEventListener('submit', async function (e) {
        console.log(e);
        return;
        try {
            
            const response = await fetch('/user_crud/nuevo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formModel)
            })

            if (!response.ok) {
                throw new Error('Error en el servidor');
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }

        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en nuevoProducto()
    });

    btnGuerdaNP.addEventListener("click", nuevoProducto)

    /* formEditPro.addEventListener('submit', function (e) {
        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en actualizaProducto()
    }); */

    //btnActualizaP.addEventListener("click", actualizaProducto)


    // Asignar evento al botón readDataBtn
    leerDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del usuario desde el atributo data del botón
            const id_usuario = this.dataset.usuarioId;
            console.log('Se hizo clic en el botón leerDataBtns con ID de usuario:', id_usuario);
    
            // Obtener la información del usuario y mostrar el modal
            infoUsuario(id_usuario);
        });
    });   

    editDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del usuario desde el atributo data del botón
            const id_usuario = this.dataset.usuarioId;
            console.log('Se hizo clic en el botón editDataBtns con ID de producto:', id_usuario);

            // Obtener la información del usuario y mostrar el modal
            editUsuario(id_usuario);
        });
    });

    /* eliminaDataBtn.forEach(btn => {
        btn.addEventListener('click', function () {
            // Obtener el ID del producto desde el atributo data del botón
            const id_producto = this.dataset.userId;
            console.log('Se hizo clic en el botón eliminaDataBtn con ID de producto:', id_producto);

            // Obtener la información del producto y mostrar el modal
            eliminaProduct(id_producto);
        });
    }); */


}


eventListeners();