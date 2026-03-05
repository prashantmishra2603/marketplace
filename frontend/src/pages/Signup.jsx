import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    brandName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'brand' && !formData.brandName.trim()) {
      setError('Brand name is required for brand accounts');
      return;
    }

    setLoading(true);

    try {
      const user = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        brandName: formData.brandName,
      });
      
      if (user.role === 'brand') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            Market<span>Nest</span>
          </Link>
          <p>Create your account and start shopping!</p>
        </div>

        <div className="auth-body">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I want to join as</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn ${formData.role === 'customer' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => setFormData({ ...formData, role: 'customer' })}
              >
                🛒 Customer
              </button>
              <button
                type="button"
                className={`btn ${formData.role === 'brand' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => setFormData({ ...formData, role: 'brand' })}
              >
                🏪 Brand
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {formData.role === 'brand' && (
              <div className="form-group">
                <label className="form-label">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  className="form-input"
                  placeholder="Your Brand Name"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p style={{ textAlign: 'center', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
