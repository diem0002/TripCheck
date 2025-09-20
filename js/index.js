const viajesContainer = document.getElementById('viajes-container');
const nuevoBtn = document.getElementById('nuevo-viaje-btn');
const modal = document.getElementById('modal');
const cerrarModal = document.getElementById('cerrar-modal');
const guardarViaje = document.getElementById('guardar-viaje');

function renderViajes() {
    viajesContainer.innerHTML = '';
    const viajes = getViajes();
    viajes.forEach(viaje => {
        const card = document.createElement('div');
        card.className = 'tarjeta';
        card.innerHTML = `
            <div class="bandera">🌍</div>
            <h3>${viaje.nombre}</h3>
            <p>${viaje.pais}</p>
            <p>${viaje.fechaInicio || ''} - ${viaje.fechaFin || ''}</p>
            <button onclick="entrarViaje('${viaje.id}')">Entrar</button>
            <button onclick="eliminarViaje('${viaje.id}')">❌ Eliminar</button>

        `;
        viajesContainer.appendChild(card);
    });
}
function eliminarViaje(id) {
    if (!confirm('¿Seguro que querés eliminar este viaje?')) return;
    let viajes = getViajes();
    viajes = viajes.filter(v => v.id !== id);
    saveViajes(viajes);
    renderViajes();
}

function entrarViaje(id) {
    localStorage.setItem('viajeActivo', id);
    window.location.href = 'dashboard.html';
}

nuevoBtn.addEventListener('click', () => modal.classList.remove('hidden'));
cerrarModal.addEventListener('click', () => modal.classList.add('hidden'));

guardarViaje.addEventListener('click', () => {
    const nombre = document.getElementById('nombre-viaje').value;
    const pais = document.getElementById('pais-viaje').value;
    const inicio = document.getElementById('fecha-inicio').value;
    const fin = document.getElementById('fecha-fin').value;

    if (!nombre || !pais) return alert('Nombre y país son obligatorios');

    const viajes = getViajes();
    viajes.push({
        id: generateID(),
        nombre,
        pais,
        fechaInicio: inicio,
        fechaFin: fin,
        equipaje: [],
        notas: [],
        regalos: [],
        gastos: [],
        contactos: [],
        reservas: [],
        fotos: [],
        frases: [],
        saldoInicial: 0
    });
    saveViajes(viajes);
    modal.classList.add('hidden');
    renderViajes();
});

// Inicializar
renderViajes();
