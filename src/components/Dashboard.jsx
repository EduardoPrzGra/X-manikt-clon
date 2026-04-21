import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2 } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('zapoteco')
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileRef = useRef(null)

  // 1. CARGA DINÁMICA DE ARCHIVOS
  useEffect(() => {
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      // El parámetro ?t= ayuda a que GitHub Pages no sirva versiones viejas (cache)
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?t=${new Date().getTime()}`;
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`No se encontró el archivo: diccionario_${fileName}.json`);
          return res.json();
        })
        .then(data => {
          // Extraemos la lista buscando la llave principal (zapoteco, maya, etc.)
          const key = Object.keys(data)[0];
          const listaReal = Array.isArray(data[key]) ? data[key] : [];
          setExtractedData(listaReal);
        })
        .catch(err => {
          console.error("Error cargando diccionario:", err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // 2. FUNCIÓN PARA DESCARGAR
  const descargarDiccionario = () => {
    if (extractedData.length === 0) return alert("No hay datos para descargar");
    const dataStr = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diccionario_${dictionaryType}_XManikt.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3. FORMATEO DE VISTAS (Maneja las llaves con doble barra invertida)
  const jsonPreview = useMemo(() => {
    if (extractedData.length === 0) return 'Cargando datos del repositorio...';
    return JSON.stringify(extractedData.slice(0, 3), null, 2) + "\n\n... (Mostrando inicio del diccionario)";
  }, [extractedData]);

  const mdfPreview = useMemo(() => {
    if (extractedData.length === 0) return "Sincronizando con base de datos...";
    const item = extractedData[0];
    
    // Función para obtener valores de llaves con barras invertidas
    const getMdf = (key) => item[`\\\\${key}`] || item[key] || '---';

    return [
      `\\id ${getMdf('id')}`,
      `\\lx ${getMdf('lx')}`,
      `\\ps ${getMdf('ps')}`,
      `\\de ${getMdf('de')}`,
      `\\dn ${getMdf('dn')}`,
      `\\xv ${getMdf('xv')}`,
      `\\xn ${getMdf('xn')}`
    ].join('\n');
  }, [extractedData]);

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT DASHBOARD</p>
          <h2>Gestión de Diccionarios</h2>
        </div>

        <div className="dashboard__grid">
          {/* PANEL IZQUIERDO: CONFIGURACIÓN */}
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">
            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <h3>Configuración</h3>
            </div>

            <div className="dashboard__controls">
              <button onClick={() => fileRef.current?.click()} className="dashboard__upload-box">
                <div className="dashboard__upload-icon"><Upload size={24} /></div>
                <span>Subir Diccionario</span>
                <small>.docx · .pdf · .txt</small>
              </button>
              <input ref={fileRef} type="file" className="dashboard__hidden-input" accept=".docx,.pdf,.txt" onChange={(e) => setUploadedFile(e.target.files[0])} />

              {uploadedFile && (
                <div className="dashboard__file-ok">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>{uploadedFile.name}</span>
                </div>
              )}

              <div>
                <label>Lengua Indígena</label>
                <select value={dictionaryType} onChange={(e) => setDictionaryType(e.target.value)}>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="iskonawa">Iskonawa</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>

              <div className="dashboard__status">
                <p className="dashboard__status-title">Información del Diccionario</p>
                <p>Entradas detectadas: <strong>{extractedData.length}</strong></p>
                <p>Fuente: <code>MDF Standard</code></p>
              </div>
            </div>
          </div>

          {/* PANEL CENTRAL: JSON */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura JSON (Raw)</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{jsonPreview}</pre>
            </div>
          </div>

          {/* PANEL DERECHO: MDF */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Formato Lingüístico (MDF)</h3>
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
