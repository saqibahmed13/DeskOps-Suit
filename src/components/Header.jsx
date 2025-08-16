import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useCallback } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaChair } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // --- Prefetch /products chunk on hover, focus, or touch ---
  const prefetchedRef = useRef(false);
  const prefetchProducts = useCallback(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;
    // This matches the lazy() import path you use in App.jsx
    import("./ImageCards"); // starts downloading the products route chunk
  }, []);

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand
          className="brand-title"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <FaChair className="brand-icon" />
          <span className="brand-name">DeskOps Suite</span>
        </Navbar.Brand>

        <Nav className="ms-auto nav-links">
          <Nav.Link
            className={isActive("/products") ? "nav-link active" : "nav-link"}
            aria-current={isActive("/products") ? "page" : undefined}
            onMouseEnter={prefetchProducts}
            onFocus={prefetchProducts}
            onTouchStart={prefetchProducts}
            onClick={() => navigate("/products")}
          >
            Products
          </Nav.Link>

          <Nav.Link
            className={isActive("/about-us") ? "nav-link active" : "nav-link"}
            aria-current={isActive("/about-us") ? "page" : undefined}
            onClick={() => navigate("/about-us")}
          >
            About Us
          </Nav.Link>

          <Nav.Link
            className={isActive("/contact-us") ? "nav-link active" : "nav-link"}
            aria-current={isActive("/contact-us") ? "page" : undefined}
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
