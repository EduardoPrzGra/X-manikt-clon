import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2, Clock } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('iskonawa')
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileRef = useRef(null)

  // 1. CARGA DESDE REPOSITORIO (Cloud)
  useEffect(() => {
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?v=${Date.now()}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          // Soporta tanto listas directas [] como objetos con llave raíz
          const lista = Array.isArray(data) ? data : data[Object.keys(data)[0]];
          setExtractedData(lista || []);
        })
        .catch(() => setExtractedData([]));
    }
  }, [dictionaryType, uploadedFile]);

  // 2. PROCESAMIENTO DE ARCHIVOS CRUDOS (PDF, DOCX, TXT)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);

      // Simulación de ejecución del script de Python (1.5 segundos)
      setTimeout(() => {
        setIsProcessing(false);
        
        // Mock de datos para la presentación
        setExtractedData([{ 
          id: "AUTO", 
          lx: file.name.split('.')[0], 
          ps: "archivo_" + file.name.split('.').pop(),
          dn: `Contenido extraído exitosamente del archivo ${file.name}. El motor X-Manikt ha identificado la estructura léxica y está listo para la conversión final.`,
          de: "Content successfully extracted. Python engine ready for final conversion."
        }]);
      }, 1500);
    }
  };

  // 3. VISTA PREVIA MDF
  const mdfPreview = useMemo(() => {
    if (isProcessing) return "Ejecutando extractor de Python...";
    if (!extractedData || extractedData.length === 0) return "Esperando entrada...";
    
    const item = extractedData[0]; 
    return [
      `\\id ${item.id || '---'}`,
      `\\lx ${item.lx || ''}`,
      `\\ps ${item.ps || ''}`,
      `\\dn ${item.dn || ''}`,
      `\\de ${item.de || ''}`
    ].join('\n');
  }, [extractedData, isProcessing]);

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT CORE</p>
          <h2>Dashboard de Procesamiento</h2>
        </div>

        <div className="dashboard__grid">
          {/* PANEL DE CONFIGURACIÓN */}
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">
            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <h3>Entrada Cruda</h3>
            </div>
            
            <div className="dashboard__controls">
              {/* SOPORTE PARA PDF, DOCX Y TXT */}
              <button 
                onClick={() => fileRef.current?.click()} 
                className={`dashboard__upload-box ${isProcessing ? 'processing' : ''}`}
              >
                <div className="dashboard__upload-icon">
                  {isProcessing ? <Clock size={24} className="spin" /> : <Upload size={24} />}
                </div>
                <span>{isProcessing ? "Procesando..." : "Subir Diccionario"}</span>
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
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} className="btn-remove">×</button>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <label>Ver Resultados del Repo</label>
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
                <p>Status: <strong>{isProcessing ? "Extrayendo..." : "En Línea"}</strong></p>
                <p>Engine: <span>Python/MDF</span></p>
              </div>
            </div>
          </div>

          {/* PANEL CENTRAL: JSON */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura Extraída (JSON)</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>
                {isProcessing 
                  ? "// Ejecutando script de extracción..." 
                  : JSON.stringify(extractedData.slice(0, 2), null, 4)
                }
              </pre>
            </div>
          </div>

          {/* PANEL DERECHO: MDF */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Formato Lingüístico</h3>
              </div>
              <button 
                onClick={() => {
                  const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `XManikt_Export.json`;
                  a.click();
                }} 
                className="pill-button pill-button--primary"
              >
                <Download size={14} /> Exportar
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
