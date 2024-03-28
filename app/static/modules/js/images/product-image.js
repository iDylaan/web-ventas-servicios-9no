(() => {
    document.addEventListener('DOMContentLoaded', () => {
        // Selectores

        // MODAL PARA EDITAR
        const editButtons = document.querySelectorAll('.editDataBtn');
        editButtons.forEach(editBtn => {
            editBtn.addEventListener('click', async function () {
                const productID = this.dataset.productId;

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
            const response = await fetch('/productos_crud/imagen_producto_base64/' + productID)
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
