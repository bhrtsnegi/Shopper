import React, { useEffect, useState } from 'react'
import { stockApi } from '../api/stock'
import { productsApi } from '../api/products'

const EMPTY_FORM = { productId: '', type: 'IN', quantity: '', note: '' }

export default function Stock() {
  const [movements, setMovements] = useState([])
  const [products, setProducts]   = useState([])
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)

  const load = () => {
    stockApi.getAllMovements().then(r => setMovements(r.data)).catch(console.error)
    productsApi.getAll().then(r => setProducts(r.data)).catch(console.error)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await stockApi.addMovement({
        product: { id: parseInt(form.productId) },
        type: form.type,
        quantity: parseInt(form.quantity),
        note: form.note,
      })
      setModal(false)
      setForm(EMPTY_FORM)
      load()
    } catch (err) { alert(err.message) }
  }

  const typeBadge = (type) => {
    if (type === 'IN')  return <span className="badge badge-success">IN</span>
    if (type === 'OUT') return <span className="badge badge-danger">OUT</span>
    return <span className="badge badge-muted">ADJ</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Stock levels and movement history</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Stock Movement</button>
      </div>

      {/* Current Stock */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Current Stock Levels</span></div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Stock</th><th>Unit</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td className="mono">{p.sku || '—'}</td>
                  <td><span className="badge badge-accent">{p.category || '—'}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`status-dot ${p.quantity <= 0 ? 'danger' : p.quantity <= 10 ? 'warning' : 'success'}`} />
                      <span className="mono" style={{ fontWeight: 600 }}>{p.quantity}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{p.unit || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Log */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Movement Log</span></div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Product</th><th>Type</th><th>Qty</th><th>Reference</th><th>Note</th><th>Date</th></tr></thead>
            <tbody>
              {movements.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">No movements recorded</div></div></td></tr>
              ) : movements.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.product?.name}</td>
                  <td>{typeBadge(m.type)}</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{m.type === 'OUT' ? '-' : '+'}{m.quantity}</td>
                  <td className="mono" style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{m.referenceId || '—'}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>{m.note || '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{new Date(m.date).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add Stock Movement</span>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product *</label>
                  <select className="form-select" required value={form.productId} onChange={e => setForm(f => ({...f, productId: e.target.value}))}>
                    <option value="">Select product…</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                      <option value="IN">IN (Add Stock)</option>
                      <option value="OUT">OUT (Remove Stock)</option>
                      <option value="ADJUSTMENT">Adjustment (Set Absolute)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <input className="form-input" type="number" min="1" required value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Note</label>
                  <input className="form-input" placeholder="Reason / reference…" value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Movement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
