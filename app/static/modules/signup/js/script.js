// Selectors | Selectores

const usernameImput = document.querySelector("#username")
const emailImput = document.querySelector("#email")
const passwordImput = document.querySelector("#password")
const confirmpasswordImput = document.querySelector("#confirm_password")
const btnSingup = document.querySelector("#btnSingup")
const formsignup = document.querySelector("#form-signup")
const formErrorsAlert = document.querySelector("#form_error")
//const confirmPasswordErrorAlert = document.querySelector("confirm_password_error");


// Event Listener / Evento Listeners
eventListeners();

function eventListeners() {
	formsignup.addEventListener('submit', (e) => e.preventDefault());

	// Receive the values of the form fields / Recibir los valores de los campos del formulario
	usernameImput.addEventListener("input", (e) => (formModel.username = e.target.value))
	emailImput.addEventListener("input", (e) => (formModel.email = e.target.value))
	passwordImput.addEventListener("input", (e) => (formModel.password = e.target.value))
	confirmpasswordImput.addEventListener("input", (e) => (formModel.confirm_password = e.target.value))

	//confirmPasswordErrorAlert.addEventListener('blur', (e) => ())

	btnSingup.addEventListener("click", signup)
}

// Variables
const formModel = {
	username: "",
	email: "",
	password: "",
	confirm_password: "",
}
const formRules = {
	confirm_password: {
		valid: false,
		error_message: ''
	}
}

// Funciones
async function signup() {
	const validForm = validarFormulario()

	if (validForm) {
		try {
			const response = await fetch("/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formModel),
			})

			console.log(response)
			if (!response.ok) {
				throw new Error("Ocurrio un error inesperado en el servidor")
			}

			const result = await response.json()
			console.log(result)
			if (result.success) {
				// Mostrar mensaje de éxito
				mostrarMensaje("success", "¡Registro exitoso! Felicidades a horas eres parte de nosotros.");
				// Redirigir después de un tiempo (opcional)
				setTimeout(() => {
					//window.location.href = indexURL;
				}, 4000);
			} else {
				throw new Error(result.error.msg)
			}
		} catch (error) {
			gestionarErrores([error])
		}
	}
}

function validarFormulario() {
	const errors = []
	const { username, email, password, confirm_password } = formModel

	if (!username) errors.push("Falta el nombre de usuario")
	if (!email) errors.push("Falta el correo electronico")
	if (!password) errors.push("Falta la contraseña")
	if (!confirm_password) errors.push("Falta confirmar la contraseña")

	// Si faltan campos no proseguir con las validaciones
	if (errors.length > 0) {
		gestionarErrores(errors)
		return
	}

	if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
		errors.push("El correo electronico no es valido")
	}

	const incorrectPasswordLenght = password.length < 8
	if (incorrectPasswordLenght) errors.push("La contraseña debe ser de minimo 8 caracteres")

	// Validar que las contrasenias coincidan
	if (password !== confirm_password && !incorrectPasswordLenght) errors.push("Las contraseñas no coinciden")

	gestionarErrores(errors)

	return errors.length === 0
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
