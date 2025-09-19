// Genera ID único
function generateID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Obtener viajes del localStorage
function getViajes() {
    return JSON.parse(localStorage.getItem('viajesApp')) || [];
}

// Guardar viajes en localStorage
function saveViajes(viajes) {
    localStorage.setItem('viajesApp', JSON.stringify(viajes));
}

// Obtener un viaje por ID
function getViaje(id) {
    return getViajes().find(v => v.id === id);
}

// Guardar viaje actual en el array de viajes
function saveViajeActual(viaje) {
    const viajes = getViajes();
    const index = viajes.findIndex(v => v.id === viaje.id);
    viajes[index] = viaje;
    saveViajes(viajes);
}
