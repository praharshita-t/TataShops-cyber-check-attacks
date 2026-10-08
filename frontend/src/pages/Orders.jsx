import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import '../styles/auth.css';

const statusBadge = (status) => {
  const map = {
    Delivered: 'badge--success',
    Shipped: 'badge--info',
    Processing: 'badge--warning',
    Cancelled: 'badge--danger',
  };
  return `badge ${map[status] || 'badge--info'}`;
};

const Orders = () => {
  const { user } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    ordersAPI
      .getMyOrders()
      .then((res) => {
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      })
      .catch((err) => {
        console.error('Failed to load orders:', err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="orders-page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 className="section-title">My Orders</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Please sign in to view your order history.
          </p>
          <Link to="/login">
            <Button variant="primary">Login to Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="section-title">My Orders</h1>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            Loading your orders...
          </p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: 'var(--fs-md)' }}>
              You haven&apos;t placed any orders yet.
            </p>
            <Link to="/products">
              <Button variant="primary">Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-card__header">
                    <span className="order-card__id">Order #{order.id}</span>
                    <span className="order-card__date">{formattedDate}</span>
                  </div>

                  <div className="order-card__body">
                    <div className="order-card__items">
                      {order.items &&
                        order.items.map((item, idx) => (
                          <div className="order-card__item" key={idx}>
                            <span>
                              {item.product_name} × {item.quantity}
                            </span>
                            <span>
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="order-card__footer">
                      <span className="order-card__total">
                        Total: ₹{order.total_amount.toLocaleString('en-IN')}
                      </span>
                      <span className={statusBadge(order.status)}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
