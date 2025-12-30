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

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#121212', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#FFD700' }}>🏆 TORNEO DE DOMINÓ PRO</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
        <div style={{ border: '2px solid #4caf50', padding: '20px', borderRadius: '15px', width: '45%' }}>
          <h2>PAREJA A</h2>
          <div style={{ fontSize: '80px', margin: '20px 0' }}>{puntosA}</div>
          <input type="number" value={entradaA} onChange={(e) => setEntradaA(e.target.value)} placeholder="Puntos" style={{ width: '80%', padding: '10px', fontSize: '20px', textAlign: 'center' }} />
          <button onClick={() => sumarPuntos('A')} style={{ marginTop: '15px', width: '90%', padding: '15px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px' }}>ANOTAR</button>
        </div>
        <div style={{ border: '2px solid #f44336', padding: '20px', borderRadius: '15px', width: '45%' }}>
          <h2>PAREJA B</h2>
          <div style={{ fontSize: '80px', margin: '20px 0' }}>{puntosB}</div>
          <input type="number" value={entradaB} onChange={(e) => setEntradaB(e.target.value)} placeholder="Puntos" style={{ width: '80%', padding: '10px', fontSize: '20px', textAlign: 'center' }} />
          <button onClick={() => sumarPuntos('B')} style={{ marginTop: '15px', width: '90%', padding: '15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px' }}>ANOTAR</button>
        </div>
      </div>
      <button onClick={() => { setPuntosA(0); setPuntosB(0); }} style={{ marginTop: '50px', backgroundColor: 'transparent', color: '#888', border: '1px solid #888', padding: '10px 20px' }}>Reiniciar Marcador</button>
    </div>
  );
}

export default App;
