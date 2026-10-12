import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_NAMES = {
  '/dashboard': 'Dashboard',
  '/products':  'Products',
  '/billing':   'Billing',
  '/stock':     'Inventory',
}

export default function Topbar() {
  const location = useLocation()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pageName = PAGE_NAMES[location.pathname] || 'Shopper'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span className="breadcrumb-parent">Shopper</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{pageName}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-time">
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </header>
  )
}
