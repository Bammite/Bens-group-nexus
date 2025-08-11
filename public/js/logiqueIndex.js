// logiqueIndex.js

import { getOpsLigneTransport } from './Data.js';


document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('tracking-form');
    const submitButton = trackingForm.querySelector('button[type="submit"]');
    
    trackingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('order-id').value.trim();
        
        if (!orderId) {
            alert('Veuillez entrer un numéro de commande');
            return;
        }
        
        // Afficher un indicateur de chargement
        submitButton.disabled = true;
        submitButton.textContent = 'Recherche en cours...';
        
        try {
            const transports = await getOpsLigneTransport({
                field: "ID_Ligne_Transport", 
                value: orderId
            });
            
            if (transports.length > 0) {
                window.location.href = `livraison.html?ID_Ligne_Transport=${encodeURIComponent(orderId)}`;
            } else {
                alert('Numéro de commande introuvable. Veuillez vérifier et réessayer.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion. Veuillez réessayer.');
        } finally {
            // Réactiver le bouton
            submitButton.disabled = false;
            submitButton.textContent = 'Afficher sur la carte';
        }
    });
});