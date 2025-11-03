// src/components/objetos/ComProd.jsx
import Card from 'react-bootstrap/Card';
import './objetos.css';


import { useNavigate } from 'react-router-dom';

function ComProd({ id, title, price, description, imageUrl }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (!id) {
      console.error("ID no definido");
      return;
    }
    navigate(`/detalleprod/${id}`);
  };

  return (
    <Card 
      style={{cursor: 'pointer'}} 
      onClick={handleClick}
      className="border-white card-hoverx h-80 w-100"
    >
      <Card.Img variant="top" src={imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title className="text-truncate">{title}</Card.Title>
        <Card.Subtitle className="text-success">{price} USDC</Card.Subtitle>
        {/* <Card.Text className="text-truncate">{description}</Card.Text> */}
      </Card.Body>
    </Card>
  );
}

export default ComProd;