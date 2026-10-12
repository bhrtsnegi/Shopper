import React, { useEffect, useState } from 'react'
import { productsApi } from '../api/products'
import { billsApi } from '../api/bills'

export default function Dashboard() {
  const [productStats, setProductStats] = useState(null)
  const [billStats, setBillStats]       = useState(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      productsApi.getStats(),
      billsApi.getStats(),
    ]).then(([pRes, bRes]) => {
      setProductStats(pRes.data)
      setBillStats(bRes.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here's your store overview.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Products</div>
          <div className="kpi-value accent">{loading ? '—' : productStats?.totalProducts ?? 0}</div>
          <div className="kpi-sub">in catalog</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Low Stock Alerts</div>
          <div className="kpi-value warning">{loading ? '—' : productStats?.lowStockCount ?? 0}</div>
          <div className="kpi-sub">items &lt;= 10 units</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Bills Today</div>
          <div className="kpi-value teal">{loading ? '—' : billStats?.todaysBills ?? 0}</div>
          <div className="kpi-sub">transactions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Revenue Today</div>
          <div className="kpi-value success">
            {loading ? '—' : `₹${Number(billStats?.todaysRevenue ?? 0).toLocaleString('en-IN')}`}
          </div>
          <div className="kpi-sub">paid bills only</div>
        </div>
      </div>
    </div>
  )
}
