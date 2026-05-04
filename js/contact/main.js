// mobile menu toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinksMenu = document.getElementById('navLinks');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinksMenu.classList.toggle('show');
    });
}

// dropdown functionality
const dropdown = document.getElementById('campusDropdown');

// function to switch campuses
function switchCampus(campusId) {
    // hide all campus cards
    document.querySelectorAll('.campus-card').forEach(card => {
        card.classList.remove('active');
    });
    // show selected campus
    const selectedCard = document.getElementById('campus-' + campusId);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    // update dropdown to match
    if (dropdown) {
        dropdown.value = campusId;
    }
    // update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-campus') === campusId) {
            btn.classList.add('active');
        }
    });
    // refresh maps after switching
    setTimeout(() => {
        if (campusId === 'soweto' && sowetoMap) sowetoMap.invalidateSize();
        if (campusId === 'sandton' && sandtonMap) sandtonMap.invalidateSize();
        if (campusId === 'alexandra' && alexandraMap) alexandraMap.invalidateSize();
    }, 150);
}

// when dropdown changes
if (dropdown) {
    dropdown.addEventListener('change', function() {
        switchCampus(this.value);
    });
}

// when filter buttons are clicked
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const campusId = btn.getAttribute('data-campus');
        switchCampus(campusId);
    });
});

// ===== INTERACTIVE MAPS using Leaflet =====
// Soweto map
const sowetoCoords = [-26.2674, 27.8583];
const sowetoMap = L.map('mapSoweto').setView(sowetoCoords, 15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'Map data &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(sowetoMap);
L.marker(sowetoCoords).addTo(sowetoMap).bindPopup('<b>Empowering the Nation - Soweto</b>').openPopup();

// Sandton map
const sandtonCoords = [-26.1076, 28.0567];
const sandtonMap = L.map('mapSandton').setView(sandtonCoords, 15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'Map data &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(sandtonMap);
L.marker(sandtonCoords).addTo(sandtonMap).bindPopup('<b>Empowering the Nation - Sandton</b>').openPopup();

// Alexandra map
const alexandraCoords = [-26.1031, 28.0921];
const alexandraMap = L.map('mapAlexandra').setView(alexandraCoords, 15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'Map data &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(alexandraMap);
L.marker(alexandraCoords).addTo(alexandraMap).bindPopup('<b>Empowering the Nation - Alexandra</b>').openPopup();

// fix map sizes when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        sowetoMap.invalidateSize();
        sandtonMap.invalidateSize();
        alexandraMap.invalidateSize();
    }, 200);
});
