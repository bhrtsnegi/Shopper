import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  {
    group: 'Main',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { to: '/billing',  label: 'Billing',   icon: '🧾' },
      { to: '/products', label: 'Products',  icon: '📦' },
      { to: '/stock',    label: 'Inventory', icon: '📊' },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">S</div>
        <span className="brand-name">Shopper</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(group => (
          <div key={group.group}>
            <div className="nav-section-label">{group.group}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        Shopper v1.0
      </div>
    </aside>
  )
}
