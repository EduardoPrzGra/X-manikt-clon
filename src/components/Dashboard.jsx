import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2, Clock } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('iskonawa')
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?v=${Date.now()}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const lista = Array.isArray(data) ? data : data[Object.keys(data)[0]];
          setExtractedData(lista || []);
        })
        .catch(() => setExtractedData([]));
    }
  }, [dictionaryType, uploadedFile]);

  // --- LÓGICA PROTEGIDA PARA LA FICHA MDF ---
  const mdfPreview = useMemo(() => {
    if (isProcessing) return "Ejecutando extractor de Python...";
    
    // VALIDACIÓN CRÍTICA: Si no hay datos, devolvemos un mensaje en lugar de tronar
    if (!extractedData || extractedData.length === 0) {
      return "No hay datos disponibles para mostrar.";
    }
    
    // Si llegamos aquí, el elemento [0] sí existe
    const item = extractedData[0]; 
    return [
      `\\id ${item.id || '---'}`,
      `\\lx ${item.lx || ''}`,
      `\\ps ${item.ps || ''}`,
      `\\dn ${item.dn || ''}`,
      `\\de ${item.de || ''}`
    ].join('\n');
  }, [extractedData, isProcessing]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setExtractedData([{ 
          id: "AUTO", 
          lx: file.name.split('.')[0], 
          ps: "archivo_" + file.name.split('.').pop(),
          dn: `Contenido extraído del archivo ${file.name}.` 
        }]);
      }, 1500);
    }
  };

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT CORE</p>
          <h2>Panel de Control</h2>
        </div>

        <div className="dashboard__grid">
          {/* PANEL IZQUIERDO */}
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">
            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <h3>Entrada</h3>
            </div>
            <div className="dashboard__controls">
              <button onClick={() => fileRef.current?.click()} className="dashboard__upload-box">
                <div className="dashboard__upload-icon">
                  {isProcessing ? <Clock size={24} className="spin" /> : <Upload size={24} />}
                </div>
                <span>Subir Diccionario</span>
                <small>.pdf · .docx · .txt</small>
              </button>
              <input ref={fileRef} type="file" className="dashboard__hidden-input" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />

              <div style={{ marginTop: '20px' }}>
                <label>Diccionarios</label>
                <select value={dictionaryType} onChange={(e) => {setUploadedFile(null); setDictionaryType(e.target.value);}}>
                  <option value="iskonawa">Iskonawa</option>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>
            </div>
          </div>

          {/* PANEL CENTRAL */}
          <div className="card dashboard__panel">
            <div className="dashboard__panel-head">
              <h3>Estructura JSON</h3>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{JSON.stringify(extractedData.slice(0, 2), null, 4)}</pre>
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="card dashboard__panel">
            <div className="dashboard__panel-head">
              <h3>Ficha Técnica</h3>
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
