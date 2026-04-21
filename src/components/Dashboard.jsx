import { useMemo, useRef, useState, useEffect } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2 } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [outputFormat, setOutputFormat] = useState('JSON')
  const [dictionaryType, setDictionaryType] = useState('zapoteco') // En minúsculas para coincidir con archivos
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extractedData, setExtractedData] = useState([]) 
  const fileRef = useRef(null)

  // Carga automática del JSON basado en la lengua seleccionada
  useEffect(() => {
    if (!uploadedFile) {
      // Intentamos cargar el archivo desde public/data/
      const url = `${import.meta.env.BASE_URL}data/${dictionaryType.toLowerCase()}.json`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => setExtractedData(data))
        .catch(err => {
          console.error("Error cargando diccionario:", err);
          setExtractedData([]);
        });
    }
  }, [dictionaryType, uploadedFile]);

  // Previsualización de los datos (Muestra solo los primeros 3 para no saturar)
  const previewText = useMemo(() => {
    if (extractedData.length === 0) return 'Cargando datos o archivo no encontrado...';
    
    if (outputFormat === 'JSON') {
      return JSON.stringify(extractedData.slice(0, 3), null, 2) + "\n\n... (mostrando inicio del archivo)";
    }
    return "Formato YAML no disponible en esta vista.";
  }, [extractedData, outputFormat]);

  // Generador de formato MDF para la previsualización derecha
  const mdfPreview = useMemo(() => {
    if (extractedData.length === 0) return "Sin datos";
    const item = extractedData[0]; // Tomamos la primera entrada como ejemplo
    return [
      `\\id ${item.id || 1}`,
      `\\lx ${item.lx || ''}`,
      `\\ps ${item.ps || ''}`,
      `\\ph ${item.ph || ''}`,
      `\\de ${item.de || ''}`,
      `\\dn ${item.dn || ''}`,
      `\\xv ${item.xv || ''}`,
      `\\xn ${item.xn || ''}`
    ].join('\n');
  }, [extractedData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">Dashboard</p>
          <p>Explora los diccionarios procesados de lenguas indígenas.</p>
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
                <label>Lengua del Diccionario</label>
                <select
                  value={dictionaryType}
                  onChange={(e) => setDictionaryType(e.target.value)}
                >
                  <option value="zapoteco">Zapoteco</option>
                  <option value="maya">Maya Yucateco</option>
                  <option value="iskonawa">Iskonawa</option>
                  <option value="popoluca">Popoluca</option>
                  <option value="nahuatl">Náhuatl</option>
                </select>
              </div>

              <div>
                <label>Formato de Visualización</label>
                <div className="dashboard__toggle-row">
                  {['JSON', 'YAML'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setOutputFormat(format)}
                      className={outputFormat === format ? 'dashboard__toggle dashboard__toggle--active' : 'dashboard__toggle'}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dashboard__status">
                <p className="dashboard__status-title">Estadísticas</p>
                <p>Entradas totales: {extractedData.length}</p>
                <p>Estado: <span className="text-green-500">Conectado</span></p>
              </div>
            </div>
          </div>

          {/* PANEL DE DATOS JSON */}
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

          {/* PANEL DE PREVISUALIZACIÓN MDF */}
          <div className="card dashboard__panel reveal reveal-delay-2">
            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <h3>Ficha Técnica (MDF)</h3>
              </div>
              <button className="pill-button pill-button--primary dashboard__download">
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
