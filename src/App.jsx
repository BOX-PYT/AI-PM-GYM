import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import RadarHomePage from './pages/RadarHomePage'
import DimensionPage from './pages/DimensionPage'
import TrainEntryPage from './pages/TrainEntryPage'
import JdEntryPage from './pages/JdEntryPage'
import TrainPage from './pages/TrainPage'
import ReviewPage from './pages/ReviewPage'
import StatsPage from './pages/StatsPage'
import StatsDetailPage from './pages/StatsDetailPage'
import ConquerPage from './pages/ConquerPage'

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 3 20 12 12 21 4 12" />
          <polygon points="12 7.5 16 12 12 16.5 8 12" />
        </svg>
        成长
      </NavLink>
      <NavLink to="/stats">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        统计
      </NavLink>
      <NavLink to="/conquer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        待攻克
      </NavLink>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><RadarHomePage /><BottomNav /></>} />
        <Route path="/dimension/:key" element={<DimensionPage />} />
        <Route path="/train/:direction" element={<TrainEntryPage />} />
        <Route path="/jd" element={<JdEntryPage />} />
        <Route path="/train/:direction/session" element={<TrainPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/stats" element={<><StatsPage /><BottomNav /></>} />
        <Route path="/stats/:direction" element={<StatsDetailPage />} />
        <Route path="/conquer" element={<><ConquerPage /><BottomNav /></>} />
      </Routes>
    </BrowserRouter>
  )
}
