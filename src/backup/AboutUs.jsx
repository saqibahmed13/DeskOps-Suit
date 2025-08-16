import { Container, Row, Col, Card , Button} from 'react-bootstrap';
import Header from './Header';
const AboutUs = () => {
    
   return (
    <>
    <Header/>
    <div className="about-wrapper">
      {/* Hero Section */}
      <section className="hero-section text-center text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold">Welcome to DeskOps Suits</h1>
          <p className="lead mt-3">
            Smart, modular, and elegant workspace solutions that evolve with you.
          </p>
        </Container>
      </section>

      {/* Mission / Vision Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card className="info-card shadow-sm">
                <Card.Body>
                  <h4 className="text-primary mb-3">🎯 Our Mission</h4>
                  <p>
                    We aim to create inspiring, ergonomic, and technology-friendly workspaces that enhance
                    productivity while embracing sustainability and innovation.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="info-card shadow-sm">
                <Card.Body>
                  <h4 className="text-success mb-3">🚀 Our Vision</h4>
                  <p>
                    To become a leader in smart office design with AI-enabled planning tools, eco-conscious
                    materials, and intuitive modular components for every workspace.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Product Highlights */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">🛠️ Product Highlights</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="highlight-card h-100 shadow-sm">
                <Card.Body>
                  <h5 className="mb-2">Modular Systems</h5>
                  <p>Desks, partitions & full systems tailored to every office need.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="highlight-card h-100 shadow-sm">
                <Card.Body>
                  <h5 className="mb-2">Smart Storage</h5>
                  <p>Wood or metal-based pedestals, lockers, credenzas and tall partitions.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="highlight-card h-100 shadow-sm">
                <Card.Body>
                  <h5 className="mb-2">Power Integration</h5>
                  <p>Seamlessly embedded power/data modules with CAD-based layout support.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Footer Section (optional) */}
      <section className="footer-cta text-center text-white py-5">
        <Container>
          <h3 className="mb-3">Ready to elevate your workspace?</h3>
          <Button variant="light" size="lg">Contact Us</Button>
        </Container>
      </section>
    </div>
    </>
  );

};

export default AboutUs;
