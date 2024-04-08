(() => {
    document.addEventListener('DOMContentLoaded', () => {
        // Selectores
        const editFormModal = document.querySelector('#editformModal');

        // Variables
        let rowID = 0;
        // Actualizar la imagen en Modal de Editar
        editFormModal.querySelector('#imgInputEdit').addEventListener('change', event => {
            const file = event.target.files[0];
            if (!file) {
                console.error("No se seleccionó ningún archivo.");
                return;
            }

            const formData = new FormData();
            formData.append('imagen', file);

            activarEditLoader();
            fetch('/productos_crud/imagen_producto/' + rowID, {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(result => {
                    const imageUrl = result.data.image;
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
                const productID = this.dataset.productId;
                rowID = productID;

                await getModalImage('edit', productID);
            })
        })

        // MODAL PARA VISUALIZAR LA INFO
        const viewersButtons = document.querySelectorAll('.leerDataBtn');
        viewersButtons.forEach(leerBtn => {
            leerBtn.addEventListener('click', async function () {
                const productID = this.dataset.productId;
                await getModalImage('view', productID);
            })
        })

    })


    function updateModaImage(imageURL) {
        const containerTargetID = '#image-product-editor-container';

        clearImage('edit');

        // Crear imagen
        const image = document.createElement('img');
        image.id = 'profile-picture-img';
        image.alt = 'Profile Picture';
        image.width = '200';
        image.height = '200';
        image.classList.add('img');
        image.src = imageURL;
        document.querySelector(containerTargetID).appendChild(image);

    }

    async function getModalImage(modal, productID) {
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
            const response = await fetch('/productos_crud/imagen_producto_json/' + productID)
            if (!response.ok) {
                throw new Error('Error en el servidor');
            }

            const result = await response.json();

            if (result.data.image) {
                const imageUrl = result.data.image;

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
                icon.textContent = 'inventory_2';
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
