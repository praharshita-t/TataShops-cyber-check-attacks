import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useCart();
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
      const res = await login({ email: form.email, password: form.password });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to your TataShops account</p>

        {success && (
          <div className="auth-success">Login successful! Redirecting…</div>
        )}

        {error && (
          <div className="badge badge--danger" style={{ display: 'block', marginBottom: '1rem', padding: '8px 12px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@tatashops.local"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="auth-card__submit">
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </div>
        </form>

        <div className="auth-card__footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
