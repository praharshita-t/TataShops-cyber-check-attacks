import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Button from '../components/Button';
import '../styles/auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({
        email: form.email,
        password: form.password,
      });

      if (res.success && res.token) {
        if (res.user.role !== 'admin') {
          setError('Access denied. This account does not possess administrator privileges.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setSuccess(true);

        setTimeout(() => {
          navigate('/admin');
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--admin">
        <h1 className="auth-card__title">
          Admin Login
          <span className="admin-badge">Admin</span>
        </h1>
        <p className="auth-card__subtitle">
          Restricted access — authorised personnel only
        </p>

        {success && (
          <div className="auth-success">Access granted! Redirecting to dashboard…</div>
        )}

        {error && (
          <div className="badge badge--danger" style={{ display: 'block', marginBottom: '1rem', padding: '8px 12px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@tatashops.local"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>

          <div className="auth-card__submit">
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Authenticating...' : 'Admin Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
