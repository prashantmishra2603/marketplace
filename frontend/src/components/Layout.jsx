import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, isAuthenticated, isBrand, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <Link to="/" className="navbar-brand">
            Market<span>Nest</span>
          </Link>

          <div className="navbar-nav">
            <Link to="/marketplace" className="btn btn-ghost">
              Marketplace
            </Link>

            {isAuthenticated ? (
              <>
                {isBrand && (
                  <Link to="/dashboard" className="btn btn-ghost">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {user?.name}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--primary)', color: 'white', padding: '2rem 0', marginTop: '4rem' }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
                Market<span>Nest</span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Your premier fashion marketplace
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/marketplace" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Marketplace
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                © 2024 MarketNest
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
