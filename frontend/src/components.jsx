import { Link, NavLink } from 'react-router-dom'

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="ButterBell home">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>ButterBell</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/customers">Customers</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer>ButterBell Studio · product and customer management</footer>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function LoadingCards() {
  return (
    <div className="card-grid" aria-label="Loading">
      {[1, 2, 3].map((item) => <div className="skeleton-card" key={item} />)}
    </div>
  )
}

export function Notice({ title, children, action }) {
  return (
    <section className="notice">
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </section>
  )
}

export function ConfirmDialog({ title, message, onCancel, onConfirm, busy }) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <h2 id="dialog-title">{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="button button-danger" type="button" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}

export function Field({ label, error, hint, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  )
}
