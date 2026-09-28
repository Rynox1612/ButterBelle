import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { customersApi, getErrorMessage } from '../api.js'
import { Field, Notice, PageHeader } from '../components.jsx'

const emptyCustomer = { name: '', phoneNumber: '', address: '' }

function validate(customer) {
  const errors = {}
  if (!customer.name.trim()) errors.name = 'Enter the customer name.'
  if (!customer.phoneNumber.trim()) errors.phoneNumber = 'Enter a phone number.'
  else if (!/^[+\d][\d\s-]{7,14}$/.test(customer.phoneNumber.trim())) errors.phoneNumber = 'Enter a valid phone number.'
  if (!customer.address.trim()) errors.address = 'Enter a delivery address.'
  return errors
}

export default function CustomerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [customer, setCustomer] = useState(emptyCustomer)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [requestError, setRequestError] = useState('')

  useEffect(() => {
    if (!editing) return
    customersApi.get(id)
      .then(({ name, phoneNumber, address }) => setCustomer({ name, phoneNumber, address }))
      .catch((error) => setRequestError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [editing, id])

  function update(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = validate(customer)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    setRequestError('')
    const payload = {
      name: customer.name.trim(),
      phoneNumber: customer.phoneNumber.trim(),
      address: customer.address.trim(),
    }
    try {
      if (editing) await customersApi.update(id, payload)
      else await customersApi.create(payload)
      navigate('/customers')
    } catch (error) {
      setRequestError(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container form-page">
      <PageHeader eyebrow={editing ? 'Update customer' : 'New customer'} title={editing ? 'Edit customer' : 'Add a customer'} description="Save the details needed to contact the customer and deliver their order." />
      {loading && <div className="form-skeleton" />}
      {!loading && requestError && editing && !customer.name && <Notice title="Customer could not load">{requestError}</Notice>}
      {!loading && (!requestError || customer.name) && (
        <form className="record-form" onSubmit={submit} noValidate>
          {requestError && <p className="form-banner" role="alert">{requestError}</p>}
          <Field label="Customer name" error={errors.name}>
            <input autoFocus value={customer.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} />
          </Field>
          <Field label="Phone number" error={errors.phoneNumber} hint="Include the country code when needed">
            <input type="tel" value={customer.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value)} aria-invalid={Boolean(errors.phoneNumber)} />
          </Field>
          <Field label="Delivery address" error={errors.address}>
            <textarea rows="4" value={customer.address} onChange={(event) => update('address', event.target.value)} aria-invalid={Boolean(errors.address)} />
          </Field>
          <div className="form-actions">
            <button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add customer'}</button>
            <Link className="button button-secondary" to="/customers">Cancel</Link>
          </div>
        </form>
      )}
    </div>
  )
}
