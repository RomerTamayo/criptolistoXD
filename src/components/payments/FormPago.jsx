import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { BiHome, BiCreditCard } from "react-icons/bi"; 


function FormPago () {
    const navigate = useNavigate();

    return (
        <>
      
        <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow">
              <Card.Body className="text-center">
                <Card.Title as="h2" className="mb-4">
                  Forma de Pago
                </Card.Title>
  
                <div className="d-grid gap-3">
                  {/* Botón para Metamask */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="py-3"
                    onClick={() => navigate("/paymeta")}
                  >
                    <BiHome className="me-2" /> {/* Ícono opcional */}
                    Metamask
                  </Button>
  
                  {/* Botón para Trust Wallet */}
                  <Button
                    variant="success"
                    size="lg"
                    className="py-3"
                    onClick={() => navigate("/paytrust")}
                  >
                    <BiCreditCard className="me-2" /> {/* Ícono opcional */}
                    Trust Wallet
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
        
        </>
      
    );
}

export default FormPago;