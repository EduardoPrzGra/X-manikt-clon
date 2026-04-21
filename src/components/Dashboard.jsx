import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2, Clock } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('iskonawa')
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileRef = useRef(null)

  // 1. CARGA AUTOMÁTICA DESDE EL REPOSITORIO
  useEffect(() => {
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?v=${Date.now()}`;
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("No se encontró el archivo");
          return res.json();
        })
        .then(data => {
          // Detecta si es una lista directa [] o si viene envuelto en una llave {"lang": []}
          const listaReal = Array.isArray(data) ? data : data[Object.keys(data)[0]];
          setExtractedData(listaReal || []);
        })
        .catch(err => {
          console.error("Error al cargar:", err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // 2. MANEJO DE SUBIDA (SIMULACIÓN DE MOTOR PYTHON)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      
      // Simulamos el proceso de extracción de tu script
      setTimeout(() => {
        setIsProcessing(false);
        setExtractedData([{ 
          id: "AUTO", 
          lx: file.name.split('.')[0], 
          ps: "procesado", 
          dn: `Contenido extraído del archivo ${file.name}. Listo para estructuración MDF.` 
        }]);
      }, 1500);
    }
  };

  // 3. PREVISUALIZACIÓN MDF (PROTEGIDA)
  const mdfPreview = useMemo(() => {
    if (isProcessing) return "Procesando archivo mediante motor X-Manikt...";
    if (!extractedData || extractedData.length === 0) return "Esperando datos...";
    
    const item = extractedData[0]; 
    return [
      `\\id ${item.id || '---'}`,
      `\\lx ${item.lx || ''}`,
      `\\ps ${item.ps || ''}`,
      `\\dn ${item.dn || ''}`,
      `\\de ${item.de || ''}`
    ].join('\n');
  }, [extractedData, isProcessing]);

  // 4. FUNCIÓN DE DESCARGA
  const descargarDiccionario = () => {
    if (extractedData.length === 0) return alert("No hay datos para exportar");
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XManikt_${dictionaryType}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT CORE</p>
          <h2>Panel de Control Lexicográfico</h2>
          <p>Gestión y validación de diccionarios en lenguas indígenas.</p>
        </div>

        <div className="dashboard__grid">
          {/* SECCIÓN 1: CONFIGURACIÓN Y STATUS */}
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">
            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <h3>Configuración</h3>
            </div>
            
            <div className="dashboard__controls">
              <button onClick={() => fileRef.current?.click()} className="dashboard__upload-box">
                <div className="dashboard__upload-icon">
                  {isProcessing ? <Clock size={24} className="spin" /> : <Upload size={24} />}
                </div>
                <span>{isProcessing ? "Extrayendo..." : "Subir Diccionario"}</span>
                <small>.pdf · .docx · .txt</small>
              </button>
              
              <input 
                ref={fileRef} 
                type="file" 
                className="dashboard__hidden-input" 
                accept=".pdf,.docx,.txt" 
                onChange={handleFileUpload} 
              />

              {uploadedFile && (
                <div className="dashboard__file-ok">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontSize: '11px' }}>{uploadedFile.name}</span>
                  <button onClick={() => {setUploadedFile(null); setDictionaryType('iskonawa');}} className="btn-clear">×</button>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <label>Diccionarios Disponibles</label>
                <select 
                  value={dictionaryType} 
                  onChange={(e) => {setUploadedFile(null); setDictionaryType(e.target.value);}}
                  disabled={isProcessing}
                >
                  <option value="iskonawa">Iskonawa</option>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>

              <div className="dashboard__status">
                <p>Status: <strong style={{color: isProcessing ? '#f59e0b' : '#10b981'}}>
                  {isProcessing ? "Analizando..." : "Activo"}
                </strong></p>
                {/* AQUÍ REGRESÓ EL CONTADOR DE PALABRAS */}
                <p>Palabras encontradas: <strong>{extractedData.length.toLocaleString()}</strong></p>
                <p>Motor: <span>Python / MDF</span></p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: ESTRUCTURA JSON (CENTRAL) */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura JSON</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{isProcessing ? "// Procesando binarios..." : JSON.stringify(extractedData.slice(0, 3), null, 4)}</pre>
              {extractedData.length > 3 && (
                <div className="dashboard__code-footer">
                   ... y {extractedData.length - 3} entradas adicionales cargadas.
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 3: DESCARGA Y FICHA TÉCNICA (DERECHA) */}
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
