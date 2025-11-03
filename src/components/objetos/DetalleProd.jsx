//src/components/objetos/DetalleProd.jsx
import NavBar from "/src/components/blocks/NavBar.jsx";

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Button, Card, Spinner, Container, Row, Col } from 'react-bootstrap';
import DetInfoProd from './DetInfoProd.jsx';
import ComentProd from './ComentProd.jsx';


const DetalleProd = () => {


  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          setError('ID de producto no proporcionado');
          return;
        }

        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            title: data.name || 'Sin nombre',
            price: data.price || '0',
            description: data.description || 'Sin descripción',
            imageUrl: data.imageUrl || 'No file',
            alias: data.userAlias || 'No identificado',
            billetera: data.walletAddress
          });
        } else {
          setError('Producto no encontrado');
        }
        
      } catch (err) {
        console.error("Error fetching product:", err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
      



    };

    fetchProduct();
  }, [id]);

  const formatoWalletAddress = (address) => {
    if (!address) return 'Sin direccion de billetera';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <>
      <NavBar/>
        <Container className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Cargando producto...</p>
        </Container>
      </>
      
    );
  }

  if (error) {
    return (
      <>
      <NavBar/>
        <Container className="text-center my-5">
          <Card className="text-danger p-3">
            <h4>{error}</h4>
            <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
              Volver atrás
            </Button>
          </Card>
        </Container>
      </>   
    );
  }
  
  return (
    
    <>
    <NavBar/>
      <Container className="my-3">
        <Row className="justify-content-center">
          <Col lg={8}>
            <DetInfoProd product={product} formatoWalletAddress={formatoWalletAddress} />
          </Col>
          <Col lg={4}>
            <ComentProd productId={product.id} />
          </Col>
        </Row>
      </Container>
    </>
    
  );
};

export default DetalleProd;