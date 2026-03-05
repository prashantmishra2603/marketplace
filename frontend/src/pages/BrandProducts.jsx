import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';

const BrandProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
      };
      if (filter) params.status = filter;

      const response = await productAPI.getBrandProducts(params);
      setProducts(response.data.data.products);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: 'badge-success',
      draft: 'badge-warning',
      archived: 'badge-info',
    };
    return badges[status] || 'badge-info';
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>My Products</h2>
        <Link to="/dashboard/products/create" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`btn ${filter === '' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('')}
        >
          All
        </button>
        <button
          className={`btn ${filter === 'published' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('published')}
        >
          Published
        </button>
        <button
          className={`btn ${filter === 'draft' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('draft')}
        >
          Draft
        </button>
        <button
          className={`btn ${filter === 'archived' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('archived')}
        >
          Archived
        </button>
      </div>

      {/* Products Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center" style={{ padding: '3rem' }}>
            <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No products yet</h3>
            <p className="empty-state-text">Start by adding your first product</p>
            <Link to="/dashboard/products/create" className="btn btn-primary">
              Add Product
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500 }}>Product</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500 }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500 }}>Price</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500 }}>Stock</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: 'var(--radius)',
                            overflow: 'hidden',
                            background: 'var(--surface-hover)',
                          }}
                        >
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              👗
                            </div>
                          )}
                        </div>
                        <span style={{ fontWeight: 500 }}>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{product.category}</td>
                    <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>{product.stock}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${getStatusBadge(product.status)}`}>{product.status}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div className="flex gap-2 justify-end">
                        <Link to={`/dashboard/products/${product._id}/edit`} className="btn btn-outline btn-sm">
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--error)' }}
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
          >
            ←
          </button>
          
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
              onClick={() => setPagination({ ...pagination, page })}
            >
              {page}
            </button>
          ))}
          
          <button
            className="pagination-btn"
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandProducts;
