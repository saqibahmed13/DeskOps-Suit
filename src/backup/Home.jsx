import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import EditImg from '../assets/mg.jpg'
import officeImg from '../../src/assets/quotation.jpg'
import Header from "./Header";



function Home({ setActiveCustomerIndex, customers, setEditingQuotation }) {
  const navigate = useNavigate();

  const handleNewQuotation = () => {
    setActiveCustomerIndex(null); 
    setEditingQuotation(false); 
    navigate("/customer", { state: { showQuotation: false } });
  };

  const handleManageQuotations = () => {
    navigate("/manage-quotations");
  };

  // return (
  //   <div className="flex justify-around items-center h-screen">
  //     <button
  //       onClick={handleNewQuotation}
  //       className="bg-orange-400 m-2 p-4 rounded cursor-pointer hover:bg-orange-300 text-white text-xl"

  //     >
  //       New Quotation
  //     </button>
  //     <button
  //       onClick={handleManageQuotations}
  //       className="bg-orange-500 m-2 p-4 rounded cursor-pointer hover:bg-orange-400 text-white text-xl"
  //     >
  //       Manage Quotations
  //     </button>
  //   </div>
  // );


  return (
<>
         <Header/>
          <Container fluid 
              className="min-vh-100 d-flex flex-column align-items-center pt-3" 
            //   style={{
            //       backgroundImage: `url(${ManageQuotation})`,
            //       width: '100vw',
            //       height: '100vh',
            //       position:'fixed',
            //       left: 0,
            //       top: 0,
            //   }}
              >
            
              <h4 className="text-center" style={{ color: 'orange', marginTop: "2rem", marginBottom:'2.5rem'}}>Select the Quotation</h4>
  
              <Row className="justify-content-center mt-2 w-100 d-flex">
                  <Col md={4} className="d-flex justify-content-center mb-2">
                          <Card onClick={handleNewQuotation} className="text-decoration-none"
                              style={{ height:'28rem' , width: '23rem', marginBottom: "1.5rem", transition: 'transform 0.3s ease-in-out' }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
  
                              <Card.Body className="text-center">
                                  <Card.Img style={{height:'23rem'}}variant="top" src={officeImg} alt="MLR" className="img-fluid rounded" />
                                  <Button 
                                      style={{ backgroundColor: 'orange', borderColor: 'orange', transition: 'background-color 0.3s ease-in-out' }}
                                      className="mt-2"
                                      >
                                      Create a new Quotation
                                  </Button>
                              </Card.Body>
                          </Card>
                  </Col>
  
                  <Col md={4} className="d-flex justify-content-center mb-2">
                          <Card  onClick={handleManageQuotations} className="text-decoration-none"
                              style={{ height:'28rem' , width: '23rem', marginBottom: "1.5rem", transition: 'transform 0.3s ease-in-out' }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                              <Card.Body className="text-center">
                                  <Card.Img variant="top" style={{height:'23rem'}} src={EditImg} alt="SDLC" className="img-fluid rounded"/>
                                  <Button 
                                      style={{ backgroundColor: 'orange', borderColor: 'orange', transition: 'background-color 0.3s ease-in-out' }}
                                      className="mt-2"
                                   >
                                      Manage Quotation
                                  </Button>
                              </Card.Body>
                          </Card>
                  </Col>
              </Row>
          </Container>
</>

      );
}
export default Home;
