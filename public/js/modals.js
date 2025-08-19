document.addEventListener('DOMContentLoaded', async () => {

    let isLoggedIn = false;

    // --- Element Selection ---
    const buttons = {
        images: document.getElementById('btn-images'),
        justificatif: document.getElementById('btn-justificatif'),
        reception: document.getElementById('btn-reception'),
        probleme: document.getElementById('btn-probleme')
    };

    const modals = {
        images: document.getElementById('modal-images'),
        justificatif: document.getElementById('modal-justificatif'),
        reception: document.getElementById('modal-reception'),
        probleme: document.getElementById('modal-probleme'),
        authRequired: document.getElementById('modal-auth-required')
    };

    const forms = {
        reception: document.getElementById('form-reception'),
        probleme: document.getElementById('form-probleme')
    };

    const allCloseButtons = document.querySelectorAll('.close-modal');
    const allOverlays = document.querySelectorAll('.modal-overlay');

    // --- Fonctions ---
    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/session-info');
            const sessionData = await response.json();
            isLoggedIn = sessionData.isLoggedIn;
        } catch (error) {
            console.error("Impossible de vérifier l'état de la session:", error);
            isLoggedIn = false;
        }
    };

    // --- Functions ---
    const openModal = (modal) => {
        if (modal) modal.classList.add('visible');
    };

    const closeModal = (modal) => {
        if (modal) modal.classList.remove('visible');
    };

    // --- Event Listeners ---

    const setupAuthenticatedClick = (button, modal) => {
        if (!button) return;
        button.addEventListener('click', () => {
            if (isLoggedIn) {
                openModal(modal);
            } else {
                openModal(modals.authRequired);
            }
        });
    };

    // Close modals using the 'X' button
    allCloseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close modals by clicking on the overlay background
    allOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            // Only close if the click is on the overlay itself, not the content
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // --- Get Delivery ID from URL ---
    const pathParts = window.location.pathname.split('/');
    const idLigneTransport = pathParts[pathParts.length - 1];

    // --- Form Submission Logic ---
    
    // Reception Form
    if (forms.reception) {
        forms.reception.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevents page reload
            const checkbox = e.target.querySelector('#reception-confirm');
            
            if (!checkbox.checked) {
                alert("Veuillez cocher la case pour confirmer la réception.");
                return;
            }

            try {
                const response = await fetch('/api/data/confirm-reception', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idLigneTransport: idLigneTransport })
                });

                const result = await response.json();

                if (result.success) {
                    alert("Confirmation envoyée ! Le statut de la livraison a été mis à jour.");
                    closeModal(modals.reception);
                    // Rafraîchir la page pour voir le nouveau statut
                    window.location.reload();
                } else {
                    throw new Error(result.error || 'Une erreur est survenue.');
                }

            } catch (error) {
                console.error("Erreur lors de la confirmation de réception:", error);
                alert(`Erreur: ${error.message}`);
            }
        });
    }

    // Problem Report Form
    if (forms.probleme) {
        forms.probleme.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevents page reload
            const descriptionInput = e.target.querySelector('#probleme-description');
            const description = descriptionInput.value;
            
            if (!description.trim()) {
                alert("Veuillez décrire le problème.");
                return;
            }

            try {
                const response = await fetch('/api/data/report-problem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        idLigneTransport: idLigneTransport,
                        description: description 
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert("Signalement envoyé. Nous vous contacterons bientôt.");
                    descriptionInput.value = ''; // Vider le champ
                    closeModal(modals.probleme);
                } else {
                    throw new Error(result.error || 'Une erreur est survenue.');
                }

            } catch (error) {
                console.error("Erreur lors du signalement du problème:", error);
                alert(`Erreur: ${error.message}`);
            }
        });
    }

    // --- Initialisation ---
    await checkLoginStatus();

    setupAuthenticatedClick(buttons.images, modals.images);
    setupAuthenticatedClick(buttons.justificatif, modals.justificatif);
    setupAuthenticatedClick(buttons.reception, modals.reception);
    setupAuthenticatedClick(buttons.probleme, modals.probleme);
});