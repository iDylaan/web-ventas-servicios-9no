// Selectores
const emailInput = document.querySelector("#email")
const passwordInput = document.querySelector("#password")
const siginpForm = document.querySelector('#form-signin')
const btnSingin = document.querySelector("#btnSingin")
const formErrorsAlert = document.querySelector("#form_error")
const formBarLoader = document.querySelector('#bar-loader');

// Event Listeners
eventListeners();
window.onload = function () {
    google.accounts.id.initialize({
        client_id: '794007100549-ii414p96k9vidkh015i9qs4ofk8pvv80.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt();
};


function eventListeners() {
    siginpForm.addEventListener('submit', (e) => e.preventDefault())

    // Recibir la value de los inputs del formulario
    emailInput.addEventListener('input', e => formModel.email = e.target.value)
    passwordInput.addEventListener('input', e => formModel.password = e.target.value)

    btnSingin.addEventListener("click", signin)

}

// Variables
const formModel = {
    email: '',
    password: '',
}

// Funciones
async function signin() {
    const validForm = validarFormulario();

    if (validForm) {
        formBarLoader.style.display = 'block';
        try {
            const response = await fetch('/auth/signin', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formModel)
            })

            if (!response.ok) {
                throw new Error('Ocurrio un error inesperado en el servidor');
            }

            const result = await response.json();
            if (result.success) {
                mostrarMensaje("success", "¡Bienvenido!");
                setTimeout(() => {
                    window.location.href = indexURL;
                }, 1300);
            } else {
                throw new Error(result.error.msg)
            }
        } catch (error) {
            gestionarErrores([error])
        } finally {
            formBarLoader.style.display = 'none';
        }
    }
}


function validarFormulario() {
    const errors = [];
    const { email, password } = formModel;

    if (!email) errors.push('Falta el correo electronico');
    if (!password) errors.push('Falta la contraseña');

    // Si faltan campos no proseguir con las validaciones
    if (errors.length > 0) {
        gestionarErrores(errors);
        return;
    };

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        errors.push('El correo electrónico no es válido');
    }

    const incorrectPasswordLenght = password.length < 8;
    if (incorrectPasswordLenght) errors.push('La contraseña debe ser de minimo 8 caracteres');

    gestionarErrores(errors);

    return errors.length === 0;
}

function gestionarErrores(errors) {
    if (!formErrorsAlert.classList.contains('d-none')) formErrorsAlert.classList.add('d-none');

    if (errors.length > 0) {
        formErrorsAlert.classList.remove('d-none')

        let msg = '';
        msg += '<ul>';

        errors.forEach(error => {
            msg += `
            <li>
            ${error}
            </li>
            `;
        });

        msg += '</ul>';

        formErrorsAlert.innerHTML = msg;
        // Desplazar la vista del usuario hacia el mensaje de error
        scrollToElement(formErrorsAlert);

        // Ocultar los mensajes después de 10 segundos
        setTimeout(() => {
            formErrorsAlert.classList.add('d-none');
            formErrorsAlert.innerHTML = '';
        }, 10000);
    }
}
function mostrarMensaje(type, message) {
    const formMessageElement = formErrorsAlert;

    // Limpiar clases y contenido previo
    formMessageElement.classList.remove("d-none", "alert-success", "alert-danger");
    formMessageElement.innerHTML = "";

    // Agregar clases de Bootstrap y mostrar el mensaje
    formMessageElement.classList.add("alert", `alert-${type}`, "mt-3");
    formMessageElement.innerHTML = message;

    // Hacer el div enfocable agregando el atributo tabindex
    formMessageElement.setAttribute("tabindex", "-1");

    // Enfocar en el elemento para dirigir automáticamente al usuario al mensaje
    formMessageElement.focus();

    // Desplazar la vista del usuario hacia el mensaje
    scrollToElement(formMessageElement);

    // Temporizador para ocultar los mensajes después de un tiempo (opcional)
    setTimeout(() => {
        formMessageElement.classList.add("d-none");
        formMessageElement.classList.remove("alert-success", "alert-danger");
        formMessageElement.innerHTML = "";
    }, 3000);
}

// Función para desplazarse al elemento con JavaScript puro
function scrollToElement(element) {
    const offsetTop = element.offsetTop;
    const scrollPosition = offsetTop - 20; // Ajuste opcional para el espacio del encabezado

    // Desplazar suavemente
    window.scrollTo({
        top: scrollPosition,
        behavior: "smooth"
    });
}


// GOOGLE OAuth2.0 API
const btnGoogle = document.querySelector('#google-auth-btn');
const baseURL = window.location.origin;
const state = Math.random().toString(36).substring(2, 15);
const client = google.accounts.oauth2.initCodeClient({
    client_id: '794007100549-ii414p96k9vidkh015i9qs4ofk8pvv80.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    ux_mode: 'popup',
    redirect_uri: `${baseURL}/auth/signin`,
    state: state,
    callback: onSignIn
});
btnGoogle.addEventListener('click', async () => {
    await client.requestCode();
})

async function onSignIn(googleUser) {
    console.log(googleUser);
    try {
        const response = await fetch('/auth/sso_google', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(googleUser)
        })

        
        if (!response.ok) {
            throw new Error('No se inicio correctamente el inicio de sesion con Google')
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.log(error)
    }
}

function handleCredentialResponse(e) {
    console.log(e)
}
