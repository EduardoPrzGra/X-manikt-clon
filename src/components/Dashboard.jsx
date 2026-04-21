import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2 } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [dictionaryType, setDictionaryType] = useState('iskonawa')
  const [extractedData, setExtractedData] = useState([]) 
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileRef = useRef(null)

  // 1. CARGA DE DATOS (Servidor/Repositorio)
  useEffect(() => {
    // Solo cargamos del repo si NO hay un archivo subido manualmente
    if (!uploadedFile) {
      const fileName = dictionaryType.toLowerCase();
      const url = `${import.meta.env.BASE_URL}data/diccionario_${fileName}.json?v=${Date.now()}`;
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("Archivo no encontrado");
          return res.json();
        })
        .then(data => {
          const listaReal = Array.isArray(data) ? data : data[Object.keys(data)[0]];
          setExtractedData(listaReal || []);
        })
        .catch(err => {
          console.error("Error:", err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // 2. LÓGICA PARA SUBIR ARCHIVO LOCAL (Para la Demo)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          const lista = Array.isArray(json) ? json : json[Object.keys(json)[0]];
          setExtractedData(lista);
        } catch (err) {
          alert("El archivo no es un JSON válido. Mostrando vista previa de texto.");
          setExtractedData([{ id: "ERR", lx: file.name, dn: "Error de formato JSON" }]);
        }
      };
      reader.readAsText(file);
    }
  };

  // 3. FORMATEO MDF
  const mdfPreview = useMemo(() => {
    if (!extractedData || extractedData.length === 0) return "Esperando datos...";
    const item = extractedData[0]; 
    return [
      `\\id ${item.id || '---'}`,
      `\\lx ${item.lx || ''}`,
      `\\ps ${item.ps || ''}`,
      `\\dn ${item.dn || ''}`,
      `\\de ${item.de || ''}`,
      `\\xv ${item.xv || ''}`,
      `\\xn ${item.xn || ''}`
    ].join('\n');
  }, [extractedData]);

  // 4. DESCARGA
  const descargarDiccionario = () => {
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XManikt_${dictionaryType}.json`;
    a.click();
  };

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">X-MANIKT CORE</p>
          <h2>Panel de Control</h2>
        </div>

        <div className="dashboard__grid">
          {/* PANEL DE CONTROL: REESTABLECIDO */}
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">
            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <h3>Configuración</h3>
            </div>
            
            <div className="dashboard__controls">
              {/* BOTÓN DE SUBIR ARCHIVO REGRESADO */}
              <button onClick={() => fileRef.current?.click()} className="dashboard__upload-box">
                <div className="dashboard__upload-icon"><Upload size={24} /></div>
                <span>Subir Diccionario</span>
                <small>.json · .txt</small>
              </button>
              <input 
                ref={fileRef} 
                type="file" 
                className="dashboard__hidden-input" 
                accept=".json,.txt" 
                onChange={handleFileUpload} 
              />

              {uploadedFile && (
                <div className="dashboard__file-ok">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>{uploadedFile.name}</span>
                  <button onClick={() => {setUploadedFile(null); setDictionaryType('iskonawa');}} style={{marginLeft: '10px', fontSize: '10px', cursor: 'pointer'}}>Quitar</button>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <label>Diccionarios en Repositorio</label>
                <select 
                  value={dictionaryType} 
                  onChange={(e) => {setUploadedFile(null); setDictionaryType(e.target.value);}}
                  disabled={!!uploadedFile}
                >
                  <option value="iskonawa">Iskonawa</option>
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>

              <div className="dashboard__status">
                <p>Entradas: <strong>{extractedData.length}</strong></p>
                <p>Modo: <span>{uploadedFile ? "Local" : "Cloud"}</span></p>
              </div>
            </div>
          </div>

          {/* VISTA JSON */}
          <div className="card dashboard__panel reveal reveal-delay-1">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <h3>Estructura JSON</h3>
              </div>
            </div>
            <div className="dashboard__code dashboard__code--dark">
              <pre>{extractedData.length > 0 ? JSON.stringify(extractedData.slice(0, 2), null, 4) : "Cargando..."}</pre>
            </div>
          </div>

          {/* VISTA MDF */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Ficha Técnica</h3>
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
