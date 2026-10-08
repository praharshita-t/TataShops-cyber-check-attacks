import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            SecureShop
          </div>
          <p className="footer__disclaimer">
            Fictional e-commerce application created for an application security laboratory.
          </p>
        </div>

        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <span className="footer__link-disabled">About</span>
          <span className="footer__link-disabled">Contact</span>
        </div>

        <div className="footer__copy">
          &copy; {new Date().getFullYear()} SecureShop. For educational purposes only.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
