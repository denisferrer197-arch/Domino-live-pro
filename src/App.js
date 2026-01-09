import React, { useState } from 'react';

function App() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [historial, setHistorial] = useState([]);

  const anotarPuntos = (equipo) => {
    const valor = parseInt(prompt("¿Cuántos puntos anotaron?"), 10);
    if (!isNaN(valor)) {
      if (equipo === 'A') {
        setPuntosA(puntosA + valor);
        setHistorial([...historial, { a: valor, b: '-' }]);
      } else {
        setPuntosB(puntosB + valor);
        setHistorial([...historial, { a: '-', b: valor }]);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#001529', color: 'white', fontFamily: 'sans-serif' }}>
      {/* MARCADOR GIGANTE DIVIDIDO */}
      <div style={{ display: 'flex', flex: 1, borderBottom: '2px solid #444' }}>
        <div style={{ flex: 1, borderRight: '1px solid #444', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => anotarPuntos('A')}>
          <h2 style={{ color: '#1890ff' }}>EQUIPO A</h2>
          <h1 style={{ fontSize: '100px', margin: 0 }}>{puntosA}</h1>
          <p>Toca para anotar</p>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => anotarPuntos('B')}>
          <h2 style={{ color: '#f5222d' }}>EQUIPO B</h2>
          <h1 style={{ fontSize: '100px', margin: 0 }}>{puntosB}</h1>
          <p>Toca para anotar</p>
        </div>
      </div>

      {/* TABLA DE REGISTRO */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid white' }}>
              <th>Ronda</th>
              <th>A</th>
              <th>B</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((ronda, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                <td>{i + 1}</td>
                <td style={{ color: '#1890ff' }}>{ronda.a}</td>
                <td style={{ color: '#f5222d' }}>{ronda.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
