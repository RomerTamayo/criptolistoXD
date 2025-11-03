// src/pages/HomVenta.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AgrProd from '/src/components/objetos/AgrProd.jsx';
import MisProd from '/src/components/objetos/MisProd.jsx';

import { db, collection, getDocs, doc, deleteDoc } from '../firebase/firebase';

import NavBar from "/src/components/blocks/NavBar.jsx";

const HomVenta = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productsData);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      fetchProducts(); // Actualizar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar producto: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <NavBar/>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={6} className="mb-4">
            <AgrProd onProductAdded={fetchProducts} />
          </Col>

          <Col xs={12} md={6} lg={6} className="mb-4">
            <MisProd 
              products={products} 
              onDelete={handleDeleteProduct} 
            />
          </Col>
          
        </Row>
      </Container>
    </>
    
  );
};

export default HomVenta;