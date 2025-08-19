document.addEventListener('DOMContentLoaded', () => {
    // --- Éléments du DOM ---
    const optionsMenuBtn = document.getElementById('options-menu-btn');
    const optionsDropdown = document.getElementById('options-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Éléments du tableau de bord ---
    const tripsListContainer = document.getElementById('tripsList');
    const historyListContainer = document.getElementById('historyList');
    const countOngoing = document.getElementById('countOngoing');
    const countHistory = document.getElementById('countHistory');

    // --- Éléments des filtres ---
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const searchBtn = document.getElementById('searchBtn');

    // --- Stockage des données ---
    let allFetchedTrips = [];

    // --- Logique du menu d'options ---
    if (optionsMenuBtn) {
        optionsMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche le clic de se propager au document
            const isVisible = optionsDropdown.style.display === 'block';
            optionsDropdown.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Fermer le menu si l'utilisateur clique en dehors
    document.addEventListener('click', (e) => {
        if (optionsDropdown && optionsDropdown.style.display === 'block') {
            if (!optionsMenuBtn.contains(e.target)) {
                optionsDropdown.style.display = 'none';
            }
        }
    });

    // --- Logique de déconnexion ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/api/logout', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                    window.location.href = '/authentification.html';
                } else {
                    alert('Erreur lors de la déconnexion. Veuillez réessayer.');
                }
            } catch (error) {
                console.error('Erreur réseau lors de la déconnexion:', error);
                alert('Une erreur réseau est survenue.');
            }
        });
    }

    // --- Fonction principale pour charger et afficher les livraisons ---
    async function loadAndDisplayTrips() {
        tripsListContainer.innerHTML = '<p>Chargement des livraisons...</p>';
        historyListContainer.innerHTML = '<p>Chargement de l\'historique...</p>';
        try {
            const response = await fetch('/api/my-deliveries');
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/authentification.html';
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'La réponse du serveur n\'est pas OK');
            }
            allFetchedTrips = await response.json();
            // Affichage initial avec tous les voyages
            filterAndDisplayTrips();
        } catch (error) {
            console.error("Erreur lors du chargement des livraisons:", error);
            tripsListContainer.innerHTML = '<p class="ElementParDefaut error">Impossible de charger les livraisons.</p>';
            historyListContainer.innerHTML = '<p class="ElementParDefaut error">Impossible de charger l\'historique.</p>';
        }
    }

    // --- Logique de filtrage ---
    function filterAndDisplayTrips() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const dateValue = dateFilter.value;

        const filteredTrips = allFetchedTrips.filter(trip => {
            // 1. Filtre par terme de recherche
            const searchFields = {
                refLigne: trip.Ref_Ligne_Transport?.toLowerCase() || '',
                lieuChargement: trip.Lieu_Chargement?.toLowerCase() || '',
                lieuDechargement: trip.Lieu_Dechargement?.toLowerCase() || '',
                refConteneur: trip.Ref_Conteneur?.toLowerCase() || '',
                refBooking: trip.Ref_Booking?.toLowerCase() || '',
                tracteur: trip.Tracteur?.toLowerCase() || '',
                driver: trip.Driver?.toLowerCase() || '',
                transporteur: trip.Transporteur?.toLowerCase() || '',
                natureTransport: trip.Nature_Transport?.toLowerCase() || ''
            };

            const matchesSearch = searchTerm === '' || Object.values(searchFields).some(field => field.includes(searchTerm));

            // 2. Filtre par statut
            const tripStatus = trip.Statut_Trajet?.toLowerCase() || 'inconnu';
            const matchesStatus = statusValue === 'all' || tripStatus === statusValue;

            // 3. Filtre par date
            let matchesDate = true;
            if (dateValue !== 'all' && trip.Date_Chargement) {
                const parts = trip.Date_Chargement.split('/');
                if (parts.length === 3) {
                    const tripDate = new Date(parts[2], parts[1] - 1, parts[0]);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    switch (dateValue) {
                        case 'today':
                            matchesDate = tripDate.getTime() === today.getTime();
                            break;
                        case 'week':
                            const firstDayOfWeek = new Date(today);
                            const dayOfWeek = today.getDay();
                            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                            firstDayOfWeek.setDate(diff);
                            matchesDate = tripDate >= firstDayOfWeek;
                            break;
                        case 'month':
                            matchesDate = tripDate.getMonth() === today.getMonth() &&
                                tripDate.getFullYear() === today.getFullYear();
                            break;
                    }
                } else {
                    matchesDate = false;
                }
            }

            return matchesSearch && matchesStatus && matchesDate;
        });

        // Séparer les voyages filtrés en "en cours" et "historique"
        const ongoingTrips = [];
        const historyTrips = [];

        filteredTrips.forEach(trip => {
            const status = trip.Statut_Trajet ? trip.Statut_Trajet.toLowerCase() : 'inconnu';
            if (status === 'en cours') {
                ongoingTrips.push(trip);
            } else {
                historyTrips.push(trip);
            }
        });

        // Afficher les livraisons en cours et l'historique
        displayTrips(ongoingTrips, tripsListContainer, true);
        displayTrips(historyTrips, historyListContainer, false);

        // Mettre à jour les compteurs
        countOngoing.textContent = ongoingTrips.length;
        countHistory.textContent = historyTrips.length;
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
                `;
                
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
        cardLink.href = `/livraison/${trip.id}`;
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

    // Écouteurs d'événements pour les filtres
    searchInput.addEventListener('input', () => {
        filterAndDisplayTrips();
    });

    statusFilter.addEventListener('change', () => {
        filterAndDisplayTrips();
    });

    dateFilter.addEventListener('change', () => {
        filterAndDisplayTrips();
    });

    applyFilterBtn.addEventListener('click', () => {
        filterAndDisplayTrips();
    });

    searchBtn.addEventListener('click', () => {
        filterAndDisplayTrips();
    });

    // Charge les livraisons au chargement de la page
    loadAndDisplayTrips();
});