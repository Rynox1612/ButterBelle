import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage, productsApi } from '../api.js'
import { Field, Notice, PageHeader } from '../components.jsx'

const emptyProduct = { productName: '', price: '', category: '' }

function validate(product) {
  const errors = {}
  if (!product.productName.trim()) errors.productName = 'Enter a product name.'
  if (!product.category.trim()) errors.category = 'Enter a category.'
  if (product.price === '' || Number(product.price) <= 0) errors.price = 'Enter a price greater than zero.'
  return errors
}

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [product, setProduct] = useState(emptyProduct)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [requestError, setRequestError] = useState('')

  useEffect(() => {
    if (!editing) return
    productsApi.get(id)
      .then(({ productName, price, category }) => setProduct({ productName, price: String(price), category }))
      .catch((error) => setRequestError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [editing, id])

  function update(field, value) {
    setProduct((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = validate(product)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    setRequestError('')
    const payload = {
      productName: product.productName.trim(),
      price: Number(product.price),
      category: product.category.trim(),
    }
    try {
      if (editing) await productsApi.update(id, payload)
      else await productsApi.create(payload)
      navigate('/products')
    } catch (error) {
      setRequestError(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container form-page">
      <PageHeader eyebrow={editing ? 'Update product' : 'New product'} title={editing ? 'Edit product' : 'Add a product'} description="Use the same wording and pricing customers see on the menu." />
      {loading && <div className="form-skeleton" />}
      {!loading && requestError && editing && !product.productName && <Notice title="Product could not load">{requestError}</Notice>}
      {!loading && (!requestError || product.productName) && (
        <form className="record-form" onSubmit={submit} noValidate>
          {requestError && <p className="form-banner" role="alert">{requestError}</p>}
          <Field label="Product name" error={errors.productName}>
            <input autoFocus value={product.productName} onChange={(event) => update('productName', event.target.value)} aria-invalid={Boolean(errors.productName)} />
          </Field>
          <div className="form-row">
            <Field label="Price" error={errors.price} hint="Amount in Indian rupees">
              <input type="number" min="0.01" step="0.01" value={product.price} onChange={(event) => update('price', event.target.value)} aria-invalid={Boolean(errors.price)} />
            </Field>
            <Field label="Category" error={errors.category} hint="For example, Cake or Brownie">
              <input value={product.category} onChange={(event) => update('category', event.target.value)} aria-invalid={Boolean(errors.category)} />
            </Field>
          </div>
          <div className="form-actions">
            <button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}</button>
            <Link className="button button-secondary" to="/products">Cancel</Link>
          </div>
        </form>
      )}
    </div>
  )
}
