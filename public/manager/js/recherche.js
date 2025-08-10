// Ajoutez ces variables en haut avec les autres
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const statusFilter = document.getElementById('statusFilter');
const dateFilter = document.getElementById('dateFilter');
const applyFilterBtn = document.getElementById('applyFilterBtn');

// Ajoutez ces événements dans DOMContentLoaded
searchInput.addEventListener('input', function() {
    if (this.value.length > 2 || this.value.length === 0) {
        filterTrips();
    }
});

searchBtn.addEventListener('click', filterTrips);
applyFilterBtn.addEventListener('click', filterTrips);

// Ajoutez cette nouvelle fonction
function filterTrips() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const dateValue = dateFilter.value;
    
    const filteredTrips = trips.filter(trip => {
        // Filtre par recherche texte
        const matchesSearch = searchTerm === '' || 
            trip.missionName.toLowerCase().includes(searchTerm) ||
            trip.departure.address.toLowerCase().includes(searchTerm) ||
            trip.arrival.address.toLowerCase().includes(searchTerm);
        
        // Filtre par statut
        const matchesStatus = statusValue === 'all' || trip.status === statusValue;
        
        // Filtre par date
        let matchesDate = true;
        if (dateValue !== 'all') {
            const tripDate = new Date(trip.date);
            const today = new Date();
            
            switch(dateValue) {
                case 'today':
                    matchesDate = tripDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay());
                    matchesDate = tripDate >= startOfWeek;
                    break;
                case 'month':
                    matchesDate = tripDate.getMonth() === today.getMonth() && 
                                 tripDate.getFullYear() === today.getFullYear();
                    break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    renderFilteredTrips(filteredTrips);
}

function renderFilteredTrips(filteredTrips) {
    const ongoingTrips = filteredTrips.filter(trip => trip.status === "en cours");
    const historyTrips = filteredTrips.filter(trip => trip.status !== "en cours");
    
    countOngoing.textContent = ongoingTrips.length;
    countHistory.textContent = historyTrips.length;
    
    // Afficher les trajets en cours filtrés
    if (ongoingTrips.length > 0) {
        tripsList.innerHTML = '';
        ongoingTrips.forEach(trip => {
            const tripCard = createTripCard(trip);
            tripsList.appendChild(tripCard);
        });
    } else {
        tripsList.innerHTML = '<div class="ElementParDefaut">Aucun résultat trouvé</div>';
    }
    
    // Afficher l'historique filtré
    if (historyTrips.length > 0) {
        historyList.innerHTML = '';
        historyTrips.forEach(trip => {
            const tripCard = createTripCard(trip);
            historyList.appendChild(tripCard);
        });
    } else {
        historyList.innerHTML = '<div class="ElementParDefaut">Aucun résultat trouvé</div>';
    }
}

// Modifiez la fonction renderTrips pour utiliser filterTrips
function renderTrips() {
    filterTrips(); // Au lieu de l'ancienne implémentation
}