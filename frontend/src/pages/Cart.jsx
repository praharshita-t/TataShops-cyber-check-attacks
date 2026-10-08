import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import Button from '../components/Button';
import '../styles/cart.css';

const Cart = () => {
  const { items, increment, decrement, removeFromCart, cartTotal, clearCart, user } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in or register before placing an order.');
      navigate('/login');
      return;
    }

    if (items.length === 0) return;

    setError('');
    setSubmitting(true);

    try {
      const res = await ordersAPI.createOrder();
      if (res.success && res.order) {
        clearCart();
        setSuccessMsg('Order placed successfully! Redirecting to orders…');
        setTimeout(() => {
          navigate('/orders');
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !successMsg) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="section-title">My Cart</h1>
          <div className="cart-page__empty">
            <div className="cart-page__empty-icon">🛒</div>
            <p>Your cart is empty.</p>
            <Link to="/products">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title">My Cart</h1>

        {successMsg && (
          <div className="auth-success" style={{ marginBottom: '1.5rem' }}>
            ✓ {successMsg}
          </div>
        )}

        {error && (
          <div className="badge badge--danger" style={{ display: 'block', marginBottom: '1.5rem', padding: '10px 14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item__image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item__info">
                  <span className="cart-item__category">{item.category}</span>
                  <span className="cart-item__name">{item.name}</span>
                  <span className="cart-item__price">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>

                  <div className="cart-item__controls">
                    <div className="quantity-control">
                      <button onClick={() => decrement(item.id)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increment(item.id)}>+</button>
                    </div>

                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__row">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span>{cartTotal >= 999 ? 'Free' : '₹99'}</span>
            </div>

            <div className="cart-summary__total">
              <span>Total</span>
              <span>
                ₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="cart-summary__checkout">
              <Button
                variant="primary"
                fullWidth
                onClick={handleCheckout}
                disabled={submitting}
              >
                {submitting ? 'Processing Order...' : 'Proceed to Checkout'}
              </Button>
            </div>

            <p className="cart-summary__note">
              Server-calculated total with secure order processing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
