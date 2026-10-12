import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <Topbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
