// Variables
const toggle = {
    dataId: '',
    dataAnother: '',
}

//funciones 
function envioDeInformacion(checkbox) {
    var isChecked = checkbox.checked;
    toggle.dataId = parseInt(checkbox.getAttribute('data-id')); // )Obtiene el valor del atributo data-id
    toggle.dataAnother = parseInt(checkbox.getAttribute('data-another')); // Obtiene el valor del another
    
    if (isChecked) {
        console.log("El checkbox está activado");
    } else {
        console.log("El checkbox está desactivado");
    }
    fetch('/tienda/like', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(toggle)
    })
    .then(function (response) {
        return response.json();
    }).then(function (results) {
        console.log(results);
    })
    .catch(function (error) {
        console.log(error);
    });

    console.log("Valor de data-id:", toggle); // Imprime el valor de data-id en la consola
}
