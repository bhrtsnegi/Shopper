import React, { useEffect, useState } from 'react'
import { productsApi } from '../api/products'
import { billsApi } from '../api/bills'

export default function Billing() {
  const [products, setProducts]       = useState([])
  const [bills, setBills]             = useState([])
  const [cart, setCart]               = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [view, setView]               = useState('new') // 'new' | 'history'
  const [submitting, setSubmitting]   = useState(false)

  useEffect(() => {
    productsApi.getAll().then(r => setProducts(r.data)).catch(console.error)
    billsApi.getAll().then(r => setBills(r.data)).catch(console.error)
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { product, quantity: 1, unitPrice: product.price }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.product.id !== id)); return }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
  }

  const subtotal = cart.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0)

  const handleBill = async () => {
    if (cart.length === 0) { alert('Cart is empty'); return }
    setSubmitting(true)
    try {
      const payload = {
        customerName,
        customerPhone,
        items: cart.map(i => ({ product: { id: i.product.id }, quantity: i.quantity })),
        status: 'PAID',
        discountAmount: 0,
      }
      await billsApi.create(payload)
      setCart([])
      setCustomerName('')
      setCustomerPhone('')
      const r = await billsApi.getAll()
      setBills(r.data)
      alert('Bill created successfully!')
    } catch (err) { alert(err.message) }
    setSubmitting(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="page-subtitle">Create bills and manage sales</p>
        </div>
        <div className="toolbar">
          <button className={`btn ${view==='new' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('new')}>New Bill</button>
          <button className={`btn ${view==='history' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('history')}>History</button>
        </div>
      </div>

      {view === 'new' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', alignItems: 'start' }}>
          {/* Product Picker */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Select Products</span>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="Search…"
                  value={productSearch} onChange={e => setProductSearch(e.target.value)} />
              </div>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th></th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:'11px',color:'var(--color-text-muted)'}}>{p.category}</div></td>
                      <td className="mono">₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td><span className={`badge ${p.quantity <= 10 ? 'badge-warning' : 'badge-success'}`}>{p.quantity}</span></td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => addToCart(p)} disabled={p.quantity === 0}>Add</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart / Bill */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="panel">
              <div className="panel-header"><span className="panel-title">Customer</span></div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" placeholder="Customer name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" placeholder="Phone number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><span className="panel-title">Cart ({cart.length})</span></div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px' }}>
                    <div className="empty-icon">🛒</div>
                    <div className="empty-desc">Add products from the list</div>
                  </div>
                ) : cart.map(item => (
                  <div key={item.product.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 16px', borderBottom: '1px solid var(--color-border)'
                  }}>
                    <div style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{item.product.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateQty(item.product.id, item.quantity - 1)}>−</button>
                      <span className="mono" style={{ minWidth: '28px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateQty(item.product.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="mono" style={{ minWidth: '80px', textAlign: 'right', fontSize: '13px' }}>
                      ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Total</span>
                  <span className="mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)' }}>
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}
                  onClick={handleBill} disabled={submitting || cart.length === 0}>
                  {submitting ? 'Creating…' : '🧾 Create Bill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header"><span className="panel-title">Bill History</span></div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Bill No.</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">🧾</div><div className="empty-title">No bills yet</div></div></td></tr>
                ) : bills.map(b => (
                  <tr key={b.id}>
                    <td className="mono" style={{ color: 'var(--color-text-accent)' }}>{b.billNumber}</td>
                    <td>{b.customerName || '—'}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>₹{Number(b.totalAmount).toLocaleString('en-IN')}</td>
                    <td><span className={`badge badge-${b.status==='PAID'?'success':b.status==='PENDING'?'warning':'danger'}`}>{b.status}</span></td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{new Date(b.createdAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
