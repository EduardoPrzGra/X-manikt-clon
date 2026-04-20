import { Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'
import '../styles/Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__brand">
          <div className="header__logo float-soft pulse-glow">            <img
              src={`${import.meta.env.BASE_URL}assets/img/logo.png`}
              alt="Logo"
            />
          </div>
          <div>
            <p className="header__eyebrow">Hackatón GIL - UNAM</p>
            <h1 className="header__title">X'manikté</h1>
          </div>
        </div>

        <nav className="header__nav">
          <a href="#inicio">Inicio</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#proyecto">Proyecto</a>
          <a href="#equipo">Equipo</a>
          <span className="header__demo">
            <Sparkles size={16} />
            Demo
          </span>
        </nav>

        <button
          className="header__menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="header__mobile">
          <div className="container header__mobile-links">
            <a href="#inicio">Inicio</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#proyecto">Proyecto</a>
            <a href="#equipo">Equipo</a>
          </div>
        </div>
      )}
    </header>
  )
}