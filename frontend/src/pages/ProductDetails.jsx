import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import '../styles/products.css';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? '' : 'empty'}>
        ★
      </span>
    );
  }
  return <span className="stars">{stars}</span>;
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    productsAPI
      .getById(id)
      .then((res) => {
        if (res.success && res.product) {
          setProduct(res.product);
        }
      })
      .catch((err) => {
        console.error('Failed to load product details:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="product-details">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details">
        <div className="container">
          <Link to="/products" className="product-details__back">
            ← Back to Products
          </Link>
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockLabel =
    product.stock > 10
      ? 'In Stock'
      : product.stock > 0
      ? `Only ${product.stock} left`
      : 'Out of Stock';

  const stockClass =
    product.stock > 10
      ? 'product-details__stock--ok'
      : product.stock > 0
      ? 'product-details__stock--low'
      : 'product-details__stock--out';

  return (
    <div className="product-details">
      <div className="container">
        <Link to="/products" className="product-details__back">
          ← Back to Products
        </Link>

        <div className="product-details__grid">
          {/* Image */}
          <div className="product-details__image-wrapper">
            <img src={product.image} alt={product.name} />
          </div>

          {/* Info */}
          <div className="product-details__info">
            <span className="product-details__category">{product.category}</span>
            <h1 className="product-details__name">{product.name}</h1>
            <StarRating rating={product.rating} />
            <span className="product-details__price">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <p className="product-details__description">{product.description}</p>

            <span className={`product-details__stock ${stockClass}`}>
              {stockLabel}
            </span>

            {product.stock > 0 && (
              <>
                <div className="product-details__quantity">
                  <label>Quantity:</label>
                  <div className="quantity-control">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="product-details__add-btn">
                  <Button variant="primary" size="lg" onClick={handleAdd}>
                    Add to Cart
                  </Button>
                </div>
              </>
            )}

            {added && (
              <div className="auth-success">
                ✓ Added {quantity} item{quantity > 1 ? 's' : ''} to cart
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
