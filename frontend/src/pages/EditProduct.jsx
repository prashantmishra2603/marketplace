import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [],
    colors: [],
    stock: '',
    status: 'draft',
    images: [],
    existingImages: [],
  });

  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        productAPI.getCategories(),
        productAPI.getBrandProduct(id),
      ]);
      
      setCategories(catRes.data.data);
      const product = prodRes.data.data;
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock.toString(),
        status: product.status,
        existingImages: product.images || [],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load product');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSizeToggle = (size) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter((s) => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes });
  };

  const handleAddColor = () => {
    if (newColor.name) {
      setFormData({
        ...formData,
        colors: [...formData.colors, { ...newColor }],
      });
      setNewColor({ name: '', hex: '#000000' });
    }
  };

  const handleRemoveColor = (index) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };

  const handleDeleteImage = async (publicId) => {
    try {
      await productAPI.deleteProductImage(id, publicId);
      setFormData({
        ...formData,
        existingImages: formData.existingImages.filter(img => img.publicId !== publicId),
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        images: newImages,
      };
      
      await productAPI.updateProduct(id, data);
      navigate('/dashboard/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  if (fetching) {
    return (
      <div className="flex justify-center" style={{ padding: '4rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2" style={{ marginBottom: '2rem' }}>
        <Link to="/dashboard/products" className="btn btn-ghost btn-sm">
          ← Back
        </Link>
        <h2>Edit Product</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h4 style={{ margin: 0 }}>Basic Information</h4>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    rows={5}
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price *</label>
                    <input
                      type="number"
                      name="price"
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-input"
                      placeholder="0"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h4 style={{ margin: 0 }}>Images</h4>
              </div>
              <div className="card-body">
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Existing Images:
                </p>
                {formData.existingImages.length > 0 ? (
                  <div className="flex gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {formData.existingImages.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          width: '100px',
                          height: '100px',
                          borderRadius: 'var(--radius)',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`Product ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.publicId)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'var(--error)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No images uploaded</p>
                )}

                <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Add new images:
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-input"
                  style={{ padding: '0.5rem' }}
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Upload up to 5 images
                </p>
                {newImages.length > 0 && (
                  <div className="flex gap-2" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
                    {Array.from(newImages).map((file, index) => (
                      <div
                        key={index}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: 'var(--radius)',
                          overflow: 'hidden',
                          background: 'var(--surface-hover)',
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h4 style={{ margin: 0 }}>Status</h4>
              </div>
              <div className="card-body">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h4 style={{ margin: 0 }}>Sizes</h4>
              </div>
              <div className="card-body">
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`btn btn-sm ${formData.sizes.includes(size) ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 style={{ margin: 0 }}>Colors</h4>
              </div>
              <div className="card-body">
                <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Color name"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="color"
                    value={newColor.hex}
                    onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                  />
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddColor}>
                    Add
                  </button>
                </div>
                {formData.colors.length > 0 && (
                  <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    {formData.colors.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          background: 'var(--surface-hover)',
                          borderRadius: 'var(--radius)',
                        }}
                      >
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: color.hex,
                            border: '1px solid var(--border)',
                          }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>{color.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--error)',
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end" style={{ marginTop: '2rem' }}>
          <Link to="/dashboard/products" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
