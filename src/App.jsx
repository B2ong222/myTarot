import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import CardsPage from './pages/CardsPage.jsx'
import CompatibilityPage from './pages/CompatibilityPage.jsx'
import HomePage from './pages/HomePage.jsx'
import HoroscopePage from './pages/HoroscopePage.jsx'
import TarotPage from './pages/TarotPage.jsx'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand-mark">✦</div>
          <div>
            <h1>마이타로</h1>
          </div>
        </header>

        <main className="page-frame">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tarot" element={<TarotPage />} />
            <Route path="/horoscope" element={<HoroscopePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/compatibility" element={<CompatibilityPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
