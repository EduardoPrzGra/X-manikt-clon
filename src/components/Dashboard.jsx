import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2, Clock } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('iskonawa')
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileRef = useRef(null)

  // 1. LÓGICA ORIGINAL RESTAURADA (Carga desde el repo)
  useEffect(() => {
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?v=${Date.now()}`;
      
      // Obtenemos el texto primero para evitar que la app explote si el JSON tiene un error
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("Archivo no encontrado");
          return res.text(); 
        })
        .then(text => {
          try {
            const data = JSON.parse(text);
            const listaReal = Array.isArray(data) ? data : data[Object.keys(data)[0]];
            setExtractedData(listaReal || []);
          } catch (e) {
            console.error("Error de sintaxis en el archivo:", fileName);
            // Si el archivo JSON tiene un error de comillas, no explota, solo avisa
            setExtractedData([{ id: "ERR", lx: "Error de formato", dn: "El archivo JSON tiene un error de sintaxis en su código." }]);
          }
        })
        .catch(err => {
          console.error(err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // 2. SIMULACIÓN DE SUBIDA (Solo para Demo, sin romper los datos)
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
          dn: `Contenido extraído exitosamente del archivo ${file.name}.`
        }]);
      }, 1500);
    }
  };

  // 3. VISTA MDF (Protegida)
  const mdfPreview = useMemo(() => {
    if (isProcessing) return "Ejecutando motor de extracción...";
    if (!extractedData || extractedData.length === 0) return "Cargando datos...";
    
    const item = extractedData[0]; 
    return [
      `\\id ${item.id || '---'}`,
      `\\lx ${item.lx || ''}`,
      `\\ps ${item.ps || ''}`,
      `\\dn ${item.dn || ''}`,
      `\\de ${item.de || ''}`,
      `\\xv ${item.xv || ''}`,
      `\\xn ${item.xn || ''}`
    ].filter(line => !line.endsWith('undefined') && line !== '\\xv ' && line !== '\\xn ').join('\n');
  }, [extractedData, isProcessing]);

  // 4. DESCARGA FUNCIONAL
  const descargarDiccionario = () => {
    if (extractedData.length === 0 || extractedData[0].id === "ERR") return alert("No hay datos válidos para descargar.");
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XManikt_${dictionaryType}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT CORE</p>
          <h2>Panel de Control Lexicográfico</h2>
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
                <span>{isProcessing ? "Procesando..." : "Subir Diccionario"}</span>
                <small>.pdf · .docx · .txt</small>
              </button>
              
              <input ref={fileRef} type="file" className="dashboard__hidden-input" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />

              {uploadedFile && (
                <div className="dashboard__file-ok">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontSize: '11px' }}>{uploadedFile.name}</span>
                  <button onClick={() => {setUploadedFile(null); setDictionaryType('iskonawa');}} className="btn-clear">×</button>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <label>Ver Diccionarios</label>
                <select value={dictionaryType} onChange={(e) => {setUploadedFile(null); setDictionaryType(e.target.value);}} disabled={isProcessing}>
                  <option value="iskonawa">Iskonawa</option>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>

              <div className="dashboard__status">
                <p>Status: <strong style={{color: isProcessing ? '#f59e0b' : '#10b981'}}>{isProcessing ? "Analizando..." : "Activo"}</strong></p>
                <p>Palabras encontradas: <strong>{extractedData.length.toLocaleString()}</strong></p>
              </div>
            </div>
          </div>

          {/* PANEL CENTRAL */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura JSON</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{isProcessing ? "// Extrayendo datos..." : JSON.stringify(extractedData.slice(0, 2), null, 4)}</pre>
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Ficha Técnica</h3>
              </div>
              <button onClick={descargarDiccionario} className="pill-button pill-button--primary">
                <Download size={16} /> Exportar
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
