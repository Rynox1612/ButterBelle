import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage, productsApi } from '../api.js'
import { ConfirmDialog, LoadingCards, Notice, PageHeader } from '../components.jsx'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(await productsApi.list())
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    productsApi.list()
      .then(setProducts)
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return products
    return products.filter((product) =>
      `${product.productName} ${product.category}`.toLowerCase().includes(search),
    )
  }, [products, query])

  async function confirmDelete() {
    setDeleteBusy(true)
    try {
      await productsApi.remove(deleting.productId)
      setProducts((current) => current.filter((product) => product.productId !== deleting.productId))
      setDeleting(null)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setDeleting(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="Menu management"
        title="Products"
        description="Keep names, categories, and prices accurate across your menu."
        action={<Link className="button button-primary" to="/products/new">Add product</Link>}
      />

      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Search products</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or category" />
        </label>
        {!loading && !error && <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</span>}
      </div>

      {loading && <LoadingCards />}
      {!loading && error && <Notice title="Products could not load" action={<button className="button button-secondary" onClick={loadProducts}>Try again</button>}>{error}</Notice>}
      {!loading && !error && products.length === 0 && <Notice title="Your menu is empty" action={<Link className="button button-primary" to="/products/new">Add the first product</Link>}>Create your first product to start building the ButterBell menu.</Notice>}
      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && <Notice title="No products match">Try a different product name or category.</Notice>}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="card-grid">
          {filteredProducts.map((product, index) => (
            <article className="product-card" key={product.productId}>
              <div className={`product-visual visual-${index % 3}`}><span>{product.productName?.charAt(0) || 'B'}</span></div>
              <div className="card-body">
                <p className="card-kicker">{product.category}</p>
                <h2>{product.productName}</h2>
                <p className="price">{currency.format(product.price)}</p>
                <div className="card-actions">
                  <Link className="text-link" to={`/products/${product.productId}/edit`}>Edit</Link>
                  <button className="text-button danger-text" type="button" onClick={() => setDeleting(product)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {deleting && <ConfirmDialog title="Delete product?" message={`${deleting.productName} will be permanently removed.`} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} busy={deleteBusy} />}
    </div>
  )
}
