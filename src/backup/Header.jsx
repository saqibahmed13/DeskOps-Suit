import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const goToProducts = () => navigate('/products');
  const goToAboutUs = () => navigate('/about-us');
  const goToContactUs = () => navigate('/contact-us');

  return (
    <Navbar style={{ backgroundColor: "orange", padding: '0.3rem' }} data-bs-theme="black">
      <Container>
        <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Home
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link onClick={goToProducts}>Products</Nav.Link>
          <Nav.Link onClick={goToAboutUs}>About Us</Nav.Link>
          <Nav.Link onClick={goToContactUs}>Contact Us</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
