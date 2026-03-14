import { AvatarBase } from './components/AvatarBase'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>REGEN ELIZA // TERMINAL</h1>
        <hr className="scanline" />
      </header>

      <main className="main-content">
        <section className="avatar-section">
          {/* Note: Provide the path to a valid .glb file */}
          <AvatarBase avatarUrl="/models/regen-eliza.glb" />
        </section>

        <section className="interaction-section">
          <div className="status-bar">
            <span>[ SYSTEM: ONLINE ]</span>
            <span>[ AVATAR: INITIALIZING ]</span>
          </div>
          <div className="input-prompt">
            <span>&gt; Ask Eliza...</span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
