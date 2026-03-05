import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 12,
        ...filters,
      };
      delete params.search;
      if (filters.search) params.search = filters.search;
      
      const response = await productAPI.getProducts(params);
      setProducts(response.data.data.products);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1>Marketplace</h1>
          <p>Discover the latest fashion trends from top brands</p>
        </div>

        {/* Filters */}
        <div className="marketplace-header">
          <form onSubmit={handleSearch} className="marketplace-filters">
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: '180px' }}
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>

            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Results Info */}
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Showing {products.length} of {pagination.total} products
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center" style={{ padding: '4rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-text">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '3rem',
                      background: 'var(--surface-hover)'
                    }}>
                      👗
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-brand">
                    {product.brand?.brandName || product.brand?.name}
                  </div>
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-price">${product.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              ←
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === pagination.pages || 
                Math.abs(page - pagination.page) <= 1
              )
              .map((page, index, arr) => (
                <span key={page}>
                  {index > 0 && arr[index - 1] !== page - 1 && (
                    <span style={{ padding: '0 0.5rem' }}>...</span>
                  )}
                  <button
                    className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </span>
              ))}
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
