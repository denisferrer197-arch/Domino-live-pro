import React, { useState } from 'react';

function App() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [entradaA, setEntradaA] = useState('');
  const [entradaB, setEntradaB] = useState('');

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

  const navButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#8a8d91',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#0a0b0d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* ENCABEZADO Y NAVEGACIÓN */}
      <header style={{ backgroundColor: '#161b22', padding: '20px 0', borderBottom: '1px solid #30363d' }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#FFD700', fontSize: '24px' }}>🏆 TORNEO DE DOMINÓ PRO</h1>
        
        <nav style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '500px', margin: '0 auto' }}>
          <button style={{...navButtonStyle, color: '#ffa500'}}>
            <span style={{fontSize: '20px'}}>▶️</span> MESAS
          </button>
          <button style={navButtonStyle}>
            <span style={{fontSize: '20px'}}>🏆</span> RANKING
          </button>
          <button style={navButtonStyle}>
            <span style={{fontSize: '20px'}}>👥</span> EQUIPOS
          </button>
          <button style={navButtonStyle}>
            <span style={{fontSize: '20px'}}>⚙️</span> AJUSTES
          </button>
        </nav>
      </header>

      {/* ÁREA DE JUEGO (MESAS) */}
      <main style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          <div style={{ border: '2px solid #4caf50', padding: '20px', borderRadius: '15px', width: '45%', backgroundColor: '#161b22' }}>
            <h2 style={{color: '#4caf50'}}>PAREJA A</h2>
            <div style={{ fontSize: '80px', margin: '15px 0', fontWeight: 'bold' }}>{puntosA}</div>
            <input type="number" value={entradaA} onChange={(e) => setEntradaA(e.target.value)} placeholder="Puntos" style={{ width: '80%', padding: '12px', fontSize: '18px', textAlign: 'center', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: 'white' }} />
            <button onClick={() => sumarPuntos('A')} style={{ marginTop: '15px', width: '90%', padding: '15px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>ANOTAR</button>
          </div>

          <div style={{ border: '2px solid #f44336', padding: '20px', borderRadius: '15px', width: '45%', backgroundColor: '#161b22' }}>
            <h2 style={{color: '#f44336'}}>PAREJA B</h2>
            <div style={{ fontSize: '80px', margin: '15px 0', fontWeight: 'bold' }}>{puntosB}</div>
            <input type="number" value={entradaB} onChange={(e) => setEntradaB(e.target.value)} placeholder="Puntos" style={{ width: '80%', padding: '12px', fontSize: '18px', textAlign: 'center', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: 'white' }} />
            <button onClick={() => sumarPuntos('B')} style={{ marginTop: '15px', width: '90%', padding: '15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>ANOTAR</button>
          </div>
        </div>

        <button onClick={() => { if(window.confirm("¿Reiniciar?")) { setPuntosA(0); setPuntosB(0); } }} style={{ marginTop: '40px', backgroundColor: 'transparent', color: '#8b949e', border: '1px solid #30363d', padding: '10px 20px', borderRadius: '6px' }}>
          Reiniciar Mesa Actual
        </button>
      </main>
    </div>
  );
}

export default App;
