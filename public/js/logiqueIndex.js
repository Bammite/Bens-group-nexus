// logiqueIndex.js

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
            // On appelle la nouvelle route publique pour vérifier l'existence
            const response = await fetch(`/api/data/public/check-delivery/${orderId}`);
            const result = await response.json();
            
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Erreur de vérification');
            }

            if (result.exists) {
                // Redirige vers la page de livraison protégée.
                // Si l'utilisateur n'est pas connecté, le serveur le redirigera vers la page de connexion.
                window.location.href = `/livraison/${orderId}`;
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