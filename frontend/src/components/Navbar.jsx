import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, user, logout } = useCart();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `navbar__link${isActive ? ' navbar__link--active' : ''}`;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`navbar${menuOpen ? ' navbar--open' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          TataShops
        </Link>

        {/* Navigation links */}
        <div className="navbar__links">
          <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          {user && (
            <>
              <NavLink to="/orders" className={linkClass} onClick={() => setMenuOpen(false)}>
                Orders
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
                Profile
              </NavLink>
            </>
          )}
        </div>

        {/* Right-side actions */}
        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/profile" className="navbar__auth-link" onClick={() => setMenuOpen(false)}>
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="navbar__auth-link"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__auth-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="navbar__auth-link navbar__auth-link--accent"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
          <Link to="/admin/login" className="navbar__admin-link" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__menu">
          <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
            Cart {cartCount > 0 && `(${cartCount})`}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/orders" className={linkClass} onClick={() => setMenuOpen(false)}>
                Orders
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
                Profile ({user.name})
              </NavLink>
              <button
                onClick={handleLogout}
                className="navbar__auth-link"
                style={{ textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__auth-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="navbar__auth-link navbar__auth-link--accent" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
          <Link to="/admin/login" className="navbar__admin-link" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
