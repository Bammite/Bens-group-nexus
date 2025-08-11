document.addEventListener('DOMContentLoaded', () => {
    const tripsListContainer = document.getElementById('tripsList');
    const historyListContainer = document.getElementById('historyList');
    const countOngoing = document.getElementById('countOngoing');
    const countHistory = document.getElementById('countHistory');
    const addTripButtons = document.querySelectorAll('.addTripBtn');
    const tripModal = document.getElementById('tripModal');
    const closeModal = document.querySelector('.modal .close');

    let departureMap, arrivalMap;
    let departureMarker, arrivalMarker;
    // --- Logique du Modal (pour ajouter une livraison) ---
       function openTripModal() {
        tripModal.style.display = 'block';
        
        // Initialiser les cartes
        initDepartureMap();
        initArrivalMap();
    }
    
    function initDepartureMap() {
        if (departureMap) departureMap.remove();
        
        departureMap = L.map('departureMap').setView([14.7850, -17.3145], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(departureMap);
        
        departureMap.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            document.getElementById('departureLat').value = lat;
            document.getElementById('departureLng').value = lng;
            
            if (departureMarker) departureMap.removeLayer(departureMarker);
            
            departureMarker = L.marker([lat, lng]).addTo(departureMap)
                .bindPopup("Point de départ").openPopup();
            
            getAddressFromCoordinates(lat, lng, 'departureAddress');
        });
    }
    
    function initArrivalMap() {
        if (arrivalMap) arrivalMap.remove();
        
        arrivalMap = L.map('arrivalMap').setView([14.7850, -17.3145], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(arrivalMap);
        
        arrivalMap.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            document.getElementById('arrivalLat').value = lat;
            document.getElementById('arrivalLng').value = lng;
            
            if (arrivalMarker) arrivalMap.removeLayer(arrivalMarker);
            
            arrivalMarker = L.marker([lat, lng]).addTo(arrivalMap)
                .bindPopup("Point d'arrivée").openPopup();
            
            getAddressFromCoordinates(lat, lng, 'arrivalAddress');
        });
    }
    
    function getAddressFromCoordinates(lat, lng, elementId) {
        // Simulation - en réel, utiliser Mapbox ou Nominatim
        document.getElementById(elementId).value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }



    addTripButtons.forEach(btn => btn.addEventListener('click', openTripModal));

    closeModal.addEventListener('click', () => {
        tripModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == tripModal) {
            tripModal.style.display = 'none';
        }
    });

    // --- Fonction principale pour charger et afficher les livraisons ---
    async function loadAndDisplayTrips() {
        tripsListContainer.innerHTML = '<p>Chargement des livraisons...</p>';
        historyListContainer.innerHTML = '<p>Chargement de l\'historique...</p>';

        try {
            const response = await fetch('/api/my-deliveries');
            if (!response.ok) {
                if (response.status === 401) {
                    // L'utilisateur n'est pas authentifié, on le redirige.
                    window.location.href = '/authentification.html';
                    return; // Arrêter l'exécution
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'La réponse du serveur n\'est pas OK');
            }
            const allTrips = await response.json();

            const ongoingTrips = [];
            const historyTrips = [];
            console.log(allTrips);
            allTrips.forEach(trip => {
                const status = trip.Statut_Trajet ? trip.Statut_Trajet.toLowerCase() : 'inconnu';
                if (status === 'en cours' || status === 'en attente de confirmation') {
                    ongoingTrips.push(trip);
                } else { // 'livrée', 'annulé'
                    historyTrips.push(trip);
                }
            });

            countOngoing.textContent = ongoingTrips.length;
            countHistory.textContent = historyTrips.length;

            displayTrips(ongoingTrips, tripsListContainer, true);
            displayTrips(historyTrips, historyListContainer, false);

        } catch (error) {
            console.error("Erreur lors du chargement des livraisons:", error);
            tripsListContainer.innerHTML = '<p class="ElementParDefaut error">Impossible de charger les livraisons.</p>';
            historyListContainer.innerHTML = '<p class="ElementParDefaut error">Impossible de charger l\'historique.</p>';
        }
    }

    /**
     * Affiche une liste de livraisons dans un conteneur.
     * @param {Array<object>} trips - Le tableau des objets de livraison.
     * @param {HTMLElement} container - L'élément conteneur.
     * @param {boolean} isOngoing - Indique si la liste est pour les livraisons en cours.
     */
    function displayTrips(trips, container, isOngoing) {
        container.innerHTML = '';

        if (trips.length === 0) {
            const defaultEl = document.createElement('div');
            defaultEl.className = 'ElementParDefaut';
            if (isOngoing) {
                defaultEl.innerHTML = `
                   <p>Vous n'avez aucune livraison en cours</p>
                   <br>
                   <button class="btn-primary addTripBtn">Initialiser une livraison</button>
                `;
                defaultEl.querySelector('.addTripBtn').addEventListener('click', openTripModal);
            } else {
                defaultEl.innerHTML = '<p>Historique vide</p>';
            }
            container.appendChild(defaultEl);
            return;
        }

        trips.forEach(trip => {
            const tripCard = createTripCard(trip);
            container.appendChild(tripCard);
        });
    }

    /**
     * Crée une carte HTML pour une seule livraison.
     * @param {object} trip - L'objet de données de la livraison.
     * @returns {HTMLElement} L'élément de la carte (une balise <a>).
     */
    function createTripCard(trip) {
        const cardLink = document.createElement('a');
        cardLink.href = `livraison.html?ID_Ligne_Transport=${trip.id}`;
        cardLink.className = 'trip-card';

        // Create elements for the card content
        const missionName = document.createElement('h3');
        missionName.textContent = trip.Ref_Ligne_Transport || 'Livraison sans nom';

        const tripInfo = document.createElement('div');
        tripInfo.className = 'trip-info';

        const statusText = document.createElement('p');
        statusText.className = `status ${trip.Statut_Trajet? trip.Statut_Trajet.toLowerCase().replace(' ', '-') : 'inconnu'}`;
        statusText.innerHTML = `<strong>Statut:</strong> ${trip.Statut_Trajet || 'Inconnu'}`;

        const dateText = document.createElement('p');
        // Utilise la Date_Chargement ou une date par défaut
        // Le format "DD/MM/YYYY" doit être converti en "MM/DD/YYYY" pour new Date()
        const dateString = trip.Date_Chargement ? trip.Date_Chargement.split('/').reverse().join('/') : null;
        const tripDate = dateString ? new Date(dateString) : new Date();
        const formattedDate = tripDate.toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        dateText.innerHTML = `<strong>Date:</strong> ${formattedDate}`;

        // Append elements to the card
        tripInfo.appendChild(statusText);
        tripInfo.appendChild(dateText);

        cardLink.appendChild(missionName);
        cardLink.appendChild(tripInfo);

        return cardLink;
    }

    // Charge les livraisons au chargement de la page
    loadAndDisplayTrips();
});