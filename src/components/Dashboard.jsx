import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2 } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [outputFormat, setOutputFormat] = useState('JSON')
  const [dictionaryType, setDictionaryType] = useState('zapoteco')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extractedData, setExtractedData] = useState([]) 
  const fileRef = useRef(null)

  // 1. CARGA DE DATOS: Conexión con public/data/
  useEffect(() => {
    if (!uploadedFile) {
      // Forzamos minúsculas para evitar errores 404 en GitHub
      const fileName = dictionaryType.toLowerCase();
      // Añadimos un "timestamp" (?t=...) para obligar al navegador a no usar la versión vieja (caché)
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?t=${new Date().getTime()}`;
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`No se encontró: ${url}`);
          return res.json();
        })
        .then(data => {
          // Extrae el arreglo dinámicamente sin importar el nombre de la llave principal
          const key = Object.keys(data)[0];
          const listaReal = Array.isArray(data[key]) ? data[key] : [];
          setExtractedData(listaReal);
        })
        .catch(err => {
          console.error("Error en la carga:", err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // 2. FUNCIÓN DE DESCARGA: Crea un archivo JSON localmente
  const descargarDiccionario = () => {
    if (extractedData.length === 0) return alert("No hay datos para descargar");

    const dataStr = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `diccionario_${dictionaryType}_procesado.json`;
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3. PREVISUALIZACIONES
  const previewText = useMemo(() => {
    if (extractedData.length === 0) return 'Buscando datos en el servidor...';
    return JSON.stringify(extractedData.slice(0, 3), null, 2) + "\n\n... (inicio del archivo)";
  }, [extractedData]);

  const mdfPreview = useMemo(() => {
    if (!extractedData || extractedData.length === 0) return "Esperando sincronización...";
    const item = extractedData[0]; 
    return [
      `\\id ${item["\\id"] || 'N/A'}`,
      `\\lx ${item["\\lx"] || ''}`,
      `\\ps ${item["\\ps"] || ''}`,
      `\\de ${item["\\de"] || ''}`,
      `\\dn ${item["\\dn"] || ''}`,
      `\\xv ${item["\\xv"] || ''}`
    ].join('\n');
  }, [extractedData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">Dashboard</p>
          <h2>Panel de Control Lexicográfico</h2>
          <p>Visualización en tiempo real de diccionarios procesados.</p>
        </div>

        <div className="dashboard__grid">
          {/* PANEL DE CONTROL */}
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
              <input ref={fileRef} type="file" className="dashboard__hidden-input" accept=".docx,.pdf,.txt" onChange={handleFileChange} />

              {uploadedFile && (
                <div className="dashboard__file-ok">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>{uploadedFile.name}</span>
                </div>
              )}

              <div>
                <label>Seleccionar Lengua</label>
                <select value={dictionaryType} onChange={(e) => setDictionaryType(e.target.value)}>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="iskonawa">Iskonawa</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>

              <div className="dashboard__status">
                <p className="dashboard__status-title">Estado del Diccionario</p>
                <p>Entradas: <strong>{extractedData.length}</strong></p>
                <p>Base: <code>/public/data/</code></p>
              </div>
            </div>
          </div>

          {/* PANEL JSON */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura JSON</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{previewText}</pre>
            </div>
          </div>

          {/* PANEL MDF */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Ficha Técnica (MDF)</h3>
              </div>
              <button 
                onClick={descargarDiccionario}
                className="pill-button pill-button--primary dashboard__download"
              >
                <Download size={16} />
                Descargar
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
