const tituloViaje = document.getElementById('titulo-viaje');
const contenido = document.getElementById('contenido-seccion');

const viajeID = localStorage.getItem('viajeActivo');
let viaje = getViaje(viajeID);

if (!viaje) {
    alert('Viaje no encontrado');
    window.location.href = 'index.html';
}

tituloViaje.textContent = `${viaje.nombre} (${viaje.pais})`;

function abrirSeccion(seccion) {
    contenido.innerHTML = '';
    switch(seccion) {
        case 'equipaje': renderEquipaje(); break;
        case 'notas': renderNotas(); break;
        case 'regalos': renderRegalos(); break;
        case 'gastos': renderGastos(); break;
        case 'diccionario': renderDiccionario(); break;
        case 'contactos': renderContactos(); break;
        case 'reservas': renderReservas(); break;
        case 'galeria': renderGaleria(); break;
        case 'conversor': renderConversor(); break;
    }
}

// -------------------- Equipaje --------------------
function renderEquipaje() {
    contenido.innerHTML = `
        <h2>Checklist de Equipaje</h2>
        <input type="text" id="nuevo-item" placeholder="Agregar objeto">
        <button id="agregar-item">Agregar</button>
        <ul id="lista-equipaje"></ul>
    `;
    const lista = document.getElementById('lista-equipaje');
    const input = document.getElementById('nuevo-item');
    const btn = document.getElementById('agregar-item');

    function actualizarLista() {
        lista.innerHTML = '';
        viaje.equipaje.forEach((item, i) => {
            const li = document.createElement('li');
            li.textContent = item;
            const del = document.createElement('button');
            del.textContent = '❌';
            del.onclick = () => {
                viaje.equipaje.splice(i,1);
                saveViajeActual(viaje);
                actualizarLista();
            };
            li.appendChild(del);
            lista.appendChild(li);
        });
    }

    btn.onclick = () => {
        const val = input.value.trim();
        if(!val) return;
        viaje.equipaje.push(val);
        saveViajeActual(viaje);
        input.value = '';
        actualizarLista();
    };
    actualizarLista();
}

// --------------------
// -------------------- Notas --------------------
function renderNotas() {
    contenido.innerHTML = `
        <h2>Notas Rápidas</h2>
        <textarea id="nueva-nota" placeholder="Escribe tu nota"></textarea>
        <button id="agregar-nota">Agregar</button>
        <ul id="lista-notas"></ul>
    `;
    const lista = document.getElementById('lista-notas');
    const textarea = document.getElementById('nueva-nota');
    document.getElementById('agregar-nota').onclick = () => {
        const val = textarea.value.trim();
        if (!val) return;
        viaje.notas.push(val);
        saveViajeActual(viaje);
        textarea.value = '';
        actualizarNotas();
    };

    function actualizarNotas() {
        lista.innerHTML = '';
        viaje.notas.forEach((nota,i) => {
            const li = document.createElement('li');
            li.textContent = nota;
            const del = document.createElement('button');
            del.textContent = '❌';
            del.onclick = () => {
                viaje.notas.splice(i,1);
                saveViajeActual(viaje);
                actualizarNotas();
            };
            li.appendChild(del);
            lista.appendChild(li);
        });
    }
    actualizarNotas();
}

// -------------------- Regalos --------------------
function renderRegalos() {
    contenido.innerHTML = `
        <h2>Regalos</h2>
        <input type="text" id="nombre-regalo" placeholder="Nombre">
        <input type="text" id="detalle-regalo" placeholder="Qué comprar">
        <button id="agregar-regalo">Agregar</button>
        <ul id="lista-regalos"></ul>
    `;
    const lista = document.getElementById('lista-regalos');
    const nombreInput = document.getElementById('nombre-regalo');
    const detalleInput = document.getElementById('detalle-regalo');
    document.getElementById('agregar-regalo').onclick = () => {
        const nombre = nombreInput.value.trim();
        const detalle = detalleInput.value.trim();
        if (!nombre || !detalle) return;
        viaje.regalos.push({nombre, detalle});
        saveViajeActual(viaje);
        nombreInput.value = '';
        detalleInput.value = '';
        actualizarRegalos();
    };
    function actualizarRegalos() {
        lista.innerHTML = '';
        viaje.regalos.forEach((r,i)=>{
            const li = document.createElement('li');
            li.textContent = `${r.nombre} → ${r.detalle}`;
            const del = document.createElement('button');
            del.textContent = '❌';
            del.onclick = () => { viaje.regalos.splice(i,1); saveViajeActual(viaje); actualizarRegalos(); };
            li.appendChild(del);
            lista.appendChild(li);
        });
    }
    actualizarRegalos();
}

// -------------------- Gastos --------------------
function renderGastos() {
    contenido.innerHTML = `
        <h2>Gastos</h2>
        <input type="number" id="monto-gasto" placeholder="Monto">
        <input type="text" id="detalle-gasto" placeholder="Detalle">
        <button id="agregar-gasto">Agregar</button>
        <p>Saldo inicial: <input type="number" id="saldo-inicial" value="${viaje.saldoInicial || 0}"></p>
        <p>Saldo restante: <span id="saldo-restante">0</span></p>
        <ul id="lista-gastos"></ul>
    `;
    const lista = document.getElementById('lista-gastos');
    const montoInput = document.getElementById('monto-gasto');
    const detalleInput = document.getElementById('detalle-gasto');
    const saldoInput = document.getElementById('saldo-inicial');

    function calcularSaldo() {
        const totalGastos = viaje.gastos.reduce((a,b)=>a+Number(b.monto),0);
        return (viaje.saldoInicial||0) - totalGastos;
    }

    function actualizarLista() {
        lista.innerHTML = '';
        viaje.gastos.forEach((g,i)=>{
            const li = document.createElement('li');
            li.textContent = `${g.detalle} → ${g.monto}`;
            const del = document.createElement('button');
            del.textContent = '❌';
            del.onclick = ()=>{viaje.gastos.splice(i,1); saveViajeActual(viaje); actualizarLista(); saldoInput.dispatchEvent(new Event('input'));};
            li.appendChild(del);
            lista.appendChild(li);
        });
        document.getElementById('saldo-restante').textContent = calcularSaldo();
    }

    document.getElementById('agregar-gasto').onclick = ()=>{
        const monto = parseFloat(montoInput.value);
        const detalle = detalleInput.value.trim();
        if(isNaN(monto) || !detalle) return;
        viaje.gastos.push({detalle,monto});
        saveViajeActual(viaje);
        montoInput.value=''; detalleInput.value='';
        actualizarLista();
    };

    saldoInput.addEventListener('input',()=>{
        viaje.saldoInicial = parseFloat(saldoInput.value)||0;
        saveViajeActual(viaje);
        actualizarLista();
    });

    actualizarLista();
}

// -------------------- Diccionario --------------------
function renderDiccionario() {
    if(!viaje.frases) viaje.frases=[];
    contenido.innerHTML = `
        <h2>Diccionario / Frases</h2>
        <input type="text" id="esp" placeholder="Español">
        <input type="text" id="otro" placeholder="Idioma local">
        <button id="agregar-frase">Agregar</button>
        <ul id="lista-frases"></ul>
    `;
    const lista = document.getElementById('lista-frases');
    document.getElementById('agregar-frase').onclick = ()=>{
        const esp = document.getElementById('esp').value.trim();
        const otro = document.getElementById('otro').value.trim();
        if(!esp||!otro) return;
        viaje.frases.push({esp,otro});
        saveViajeActual(viaje);
        document.getElementById('esp').value=''; document.getElementById('otro').value='';
        actualizarFrases();
    };
    function actualizarFrases(){
        lista.innerHTML='';
        viaje.frases.forEach((f,i)=>{
            const li=document.createElement('li');
            li.textContent=`${f.esp} → ${f.otro}`;
            const del=document.createElement('button');
            del.textContent='❌';
            del.onclick=()=>{viaje.frases.splice(i,1); saveViajeActual(viaje); actualizarFrases();};
            li.appendChild(del);
            lista.appendChild(li);
        });
    }
    actualizarFrases();
}

// -------------------- Contactos --------------------
function renderContactos() {
    if(!viaje.contactos) viaje.contactos=[];
    contenido.innerHTML=`
        <h2>Contactos</h2>
        <input type="text" id="nombre-contacto" placeholder="Nombre">
        <input type="text" id="tel-contacto" placeholder="Teléfono">
        <button id="agregar-contacto">Agregar</button>
        <ul id="lista-contactos"></ul>
    `;
    const lista=document.getElementById('lista-contactos');
    document.getElementById('agregar-contacto').onclick=()=>{
        const nombre=document.getElementById('nombre-contacto').value.trim();
        const tel=document.getElementById('tel-contacto').value.trim();
        if(!nombre||!tel) return;
        viaje.contactos.push({nombre,tel});
        saveViajeActual(viaje);
        document.getElementById('nombre-contacto').value='';
        document.getElementById('tel-contacto').value='';
        actualizarContactos();
    };
    function actualizarContactos(){
        lista.innerHTML='';
        viaje.contactos.forEach((c,i)=>{
            const li=document.createElement('li');
            li.textContent=`${c.nombre} → ${c.tel}`;
            const del=document.createElement('button');
            del.textContent='❌';
            del.onclick=()=>{viaje.contactos.splice(i,1); saveViajeActual(viaje); actualizarContactos();};
            li.appendChild(del);
            lista.appendChild(li);
        });
    }
    actualizarContactos();
}

// -------------------- Reservas --------------------
function renderReservas() {
    if(!viaje.reservas) viaje.reservas=[];
    contenido.innerHTML=`
        <h2>Reservas / Vuelos</h2>
        <input type="text" id="detalle-reserva" placeholder="Detalle">
        <input type="text" id="info-reserva" placeholder="Link / info">
        <button id="agregar-reserva">Agregar</button>
        <ul id="lista-reservas"></ul>
    `;
    const lista=document.getElementById('lista-reservas');
    document.getElementById('agregar-reserva').onclick=()=>{
        const detalle=document.getElementById('detalle-reserva').value.trim();
        const info=document.getElementById('info-reserva').value.trim();
        if(!detalle||!info) return;
        viaje.reservas.push({detalle,info});
        saveViajeActual(viaje);
        document.getElementById('detalle-reserva').value='';
        document.getElementById('info-reserva').value='';
        actualizarReservas();
    };
    function actualizarReservas(){
        lista.innerHTML='';
        viaje.reservas.forEach((r,i)=>{
            const li=document.createElement('li');
            li.innerHTML=`${r.detalle} → <a href="${r.info}" target="_blank">${r.info}</a>`;
            const del=document.createElement('button');
            del.textContent='❌';
            del.onclick=()=>{viaje.reservas.splice(i,1); saveViajeActual(viaje); actualizarReservas();};
            li.appendChild(del);
            lista.appendChild(li);
        });
    }
    actualizarReservas();
}

// -------------------- Galería Polaroid --------------------
function renderGaleria(){
    if(!viaje.fotos) viaje.fotos=[];
    contenido.innerHTML=`
        <h2>Galería de Fotos</h2>
        <input type="file" id="foto-input" accept="image/*">
        <input type="text" id="titulo-foto" placeholder="Título">
        <input type="text" id="desc-foto" placeholder="Descripción">
        <button id="agregar-foto">Agregar</button>
        <div id="galeria" class="galeria-polaroid"></div>
    `;
    const input=document.getElementById('foto-input');
    const tituloInput=document.getElementById('titulo-foto');
    const descInput=document.getElementById('desc-foto');
    const galeria=document.getElementById('galeria');

    document.getElementById('agregar-foto').onclick=()=>{
        const file=input.files[0];
        const titulo=tituloInput.value.trim();
        const desc=descInput.value.trim();
        if(!file||!titulo) return;
        const reader=new FileReader();
        reader.onload=()=>{
            viaje.fotos.push({src:reader.result,titulo,descripcion:desc});
            saveViajeActual(viaje);
            input.value=''; tituloInput.value=''; descInput.value='';
            actualizarGaleria();
        };
        reader.readAsDataURL(file);
    };

    function actualizarGaleria(){
        galeria.innerHTML='';
        viaje.fotos.forEach(f=>{
            const div=document.createElement('div');
            div.className='polaroid';
            div.innerHTML=`<img src="${f.src}" alt="${f.titulo}"><h4>${f.titulo}</h4><p>${f.descripcion}</p>`;
            galeria.appendChild(div);
        });
    }
    actualizarGaleria();
}

// -------------------- Conversor --------------------
function renderConversor(){
    contenido.innerHTML=`
        <h2>Conversor de Moneda</h2>
        <input type="number" id="monto-conv" placeholder="Cantidad">
        <input type="number" id="tasa" placeholder="Tasa de cambio">
        <button id="convertir">Convertir</button>
        <p>Resultado: <span id="resultado-conv">0</span></p>
    `;
    document.getElementById('convertir').onclick=()=>{
        const monto=parseFloat(document.getElementById('monto-conv').value);
        const tasa=parseFloat(document.getElementById('tasa').value);
        if(isNaN(monto)||isNaN(tasa)) return alert('Ingrese números válidos');
        document.getElementById('resultado-conv').textContent=(monto*tasa).toFixed(2);
    };
}
