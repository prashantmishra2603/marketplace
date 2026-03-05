import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isBrand } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          color: 'white',
          padding: '6rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '1.5rem' }}>
            Discover Your Perfect <span style={{ color: 'var(--accent)' }}>Style</span>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.25rem',
              maxWidth: '600px',
              margin: '0 auto 2rem',
            }}
          >
            Join MarketNest - the premier fashion marketplace connecting brands with fashion-forward customers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/marketplace" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
              Explore Marketplace
            </Link>
            {!isAuthenticated && (
              <Link to="/signup" className="btn btn-lg" style={{ background: 'var(--accent)', color: 'white' }}>
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', background: 'var(--background)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Choose MarketNest?</h2>
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(233, 69, 96, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.5rem',
                  }}
                >
                  🛍️
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>For Customers</h4>
                <p style={{ margin: 0 }}>
                  Browse thousands of products from verified brands. Find your unique style with easy filtering and search.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(233, 69, 96, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.5rem',
                  }}
                >
                  🏪
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>For Brands</h4>
                <p style={{ margin: 0 }}>
                  Create your online store in minutes. Manage products, track orders, and grow your fashion business.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(233, 69, 96, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.5rem',
                  }}
                >
                  🔒
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>Secure & Trusted</h4>
                <p style={{ margin: 0 }}>
                  Secure payments, verified brands, and buyer protection. Shop with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section style={{ padding: '5rem 0', background: 'var(--surface)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to Get Started?</h2>
            <p style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
              Join thousands of brands and customers already on MarketNest.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup?role=customer" className="btn btn-primary btn-lg">
                Join as Customer
              </Link>
              <Link to="/signup?role=brand" className="btn btn-secondary btn-lg">
                Join as Brand
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Preview */}
      <section style={{ padding: '5rem 0', background: 'var(--background)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Shop by Category</h2>
          <div className="grid grid-cols-5" style={{ gap: '1rem' }}>
            {['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'].map((category) => (
              <Link
                key={category}
                to={`/marketplace?category=${category.toLowerCase()}`}
                className="card"
                style={{ textAlign: 'center', padding: '1.5rem' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {category === 'Tops' && '👕'}
                  {category === 'Bottoms' && '👖'}
                  {category === 'Dresses' && '👗'}
                  {category === 'Shoes' && '👟'}
                  {category === 'Accessories' && '👜'}
                </div>
                <h5 style={{ margin: 0 }}>{category}</h5>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
