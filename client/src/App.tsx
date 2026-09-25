import SchedulePage from "./pages/SchedulePage"
import "./styles/global.css"
import "./styles/print.css"

export default function App() {
  return (
    <>
      <a className="skip-link" href="#schedule">
        Siirry aikatauluun
      </a>

      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-header__logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </span>
          <div>
            <p className="app-header__title">Orkesterin aikataulu</p>
            <p className="app-header__tagline">Harjoitukset, konsertit ja tekniset työvuorot</p>
          </div>
        </div>
      </header>

      <main id="schedule" className="app-main" tabIndex={-1}>
        <SchedulePage />
      </main>
    </>
  )
}
