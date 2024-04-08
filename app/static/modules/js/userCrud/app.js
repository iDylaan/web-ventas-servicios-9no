// Selectores1
const usernameInput = document.querySelector("#usernameInput")
const emailInput = document.querySelector("#emailInput")
const passwordInput = document.querySelector("#passwordInput")
const radioAdmin = document.querySelector('#rolAdmin');

const lecturaUsuarioParagraph = document.querySelector('#lecturaUsuarioParagraph');
const lecturausernameInput = document.querySelector("#lecturausernameInput")
const lecturaemailInput = document.querySelector("#lecturaemailInput")
const lecturaradioAdmin = document.querySelector('#lecturarolAdmin');

const editUsuarioParagraph = document.querySelector('#editUsuarioParagraph');
const editIDUsuario = document.querySelector('#editIDUsuario');
const editusernameInput = document.querySelector('#editusernameInput');
const editemailInput = document.querySelector('#editemailInput');
const editpasswordInput = document.querySelector('#editpasswordInput');
const editradioAdmin = document.querySelector('#editradioAdmin');

const formNuevoUsuario = document.querySelector('#formNuevoUsuario');
const formEditUser = document.querySelector('#formEditUser');
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
    admin: "",
}
// Funciones
async function nuevoUsuario(e) {
    e.preventDefault();
    
    try {
        // Asignar los valores de los campos del formulario al objeto formModel
        formModel.nombre_usuario = usernameInput.value;
        formModel.email = emailInput.value;
        formModel.password = passwordInput.value;
        // Obtener el valor del checkbox #rolAdmin
        formModel.admin = radioAdmin.checked ? 1 : 0;

        // Establecer todos los campos como no válidos (is-invalid)
        document.querySelectorAll('.form-control').forEach(element => {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        });

        // Validar el campo 'Nombre del producto'
        if (formModel.nombre_usuario) {
            usernameInput.classList.remove('is-invalid');
            usernameInput.classList.add('is-valid');
        } else {
            usernameInput.classList.remove('is-valid');
            usernameInput.classList.add('is-invalid');
        }

        // Validar el campo 'Descripción'
        if (formModel.email) {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        } else {
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
        }

        // Validar el campo 'Descripción breve'
        if (formModel.password) {
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.add('is-valid');
        } else {
            passwordInput.classList.remove('is-valid');
            passwordInput.classList.add('is-invalid');
        }


        if (!formModel.nombre_usuario || !formModel.email || !formModel.password) {

            throw new Error('Faltan campos obligatorios');
        }
        btnGuerdaNP.disabled = true;
        // Mostrar los datos que se van a enviar en la solicitud AJAX
        console.log('Datos enviados:', formModel);

        const response = await fetch('/usuarios_crud/nuevo', {
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
                const { data: { id_usuario } } = result;
                console.log(id_usuario);

                // File
                const file = imgInput.files[0]
                console.log(file);

                console.log('Dentro de la carga de la imagen')
                const formData = new FormData();
                formData.append('imagen', file, file.name);

                console.log('Imagen cargada al formData')

                if (id_usuario) {
                    console.log('Antes de empezar el registro')
                    const response = await fetch('/usuarios_crud/imagen_usuario/' + id_usuario, {
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
        editformModel.nombre_usuario = editusernameInput.value;
        editformModel.email = editemailInput.value;
        // Obtener el valor del checkbox #rolAdmin
        editformModel.admin = editradioAdmin.checked ? 1 : 0;
        

        // Establecer todos los campos como no válidos (is-invalid)
        document.querySelectorAll('.form-control').forEach(element => {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            editpasswordInput.classList.remove('is-invalid');
            editpasswordInput.classList.remove('is-valid');
        });

        // Validar el campo 'Nombre del usuario'
        if (editformModel.nombre_usuario) {
            editusernameInput.classList.remove('is-invalid');
            editusernameInput.classList.add('is-valid');
        } else {
            editusernameInput.classList.remove('is-valid');
            editusernameInput.classList.add('is-invalid');
        }

        // Validar el campo 'Descripción'
        if (editformModel.email) {
            editemailInput.classList.remove('is-invalid');
            editemailInput.classList.add('is-valid');
        } else {
            editemailInput.classList.remove('is-valid');
            editemailInput.classList.add('is-invalid');
        }

        // Verificar si los campos obligatorios están llenos
        if (!editformModel.nombre_usuario || !editformModel.email) {
            throw new Error('Faltan campos obligatorios');
        }

        btnActualizaP.disabled = true;
        // Mostrar los datos que se van a enviar en la solicitud AJAX
        console.log('Datos enviados:', editformModel);
        const response = await fetch('/usuarios_crud/editar/' + editformModel.id, {
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

            const responseImg = await fetch('/usuarios_crud/imagen_usuario/' + editformModel.id, {
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
   // Mostrar el modal
    var editformModal = new bootstrap.Modal(document.getElementById('editformModal'), {
        backdrop: 'static',
        keyboard: false
    });
    editformModal.show();
    // Escuchar el evento cuando se cierre el modal
    editformModal._element.addEventListener('hidden.bs.modal', function () {
        // Activar los botones nuevamente
        activarBotones();
    });
}

async function infoUsuario(id_usuario) {
    let data = null;

    // Verifica si USUARIOS es un objeto
    if (typeof USUARIOS === 'object' && USUARIOS !== null) {
        for (let key in USUARIOS) {
            if (USUARIOS.hasOwnProperty(key)) {
                if (parseInt(USUARIOS[key].id) === parseInt(id_usuario)) {
                    data = USUARIOS[key];
                    break; // Salir del bucle una vez que se encuentre el usuario
                }
            }
        }
        
    } else {
        console.error("USUARIOS no es un objeto válido.");
        return; // Salir de la función si USUARIOS no es un objeto válido
    }

    if (data !== null) {
        leeModal(data);
    } else {
        console.error("No se encontró ningún usuario con el ID proporcionado.");
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
    lecturausernameInput.value = data.nombre_usuario;
    lecturaemailInput.value = data.email;
    lecturaUsuarioParagraph.textContent = data.nombre_usuario;
    // Seleccionar el radio correspondiente al rol del usuario
    if (data.admin === 0) {
        document.getElementById('lecturarolAdmin').checked = false;
    } else if (data.admin === 1) {
        document.getElementById('lecturarolAdmin').checked = true;
    }
    // Mostrar el modal
    var leerModal = new bootstrap.Modal(document.getElementById('leerModal'), {
        backdrop: 'static',
        keyboard: false
    });
    leerModal.show();
    // Escuchar el evento cuando se cierre el modal
    leerModal._element.addEventListener('hidden.bs.modal', function () {
        // Activar los botones nuevamente
        activarBotones();
    });
}

async function editUsuario(id_usuario) {
    let data = null;

    // Verifica si USUARIOS es un objeto
    if (typeof USUARIOS === 'object' && USUARIOS !== null) {
        for (let key in USUARIOS) {
            if (USUARIOS.hasOwnProperty(key)) {
                if (parseInt(USUARIOS[key].id) === parseInt(id_usuario)) {
                    data = USUARIOS[key];
                    break; // Salir del bucle una vez que se encuentre el usuario
                }
            }
        }
        
    } else {
        console.error("USUARIOS no es un objeto válido.");
        return; // Salir de la función si USUARIOS no es un objeto válido
    }

    if (data !== null) {
        editaModal(data);
    } else {
        console.error("No se encontró ningún usuario con el ID proporcionado.");
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

// Función para desactivar los botones al hacer clic
function desactivarBotones() {
    leerDataBtns.forEach(btn => {
        btn.disabled = true;
    });
    editDataBtns.forEach(btn => {
        btn.disabled = true;
    });
}

// Función para activar los botones cuando se cierre el modal
function activarBotones() {
    leerDataBtns.forEach(btn => {
        btn.disabled = false;
    });
    editDataBtns.forEach(btn => {
        btn.disabled = false;
    });
}

// Event Listeners
function eventListeners() {
    
    verBtn.addEventListener('click', funncionver);

    formNuevoUsuario.addEventListener('submit', async function (e) {
        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en nuevoProducto()
    });

    btnGuerdaNP.addEventListener("click", nuevoUsuario)

    formEditUser.addEventListener('submit', function (e) {
        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en actualizaProducto()
    });

    btnActualizaP.addEventListener("click", actualizaProducto)


    // Asignar evento al botón readDataBtn
    leerDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
             // Desactivar los botones
            desactivarBotones();
            // Obtener el ID del usuario desde el atributo data del botón
            const id_usuario = this.dataset.usuarioId;
            // Obtener la información del usuario y mostrar el modal
            infoUsuario(id_usuario);
        });
    });   

    editDataBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Desactivar los botones
            desactivarBotones();
            // Obtener el ID del usuario desde el atributo data del botón
            const id_usuario = this.dataset.usuarioId;
            // Obtener la información del usuario y mostrar el modal
            editUsuario(id_usuario);
        });
    });
}


eventListeners();