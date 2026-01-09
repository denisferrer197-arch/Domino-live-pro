import random
import time
from flask import Flask, render_template_string, request, jsonify

app = Flask(__name__)

# --- MOTOR DE DATOS DEL TORNEO ---
torneo = {
    "config": {
        "nombre": "Gran Torneo de Dominó",
        "pts_max": 100,
        "tiempo_reglamentario": 40,
        "modalidad": "Pareja",
        "rondas_total": 5,
        "ronda_actual": 0,
        "estado": "Configuración"  # Configuración, Activo, Pausado
    },
    "equipos": {}, # {id: {nombre: str, clave: str, pg: 0, pp: 0, pts_favor: 0, pts_contra: 0}}
    "mesas": [],   # [{id: 1, e1: id, e2: id, pts1: 0, pts2: 0, estado: 'Bloqueada', tiempo: 0}]
    "mensajes": [], # [{de: 'Mesa 1', texto: '...'}]
    "claves_maestras": ["1234", "DOMINO99"] # Claves de supervisor
}

# --- INTERFAZ UI (HTML/JS/CSS) ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domino Live Pro</title>
    <style>
        :root {
            --blue: #1a73e8; --green: #34a853; --red: #d93025; --gray: #5f6368; --light: #f8f9fa;
        }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: #e9ecef; }
        header { background: var(--blue); color: white; padding: 15px; text-align: center; font-size: 1.4em; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        
        .nav-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; background: white; padding: 10px; sticky: top; }
        .nav-bar button { border: none; padding: 10px 5px; background: var(--light); cursor: pointer; font-weight: bold; border-radius: 5px; transition: 0.3s; font-size: 0.8em; }
        .nav-bar button:hover { background: #ddd; }
        .nav-bar button.active { background: var(--blue); color: white; }

        .container { padding: 15px; max-width: 600px; margin: auto; }
        .card { background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
        /* Botones de acción */
        .btn-main { width: 100%; padding: 12px; margin: 5px 0; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; }
        .btn-blue { background: var(--blue); } .btn-green { background: var(--green); } .btn-red { background: var(--red); }
        
        input { width: 100%; padding: 10px; margin: 8px 0; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
        
        /* Mesas y Ranking */
        .mesa-card { border-left: 10px solid var(--gray); }
        .mesa-activa { border-left-color: var(--green); }
        .mesa-cerrada { border-left-color: var(--red); opacity: 0.8; }
        .score-display { font-size: 2em; font-weight: bold; display: flex; justify-content: space-around; align-items: center; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .rank-1 { background: #fff3cd; }
        
        #banner-lider { display:none; background: #fff3cd; color: #856404; padding: 10px; border: 1px solid #ffeeba; margin-bottom: 10px; border-radius: 5px; font-weight: bold; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    </style>
</head>
<body>

<header id="nombre-torneo-header">{{ config.nombre }}</header>

<div class="nav-bar">
    <button onclick="showSec('ajustes')" id="btn-ajustes">AJUSTES</button>
    <button onclick="showSec('vs')" id="btn-vs">Vs</button>
    <button onclick="showSec('mesas')" id="btn-mesas">MESAS</button>
    <button onclick="showSec('ranking')" id="btn-ranking">RANKING</button>
</div>

<div class="container">
    <div id="banner-lider"></div>

    <div id="sec-ajustes" class="section">
        <div class="card">
            <h2>Ajustes Generales</h2>
            <button class="btn-main btn-blue" onclick="showSub('torneo')">CONFIGURAR TORNEO</button>
            <button class="btn-main btn-green" onclick="guardarCambios()">GUARDAR CAMBIOS</button>
            <button class="btn-main btn-blue" onclick="showSub('mensajes')">MENSAJES</button>
            <button class="btn-main btn-red" onclick="resetearTorneo()">RESETEAR TORNEO</button>
        </div>

        <div id="sub-torneo" style="display:none;" class="card">
            <h3>Registro y Reglas</h3>
            <label>Equipos (un nombre por línea):</label>
            <textarea id="lista-equipos" rows="5" style="width:100%"></textarea>
            <label>Rondas:</label> <input type="number" id="cfg-rondas" value="5">
            <label>Tiempo (min):</label> <input type="number" id="cfg-tiempo" value="40">
            <label>Puntos Máximos:</label> <input type="number" id="cfg-puntos" value="100">
            <label>Modalidad:</label>
            <select id="cfg-modalidad" style="width:100%; padding:10px; margin:10px 0;">
                <option value="Suizo">Torneo Suizo</option>
                <option value="Parejas">En Pareja</option>
                <option value="Individual">Individual</option>
            </select>
            <button class="btn-main btn-blue" onclick="hideSub('torneo')">Regresar</button>
        </div>
    </div>

    <div id="sec-vs" class="section" style="display:none;">
        <div id="lista-vs"></div>
    </div>

    <div id="sec-mesas" class="section" style="display:none;">
        <div id="lista-mesas"></div>
    </div>

    <div id="sec-ranking" class="section" style="display:none;">
        <div class="card">
            <h2>Tabla de Posiciones</h2>
            <div id="tabla-ranking"></div>
        </div>
    </div>
</div>

<script>
    let configActual = {{ config | tojson }};

    function showSec(id) {
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        document.getElementById('sec-' + id).style.display = 'block';
        document.querySelectorAll('.nav-bar button').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-' + id).classList.add('active');
        actualizarData();
    }

    function showSub(id) { document.getElementById('sub-' + id).style.display = 'block'; }
    function hideSub(id) { document.getElementById('sub-' + id).style.display = 'none'; }

    async function actualizarData() {
        const res = await fetch('/api/data');
        const data = await res.json();
        
        // Render Vs
        let vsHtml = '<h2>Enfrentamientos - Ronda ' + data.config.ronda_actual + '</h2>';
        data.mesas.forEach(m => {
            vsHtml += `<div class="card">
                <b>MESA #${m.id}</b><br>
                ${data.equipos[m.e1].nombre} vs ${data.equipos[m.e2].nombre}<br>
                <small>Estado: ${m.estado}</small>
            </div>`;
        });
        document.getElementById('lista-vs').innerHTML = vsHtml;

        // Render Mesas
        let mesasHtml = '';
        data.mesas.forEach(m => {
            mesasHtml += `<div class="card mesa-card ${m.estado == 'Activa' ? 'mesa-activa' : (m.estado == 'Cerrada' ? 'mesa-cerrada' : '')}">
                <h3>Mesa #${m.id} - ${m.estado}</h3>
                <div class="score-display">
                    <div>${data.equipos[m.e1].nombre}<br>${m.pts1}</div>
                    <div>VS</div>
                    <div>${data.equipos[m.e2].nombre}<br>${m.pts2}</div>
                </div>
                ${m.estado == 'Bloqueada' ? `
                    <input type="text" id="c1-${m.id}" placeholder="Clave Capitán 1">
                    <input type="text" id="c2-${m.id}" placeholder="Clave Capitán 2">
                    <button class="btn-main btn-green" onclick="desbloquearMesa(${m.id})">DESBLOQUEAR</button>
                ` : m.estado == 'Activa' ? `
                    <div style="text-align:center; color:red; font-size:1.2em;">⏳ ${Math.floor(m.tiempo / 60)}:${m.tiempo % 60}</div>
                    <button class="btn-main btn-blue" onclick="sumarPuntos(${m.id}, 1)">Sumar ${data.equipos[m.e1].nombre}</button>
                    <button class="btn-main btn-blue" onclick="sumarPuntos(${m.id}, 2)">Sumar ${data.equipos[m.e2].nombre}</button>
                ` : `<b>GANADOR: ${m.pts1 > m.pts2 ? data.equipos[m.e1].nombre : data.equipos[m.e2].nombre}</b>`}
            </div>`;
        });
        document.getElementById('lista-mesas').innerHTML = mesasHtml;

        // Render Ranking
        let rankHtml = '<table><tr><th>Pos</th><th>Equipo</th><th>PG</th><th>Pts +/-</th></tr>';
        data.ranking.forEach((r, i) => {
            rankHtml += `<tr class="${i==0?'rank-1':''}">
                <td>${i+1}</td>
                <td>${r.nombre}</td>
                <td>${r.pg}</td>
                <td>${r.dif}</td>
            </tr>`;
        });
        document.getElementById('tabla-ranking').innerHTML = rankHtml + '</table>';
        
        // Banner Nuevo Líder
        if(data.nuevo_lider) {
            const banner = document.getElementById('banner-lider');
            banner.style.display = 'block';
            banner.innerHTML = "¡ATENCIÓN! " + data.nuevo_lider + " es el nuevo líder del torneo";
        }
    }

    async function guardarCambios() {
        const rawEquipos = document.getElementById('lista-equipos').value.split('\\n').filter(n => n.trim() != '');
        const payload = {
            equipos: rawEquipos,
            tiempo: document.getElementById('cfg-tiempo').value,
            pts_max: document.getElementById('cfg-puntos').value,
            modalidad: document.getElementById('cfg-modalidad').value
        };
        await fetch('/api/guardar', { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'} });
        alert("Configuración Guardada e Instancias Creadas");
        showSec('vs');
    }

    async function desbloquearMesa(id) {
        const c1 = document.getElementById('c1-'+id).value;
        const c2 = document.getElementById('c2-'+id).value;
        const res = await fetch('/api/desbloquear', { method: 'POST', body: JSON.stringify({id, c1, c2}), headers: {'Content-Type': 'application/json'} });
        const data = await res.json();
        if(data.ok) actualizarData(); else alert(data.msg);
    }

    async function sumarPuntos(id, equipo) {
        const pts = prompt("Puntos a sumar:");
        if(pts) {
            await fetch('/api/puntos', { method: 'POST', body: JSON.stringify({id, equipo, pts}), headers: {'Content-Type': 'application/json'} });
            actualizarData();
        }
    }

    async function resetearTorneo() {
        if(confirm("¿Está seguro? Se borrará TODO. Escriba 'BORRAR'")) {
            const r = prompt("Escriba BORRAR:");
            if(r === 'BORRAR') {
                await fetch('/api/reset', { method: 'POST' });
                location.reload();
            }
        }
    }

    setInterval(actualizarData, 5000); // Sincronización automática cada 5 segundos
</script>
</body>
</html>
"""

# --- RUTAS DE API ---

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE, config=torneo["config"])

@app.route('/api/data')
def get_data():
    # Calcular Ranking dinámico
    ranking = []
    for eid, e in torneo["equipos"].items():
        ranking.append({
            "nombre": e["nombre"],
            "pg": e["pg"],
            "dif": e["pts_favor"] - e["pts_contra"],
            "total": e["pts_favor"]
        })
    # Ordenar por PG, luego por diferencia de puntos
    ranking.sort(key=lambda x: (x["pg"], x["dif"]), reverse=True)
    
    nuevo_lider = ranking[0]["nombre"] if len(ranking) > 0 else None
    
    return jsonify({
        "config": torneo["config"],
        "equipos": torneo["equipos"],
        "mesas": torneo["mesas"],
        "ranking": ranking,
        "nuevo_lider": nuevo_lider if torneo["config"]["estado"] == "Activo" else None
    })

@app.route('/api/guardar', methods=['POST'])
def guardar():
    data = request.json
    torneo["config"]["pts_max"] = int(data["pts_max"])
    torneo["config"]["tiempo_reglamentario"] = int(data["tiempo"])
    torneo["config"]["modalidad"] = data["modalidad"]
    torneo["config"]["estado"] = "Activo"
    torneo["config"]["ronda_actual"] = 1
    
    # Crear equipos con claves
    torneo["equipos"] = {}
    nombres = data["equipos"]
    ids = []
    for i, n in enumerate(nombres):
        eid = str(i+1)
        clave = str(random.randint(1000, 9999))
        torneo["equipos"][eid] = {
            "nombre": n, "clave": clave, "pg": 0, "pp": 0, "pts_favor": 0, "pts_contra": 0
        }
        ids.append(eid)
        print(f"Equipo: {n} - Clave: {clave}") # Ver claves en la terminal de Termux

    # Generar enfrentamientos ronda 1
    random.shuffle(ids)
    torneo["mesas"] = []
    for i in range(0, len(ids), 2):
        if i+1 < len(ids):
            torneo["mesas"].append({
                "id": (i//2)+1, "e1": ids[i], "e2": ids[i+1],
                "pts1": 0, "pts2": 0, "estado": "Bloqueada",
                "tiempo": torneo["config"]["tiempo_reglamentario"] * 60
            })
    return jsonify({"ok": True})

@app.route('/api/desbloquear', methods=['POST'])
def desbloquear():
    d = request.json
    mesa = next(m for m in torneo["mesas"] if m["id"] == d["id"])
    e1 = torneo["equipos"][mesa["e1"]]
    e2 = torneo["equipos"][mesa["e2"]]
    
    if d["c1"] == e1["clave"] and d["c2"] == e2["clave"]:
        mesa["estado"] = "Activa"
        return jsonify({"ok": True})
    return jsonify({"ok": False, "msg": "Claves incorrectas o no corresponden a esta mesa."})

@app.route('/api/puntos', methods=['POST'])
def puntos():
    d = request.json
    mesa = next(m for m in torneo["mesas"] if m["id"] == int(d["id"]))
    if d["equipo"] == 1: mesa["pts1"] += int(d["pts"])
    else: mesa["pts2"] += int(d["pts"])
    
    # Verificar cierre por puntuación máxima
    max_p = torneo["config"]["pts_max"]
    if mesa["pts1"] >= max_p or mesa["pts2"] >= max_p:
        cerrar_mesa(mesa)
        
    return jsonify({"ok": True})

def cerrar_mesa(mesa):
    if mesa["estado"] == "Cerrada": return
    mesa["estado"] = "Cerrada"
    e1 = torneo["equipos"][mesa["e1"]]
    e2 = torneo["equipos"][mesa["e2"]]
    
    e1["pts_favor"] += mesa["pts1"]
    e1["pts_contra"] += mesa["pts2"]
    e2["pts_favor"] += mesa["pts2"]
    e2["pts_contra"] += mesa["pts1"]
    
    if mesa["pts1"] > mesa["pts2"]:
        e1["pg"] += 1; e2["pp"] += 1
    else:
        e2["pg"] += 1; e1["pp"] += 1

@app.route('/api/reset', methods=['POST'])
def reset():
    global torneo
    torneo["equipos"] = {}
    torneo["mesas"] = []
    torneo["config"]["estado"] = "Configuración"
    return jsonify({"ok": True})

if __name__ == '__main__':
    # Hilo para manejar el cronómetro en segundo plano
    import threading
    def cronometro():
        while True:
            for m in torneo["mesas"]:
                if m["estado"] == "Activa" and m["tiempo"] > 0:
                    m["tiempo"] -= 1
                    if m["tiempo"] == 0:
                        cerrar_mesa(m)
            time.sleep(1)
    
    threading.Thread(target=cronometro, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=True)
