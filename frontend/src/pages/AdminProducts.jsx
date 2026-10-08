import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Button from '../components/Button';
import { adminAPI } from '../services/api';
import '../styles/admin.css';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Laptops',
    stock: 10,
    image: '/images/laptop-1.svg',
    rating: 4.5,
  });

  const loadProducts = () => {
    setLoading(true);
    adminAPI
      .getProducts()
      .then((res) => {
        if (res.success && res.products) {
          setProducts(res.products);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch admin products:', err);
        if (err.status === 401 || err.status === 403) {
          navigate('/admin/login');
        } else {
          setError(err.message || 'Failed to load products.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (!token || !user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadProducts();
  }, [navigate]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category: 'Laptops',
      stock: 10,
      image: '/images/laptop-1.svg',
      rating: 4.5,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || '/images/accessory-1.svg',
      rating: product.rating || 4.5,
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await adminAPI.deleteProduct(id);
      setSuccess(`Deleted "${name}" successfully.`);
      setTimeout(() => setSuccess(''), 2500);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await adminAPI.updateProduct(editingId, form);
        setSuccess('Product updated successfully.');
      } else {
        await adminAPI.createProduct(form);
        setSuccess('Product created successfully.');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 2500);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main__header">
          <h1 className="admin-main__title">Product Management</h1>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            + Add Product
          </Button>
        </div>

        {success && (
          <div className="auth-success" style={{ marginBottom: '1.5rem' }}>
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="badge badge--danger" style={{ display: 'block', marginBottom: '1.5rem', padding: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Edit / Add Modal */}
        {showModal && (
          <div style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-deep-teal)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-deep-teal)' }}>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleFormSubmit} className="auth-card__form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Audio">Audio</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Tablets">Tablets</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="2"
                  style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit" variant="primary" size="sm">
                  {editingId ? 'Save Changes' : 'Create Product'}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading products from SQLite database...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No products in database.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge--info">{p.category}</span>
                    </td>
                    <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          className="admin-table__action admin-table__action--edit"
                          onClick={() => handleOpenEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-table__action admin-table__action--delete"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
