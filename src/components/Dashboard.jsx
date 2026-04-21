import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2 } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [outputFormat, setOutputFormat] = useState('JSON')
  const [dictionaryType, setDictionaryType] = useState('zapoteco')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extractedData, setExtractedData] = useState([]) 
  const fileRef = useRef(null)

  // 1. CARGA DE DATOS: Busca en public/data/diccionario_XXX.json
  useEffect(() => {
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json`;
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("Archivo no encontrado");
          return res.json();
        })
        .then(data => {
          // Extrae el arreglo sin importar si la llave es "zapoteco", "maya", etc.
          const key = Object.keys(data)[0];
          const listaReal = Array.isArray(data[key]) ? data[key] : [];
          setExtractedData(listaReal);
        })
        .catch(err => {
          console.error("Error cargando el diccionario:", err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // 2. PREVISUALIZACIÓN JSON
  const previewText = useMemo(() => {
    if (extractedData.length === 0) return 'Cargando datos...';
    
    if (outputFormat === 'JSON') {
      return JSON.stringify(extractedData.slice(0, 3), null, 2) + "\n\n... (mostrando inicio del archivo)";
    }
    return "Formato YAML no disponible en esta vista.";
  }, [extractedData, outputFormat]);

  // 3. PREVISUALIZACIÓN MDF (Usa las llaves con doble barra como están en tus JSON)
  const mdfPreview = useMemo(() => {
    if (!extractedData || extractedData.length === 0) return "Sin datos disponibles";
    const item = extractedData[0]; 
    return [
      `\\id ${item["\\id"] || ''}`,
      `\\lx ${item["\\lx"] || ''}`,
      `\\ps ${item["\\ps"] || ''}`,
      `\\ph ${item["\\ph"] || ''}`,
      `\\de ${item["\\de"] || ''}`,
      `\\dn ${item["\\dn"] || ''}`,
      `\\xv ${item["\\xv"] || ''}`,
      `\\xn ${item["\\xn"] || ''}`
    ].join('\n');
  }, [extractedData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }
  const descargarDiccionario = () => {
      if (extractedData.length === 0) return alert("No hay datos para descargar");
  
      // Convertimos el JSON a un String bonito
      const dataStr = JSON.stringify(extractedData, null, 2);
      
      // Creamos un "Blob" (un objeto tipo archivo)
      const blob = new Blob([dataStr], { type: 'application/json' });
      
      // Creamos un link invisible para forzar la descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diccionario_${dictionaryType}.json`; // Nombre del archivo
      
      document.body.appendChild(link);
      link.click();
      
      // Limpiamos la memoria
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">Dashboard</p>
          <h2>Panel de Control Lexicográfico</h2>
          <p>Explora y valida la estructura de los diccionarios procesados.</p>
        </div>

        <div className="dashboard__grid">
          {/* CONFIGURACIÓN */}
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
                  <CheckCircle2 size={18} />
                  <span>{uploadedFile.name}</span>
                </div>
              )}

              <div>
                <label>Lengua a Visualizar</label>
                <select value={dictionaryType} onChange={(e) => setDictionaryType(e.target.value)}>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="iskonawa">Iskonawa</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>

              <div>
                <label>Formato de Salida</label>
                <div className="dashboard__toggle-row">
                  {['JSON', 'YAML'].map((format) => (
                    <button key={format} onClick={() => setOutputFormat(format)}
                      className={outputFormat === format ? 'dashboard__toggle dashboard__toggle--active' : 'dashboard__toggle'}>
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dashboard__status">
                <p className="dashboard__status-title">Estadísticas del Archivo</p>
                <p>Entradas: {extractedData.length}</p>
                <p>Estado: <span style={{color: '#10b981'}}>Sincronizado</span></p>
              </div>
            </div>
          </div>

          {/* VISTA JSON */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura {outputFormat}</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{previewText}</pre>
            </div>
          </div>

          {/* VISTA MDF */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Formato MDF</h3>
              </div>
              <button onClick={descargarDiccionario} className="pill-button pill-button--primary dashboard__download">
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
