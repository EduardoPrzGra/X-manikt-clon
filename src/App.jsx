
import Header from './components/Header'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import ProjectSection from './components/ProjectSection'
import Team from './components/Team'
import Footer from './components/Footer'
import './styles/App.css'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Hero />
      <Dashboard />
      <ProjectSection />
      <Team />
      <Footer />
    </div>
  )
}

export default App
