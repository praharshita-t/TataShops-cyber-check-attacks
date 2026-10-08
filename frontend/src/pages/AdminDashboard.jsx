import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/api';
import '../styles/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productCount: 0,
    userCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (!token || !user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    Promise.all([adminAPI.getProducts(), adminAPI.getUsers()])
      .then(([prodRes, userRes]) => {
        const products = prodRes.products || [];
        const users = userRes.users || [];
        setStats({
          productCount: products.length,
          userCount: users.length,
        });
        setRecentUsers(users.slice(0, 5));
      })
      .catch((err) => {
        console.error('Failed to load admin stats:', err);
        if (err.status === 401 || err.status === 403) {
          navigate('/admin/login');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main__header">
          <h1 className="admin-main__title">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-card__label">Total Products</div>
            <div className="admin-stat-card__value">
              {loading ? '...' : stats.productCount}
            </div>
            <div className="admin-stat-card__change">In local SQLite database</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__label">Registered Users</div>
            <div className="admin-stat-card__value">
              {loading ? '...' : stats.userCount}
            </div>
            <div className="admin-stat-card__change">Accounts created</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__label">Database Status</div>
            <div className="admin-stat-card__value" style={{ fontSize: '1.4rem' }}>
              Connected
            </div>
            <div className="admin-stat-card__change">SQLite (tatashops.db)</div>
          </div>
        </div>

        {/* Registered Users Overview */}
        <div className="admin-table-wrapper">
          <div className="admin-table-wrapper__header">
            <h2 className="admin-table-wrapper__title">Recent Users</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => {
                const dateStr = u.created_at
                  ? new Date(u.created_at).toLocaleDateString('en-IN')
                  : 'Recent';
                return (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin' ? 'badge--warning' : 'badge--info'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{dateStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
