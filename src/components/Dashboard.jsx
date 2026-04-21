import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2, Clock } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('iskonawa')
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileRef = useRef(null)

  // 1. CARGA AUTOMÁTICA (Desde el Repositorio)
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

  // 2. MANEJO DE SUBIDA DE ARCHIVOS (PDF, DOCX, TXT)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);

      // Simulamos el procesamiento del script de Python
      setTimeout(() => {
        setIsProcessing(false);
        // Si es TXT, intentamos leerlo. Si es PDF/DOCX, mostramos un aviso de éxito.
        if (file.type === "text/plain") {
          const reader = new FileReader();
          reader.onload = (event) => {
            setExtractedData([{ id: "1", lx: "Archivo Detectado", dn: event.target.result.substring(0, 100) + "..." }]);
          };
          reader.readAsText(file);
        } else {
          // Para la demo: mostramos que el sistema reconoció el archivo crudo
          setExtractedData([{ 
            id: "NEW", 
            lx: file.name, 
            ps: "formato_" + file.name.split('.').pop(),
            dn: "El archivo ha sido recibido exitosamente. El motor de extracción (Python) está listo para procesar la estructura MDF." 
          }]);
        }
      }, 1500);
    }
  };

  // 3. FORMATEO MDF
  const mdfPreview = useMemo(() => {
    if (isProcessing) return "Procesando archivo mediante motor X-Manikt (Python)...";
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

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT INTERFACE</p>
          <h2>Panel de Control Lexicográfico</h2>
        </div>

        <div className="dashboard__grid">
          {/* PANEL DE CONFIGURACIÓN */}
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">
            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <h3>Entrada de Datos</h3>
            </div>
            
            <div className="dashboard__controls">
              {/* EL BOTÓN AHORA ACEPTA PDF, DOCX Y TXT */}
              <button onClick={() => fileRef.current?.click()} className="dashboard__upload-box">
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
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: '12px' }}>{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} className="btn-clear">X</button>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <label>Ver Diccionarios Procesados</label>
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
                <p>Status: <strong>{isProcessing ? "Analizando..." : "Activo"}</strong></p>
                <p>Formato de entrada: <span>MDF/PDF</span></p>
              </div>
            </div>
          </div>

          {/* V
