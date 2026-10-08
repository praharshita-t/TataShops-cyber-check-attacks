import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`;

  const handleLogout = () => {
    // Phase 2: clear auth state
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__title">Admin Panel</div>

      <nav className="admin-sidebar__nav">
        <NavLink to="/admin" end className={linkClass}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          Products
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Users
        </NavLink>
      </nav>

      <div className="admin-sidebar__divider" />

      <nav className="admin-sidebar__nav">
        <button
          className="admin-sidebar__link"
          onClick={handleLogout}
          style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
