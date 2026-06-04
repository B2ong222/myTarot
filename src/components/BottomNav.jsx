import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '오늘', icon: '☽' },
  { to: '/tarot', label: '타로', icon: '✦' },
  { to: '/compatibility', label: '궁합', icon: '♡' },
]

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="주요 페이지" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          end={item.to === '/'}
          key={item.to}
          to={item.to}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
