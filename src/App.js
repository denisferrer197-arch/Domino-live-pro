import React, { useState } from 'react';

function App() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [entradaA, setEntradaA] = useState('');
  const [entradaB, setEntradaB] = useState('');
  
  const [vistaActual, setVistaActual] = useState('MESAS');
  const [nombreTorneo, setNombreTorneo] = useState('Torneo de Dominó Live');
  const [metaPuntos, setMetaPuntos] = useState(100);
  const [jugadores, setJugadores] = useState([]);
  const [nuevoJugador, setNuevoJugador] = useState('');

  const sumarPuntos = (equipo) => {
    const valor = parseInt(equipo === 'A' ? entradaA : entradaB);
    if (!isNaN(valor)) {
      if (equipo === 'A') {
        setPuntosA(puntosA + valor);
        setEntradaA('');
      } else {
        setPuntosB(puntosB + valor);
        setEntradaB('');
      }
    }
  };

  const navButtonStyle = (vista) => ({
    backgroundColor: vistaActual === vista ? '#ffa500' : 'transparent',
    border: 'none',
    color: vistaActual === vista ? 'black' : '#8a8d91',
    padding: '10px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '12px',
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
        <h1 style={{ margin: '0 0 20px 0', color: '#FFD700', fontSize: '22px' }}>{nombreTorneo.toUpperCase()}</h1>
        <nav style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setVistaActual('MESAS')} style={navButtonStyle('MESAS')}><span>▶️</span> MESAS</button>
          <button onClick={() => setVistaActual('RANKING')} style={navButtonStyle('RANKING')}><span>🏆</span> RANKING</button>
          <button onClick={() => setVistaActual('EQUIPOS')} style={navButtonStyle('EQUIPOS')}><span>👥</span> EQUIPOS</button>
          <button onClick={() => setVistaActual('AJUSTES')} style={navButtonStyle('AJUSTES')}><span>⚙️</span> AJUSTES</button>
        </nav>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {vistaActual === 'MESAS' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <div style={{ border: '2px solid #4caf50', padding: '15px', borderRadius: '15px', width: '48%', backgroundColor: '#161b22' }}>
              <h2 style={{color: '#4caf50', fontSize: '16px'}}>PAREJA A</h2>
              <div style={{ fontSize: '60px', margin: '10px 0' }}>{puntosA}</div>
              <input type="number" value={entradaA} onChange={(e) => setEntradaA(e.target.value)} placeholder="Pts" style={{...inputStyle, width: '80%'}} />
              <button onClick={() => sumarPuntos('A')} style={{ width: '90%', padding: '12px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px' }}>ANOTAR</button>
            </div>
            <div style={{ border: '2px solid #f44336', padding: '15px', borderRadius: '15px', width: '48%', backgroundColor: '#161b22' }}>
              <h2 style={{color: '#f44336', fontSize: '16px'}}>PAREJA B</h2>
              <div style={{ fontSize: '60px', margin: '10px 0' }}>{puntosB}</div>
              <input type="number" value={entradaB} onChange={(e) => setEntradaB(e.target.value)} placeholder="Pts" style={{...inputStyle, width: '80%'}} />
              <button onClick={() => sumarPuntos('B')} style={{ width: '90%', padding: '12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px' }}>ANOTAR</button>
            </div>
          </div>
        )}

        {vistaActual === 'AJUSTES' && (
          <div style={{ textAlign: 'left', backgroundColor: '#161b22', padding: '25px', borderRadius: '15px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>⚙️ AJUSTES GENERALES</h2>
            
            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>NOMBRE DEL TORNEO</label>
            <input type="text" value={nombreTorneo} onChange={(e) => setNombreTorneo(e.target.value)} style={inputStyle} />

            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>CÓDIGO DE ACCESO (Público)</label>
            <input type="text" placeholder="DEJAR VACÍO PARA ACCESO LIBRE" style={{...inputStyle, border: '1px solid #ffa500'}} />

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>TOTAL RONDAS</label>
                <input type="number" defaultValue="2" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>TIEMPO (MIN)</label>
                <input type="number" defaultValue="2" style={inputStyle} />
              </div>
            </div>

            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>META DE PUNTOS (Para ganar)</label>
            <input type="number" value={metaPuntos} onChange={(e) => setMetaPuntos(e.target.value)} style={inputStyle} />

            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>MÉTODO EMPAREJAMIENTO</label>
            <select style={inputStyle}><option>Automático (Aleatorio)</option></select>

            {/* SECCIÓN REGISTRO DE JUGADORES */}
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #30363d', borderRadius: '10px', backgroundColor: '#0d1117' }}>
              <label style={{ color: '#ffa500', fontSize: '12px', fontWeight: 'bold' }}>📝 REGISTRO DE JUGADORES</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input type="text" value={nuevoJugador} onChange={(e) => setNuevoJugador(e.target.value)} placeholder="Nombre" style={{...inputStyle, marginBottom: 0}} />
                <button onClick={() => {if(nuevoJugador){setJugadores([...jugadores, nuevoJugador]); setNuevoJugador('');}}} style={{ padding: '0 15px', backgroundColor: '#4caf50', border: 'none', borderRadius: '8px', color: 'white' }}>+</button>
              </div>
              <div style={{ marginTop: '10px', maxHeight: '100px', overflowY: 'auto' }}>
                {jugadores.map((j, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #30363d', fontSize: '14px' }}>
                    <span>{i+1}. {j}</span>
                    <button onClick={() => setJugadores(jugadores.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#f44336' }}>✖</button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setVistaActual('MESAS')} style={{ width: '100%', padding: '15px', backgroundColor: '#ffa500', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '20px' }}>GUARDAR Y VOLVER</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
