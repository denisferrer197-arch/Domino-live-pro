import React, { useState, useEffect } from 'react';

function App() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [entradaA, setEntradaA] = useState('');
  const [entradaB, setEntradaB] = useState('');
  const [vistaActual, setVistaActual] = useState('MESAS');
  
  // Estados de Ajustes
  const [nombreTorneo, setNombreTorneo] = useState('Torneo de Dominó Live');
  const [metaPuntos, setMetaPuntos] = useState(100);
  const [equipos, setEquipos] = useState([]);
  const [nuevoEquipo, setNuevoEquipo] = useState('');
  const [emparejamientos, setEmparejamientos] = useState([]);

  // Lógica de emparejamiento aleatorio
  const generarEnfrentamientos = (lista) => {
    if (lista.length < 2) return [];
    let mezclados = [...lista].sort(() => Math.random() - 0.5);
    let grupos = [];
    for (let i = 0; i < mezclados.length; i += 2) {
      if (mezclados[i + 1]) {
        grupos.push({ mesa: Math.floor(i/2) + 1, e1: mezclados[i], e2: mezclados[i+1] });
      }
    }
    return grupos;
  };

  useEffect(() => {
    setEmparejamientos(generarEnfrentamientos(equipos));
  }, [equipos]);

  const navButtonStyle = (vista) => ({
    backgroundColor: vistaActual === vista ? '#ffa500' : 'transparent',
    border: 'none',
    color: vistaActual === vista ? 'black' : '#8a8d91',
    padding: '10px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    minWidth: '80px'
  });

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
    color: 'white',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#0a0b0d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: '#161b22', padding: '20px 0', borderBottom: '1px solid #30363d' }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#FFD700', fontSize: '20px' }}>{nombreTorneo.toUpperCase()}</h1>
        <nav style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setVistaActual('MESAS')} style={navButtonStyle('MESAS')}><span>▶️</span> MESAS</button>
          <button onClick={() => setVistaActual('RANKING')} style={navButtonStyle('RANKING')}><span>🏆</span> RANKING</button>
          <button onClick={() => setVistaActual('EQUIPOS')} style={navButtonStyle('EQUIPOS')}><span>👥</span> EQUIPOS</button>
          <button onClick={() => setVistaActual('AJUSTES')} style={navButtonStyle('AJUSTES')}><span>⚙️</span> AJUSTES</button>
        </nav>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* VISTA EQUIPOS: MOSTRAR RIVALES */}
        {vistaActual === 'EQUIPOS' && (
          <div>
            <h2 style={{fontSize: '18px', color: '#ffa500'}}>⚔️ ENFRENTAMIENTOS ALEATORIOS</h2>
            {equipos.length < 2 ? (
              <p style={{color: '#8b949e'}}>Registra al menos 2 equipos en Ajustes.</p>
            ) : (
              emparejamientos.map((m, i) => (
                <div key={i} style={{backgroundColor: '#161b22', padding: '15px', borderRadius: '12px', border: '1px solid #30363d', marginBottom: '10px', textAlign: 'left'}}>
                  <div style={{color: '#FFD700', fontWeight: 'bold', marginBottom: '10px'}}>MESA {m.mesa}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{color: '#4caf50', fontWeight: 'bold'}}>{m.e1}</div>
                    <div style={{color: '#8b949e'}}>VS</div>
                    <div style={{color: '#f44336', fontWeight: 'bold'}}>{m.e2}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VISTA AJUSTES: TODOS LOS CAMPOS MÁS REGISTRO */}
        {vistaActual === 'AJUSTES' && (
          <div style={{ textAlign: 'left', backgroundColor: '#161b22', padding: '20px', borderRadius: '15px' }}>
            <h2 style={{fontSize: '18px', marginBottom: '15px'}}>⚙️ AJUSTES GENERALES</h2>
            
            <label style={{fontSize: '11px', color: '#8b949e'}}>NOMBRE DEL TORNEO</label>
            <input type="text" value={nombreTorneo} onChange={(e) => setNombreTorneo(e.target.value)} style={inputStyle} />

            <label style={{fontSize: '11px', color: '#8b949e', marginTop: '15px', display: 'block'}}>CÓDIGO DE ACCESO (Público)</label>
            <input type="text" placeholder="DEJAR VACÍO PARA ACCESO LIBRE" style={{...inputStyle, border: '1px solid #ffa500'}} />

            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <div style={{ flex: 1 }}><label style={{fontSize: '11px', color: '#8b949e'}}>TOTAL RONDAS</label><input type="number" defaultValue="2" style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{fontSize: '11px', color: '#8b949e'}}>TIEMPO (MIN)</label><input type="number" defaultValue="2" style={inputStyle} /></div>
            </div>

            <label style={{fontSize: '11px', color: '#8b949e', marginTop: '15px', display: 'block'}}>META DE PUNTOS</label>
            <input type="number" value={metaPuntos} onChange={(e) => setMetaPuntos(e.target.value)} style={inputStyle} />

            <label style={{fontSize: '11px', color: '#8b949e', marginTop: '15px', display: 'block'}}>MÉTODO EMPAREJAMIENTO</label>
            <select style={inputStyle}><option>Automático (Aleatorio)</option></select>

            {/* SECCIÓN REGISTRO INTEGRADA */}
            <div style={{marginTop: '20px', padding: '15px', border: '1px solid #ffa500', borderRadius: '10px', backgroundColor: '#0d1117'}}>
              <label style={{color: '#ffa500', fontWeight: 'bold', fontSize: '12px'}}>📝 REGISTRO DE EQUIPOS</label>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <input type="text" value={nuevoEquipo} onChange={(e) => setNuevoEquipo(e.target.value)} placeholder="Equipo" style={{...inputStyle, marginTop: 0, flex: 1}} />
                <button onClick={() => {if(nuevoEquipo){setEquipos([...equipos, nuevoEquipo]); setNuevoEquipo('');}}} style={{padding: '0 15px', backgroundColor: '#4caf50', border: 'none', borderRadius: '8px', color: 'white'}}>+</button>
              </div>
              <div style={{marginTop: '10px', maxHeight: '80px', overflowY: 'auto', fontSize: '13px'}}>
                {equipos.map((eq, i) => <div key={i} style={{padding: '4px 0', borderBottom: '1px solid #30363d'}}>{i+1}. {eq}</div>)}
              </div>
            </div>

            <button onClick={() => setVistaActual('MESAS')} style={{width: '100%', padding: '15px', backgroundColor: '#ffa500', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '20px'}}>GUARDAR Y VOLVER</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
