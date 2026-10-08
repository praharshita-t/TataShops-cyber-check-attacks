import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { productsAPI } from '../services/api';
import '../styles/products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
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
        console.error('Failed to fetch products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const activeCategory = searchParams.get('category') || 'All';

  const filtered = useMemo(() => {
    let list = products;

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [products, activeCategory, search]);

  const handleCategoryClick = (cat) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-page__header">
          <h1 className="section-title" style={{ marginBottom: 0 }}>
            Products
          </h1>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="products-page__filters">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              className={`products-page__category-btn${
                activeCategory === cat ? ' products-page__category-btn--active' : ''
              }`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="products-page__count">
          {loading ? 'Loading catalog...' : `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            Loading products from database...
          </div>
        ) : filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
