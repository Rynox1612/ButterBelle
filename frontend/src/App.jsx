import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import CustomerFormPage from './pages/CustomerFormPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductFormPage from './pages/ProductFormPage.jsx'

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ButterBell Studio</p>
          <h1>Keep the menu fresh and customers close.</h1>
          <p>One simple place to manage the products you sell and the people you serve.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/products">View products</Link>
            <Link className="text-link" to="/customers">Manage customers →</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="cake cake-one"><span /></div>
          <div className="cake cake-two"><span /></div>
          <div className="hero-note">Freshly organised.</div>
        </div>
      </section>

      <section className="home-links" aria-label="Management areas">
        <Link to="/products">
          <span className="home-link-number">01</span>
          <div><h2>Products</h2><p>Browse the menu, update prices, and add new items.</p></div>
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/customers">
          <span className="home-link-number">02</span>
          <div><h2>Customers</h2><p>Keep customer contact and delivery details up to date.</p></div>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="center-page">
      <p className="eyebrow">404</p>
      <h1>That page is not on the menu.</h1>
      <Link className="button button-primary" to="/">Back home</Link>
    </div>
  )
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id/edit" element={<ProductFormPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
        <Route path="/home" element={<Navigate replace to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}
