
import { Sparkles, ArrowRight } from 'lucide-react'
import '../styles/Hero.css'

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero__grid">
        <div className="card hero__main reveal">          <div className="hero__badge">
            <Sparkles size={16} />
            Plataforma de extracción y transformación MDF
          </div>

          <h2 className="hero__headline reveal reveal-delay-1">            Convierte diccionarios a MDF, JSON y YAML en una sola interfaz.
          </h2>

          <p className="hero__text">
            Un dashboard visual para cargar archivos, revisar el texto extraído y visualizar
            la salida estructurada. Pensado para demostrar claramente el funcionamiento del
            proyecto en el hackatón.
          </p>

          <div className="hero__actions">
            <a href="#dashboard" className="pill-button pill-button--primary">
              Explorar dashboard <ArrowRight size={18} />
            </a>
            <a href="#proyecto" className="pill-button pill-button--secondary">
              Ver objetivo
            </a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span>Entrada</span>
              <strong>.docx · .pdf · .txt</strong>
            </div>
            <div className="hero__stat">
              <span>Salida</span>
              <strong>MDF · JSON · YAML</strong>
            </div>
            <div className="hero__stat">
              <span>Enfoque</span>
              <strong>Flujo visual claro</strong>
            </div>
          </div>
        </div>

        <div className="card hero__aside reveal reveal-delay-1">
          <div className="hero__aside-inner">
            <div className="hero__aside-tag">Vista conceptual</div>

            <div className="hero__step">
              <div className="hero__step-number">1</div>
              <div>
                <h3>Carga de archivo</h3>
                <p>Sube el diccionario y elige tipo de salida.</p>
              </div>
            </div>

            <div className="hero__step">
              <div className="hero__step-number">2</div>
              <div>
                <h3>Extracción de texto</h3>
                <p>Visualiza el contenido detectado antes del procesamiento final.</p>
              </div>
            </div>

            <div className="hero__step">
              <div className="hero__step-number">3</div>
              <div>
                <h3>Salida MDF</h3>
                <p>Revisa las etiquetas estructuradas listas para descargar.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
