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

    // --- Form Submission Logic ---
    
    // Reception Form
    forms.reception.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents page reload
        const checkbox = e.target.querySelector('#reception-confirm');
        const fileInput = e.target.querySelector('#reception-image');
        
        console.log("--- Confirmation de Réception ---");
        console.log(`Colis bien reçu : ${checkbox.checked}`);
        if (fileInput.files.length > 0) {
            console.log(`Image fournie : ${fileInput.files[0].name}`);
        } else {
            console.log("Image fournie : Non");
        }
        
        alert("Confirmation envoyée !");
        closeModal(modals.reception);
    });

    // Problem Report Form
    forms.probleme.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents page reload
        const description = e.target.querySelector('#probleme-description').value;
        
        console.log("--- Signalement de Problème ---");
        console.log(`Description : ${description}`);
        
        alert("Signalement envoyé. Nous vous contacterons bientôt.");
        closeModal(modals.probleme);
    });

    // --- Initialisation ---
    await checkLoginStatus();

    setupAuthenticatedClick(buttons.images, modals.images);
    setupAuthenticatedClick(buttons.justificatif, modals.justificatif);
    setupAuthenticatedClick(buttons.reception, modals.reception);
    setupAuthenticatedClick(buttons.probleme, modals.probleme);
});