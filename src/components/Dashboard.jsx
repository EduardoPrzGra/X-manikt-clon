
import { useMemo, useRef, useState } from 'react'
import { Upload, FileText, Languages, Download, CheckCircle2 } from 'lucide-react'
import '../styles/Dashboard.css'

const sampleRawText = `kwanaxhe' [kwanaʐeʔ] s. garlic. ajo.
Ke' galallo' zío' kwanaxhe' gullé lawyá | Do not forget buying garlic tomorrow in the market. | Que no se te olvide comprar ajos mañana en el mercado`

const sampleMdf = String.raw`\id 1
\lx kwanaxhe'
\ps s.
\sn 1
\se
\ph [kwanaʐeʔ]
\mr
\de garlic.
\dn ajo.
\ge
\gn
\xv Ke' galallo' zío' kwanaxhe' gullé lawyá
\xe Do not forget buying garlic tomorrow in the market.
\xn Que no se te olvide comprar ajos mañana en el mercado
\rf
\cf
\lf
\lv
\wv
\vd
\nt
\et
\sc
\lo
\pc`

export default function Dashboard() {
  const [outputFormat, setOutputFormat] = useState('JSON')
  const [dictionaryType, setDictionaryType] = useState('Zapoteco')
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileRef = useRef(null)

  const previewText = useMemo(() => {
    if (!uploadedFile) {
      return 'Aún no has cargado un archivo. Aquí aparecerá el texto extraído para revisión.'
    }

    return `Archivo seleccionado: ${uploadedFile.name}

Aquí irá el texto extraído desde el backend o desde el parser del navegador.`
  }, [uploadedFile])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <div className="dashboard__heading">
          <p className="section-tag">Dashboard</p>
          <p>
            Carga el archivo, revisa el contenido y observa la salida etiquetada.
          </p>
        </div>

        <div className="dashboard__grid">
          <div className="card dashboard__panel dashboard__panel--sidebar reveal">            <div className="dashboard__panel-title">
              <div className="dashboard__icon"><Upload size={20} /></div>
              <div>
                <h3>Sube tu archivo</h3>
              </div>
            </div>

            <div className="dashboard__controls">
              <button
                onClick={() => fileRef.current?.click()}
                className="dashboard__upload-box"
              >
                <div className="dashboard__upload-icon">
                  <Upload size={24} />
                </div>
                <span>Subir archivo</span>
                <small>.docx · .pdf · .txt</small>
              </button>

              <input
                ref={fileRef}
                type="file"
                className="dashboard__hidden-input"
                accept=".docx,.pdf,.txt"
                onChange={handleFileChange}
              />

              {uploadedFile && (
                <div className="dashboard__file-ok">
                  <CheckCircle2 size={18} />
                  <span>{uploadedFile.name}</span>
                </div>
              )}

              <div>
                <label>Formato de salida</label>
                <div className="dashboard__toggle-row">
                  {['JSON', 'YAML'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setOutputFormat(format)}
                      className={
                        outputFormat === format
                          ? 'dashboard__toggle dashboard__toggle--active'
                          : 'dashboard__toggle'
                      }
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Tipo de diccionario</label>
                <select
                  value={dictionaryType}
                  onChange={(e) => setDictionaryType(e.target.value)}
                >
                  <option>Maya</option>
                  <option>Zapoteco</option>
                  <option>Popoluca</option>
                  <option>Náhuatl</option>
                  <option>Iskonawa</option>
                </select>
              </div>

              <div className="dashboard__status">
                <p className="dashboard__status-title">Estado actual</p>
                <p>Tipo: {dictionaryType}</p>
                <p>Salida: {outputFormat}</p>
                <p>Archivo: {uploadedFile ? 'Cargado' : 'Pendiente'}</p>
              </div>
            </div>
          </div>

            <div className="card dashboard__panel reveal reveal-delay-1">            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><FileText size={20} /></div>
                <div>
                  <h3>Texto extraído</h3>
                </div>
              </div>
            </div>

            <div className="dashboard__code dashboard__code--dark">
              <pre>{uploadedFile ? previewText : sampleRawText}</pre>
            </div>
          </div>

            <div className="card dashboard__panel reveal reveal-delay-2">            <div className="dashboard__panel-head">
              <div className="dashboard__panel-title">
                <div className="dashboard__icon"><Languages size={20} /></div>
                <div>
                  <h3>Previsualización MDF</h3>
                </div>
              </div>

              <button className="pill-button pill-button--primary dashboard__download">
                <Download size={16} />
                Descargar
              </button>
            </div>

            <div className="dashboard__code dashboard__code--light">
              <pre>{sampleMdf}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
