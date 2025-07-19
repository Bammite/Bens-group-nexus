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