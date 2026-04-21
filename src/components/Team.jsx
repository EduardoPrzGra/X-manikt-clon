import '../styles/Team.css'

const teamMembers = [
  {
    name: 'María Fernanda Ordóñez Figueroa',
    tag: 'Frontend · UX · Ciencia',
    bio: 'Estudiante de Ingeniería en Computación (UNAM). Apasionada por el software, la experiencia de usuario y la divulgación científica. Interesada en construir tecnología con impacto real.',
    image: `${import.meta.env.BASE_URL}assets/team/maria.jpg`,
  },
  {
    name: 'Sergio Manuel Ramirez Mejia',
    tag: 'Backend · Validacion',
    bio: 'Estudiante de ingeniería en computación cursando sexto y séptimo semestre. Encargado de pruebas y documentación.',
    image: `${import.meta.env.BASE_URL}assets/team/sergio.jpeg`,  },
  {
    name: 'Eduardo Perez Garcia',
    tag: 'Backend · Regex',
    bio: 'Estudio ingenieria en computación y me interesa mucho el mundo del analisis de datos',
    image: `${import.meta.env.BASE_URL}assets/team/Lalo.jpeg`,
  },
  {
    name: 'Integrante 4',
    tag: 'Backend · Datos',
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
              Nosotros somos un equipo de ingenieros en computación, tratando de
              hacer que las lenguas indígenas estén X&apos;manikté (siempre vivas).
            </p>
          </div>

          <div className="team__grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team__card reveal reveal-delay-1">
                <div className="team__header">
                  <div className="team__avatar">
                      {member.image ? (
                      <img src={member.image} alt={member.name} />
                       ) : (
                       member.initials
                      )}
                  </div>                  
                  <div>
                    <h3>{member.name}</h3>
                  </div>
                </div>

                <div className="team__bio">
                  {member.tag && (
                    <span className="team__tag">{member.tag}</span>
                  )}
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
