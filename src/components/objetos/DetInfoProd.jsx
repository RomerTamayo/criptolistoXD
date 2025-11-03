// src/components/objetos/DetInfoProd.jsx
import { Card, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './objetos.css';

const DetInfoProd = ({ product, formatoWalletAddress }) => {
  const navigate = useNavigate();

  return (
    <>
    <Card className="shadow border-white" style={{ backgroundColor: '#fafafa'}}>
      <Row className="g-0">
        <Col md={6}>
          <Card.Img 
            src={product.imageUrl} 
            className="img-fluid rounded"
            style={{ height: '80vh', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
            }}
          />
        </Col>
        <Col md={6}>
          <Card.Body className="h-100 d-flex flex-column p-4 rounded" style={{ backgroundColor: '#fafafa' }}>
            <Card.Title className="fs-2 mb-3" style={{ color: '#2d3748', fontWeight: '500' }}>
              {product.title}
            </Card.Title>

            <Card.Subtitle className="mb-4" style={{ color: '#0d9e5f', fontSize: '1.25rem', fontWeight: '500' }}>
              {product.price} USDC
            </Card.Subtitle>

            <div className="mb-4">
              <Card.Subtitle className="mb-2" style={{ color: '#4a5568' }}>
                <span style={{ fontWeight: '500' }}>Vendedor:</span> {product.alias}
              </Card.Subtitle>

              <Card.Subtitle style={{ color: '#4a5568' }}>
                <span style={{ fontWeight: '500' }}>Billetera:</span> 
                <span style={{ fontFamily: 'monospace', marginLeft: '4px' }}>
                  {formatoWalletAddress(product.billetera)}
                </span>
              </Card.Subtitle>
            </div>

            <Card.Text className="mb-4" style={{ color: '#4a5568', lineHeight: '1.6' }}>
              {product.description}
            </Card.Text>

            <div className="d-grid gap-2 mt-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className='card-hoverxs border-white-50'
                onClick={() => navigate("/paymeta", {
                  state: { walletAddress: product.billetera, price: product.price }
                })}
                style={{ color: '#2E1461', backgroundColor: '#eeeeee', padding: '10px' }}
              >
                Pagar con Metamask
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className='card-hoverxs border-white-50'
                onClick={() => navigate("/paytrust", {
                  state: { walletAddress: product.billetera, price: product.price }
                })}
                style={{ color: '#14612E', backgroundColor: '#eeeeee', padding: '10px' }}
              >
                Pagar con TrustWallet
              </Button>

              <div className="py-1"></div>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate(-1)}
                style={{
                  color: '#ea5b18',
                  backgroundColor: 'transparent',
                  borderColor: '#f7bda3',
                  padding: '10px'
                }}
              >
                Volver
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
    
    </>
    
  );
};

export default DetInfoProd;
