import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { customersApi, getErrorMessage } from '../api.js'
import { ConfirmDialog, LoadingCards, Notice, PageHeader } from '../components.jsx'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setCustomers(await customersApi.list())
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    customersApi.list()
      .then(setCustomers)
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false))
  }, [])

  const filteredCustomers = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return customers
    return customers.filter((customer) =>
      `${customer.name} ${customer.phoneNumber} ${customer.address}`.toLowerCase().includes(search),
    )
  }, [customers, query])

  async function confirmDelete() {
    setDeleteBusy(true)
    try {
      await customersApi.remove(deleting.customerId)
      setCustomers((current) => current.filter((customer) => customer.customerId !== deleting.customerId))
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
        eyebrow="Customer book"
        title="Customers"
        description="Keep customer contact and delivery details easy to find."
        action={<Link className="button button-primary" to="/customers/new">Add customer</Link>}
      />
      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Search customers</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, phone, or address" />
        </label>
        {!loading && !error && <span>{filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}</span>}
      </div>

      {loading && <LoadingCards />}
      {!loading && error && <Notice title="Customers could not load" action={<button className="button button-secondary" onClick={loadCustomers}>Try again</button>}>{error}</Notice>}
      {!loading && !error && customers.length === 0 && <Notice title="No customers yet" action={<Link className="button button-primary" to="/customers/new">Add the first customer</Link>}>Customer details will appear here once you add them.</Notice>}
      {!loading && !error && customers.length > 0 && filteredCustomers.length === 0 && <Notice title="No customers match">Try a different name, phone number, or address.</Notice>}

      {!loading && !error && filteredCustomers.length > 0 && (
        <div className="customer-list">
          {filteredCustomers.map((customer) => (
            <article className="customer-row" key={customer.customerId}>
              <div className="customer-avatar" aria-hidden="true">{customer.name?.charAt(0) || 'B'}</div>
              <div className="customer-name"><h2>{customer.name}</h2><p>{customer.phoneNumber}</p></div>
              <p className="customer-address">{customer.address}</p>
              <div className="card-actions">
                <Link className="text-link" to={`/customers/${customer.customerId}/edit`}>Edit</Link>
                <button className="text-button danger-text" type="button" onClick={() => setDeleting(customer)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {deleting && <ConfirmDialog title="Delete customer?" message={`${deleting.name} and their saved details will be permanently removed.`} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} busy={deleteBusy} />}
    </div>
  )
}
