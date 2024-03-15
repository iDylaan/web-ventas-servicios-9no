const imgInput = document.querySelector('#imgInput');
const nameInput = document.querySelector('#nameInput');
const informacionInput = document.querySelector('#informacionInput');
const descripcionInput = document.querySelector('#descripcionInput');
const breveDescInput = document.querySelector('#breveDescInput');
const precioInput = document.querySelector('#precioInput');
const formNuevoPro = document.querySelector('#myForm');
const btnGuerdaNP = document.querySelector('#btnGuerdaNP');

function eventListeners() {
    formNuevoPro.addEventListener('submit', function(e) {
        // No se llama a e.preventDefault() para permitir la recarga de la página
        // Se realiza la validación de los campos obligatorios en nuevoProducto()
    });

    btnGuerdaNP.addEventListener("click", nuevoProducto)
}

// Variables
const formModel = {
    titulo: '',
    descripcion: '',
    descripcion_corta: '',
    info: '',
    precio: '',
}

async function nuevoProducto() {
    try {
        // Asignar los valores de los campos del formulario al objeto formModel
        formModel.titulo = nameInput.value;
        formModel.descripcion = informacionInput.value;
        formModel.descripcion_corta = descripcionInput.value;
        formModel.info = breveDescInput.value;
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
            console.log("success");
        } else {
            throw new Error(result.error.msg)
        }
    } catch (error) {
        console.error(error);
    } 
}

eventListeners();