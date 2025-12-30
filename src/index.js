import React, { useState } from 'react';
import { Trophy, Users, Shield, Settings } from 'lucide-react';

export default function App() {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkPin = () => {
    if (pin === '1234') { // Aquí puedes cambiar tu PIN después
      setIsAuthorized(true);
    } else {
      alert('PIN Incorrecto');
      setPin('');
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white', height: '100vh' }}>
        <Trophy size={48} color="#eab308" style={{ margin: '20px auto' }} />
        <h2>DOMINO LIVE PRO</h2>
        <p>Introduce el PIN de Administrador</p>
        <input 
          type="password" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '10px', textAlign: 'center' }}
        />
        <br />
        <button onClick={checkPin} style={{ padding: '10px 20px', backgroundColor: '#eab308', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          ENTRAR
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white', padding: '15px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Centro de Mando</h1>
        <Settings size={24} />
      </header>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div style={{ backgroundColor: '#1f2937', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #eab308' }}>
          <h3><Users size={18} /> Mesas Activas</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>12</p>
        </div>
        <div style={{ backgroundColor: '#1f2937', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #3b82f6' }}>
          <h3><Shield size={18} /> Jugadores</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>48</p>
        </div>
      </div>
      
      <p style={{ marginTop: '20px', color: '#9ca3af', textAlign: 'center' }}>Sistema Domino Live Pro v1.0</p>
    </div>
  );
}

ó

