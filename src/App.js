import React, { useState } from 'react';

function App() {
  // Estados para el juego
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [entradaA, setEntradaA] = useState('');
  const [entradaB, setEntradaB] = useState('');
  
  // Estados para la navegación y ajustes
  const [vistaActual, setVistaActual] = useState('MESAS');
  const [nombreTorneo, setNombreTorneo] = useState('Torneo de Dominó Live');
  const [metaPuntos, setMetaPuntos] = useState(100);
  const [totalRondas, setTotalRondas] = useState(2);

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
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    minWidth: '80px'
  });

  const inputAjusteStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    marginBottom: '20px',
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px'
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#0a0b0d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* ENCABEZADO Y NAVEGACIÓN */}
      <header style={{ backgroundColor: '#161b22', padding: '20px 0', borderBottom: '1px solid #30363d' }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#FFD700', fontSize: '22px' }}>{nombreTorneo.toUpperCase()}</h1>
        
        <nav style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setVistaActual('MESAS')} style={navButtonStyle('MESAS')}>
            <span style={{fontSize: '20px'}}>▶️</span> MESAS
          </button>
          <button onClick={() => setVistaActual('RANKING')} style={navButtonStyle('RANKING')}>
            <span style={{fontSize: '20px'}}>🏆</span> RANKING
          </button>
          <button onClick={() => setVistaActual('EQUIPOS')} style={navButtonStyle('EQUIPOS')}>
            <span style={{fontSize: '20px'}}>👥</span> EQUIPOS
          </button>
          <button onClick={() => setVistaActual('AJUSTES')} style={navButtonStyle('AJUSTES')}>
            <span style={{fontSize: '20px'}}>⚙️</span> AJUSTES
          </button>
        </nav>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* VISTA DE MESAS (JUEGO) */}
        {vistaActual === 'MESAS' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <div style={{ border: '2px solid #4caf50', padding: '15px', borderRadius: '15px', width: '48%', backgroundColor: '#161b22' }}>
              <h2 style={{color: '#4caf50', fontSize: '16px'}}>PAREJA A</h2>
              <div style={{ fontSize: '60px', margin: '10px 0' }}>{puntosA}</div>
              <input type="number" value={entradaA} onChange={(e) => setEntradaA(e.target.value)} placeholder="Pts" style={{ width: '70%', padding: '10px', backgroundColor: '#0d1117', color: 'white', border: '1px solid #30363d', borderRadius: '5px' }} />
              <button onClick={() => sumarPuntos('A')} style={{ marginTop: '10px', width: '90%', padding: '12px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>ANOTAR</button>
            </div>

            <div style={{ border: '2px solid #f44336', padding: '15px', borderRadius: '15px', width: '48%', backgroundColor: '#161b22' }}>
              <h2 style={{color: '#f44336', fontSize: '16px'}}>PAREJA B</h2>
              <div style={{ fontSize: '60px', margin: '10px 0' }}>{puntosB}</div>
              <input type="number" value={entradaB} onChange={(e) => setEntradaB(e.target.value)} placeholder="Pts" style={{ width: '70%', padding: '10px', backgroundColor: '#0d1117', color: 'white', border: '1px solid #30363d', borderRadius: '5px' }} />
              <button onClick={() => sumarPuntos('B')} style={{ marginTop: '10px', width: '90%', padding: '12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>ANOTAR</button>
            </div>
          </div>
        )}

        {/* VISTA DE AJUSTES (TU PANEL) */}
        {vistaActual === 'AJUSTES' && (
          <div style={{ textAlign: 'left', backgroundColor: '#161b22', padding: '25px', borderRadius: '15px', marginTop: '10px' }}>
            <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
              ⚙️ AJUSTES GENERALES
            </h2>

            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>NOMBRE DEL TORNEO</label>
            <input type="text" value={nombreTorneo} onChange={(e) => setNombreTorneo(e.target.value)} style={inputAjusteStyle} />

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ width: '45%' }}>
                <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>TOTAL RONDAS</label>
                <input type="number" value={totalRondas} onChange={(e) => setTotalRondas(e.target.value)} style={inputAjusteStyle} />
              </div>
              <div style={{ width: '45%' }}>
                <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>TIEMPO (MIN)</label>
                <input type="number" defaultValue="2" style={inputAjusteStyle} />
              </div>
            </div>

            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>META DE PUNTOS (Para ganar)</label>
            <input type="number" value={metaPuntos} onChange={(e) => setMetaPuntos(e.target.value)} style={inputAjusteStyle} />

            <label style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'bold' }}>MÉTODO EMPAREJAMIENTO</label>
            <select style={inputAjusteStyle}>
              <option>Automático (Aleatorio)</option>
              <option>Manual</option>
            </select>
            
            <button onClick={() => setVistaActual('MESAS')} style={{ width: '100%', padding: '15px', backgroundColor: '#ffa500', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: 'black' }}>
              GUARDAR Y VOLVER
            </button>
          </div>
        )}

        {vistaActual === 'RANKING' && <h2 style={{marginTop: '50px'}}>Próximamente: Tabla de Posiciones</h2>}
        {vistaActual === 'EQUIPOS' && <h2 style={{marginTop: '50px'}}>Próximamente: Gestión de Jugadores</h2>}

      </main>
    </div>
  );
}

export default App;
