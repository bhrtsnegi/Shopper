import React, { useEffect, useState, useCallback } from 'react'
import { productsApi } from '../api/products'

const EMPTY_FORM = {
  name: '', sku: '', category: '', price: '', costPrice: '',
  quantity: '', unit: 'pcs', description: ''
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null) // null | 'add' | 'edit'
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editId, setEditId]     = useState(null)
  const [loading, setLoading]   = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    productsApi.getAll(search)
      .then(r => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), costPrice: String(p.costPrice ?? '') })
    setEditId(p.id)
    setModal('edit')
  }
  const closeModal = () => setModal(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: parseFloat(form.price),
      costPrice: form.costPrice ? parseFloat(form.costPrice) : null,
      quantity: parseInt(form.quantity) || 0,
    }
    try {
      if (modal === 'add') await productsApi.create(payload)
      else await productsApi.update(editId, payload)
      closeModal()
      load()
    } catch (err) { alert(err.message) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await productsApi.delete(id)
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} items in catalog</p>
        </div>
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <div className="empty-title">No products yet</div>
                    <div className="empty-desc">Add your first product to get started.</div>
                  </div>
                </td></tr>
              ) : products.map((p, i) => (
                <tr key={p.id}>
                  <td className="mono" style={{ color: 'var(--color-text-muted)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td className="mono">{p.sku || '—'}</td>
                  <td><span className="badge badge-accent">{p.category || '—'}</span></td>
                  <td className="mono">₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td className="mono">{p.costPrice ? `₹${Number(p.costPrice).toLocaleString('en-IN')}` : '—'}</td>
                  <td>
                    <span className={`badge ${p.quantity <= 10 ? 'badge-warning' : 'badge-success'}`}>
                      {p.quantity}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{p.unit || '—'}</td>
                  <td>
                    <div className="toolbar" style={{ gap: '4px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal === 'add' ? 'Add Product' : 'Edit Product'}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SKU</label>
                    <input className="form-input" value={form.sku} onChange={e => setForm(f => ({...f, sku: e.target.value}))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input className="form-input" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="form-select" value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))}>
                      {['pcs','kg','ltr','box','dozen','meter','gram'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input className="form-input" type="number" required min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cost Price (₹)</label>
                    <input className="form-input" type="number" min="0" step="0.01" value={form.costPrice} onChange={e => setForm(f => ({...f, costPrice: e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input className="form-input" type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={2} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Create' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
