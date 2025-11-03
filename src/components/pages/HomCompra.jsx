// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ComProd from '/src/components/objetos/ComProd.jsx';
import { db, collection, getDocs } from '../firebase/firebase';

import NavBar from "/src/components/blocks/NavBar.jsx";
import MuralHome from "/src/components/blocks/MuralHome.jsx";

const HomCompra = () => {
  const images = [
    { url: 'https://wallpapersok.com/images/hd/5120x1440-game-horizon-zero-dawn-xx9iu2fea7jwr30z.jpg', caption: 'Cripto Games' },
    { url: 'https://wallpapersok.com/images/hd/5120x1440-game-xenoblade-chronicles-2-jx14c9g4vbnnt1v3.jpg', caption: 'Ofertas del mes' },
    { url: 'https://wallpapers.com/images/hd/open-world-game-1328-x-746-wallpaper-l7kf2dg2vm6yi7yp.jpg', caption: 'Nuevos Lanzamientos' }
  ];


  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productsData);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <NavBar/>
      
      <MuralHome images={images} />
      <Container fluid className="my-2 px-sm-3">
        
        <Row className="justify-content-center"> {/* Alineación a la izquierda */}
          <Col xs={12} className="mb-5">
            
            
            <Row className="g-1 g-sm-2 g-lg-3"> {/* Espaciado aumentado */}
              {products.length > 0 ? (
                products.map(product => (
                  <Col 
                    key={product.id} 
                    xs={6} 
                    sm={6} 
                    lg={4} 
                    xl={2} 
                    className="d-flex" /* Flex para igualar alturas */
                  >
                    <div className="w-100 h-100"> {/* Contenedor adicional para mejor control */}
                      <ComProd
                        key={product.id}
                        id={product.id}
                        title={product.name}
                        price={product.price}
                        description={product.description}
                        imageUrl={product.imageUrl}
                        className="" /* Altura completa */
                      />
                    </div>
                  </Col>
                ))
              ) : (
                <Col xs={12} className="text-center my-5 py-5">
                  <p className="fs-4 text-muted">No hay productos disponibles</p>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
    
  );
};

export default HomCompra;