document.addEventListener('DOMContentLoaded', () => {
    // --- GESTION DU FORMULAIRE DE DEVIS NÉGOCE ---
    const devisNegoceForm = document.getElementById('devis-negoce-form');
    if (devisNegoceForm) {
        devisNegoceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = devisNegoceForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            const formData = new FormData(devisNegoceForm);
            const devisData = {
                produit: formData.get('product'),
                quantité: formData.get('quantity'),
                caracteristique: formData.get('quality'),
                contact: formData.get('contact'),
                livraison: document.getElementById('devis-livraison').checked
                // La date sera ajoutée côté serveur
            };

            const response = await fetch('/api/data/public/devis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devisData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                document.getElementById('devis-negoce-modal').style.display = 'none';
                document.getElementById('devis-confirmation-modal').style.display = 'flex';
                devisNegoceForm.reset();
            } else {
                alert("Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.");
            }

            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer la demande';
        });
    }

    // --- GESTION DU FORMULAIRE DE CONTACT PRINCIPAL ---
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            const formData = new FormData(contactForm);
            const contactData = {
                nom: formData.get('name'),
                mail: formData.get('email'),
                sujet: formData.get('subject'),
                message: formData.get('message'),
                // La date sera ajoutée côté serveur
            };

            const response = await fetch('/api/data/public/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Fermer le formulaire de contact s'il est dans une modale, ou simplement afficher la confirmation
                document.getElementById('devis-confirmation-modal').style.display = 'flex';
                console.log('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
                contactForm.reset();
            } else {
                alert("Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.");
            }

            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer le Message';
        });
    }
});