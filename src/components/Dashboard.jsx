import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2 } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('iskonawa') // Default a Iskonawa por tu ejemplo
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileRef = useRef(null)

  // 1. CARGA DE DATOS: Lee directamente el arreglo del JSON
  useEffect(() => {
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      // El parámetro ?v asegura que no se use caché vieja
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?v=${Date.now()}`;
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("Archivo no encontrado");
          return res.json();
        })
        .then(data => {
          // Si el JSON es una lista directa [...], la guardamos. 
          // Si viene envuelto en una llave, extraemos esa llave.
          const listaReal = Array.isArray(data) ? data : data[Object.keys(data)[0]];
          setExtractedData(listaReal || []);
        })
        .catch(err => {
          console.error("Error cargando el JSON:", err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // 2. FORMATEO MDF: Ahora usamos las llaves limpias ("lx", "ps", "dn")
  const mdfPreview = useMemo(() => {
    if (!extractedData || extractedData.length === 0) return "Cargando datos...";
    const item = extractedData[0]; // Vista previa del primer objeto

    return [
      `\\id ${item.id || '---'}`,
      `\\lx ${item.lx || ''}`,
      `\\ps ${item.ps || ''}`,
      `\\dn ${item.dn || ''}`,
      `\\de ${item.de || ''}`,
      `\\xv ${item.xv || ''}`, // Por si algún archivo tiene ejemplos
      `\\xn ${item.xn || ''}`
    ].join('\n');
  }, [extractedData]);

  // 3. FUNCIÓN DE DESCARGA
  const descargarDiccionario = () => {
    if (extractedData.length === 0) return;
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diccionario_${dictionaryType}_limpio.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT CORE</p>
          <h2>Dashboard de Visualización</h2>
        </div>

        <div className="dashboard__grid">
          {/* PANEL DE CONTROL */}
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">
            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <h3>Configuración</h3>
            </div>
            <div className="dashboard__controls">
              <div>
                <label>Lengua Indígena</label>
                <select value={dictionaryType} onChange={(e) => setDictionaryType(e.target.value)}>
                  <option value="iskonawa">Iskonawa</option>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>
              <div className="dashboard__status">
                <p>Entradas totales: <strong>{extractedData.length}</strong></p>
                <p>Estado: <span style={{color: '#10b981'}}>Sincronizado</span></p>
              </div>
            </div>
          </div>

          {/* VISTA JSON REAL */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura JSON</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{extractedData.length > 0 ? JSON.stringify(extractedData.slice(0, 2), null, 4) : "Cargando archivo..."}</pre>
            </div>
          </div>

          {/* VISTA FORMATO LINGÜÍSTICO */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Ficha MDF</h3>
              </div>
              <button onClick={descargarDiccionario} className="pill-button pill-button--primary">
                <Download size={16} /> Descargar
              </button>
            </div>
            <div className="dashboard__code dashboard__code--light">
              <pre>{mdfPreview}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
