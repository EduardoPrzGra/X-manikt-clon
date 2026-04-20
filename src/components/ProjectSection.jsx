import '../styles/ProjectSection.css'

export default function ProjectSection() {
  return (
    <section id="proyecto" className="project">
      <div className="container project__grid">
        <div className="card project__left reveal">
          <p className="section-tag">Proyecto</p>
          <h2>¿Por qué existe X&apos;manikté?</h2>

          <p className="project__intro">
            En el corazón de toda cultura vive la palabra. Sin embargo, muchas
            lenguas originarias enfrentan hoy un riesgo silencioso: quedar
            atrapadas en documentos estáticos y eventualmente perderse en el
            olvido.
          </p>

          <p className="project__intro">
            <strong>
              X&apos;manikté nace como una respuesta a esa urgencia, tanto
              técnica como humana.
            </strong>{' '}
            Nuestro propósito es transformar diccionarios en formatos como{' '}
            <code>.docx</code>, <code>.pdf</code> o <code>.txt</code> en datos
            estructurados y dinámicos, permitiendo que estas lenguas no solo
            sean consultadas, sino utilizadas, exploradas y preservadas en la
            era digital.
          </p>

          <p className="project__intro">
            El nombre <em>X&apos;manikté</em> no es casual. En maya, hace
            referencia a la “siempreviva”, una flor que resiste el paso del
            tiempo y florece incluso en condiciones adversas. De la misma
            manera, buscamos que lenguas como el Zapoteco, Maya, Popoluca,
            Iskonawa y Náhuatl permanezcan vivas, accesibles y vigentes.
          </p>
        </div>

        <div className="card project__right reveal reveal-delay-1">
          <h3>Nuestro objetivo: memoria que trasciende</h3>

          <p className="project__intro">
            Como estudiantes de Ingeniería en Computación de la Facultad de
            Ingeniería de la UNAM, participamos en el Hackatón del Grupo de
            Ingeniería Lingüística con una visión clara:
            <strong>
              {' '}usar la tecnología como herramienta para preservar identidad
              y conocimiento.
            </strong>
          </p>

          <p className="project__intro">
            Este proyecto no es solo un extractor basado en el formato MDF. Es
            un sistema que estructura información lingüística, facilita su
            análisis y abre la puerta a futuras aplicaciones digitales.
          </p>

          <p className="project__intro">
            Más allá del código, estamos construyendo un puente entre tradición
            y tecnología. Creemos que si una lengua puede estructurarse, puede
            analizarse; si puede analizarse, puede enseñarse; y si puede
            enseñarse, puede mantenerse viva.
          </p>

          <p className="project__intro">
            <strong>
              X&apos;manikté es nuestra apuesta por un futuro donde ninguna
              lengua sea solo memoria, sino presencia activa.
            </strong>
          </p>
        </div>
      </div>
    </section>
  )
}