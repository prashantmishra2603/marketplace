import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProduct(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container flex justify-center">
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <h3 className="empty-state-title">Product not found</h3>
            <p className="empty-state-text">This product may have been removed</p>
            <Link to="/marketplace" className="btn btn-primary">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          <Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / {product.name}
        </div>

        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-main-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[selectedImage]?.url} alt={product.name} />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '6rem',
                  background: 'var(--surface-hover)'
                }}>
                  👗
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`product-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image.url} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-info">{product.category}</span>
            </div>
            
            <h1 style={{ marginBottom: '1rem' }}>{product.name}</h1>
            
            <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              By <strong>{product.brand?.brandName || product.brand?.name}</strong>
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              ${product.price.toFixed(2)}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Description</h4>
              <p style={{ lineHeight: '1.8' }}>{product.description}</p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem' }}>Available Sizes</h4>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '0.75rem' }}>Colors</h4>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: color.hex,
                          border: '1px solid var(--border)',
                        }}
                      ></span>
                      {color.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: '1rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '2rem' }}>📦</span>
                <div>
                  <strong>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>{product.stock} units available</p>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
