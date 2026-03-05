import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import BrandProducts from './pages/BrandProducts';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Protected Routes - Brand */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="brand">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/products/create"
          element={
            <ProtectedRoute allowedRole="brand">
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/products/:id/edit"
          element={
            <ProtectedRoute allowedRole="brand">
              <EditProduct />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
