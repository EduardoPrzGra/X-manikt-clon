
import '../styles/Team.css'

const teamMembers = [
  {
    name: 'María Fernanda Ordóñez',
    role: 'Frontend / Diseño UX',
    bio: 'Estudiante de Ingeniería en Computación. Le interesa crear interfaces claras, atractivas y funcionales para proyectos tecnológicos y académicos.',
    initials: 'MFOF',
  },
  {
    name: 'Integrante 2',
    role: 'Backend / Procesamiento',
    bio: 'Encargado del flujo de extracción, limpieza de texto y transformación de entradas hacia estructuras compatibles con MDF.',
    initials: 'I2',
  },
   {
    name: 'Integrante 3',
    role: 'Backend / Procesamiento',
    bio: 'Encargado del flujo de extracción, limpieza de texto y transformación de entradas hacia estructuras compatibles con MDF.',
    initials: 'I3',
  },
  {
    name: 'Integrante 4',
    role: 'Datos / Validación',
    bio: 'Se enfoca en revisar consistencia de etiquetas, estructura de salidas y validación del resultado final.',
    initials: 'I4',
  },
]

export default function Team() {
  return (
    <section id="equipo" className="team">
      <div className="container">
        <div className="card team__wrapper reveal">
          <div className="team__intro">
            <p className="section-tag">Equipo</p>
            <h2>Integrantes y semblanza</h2>
            <p>
              Nosotros somos.
            </p>
          </div>

          <div className="team__grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team__card reveal reveal-delay-1">
                <div className="team__header">
                  <div className="team__avatar">{member.initials}</div>
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>

                <p className="team__bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
