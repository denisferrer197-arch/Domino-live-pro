import React, { useState, useEffect } from 'react';

function App() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [entradaA, setEntradaA] = useState('');
  const [entradaB, setEntradaB] = useState('');
  const [vistaActual, setVistaActual] = useState('MESAS');
  const [nombreTorneo, setNombreTorneo] = useState('Torneo de Dominó Live');
  
  // Estados de Ajustes y Equipos
  const [equipos, setEquipos] = useState([]);
  const [nuevoEquipo, setNuevoEquipo] = useState('');
  const [emparejamientos, setEmparejamientos] = useState([]);

  // Función para mezclar y crear enfrentamientos aleatorios
  const generarEnfrentamientos = (listaEquipos) => {
    if (listaEquipos.length < 2) return [];
    let mezclados = [...listaEquipos].sort(() => Math.random() - 0.5);
    let grupos = [];
    for (let i = 0; i < mezclados.length; i += 2) {
      if (mezclados[i + 1]) {
        grupos.push({
          mesa: Math.floor(i/2) + 1,
          equipo1: mezclados[i],
          equipo2: mezclados[i+1]
        });
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
    marginBottom: '15px',
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
        
        {/* VISTA EQUIPOS: RIVALES POR EQUIPO */}
        {vistaActual === 'EQUIPOS' && (
          <div>
            <h2 style={{fontSize: '18px', color: '#ffa500'}}>⚔️ ENFRENTAMIENTOS POR EQUIPOS</h2>
            {equipos.length < 2 ? (
              <p style={{color: '#8b949e'}}>Registra al menos 2 equipos en Ajustes para generar las mesas.</p>
            ) : (
              emparejamientos.map((m, i) => (
                <div key={i} style={{backgroundColor: '#161b22', padding: '15px', borderRadius: '12px', border: '1px solid #30363d', marginBottom: '10px', textAlign: 'left'}}>
                  <div style={{color: '#FFD700', fontWeight: 'bold', marginBottom: '10px'}}>MESA {m.mesa}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{color: '#4caf50', fontWeight: 'bold'}}>{m.equipo1}</div>
                    <div style={{fontSize: '12px', color: '#8b949e'}}>VS</div>
                    <div style={{color: '#f44336', fontWeight: 'bold'}}>{m.equipo2}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VISTA AJUSTES: REGISTRO DE EQUIPOS */}
        {vistaActual === 'AJUSTES' && (
          <div style={{ textAlign: 'left', backgroundColor: '#161b22', padding: '25px', borderRadius: '15px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>⚙️ AJUSTES GENERALES</h2>
            
            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>NOMBRE DEL TORNEO</label>
            <input type="text" value={nombreTorneo} onChange={(e) => setNombreTorneo(e.target.value)} style={inputStyle} />

            <div style={{ marginTop: '10px', padding: '15px', border: '1px solid #ffa500', borderRadius: '10px', backgroundColor: '#0d1117' }}>
              <label style={{ color: '#ffa500', fontSize: '12px', fontWeight: 'bold' }}>📝 REGISTRO DE EQUIPOS</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input type="text" value={nuevoEquipo} onChange={(e) => setNuevoEquipo(e.target.value)} placeholder="Nombre del Equipo" style={{...inputStyle, marginBottom: 0}} />
                <button onClick={() => {if(nuevoEquipo){setEquipos([...equipos, nuevoEquipo]); setNuevoEquipo('');}}} style={{ padding: '0 15px', backgroundColor: '#4caf50', border: 'none', borderRadius: '8px', color: 'white' }}>+</button>
              </div>
              <div style={{ marginTop: '10px', maxHeight: '120px', overflowY: 'auto' }}>
                {equipos.map((eq, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #30363d', fontSize: '14px' }}>
                    <span>{i+1}. {eq}</span>
                    <button onClick={() => setEquipos(equipos.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#f44336' }}>✖</button>
                  </div>
                ))}
              </div>
            </div>

            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold', marginTop: '20px', display: 'block' }}>META DE PUNTOS</label>
            <input type="number" value={metaPuntos} onChange={(e) => setMetaPuntos(e.target.value)} style={inputStyle} />

            <button onClick={() => setVistaActual('MESAS')} style={{ width: '100%', padding: '15px', backgroundColor: '#ffa500', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: 'black', marginTop: '10px' }}>GUARDAR Y VOLVER</button>
          </div>
        )}

        {vistaActual === 'MESAS' && <h2 style={{marginTop: '50px'}}>Mesa de juego lista</h2>}
      </main>
    </div>
  );
}

export default App;
