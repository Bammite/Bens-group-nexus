import { createDevis, createFormulaireContact } from './Data.js';

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
                caraquteristique: formData.get('quality'),
                contact: formData.get('contact'),
                livraion: document.getElementById('devis-livraison').checked,
                date: new Date()
            };

            const devisId = await createDevis(devisData);

            if (devisId) {
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
                dateCreation: new Date()
            };

            const contactId = await createFormulaireContact(contactData);

            if (contactId) {
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