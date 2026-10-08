import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/api';
import '../styles/admin.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (!token || !user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    adminAPI
      .getUsers()
      .then((res) => {
        if (res.success && res.users) {
          setUsers(res.users);
        }
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        if (err.status === 401 || err.status === 403) {
          navigate('/admin/login');
        } else {
          setError(err.message || 'Failed to load users from database.');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main__header">
          <h1 className="admin-main__title">User Management</h1>
        </div>

        {error && (
          <div className="badge badge--danger" style={{ display: 'block', marginBottom: '1.5rem', padding: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading registered users from database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No users registered in database.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const dateStr = u.created_at
                    ? new Date(u.created_at).toLocaleDateString('en-IN')
                    : 'Recent';
                  return (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin' ? 'badge--warning' : 'badge--success'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>{u.phone || '—'}</td>
                      <td>{u.address || '—'}</td>
                      <td>{dateStr}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
