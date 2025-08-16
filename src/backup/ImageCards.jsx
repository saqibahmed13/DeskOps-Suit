import { Container, Row, Col, Card } from 'react-bootstrap';
import AccessoryName from '../assets/Accessory-Name-Plate.jpg';
import AccessoryPlanter from '../assets/Accessory-Planter-Box.jpg';
import DataModules from '../assets/data-modules-for-desks.jpg';
import SystemComponent1 from '../assets/system-component1.jpg';
import MeetingTable from '../assets/Meeting-Table-Without-Flip-lid.jpg';
import StoragePrelam from '../assets/Storage-Prelam-Pedastal.jpg';
import Prelam from '../assets/Prelam.jpg';
import LockerUnits from '../assets/Locker-Units.jpg';
import ElectricalUnits from '../assets/electrical-access-units.jpg';
import MeetingTable2 from '../assets/meeting-table.png';
import SideBoard from '../assets/sideboard-style-office-storage.jpg';
import System from '../assets/System.jpg';
import Header from './Header';

const ImageCards = () => {
  const cards = [
    { id: 1, image: System, title: 'System' },
    { id: 2, image: AccessoryName, title: 'Accessory Name Plate' },
    { id: 3, image: Prelam, title: 'Prelam' },
    { id: 4, image: AccessoryPlanter, title: 'Accessory Name Planter' },
    { id: 5, image: DataModules, title: 'Desk Data Modules' },
    { id: 6, image: SystemComponent1, title: 'System Component' },
    { id: 7, image: MeetingTable, title: 'Meeting Table' },
    { id: 8, image: ElectricalUnits, title: 'Electrical Units' },
    { id: 9, image: LockerUnits, title: 'Locker Units' },
    { id: 10, image: StoragePrelam, title: 'Storage Prelam' },
    { id: 11, image: MeetingTable2, title: 'Meeting Table Without Flip LID' },
    { id: 12, image: SideBoard, title: 'Side Board' },
  ];

  return (
    <>
      <Header />
      <Container className="my-4">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {cards.map((card) => (
            <Col key={card.id}>
              <Card
                className="h-100 shadow-sm image-card"
                style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <Card.Img
                  variant="top"
                  src={card.image}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default ImageCards;
