import React, { useState, useEffect } from 'react';

export default function App() {
  const [equipos, setEquipos] = useState(() => JSON.parse(localStorage.getItem('equipos_v2')) || []);
  const [enfrentamientos, setEnfrentamientos] = useState(() => JSON.parse(localStorage.getItem('vs_v2')) || []);
  const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem('config_v2')) || { 
    rondas: 4, tiempo: 20, ptsMax: 100, modalidad: 'Parejas', mensaje: '' 
  });

  const [vista, setVista] = useState('AJUSTES');
  const [subVista, setSubVista] = useState('MENU');
  const [nombreTmp, setNombreTmp] = useState('');
  const CLAVE_SEGURIDAD = "12233210"; 

  useEffect(() => {
    localStorage.setItem('equipos_v2', JSON.stringify(equipos));
    localStorage.setItem('vs_v2', JSON.stringify(enfrentamientos));
    localStorage.setItem('config_v2', JSON.stringify(config));
  }, [equipos, enfrentamientos, config]);

  const agregarEquipo = () => {
    if (!nombreTmp.trim()) return;
    const nuevaClave = Math.floor(1000 + Math.random() * 9000).toString();
    setEquipos([...equipos, { nombre: nombreTmp, clave: nuevaClave }]);
    setNombreTmp('');
  };

  const generarTorneo = () => {
    if (equipos.length < 2) return alert("❌ Registra al menos 2 equipos.");
    let nuevosVs = [];
    for (let r = 1; r <= (parseInt(config.rondas) || 1); r++) {
      let sorteo = [...equipos].sort(() => Math.random() - 0.5);
      for (let i = 0; i < sorteo.length; i += 2) {
        if (sorteo[i+1]) {
          nuevosVs.push({
            id: `R${r}-M${i}`, ronda: r, rival1: sorteo[i], rival2: sorteo[i+1],
            pts1: 0, pts2: 0, terminada: false
          });
        }
      }
    }
    setEnfrentamientos(nuevosVs);
    alert("✅ Torneo generado con éxito.");
  };

  const anotarPuntos = (id, rivalNum) => {
    const pts = parseInt(prompt("Puntos ganados:"));
    if (isNaN(pts)) return;
    setEnfrentamientos(prev => prev.map(m => {
      if (m.id === id) {
        let n1 = m.pts1 + (rivalNum === 1 ? pts : 0);
        let n2 = m.pts2 + (rivalNum === 2 ? pts : 0);
        let fin = n1 >= config.ptsMax || n2 >= config.ptsMax;
        return { ...m, pts1: n1, pts2: n2, terminada: fin };
      }
      return m;
    }));
  };

  const obtenerRanking = () => {
    let tabla = equipos.map(eq => ({ nombre: eq.nombre, pg: 0, ptsF: 0 }));
    enfrentamientos.filter(m => m.terminada).forEach(m => {
      let e1 = tabla.find(t => t.nombre === m.rival1.nombre);
      let e2 = tabla.find(t => t.nombre === m.rival2.nombre);
      if (e1 && e2) {
        e1.ptsF += m.pts1; e2.ptsF += m.pts2;
        if (m.pts1 > m.pts2) e1.pg += 1; else if (m.pts2 > m.pts1) e2.pg += 1;
      }
    });
    return tabla.sort((a, b) => b.pg - a.pg || b.ptsF - a.ptsF);
  };

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: '#0056b3', color: 'white', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
        DOMINÓ LIVE PRO
      </header>

      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px', padding: '8px' }}>
        <button onClick={() => setVista('AJUSTES')} style={btnNav}>AJUSTES</button>
        <button onClick={() => setVista('VS')} style={{...btnNav, backgroundColor: '#ffc107', color: '#000'}}>VS</button>
        <button onClick={() => setVista('MESAS')} style={{...btnNav, backgroundColor: '#28a745'}}>MESAS</button>
        <button onClick={() => setVista('RANKING')} style={{...btnNav, backgroundColor: '#007bff'}}>RANKING</button>
      </nav>

      {config.mensaje && (
        <div style={{background:'#fff3cd', padding:'5px', color:'#856404'}}><marquee>📢 {config.mensaje.toUpperCase()}</marquee></div>
      )}

      <main style={{ padding: '12px' }}>
        {/* --- VISTA AJUSTES --- */}
        {vista === 'AJUSTES' && subVista === 'TORNEO_FULL' && (
          <div style={card}>
            <h3 style={{textAlign:'center', color:'#0056b3', marginTop:0}}>Panel de Control 🔒</h3>
            
            <div style={seccion}>
              <label><b>1. Registro de Equipos:</b></label>
              <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                <input style={input} value={nombreTmp} onChange={e=>setNombreTmp(e.target.value)} placeholder="Nombre..." />
                <button onClick={agregarEquipo} style={btnPlus}>+</button>
              </div>
              <div style={listaScroll}>
                {equipos.map((eq, i) => (
                  <div key={i} style={itemEquipo}><span>{eq.nombre}</span><span style={{color:'#007bff'}}>🔑 {eq.clave}</span></div>
                ))}
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              <div style={seccion}><label><b>2. Rondas:</b></label><input type="number" style={input} value={config.rondas} onChange={e=>setConfig({...config, rondas: e.target.value})} /></div>
              <div style={seccion}><label><b>3. Tiempo:</b></label><input type="number" style={input} value={config.tiempo} onChange={e=>setConfig({...config, tiempo: e.target.value})} /></div>
              <div style={seccion}>
                <label><b>4. Modalidad:</b></label>
                <select style={input} value={config.modalidad} onChange={e=>setConfig({...config, modalidad: e.target.value})}>
                  <option value="Parejas">Parejas</option><option value="Individual">Individual</option>
                </select>
              </div>
              <div style={seccion}><label><b>6. Pts. Máximos:</b></label><input type="number" style={input} value={config.ptsMax} onChange={e=>setConfig({...config, ptsMax: e.target.value})} /></div>
            </div>

            <div style={seccion}>
              <label><b>5. Mensajes:</b></label>
              <textarea style={textarea} value={config.mensaje} onChange={e=>setConfig({...config, mensaje: e.target.value})} />
            </div>

            <button onClick={generarTorneo} style={btnVerde}>GENERAR TORNEO / VS</button>
            <button onClick={()=>{if(window.confirm("¿BORRAR TODO?")) {localStorage.clear(); window.location.reload();}}} style={btnRojo}>REINICIAR TORNEO</button>
            <button onClick={() => setSubVista('MENU')} style={btnLink}>← Salir al Menú</button>
          </div>
        )}

        {vista === 'AJUSTES' && subVista === 'MENU' && (
          <div style={{textAlign:'center', marginTop:'50px'}}>
            <button onClick={() => {
              const p = prompt("🔐 Clave:");
              if(p === CLAVE_SEGURIDAD) setSubVista('TORNEO_FULL');
            }} style={btnAzulLargo}>Torneo 🔒</button>
          </div>
        )}

        {/* --- VISTA VS --- */}
        {vista === 'VS' && (
          <div>{enfrentamientos.map(m => (
            <div key={m.id} style={cardVs}><small>RONDA {m.ronda}</small><br/><b>{m.rival1.nombre} vs {m.rival2.nombre}</b></div>
          ))}</div>
        )}

        {/* --- VISTA MESAS --- */}
        {vista === 'MESAS' && (
          <div>{enfrentamientos.map(m => (
            <div key={m.id} style={{...cardVs, borderLeft:'8px solid #28a745'}}>
              <div style={{display:'flex', justifyContent:'space-around'}}>
                <div>{m.rival1.nombre}<br/><b style={{fontSize:'22px'}}>{m.pts1}</b><br/>{!m.terminada && <button onClick={()=>anotarPuntos(m.id, 1)} style={btnMini}>+</button>}</div>
                <div style={{color:'#ccc', alignSelf:'center'}}>VS</div>
                <div>{m.rival2.nombre}<br/><b style={{fontSize:'22px'}}>{m.pts2}</b><br/>{!m.terminada && <button onClick={()=>anotarPuntos(m.id, 2)} style={btnMini}>+</button>}</div>
              </div>
              {m.terminada && <div style={{color:'red', fontWeight:'bold', fontSize:'12px', marginTop:'5px'}}>PARTIDA FINALIZADA</div>}
            </div>
          ))}</div>
        )}

        {/* --- VISTA RANKING --- */}
        {vista === 'RANKING' && (
          <div style={card}>
            <h3 style={{textAlign:'center', color:'#007bff'}}>Ranking 🏆</h3>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
              <thead><tr style={{borderBottom:'2px solid #eee', textAlign:'left'}}><th>Pos</th><th>Equipo</th><th>PG</th><th>Pts</th></tr></thead>
              <tbody>{obtenerRanking().map((r, i) => (
                <tr key={i} style={{borderBottom:'1px solid #f0f0f0'}}><td style={{padding:'10px'}}>{i+1}</td><td>{r.nombre}</td><td style={{color:'green', fontWeight:'bold'}}>{r.pg}</td><td>{r.ptsF}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS DE LA VERSIÓN DE TABLET
const btnNav = { border:'none', padding:'12px 2px', color:'white', backgroundColor:'#495057', borderRadius:'5px', fontSize:'11px', fontWeight:'bold' };
const card = { background:'white', padding:'15px', borderRadius:'15px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)', maxWidth:'400px', margin:'auto' };
const cardVs = { background:'white', padding:'15px', borderRadius:'10px', marginBottom:'10px', textAlign:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.05)' };
const input = { padding:'10px', width:'100%', borderRadius:'5px', border:'1px solid #ccc', boxSizing:'border-box' };
const textarea = { padding:'10px', width:'100%', borderRadius:'5px', border:'1px solid #ccc', minHeight:'40px', boxSizing:'border-box' };
const btnVerde = { backgroundColor:'#28a745', color:'white', border:'none', padding:'12px', borderRadius:'8px', width:'100%', marginTop:'10px', fontWeight:'bold' };
const btnRojo = { backgroundColor:'#dc3545', color:'white', border:'none', padding:'10px', borderRadius:'8px', width:'100%', marginTop:'5px', fontSize:'12px' };
const btnPlus = { backgroundColor:'#007bff', color:'white', border:'none', padding:'0 15px', borderRadius:'5px', fontSize:'20px' };
const btnMini = { background:'#007bff', color:'#fff', border:'none', borderRadius:'50%', width:'30px', height:'30px', marginTop:'5px' };
const btnAzulLargo = { backgroundColor:'#007bff', color:'white', border:'none', padding:'15px 40px', borderRadius:'10px', fontSize:'18px', fontWeight:'bold' };
const btnLink = { background:'none', border:'none', color:'#007bff', marginTop:'10px', fontSize:'13px', width:'100%', textDecoration:'underline' };
const seccion = { marginBottom:'12px', textAlign:'left' };
const listaScroll = { maxHeight:'80px', overflowY:'auto', background:'#f8f9fa', padding:'5px', borderRadius:'5px', marginTop:'5px', border:'1px solid #eee' };
const itemEquipo = { display:'flex', justifyContent:'space-between', padding:'3px 0', borderBottom:'1px solid #eee', fontSize:'12px' };
