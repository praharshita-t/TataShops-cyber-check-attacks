import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import '../styles/auth.css';

const Profile = () => {
  const { user, logout } = useCart();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    userAPI
      .getProfile()
      .then((res) => {
        if (res.success && res.user) {
          setProfile(res.user);
          setForm({
            name: res.user.name || '',
            phone: res.user.phone || '',
            address: res.user.address || '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await userAPI.updateProfile(form);
      if (res.success && res.user) {
        setProfile(res.user);
        setIsEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 className="section-title">My Profile</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Please log in to view and manage your profile.
          </p>
          <Link to="/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="section-title">My Profile</h1>

        {success && (
          <div className="auth-success" style={{ maxWidth: '560px', marginBottom: '1.5rem' }}>
            ✓ Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="badge badge--danger" style={{ display: 'block', maxWidth: '560px', marginBottom: '1.5rem', padding: '10px 14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-card__avatar">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="profile-card__name">{profile?.name}</h2>
          <p className="profile-card__email">{profile?.email}</p>

          {isEditing ? (
            <form onSubmit={handleSave} className="auth-card__form" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label htmlFor="prof-name">Full Name</label>
                <input
                  id="prof-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-phone">Phone Number</label>
                <input
                  id="prof-phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-address">Delivery Address</label>
                <input
                  id="prof-address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, City, State, PIN"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-card__details">
                <div className="profile-card__row">
                  <span className="profile-card__label">Full Name</span>
                  <span className="profile-card__value">{profile?.name || '—'}</span>
                </div>
                <div className="profile-card__row">
                  <span className="profile-card__label">Email Address</span>
                  <span className="profile-card__value">{profile?.email || '—'}</span>
                </div>
                <div className="profile-card__row">
                  <span className="profile-card__label">Role</span>
                  <span className="profile-card__value">
                    <span className="badge badge--info">{profile?.role || 'user'}</span>
                  </span>
                </div>
                <div className="profile-card__row">
                  <span className="profile-card__label">Phone</span>
                  <span className="profile-card__value">{profile?.phone || 'Not provided'}</span>
                </div>
                <div className="profile-card__row">
                  <span className="profile-card__label">Address</span>
                  <span className="profile-card__value">{profile?.address || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-card__actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                <Button variant="danger" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
