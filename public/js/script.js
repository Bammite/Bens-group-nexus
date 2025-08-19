// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Récupérer les éléments du DOM
    const modal = document.getElementById('tracking-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const trackingForm = document.getElementById('tracking-form');
 
    // Fonction pour ouvrir la modale
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // Fonction pour fermer la modale
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Événements
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Fermer la modale si l'utilisateur clique en dehors de son contenu
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

});

document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.menu').classList.toggle('active');
});


document.addEventListener('DOMContentLoaded', () => {
    const openDevisModalButtons = document.querySelectorAll('.open-devis-modal');
    const devisModal = document.getElementById('devis-modal');

    openDevisModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.dataset.product;
            loadDevisForm(product);
            devisModal.style.display = 'flex';
        });
    });

    devisModal.addEventListener('click', (e) => {
        if (e.target === devisModal) {
            devisModal.style.display = 'none';
        }
    });

    async function loadDevisForm(product) {
        const modalContent = devisModal.querySelector('.modal-content');
        // modalContent.innerHTML = ''; // Clear previous content

        // Create form elements
        const form = document.createElement('form');
        form.id = 'devis-form';
        form.innerHTML = `
            <h2>Demande de devis - ${product}</h2>
            <p>Veuillez remplir le formulaire ci-dessous.</p>
            <div class="form-group">
                <label for="name">Nom:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="quantity">Quantité désirée:</label>
                <input type="number" id="quantity" name="quantity" required>
            </div>
            <div class="form-group">
                <label for="product">Produit:</label>
                <input type="text" id="product" name="product" value="${product}" readonly>
            </div>
            <button type="submit" class="cta-button">Envoyer la demande</button>
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission here
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const quantity = document.getElementById('quantity').value;

            alert(`Demande de devis envoyée pour ${quantity} unités de ${product} par ${name} (${email})`);
            devisModal.style.display = 'none';
        });

        const closeModalButton = document.createElement('span');
        closeModalButton.className = 'close-btn';
        closeModalButton.innerHTML = '&times;';
        closeModalButton.addEventListener('click', () => {
            devisModal.style.display = 'none';
        });

        modalContent.appendChild(closeModalButton);
        modalContent.appendChild(form);

    }


});

document.addEventListener('DOMContentLoaded', () => {
    // Check if the map container exists on the page
    const mapContainer = document.getElementById('company-map');
    if (mapContainer) {
        // Coordinates: 14°44'08.0"N 17°29'46.3"W -> 14.735556, -17.496194
        const lat = 14.735556;
        const lng = -17.496194;

        // Initialize the map
        const map = L.map('company-map').setView([lat, lng], 16);

        // Add a tile layer from OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a marker for the company location
        L.marker([lat, lng]).addTo(map)
            .bindPopup('<b>BENS GROUPE</b><br>Notre siège.')
            .openPopup();
    }

    // Handle main contact form submission
    // La logique de soumission est maintenant dans formulaireLogique.js
});

document.addEventListener('DOMContentLoaded', () => {
    // Éléments pour le devis de la section Négoce
    const openNegoceDevisBtns = document.querySelectorAll('.open-negoce-devis-btn');
    const devisNegoceModal = document.getElementById('devis-negoce-modal');
    const devisNegoceForm = document.getElementById('devis-negoce-form');
    const closeDevisNegoceBtn = devisNegoceModal.querySelector('.close-btn-negoce');
    const qualityOptionsContainer = document.getElementById('devis-quality-options');
    const productInput = document.getElementById('devis-product');

    // Éléments pour la confirmation
    const confirmationModal = document.getElementById('devis-confirmation-modal');
    const closeConfirmationBtn = document.getElementById('close-confirmation-modal-btn');

    // Options de qualité pour chaque produit
    const qualityOptions = {
        'Ciment': `
            <h4>Classe de résistance</h4>
            <div class="quality-group">
                <label><input type="radio" name="quality" value="CEM II/B-L 32.5R" checked> CEM II/B-L 32.5R</label>
                <label><input type="radio" name="quality" value="CEM I 42.5R"> CEM I 42.5R</label>
                <label><input type="radio" name="quality" value="CEM I 52.5R"> CEM I 52.5R</label>
            </div>`,
        'Fer a béton': `
            <h4>Type de fer</h4>
            <div class="quality-group">
                <label><input type="radio" name="quality" value="FE400 (Local)" checked> FE400 (Local)</label>
                <label><input type="radio" name="quality" value="FE500 (Importé)"> FE500 (Importé)</label>
            </div>`,
        'Gravier': `
            <h4>Type et Calibre</h4>
            <div class="quality-group">
                <label><input type="radio" name="quality" value="Basalte 3/8" checked> Basalte 3/8</label>
                <label><input type="radio" name="quality" value="Basalte 8/16"> Basalte 8/16</label>
                <label><input type="radio" name="quality" value="Calcaire 3/8"> Calcaire 3/8</label>
                <label><input type="radio" name="quality" value="Calcaire 8/16"> Calcaire 8/16</label>
            </div>`
    };

    // Ouvrir la modale de devis
    openNegoceDevisBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.dataset.product;
            productInput.value = product;
            qualityOptionsContainer.innerHTML = qualityOptions[product] || '';
            devisNegoceModal.style.display = 'flex';
        });
    });

    // Fermer la modale de devis
    const closeNegoceModal = () => {
        devisNegoceModal.style.display = 'none';
    };
    closeDevisNegoceBtn.addEventListener('click', closeNegoceModal);

    // La logique de soumission du formulaire de devis est maintenant dans formulaireLogique.js

    // Fermer la modale de confirmation
    const closeConfirmModal = () => {
        confirmationModal.style.display = 'none';
    };
    closeConfirmationBtn.addEventListener('click', closeConfirmModal);

    // Fermer les modales en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
        if (event.target === devisNegoceModal) closeNegoceModal();
        if (event.target === confirmationModal) closeConfirmModal();
    });
});
