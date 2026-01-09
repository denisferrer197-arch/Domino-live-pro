import React, { useState } from 'react';
import './App.css';

function App() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#001529', color: 'white', textAlign: 'center' }}>
      {/* LADO EQUIPO A */}
      <div style={{ flex: 1, borderRight: '2px solid white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2>EQUIPO A</h2>
        <h1 style={{ fontSize: '120px', margin: '20px 0' }}>{puntosA}</h1>
        <div>
          <button onClick={() => setPuntosA(puntosA + 1)} style={{ padding: '20px', fontSize: '20px', margin: '5px' }}>+1</button>
          <button onClick={() => setPuntosA(puntosA > 0 ? puntosA - 1 : 0)} style={{ padding: '20px', fontSize: '20px', margin: '5px' }}>-1</button>
        </div>
      </div>

      {/* LADO EQUIPO B */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2>EQUIPO B</h2>
        <h1 style={{ fontSize: '120px', margin: '20px 0' }}>{puntosB}</h1>
        <div>
          <button onClick={() => setPuntosB(puntosB + 1)} style={{ padding: '20px', fontSize: '20px', margin: '5px' }}>+1</button>
          <button onClick={() => setPuntosB(puntosB > 0 ? puntosB - 1 : 0)} style={{ padding: '20px', fontSize: '20px', margin: '5px' }}>-1</button>
        </div>
      </div>
    </div>
  );
}

export default App;
