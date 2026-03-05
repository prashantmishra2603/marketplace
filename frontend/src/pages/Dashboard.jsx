import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [summary, setSummary] = useState({ total: 0, published: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await productAPI.getBrandProducts({ limit: 1 });
      setSummary(response.data.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/products', label: 'Products', icon: '📦' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.25rem' }}>Dashboard</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {user?.brandName || user?.name}
          </p>
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`dashboard-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius)' }}>
          <h5 style={{ marginBottom: '0.5rem' }}>Quick Stats</h5>
          <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Products</span>
            <strong>{summary.total}</strong>
          </div>
          <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Published</span>
            <strong style={{ color: 'var(--success)' }}>{summary.published}</strong>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Draft</span>
            <strong style={{ color: 'var(--warning)' }}>{summary.draft}</strong>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">
        {location.pathname === '/dashboard' ? (
          <>
            <h2 style={{ marginBottom: '2rem' }}>Welcome back!</h2>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Products</div>
                <div className="stat-value">{summary.total}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Published</div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>{summary.published}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Draft</div>
                <div className="stat-value" style={{ color: 'var(--warning)' }}>{summary.draft}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Archived</div>
                <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{summary.archived}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h4 style={{ margin: 0 }}>Quick Actions</h4>
              </div>
              <div className="card-body">
                <div className="flex gap-4">
                  <Link to="/dashboard/products/create" className="btn btn-primary">
                    + Add New Product
                  </Link>
                  <Link to="/dashboard/products" className="btn btn-outline">
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
