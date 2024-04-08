(() => {
    document.addEventListener('DOMContentLoaded', () => {
        // Selectores
        const editFormModal = document.querySelector('#editformModal');
        //const editIDUsuarioInput = document.querySelector('#editformModal #editIDUsuario');




        // Variables
        //let rowID = 0;
        //let rowID = editIDUsuarioInput.value;
        //console.log("ID de usuario seleccionado:", rowID);
        // Actualizar la imagen en Modal de Editar
        editFormModal.querySelector('#imgInputEdit').addEventListener('change', event => {
            const editIDUsuarioInput = document.querySelector('#editformModal #editIDUsuario');
            const file = event.target.files[0];
            if (!file) {
                console.error("No se seleccionó ningún archivo.");
                return;
            }

            const formData = new FormData();
            formData.append('imagen', file);
            let rowID = editIDUsuarioInput.value;
            activarEditLoader();
            console.log("ID de usuario seleccionado:", rowID);
            fetch('/usuarios_crud/imagen_usuario/' + rowID, {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const imageUrl = `data:image/png;base64,${data.image_base64}`;
                    updateModaImage(imageUrl);
                })
                .catch(error => console.error("Error al actualizar la imagen:", error))
                .finally(() => {
                    desactivarEditLoader();
                });
        });

        // MODAL PARA EDITAR
        const editButtons = document.querySelectorAll('.editDataBtn');
        editButtons.forEach(editBtn => {
            editBtn.addEventListener('click', async function () {
                const id_usuario = this.dataset.usuarioId;
                await getModalImage('edit', id_usuario);
            })
        })

        // MODAL PARA VISUALIZAR LA INFO
        const viewersButtons = document.querySelectorAll('.leerDataBtn');
        viewersButtons.forEach(leerBtn => {
            leerBtn.addEventListener('click', async function () {
                const id_usuario = this.dataset.usuarioId;
                await getModalImage('view', id_usuario);
            })
        })

    })


    function updateModaImage(image_base64) {
        const containerTargetID = '#image-product-editor-container';

        clearImage('edit');

        // Crear imagen
        const image = document.createElement('img');
        image.id = 'profile-picture-img';
        image.alt = 'Profile Picture';
        image.width = '200';
        image.height = '200';
        image.classList.add('img');
        image.src = image_base64;
        document.querySelector(containerTargetID).appendChild(image);

    }

    async function getModalImage(modal, id_usuario) {
        let containerTargetID = '';
        switch (modal) {
            case 'edit':
                containerTargetID = '#image-product-editor-container'
                activarEditLoader();
                break;
            case 'view':
                containerTargetID = '#image-product-viewer-container'
                activarViewLoader();
                break;
        }


        clearImage(modal);
        

        try {
            const response = await fetch('/usuarios_crud/imagen_usuario_base64/' + id_usuario)
            if (!response.ok) {
                throw new Error('Error en el servidor');
            }

            const result = await response.json();

            if (result.image_base64 && result.filename) {
                const imageUrl = `data:image/png;base64,${result.image_base64}`;

                // Crear imagen
                const image = document.createElement('img');
                image.id = 'profile-picture-img';
                image.alt = 'Profile Picture';
                image.width = '200';
                image.height = '200';
                image.classList.add('img');
                image.src = imageUrl;
                document.querySelector(containerTargetID).appendChild(image);
            } else {
                const icon = document.createElement('i');
                icon.classList.add('material-icons', 'person-icon-profile-picture-modal');
                icon.setAttribute('aria-label', 'Profile picture');
                icon.id = 'profile-picture-icon';
                icon.textContent = 'person';
                document.querySelector(containerTargetID).appendChild(icon);
            }
        } catch (error) {
            console.log(error);
        } finally {
            desactivarEditLoader();
            desactivarViewLoader();
        }
    }

    function clearImage(modal) {
        let containerTargetID = '';
        switch (modal) {
            case 'edit':
                containerTargetID = '#image-product-editor-container'
                break;
            case 'view':
                containerTargetID = '#image-product-viewer-container'
                break;
        }
        const container = document.querySelector(containerTargetID);
        const image = container.querySelector('#profile-picture-img');
        const icon = container.querySelector('#profile-picture-icon');
        if (image) {
            container.removeChild(image);
        } else if (icon) {
            container.removeChild(icon);
        }
    }

    function activarEditLoader() {
        document.querySelector('#edit-product-modal-loader').style.display = 'grid'
    }
    function desactivarEditLoader() {
        document.querySelector('#edit-product-modal-loader').style.display = 'none'
    }

    function activarViewLoader() {
        document.querySelector('#viewer-product-modal-loader').style.display = 'grid'
    }
    function desactivarViewLoader() {
        document.querySelector('#viewer-product-modal-loader').style.display = 'none'
    }
})();
