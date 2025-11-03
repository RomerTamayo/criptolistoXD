import { useState } from 'react';
import { Card, Button, ListGroup, Image, Modal } from 'react-bootstrap';
import { auth, db } from '../firebase/firebase';
import ComentProd from './ComentProd';
import { deleteDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';

const MisProd = ({ products, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const myProducts = products.filter(
    product => product.userId === auth.currentUser?.uid
  );

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleChatClick = (product) => {
    setSelectedProduct(product);
    setShowChatModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Eliminar el producto
      await deleteDoc(doc(db, "products", productToDelete));
      
      // Eliminar los comentarios asociados al producto
      const commentsRef = collection(db, "comments");
      const q = query(commentsRef, where("productId", "==", productToDelete));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      await Promise.all(deletePromises);
      
      onDelete(productToDelete);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error al eliminar producto y comentarios:", error);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Productos Publicados</Card.Title>
          {myProducts.length === 0 ? (
            <p>No has publicado ningún producto aún.</p>
          ) : (
            <ListGroup variant="flush">
              {myProducts.map(product => (
                <ListGroup.Item key={product.id}>
                  <div className="d-flex">
                    {product.imageUrl && (
                      <div className="me-3" style={{ width: '100px', height: '100px' }}>
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name}
                          thumbnail
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/100?text=Imagen+no+disponible';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5>{product.name}</h5>
                          <p className="mb-1">Precio: {product.price} USDC</p>
                          <p className="mb-1">{product.description}</p>
                          <small className="text-muted">
                            Publicado el: {new Date(product.createdAt?.toDate()).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDeleteClick(product.id)}
                            
                          >
                            Eliminar
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleChatClick(product)}
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Modal para eliminar producto */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer y también se eliminarán todos los comentarios asociados.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para el chat */}
      <Modal 
        show={showChatModal} 
        onHide={() => setShowChatModal(false)}
        size="lg"
        dialogClassName="modal-90vh"
      >
        <Modal.Header closeButton>
          <Modal.Title className='text-success'>
            {selectedProduct?.name} - {selectedProduct?.price} USDC
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: 'calc(90vh - 120px)', padding: '0' }}>
          {selectedProduct && (
            <ComentProd productId={selectedProduct.id} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MisProd;