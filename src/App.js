import React, { useState } from 'react';

function App() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);

  return (
    <div style={{ backgroundColor: '#1a1a1a', color: 'white', height: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🏆 TORNEO DE DOMINÓ</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '50px' }}>
        <div>
          <h2>PAREJA A</h2>
          <p style={{ fontSize: '50px' }}>{puntosA}</p>
          <button onClick={() => setPuntosA(puntosA + 1)} style={{ padding: '10px 20px', fontSize: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>+1 Punto</button>
          <br/><br/>
          <button onClick={() => setPuntosA(0)} style={{ color: 'gray', background: 'none', border: 'none' }}>Reiniciar</button>
        </div>

        <div>
          <h2>PAREJA B</h2>
          <p style={{ fontSize: '50px' }}>{puntosB}</p>
          <button onClick={() => setPuntosB(puntosB + 1)} style={{ padding: '10px 20px', fontSize: '20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}>+1 Punto</button>
          <br/><br/>
          <button onClick={() => setPuntosB(0)} style={{ color: 'gray', background: 'none', border: 'none' }}>Reiniciar</button>
        </div>
      </div>
    </div>
  );
}

export default App;
