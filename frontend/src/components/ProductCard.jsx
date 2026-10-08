import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './Button';
import '../styles/products.css';

/**
 * Renders a star rating display.
 */
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

/**
 * Reusable product card component.
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const stockLabel =
    product.stock > 10
      ? 'In Stock'
      : product.stock > 0
      ? `Only ${product.stock} left`
      : 'Out of Stock';

  const stockClass =
    product.stock > 10
      ? ''
      : product.stock > 0
      ? 'product-card__stock--low'
      : 'product-card__stock--out';

  return (
    <div className="product-card">
      <div className="product-card__image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__meta">
          <StarRating rating={product.rating} />
          <span className={`product-card__stock ${stockClass}`}>
            {stockLabel}
          </span>
        </div>

        <span className="product-card__price">
          ₹{product.price.toLocaleString('en-IN')}
        </span>

        <div className="product-card__actions">
          <Link to={`/products/${product.id}`}>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
