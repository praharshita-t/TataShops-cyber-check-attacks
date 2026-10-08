import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import '../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useCart();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">
          Join TataShops to start shopping
        </p>

        {success && (
          <div className="auth-success">
            Account created successfully! Redirecting…
          </div>
        )}

        {apiError && (
          <div className="badge badge--danger" style={{ display: 'block', marginBottom: '1rem', padding: '8px 12px', textAlign: 'center' }}>
            {apiError}
          </div>
        )}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-phone">Phone Number (Optional)</label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-address">Shipping Address (Optional)</label>
            <input
              id="register-address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Your delivery address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="auth-card__submit">
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="auth-card__footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
