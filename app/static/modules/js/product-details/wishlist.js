
function envioDeInformacion(checkbox) {
    var isChecked = checkbox.checked;
    var dataId = checkbox.getAttribute('data-id'); // Obtiene el valor del atributo data-id
    var dataAnother = checkbox.getAttribute('data-another'); // Obtiene el valor del another
    if (isChecked) {
        console.log("El checkbox está activado");
    } else {
        console.log("El checkbox está desactivado");
    }
    console.log("Valor de data-id:", dataId); // Imprime el valor de data-id en la consola
    console.log("Valor de data-id:", dataAnother); // Imprime el valor de data-another en la consola
}
