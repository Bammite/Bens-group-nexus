document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let trips = [];
    
    // Éléments du DOM
    const addTripBtn = document.querySelectorAll('.addTripBtn');
    const tripModal = document.getElementById('tripModal');
    const closeButtons = document.querySelectorAll('.close');
    const tripForm = document.getElementById('tripForm');
    const tripsList = document.getElementById('tripsList');
    const historyList = document.getElementById('historyList');
    const countOngoing = document.getElementById('countOngoing');
    const countHistory = document.getElementById('countHistory');
    
    // Initialisation des cartes
    let departureMap, arrivalMap;
    let departureMarker, arrivalMarker;
    
    // Charger les données initiales
    loadSampleTrips();
    
    // Événements
    addTripBtn.forEach(button => button.addEventListener('click', openTripModal));
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            tripModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === tripModal) {
            tripModal.style.display = 'none';
        }
    });
    
    tripForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewTrip();
    });
    
    function loadSampleTrips() {
        // Exemples de trajets
        trips = [
            {
                id: 1,
                missionName: "Livraison Paris-Lyon",
                date: "2023-06-15T08:00",
                departure: { lat: 48.8566, lng: 2.3522, address: "Paris, France" },
                arrival: { lat: 45.7640, lng: 4.8357, address: "Lyon, France" },
                status: "en cours"
            },
            {
                id: 2,
                missionName: "Transport Marseille-Nice",
                date: "2023-06-16T10:30",
                departure: { lat: 43.2965, lng: 5.3698, address: "Marseille, France" },
                arrival: { lat: 43.7102, lng: 7.2620, address: "Nice, France" },
                status: "terminé"
            }
        ];
        
        renderTrips();
    }
    
    function renderTrips() {
        const ongoingTrips = trips.filter(trip => trip.status === "en cours");
        const historyTrips = trips.filter(trip => trip.status !== "en cours");
        
        countOngoing.textContent = ongoingTrips.length;
        countHistory.textContent = historyTrips.length;
        
        // Afficher les trajets en cours
        if (ongoingTrips.length > 0) {
            tripsList.innerHTML = '';
            ongoingTrips.forEach(trip => {
                const tripCard = createTripCard(trip);
                tripsList.appendChild(tripCard);
            });
        }
        
        // Afficher l'historique
        if (historyTrips.length > 0) {
            historyList.innerHTML = '';
            historyTrips.forEach(trip => {
                const tripCard = createTripCard(trip);
                historyList.appendChild(tripCard);
            });
        }
    }
    
    function createTripCard(trip) {
        const tripCard = document.createElement('div');
        tripCard.className = 'trip-card';
        tripCard.setAttribute('data-id', trip.id);
        
        tripCard.innerHTML = `
            <h3>${trip.missionName}</h3>
            <div class="trip-info">
                <p class="${trip.status}"><strong>Statut:</strong> ${formatStatus(trip.status)}</p>
                <p><strong>Date:</strong> ${formatDate(trip.date)}</p>
            </div>
        `;
        
        tripCard.addEventListener('click', function() {
            window.location.href = `../livraison.html?id=${trip.id}`;
        });
        
        return tripCard;
    }
    
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
    
    function formatStatus(status) {
        const statusMap = {
            'en cours': 'En cours',
            'terminé': 'Terminé',
            'annulé': 'Annulé'
        };
        return statusMap[status] || status;
    }
    
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
    
    function addNewTrip() {
        const missionName = document.getElementById('missionName').value;
        const departureLat = document.getElementById('departureLat').value;
        const departureLng = document.getElementById('departureLng').value;
        const departureAddress = document.getElementById('departureAddress').value;
        const arrivalLat = document.getElementById('arrivalLat').value;
        const arrivalLng = document.getElementById('arrivalLng').value;
        const arrivalAddress = document.getElementById('arrivalAddress').value;
        
        const newTrip = {
            id: trips.length > 0 ? Math.max(...trips.map(t => t.id)) + 1 : 1,
            missionName,
            date: new Date().toISOString(),
            departure: {
                lat: parseFloat(departureLat),
                lng: parseFloat(departureLng),
                address: departureAddress
            },
            arrival: {
                lat: parseFloat(arrivalLat),
                lng: parseFloat(arrivalLng),
                address: arrivalAddress
            },
            status: "en cours"
        };
        
        trips.push(newTrip);
        renderTrips();
        tripModal.style.display = 'none';
        tripForm.reset();
        
        if (departureMarker) departureMap.removeLayer(departureMarker);
        if (arrivalMarker) arrivalMap.removeLayer(arrivalMarker);
    }
});


