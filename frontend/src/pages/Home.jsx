import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { productsAPI } from '../services/api';
import '../styles/home.css';

const categoryIcons = {
  Laptops: '💻',
  Audio: '🎧',
  Accessories: '⌨️',
  Monitors: '🖥️',
  Tablets: '📱',
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI
      .getAll()
      .then((res) => {
        if (res.success && res.products) {
          setProducts(res.products);
        }
      })
      .catch((err) => {
        console.error('Failed to load products for homepage:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__content">
          <h1 className="hero__title">Everything You Need. One Secure Store.</h1>
          <p className="hero__desc">
            Browse electronics, accessories and everyday technology products with verified local reliability.
          </p>
          <div className="hero__buttons">
            <Link to="/products">
              <Button variant="primary" size="lg">Shop Products</Button>
            </Link>
            <Link to="/products">
              <Button variant="secondary" size="lg">Explore Categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              Loading products...
            </p>
          ) : (
            <div className="products-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories__grid">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat}`} key={cat}>
                <div className="category-card">
                  <div className="category-card__icon">
                    {categoryIcons[cat] || '📦'}
                  </div>
                  <div className="category-card__name">{cat}</div>
                  <div className="category-card__count">
                    {products.filter((p) => p.category === cat).length} products
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="trust">
        <div className="container">
          <div className="trust__grid">
            <div className="trust__item">
              <div className="trust__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="trust__title">Secure Checkout</div>
              <div className="trust__desc">
                All transactions are protected with industry-standard encryption.
              </div>
            </div>
            <div className="trust__item">
              <div className="trust__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="trust__title">Fast Delivery</div>
              <div className="trust__desc">
                Free delivery on orders above ₹999. Quick dispatch within 24 hours.
              </div>
            </div>
            <div className="trust__item">
              <div className="trust__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </div>
              <div className="trust__title">Easy Returns</div>
              <div className="trust__desc">
                Hassle-free 7-day return policy on all products.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
