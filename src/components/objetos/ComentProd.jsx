// src/components/objetos/ComentProd.jsx
import { useState, useEffect } from 'react';
import { Card, ListGroup, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { auth, db } from '../firebase/firebase';
import { orderBy, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { collection, addDoc, query, where, onSnapshot} from 'firebase/firestore';
import { IoSendSharp } from 'react-icons/io5';




const ComentProd = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAlias, setUserAlias] = useState('');

  // Obtener el alias del usuario actual
  useEffect(() => {
    const fetchUserAlias = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserAlias(userDoc.data().alias);
          }
        } catch (err) {
          console.error("Error fetching user alias:", err);
        }
      }
    };
    
    fetchUserAlias();
  }, []);

  // Cargar comentarios del producto
  useEffect(() => {
    if (!productId) return;
    
    const q = query(
      collection(db, "comments"),
      where("productId", "==", productId),
      orderBy("createdAt", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    }, (err) => {
      setError("Error al cargar comentarios");
      console.error("Error loading comments:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!auth.currentUser) {
      setError("Debes iniciar sesión para comentar");
      return;
    }

    try {
      await addDoc(collection(db, "comments"), {
        productId: productId,
        text: newComment.trim(),
        userId: auth.currentUser.uid,
        userAlias: userAlias,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setError(null);
    } catch (err) {
      setError("Error al publicar comentario");
      console.error("Error adding comment:", err);
    }
  };



  return (
    <Card className="shadow border-white" style={{ backgroundColor: '#fafafa', height: '80vh'}}>
      <Card.Body>
        <Card.Title>Comentarios sobre el producto</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" /> Cargando comentarios...
          </div>
        ) : (
          <>
            <ListGroup className="mb-3" style={{ height: '60vh', overflowY: 'auto' }}>
              {comments.length === 0 ? (
                <ListGroup.Item className="text-muted">
                  No hay comentarios aún. Sé el primero en opinar.
                </ListGroup.Item>
              ) : (
                comments.map(comment => (
                  <ListGroup.Item key={comment.id}>
                    <div className="d-flex justify-content-between">
                      <strong>{comment.userAlias || 'Anónimo'}</strong>
                      <small className="text-muted">
                        {comment.createdAt?.toDate().toLocaleString()}
                      </small>
                    </div>
                    <div>{comment.text}</div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>

            {auth.currentUser ? (
              <Form onSubmit={handleSubmit}>
                <div className="d-flex gap-2">
                    <Form.Control
                    as="input"
                    
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    required

                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); // Evita salto de línea
                        handleSubmit(e);    // Llama la función para enviar
                        }
                    }}
                    />
                    <Button
                    variant="primary"
                    type="submit"
                    
                    >
                    <IoSendSharp size={20} />
                    </Button>
                </div>
                </Form>

            ) : (
              <Alert variant="info">
                Inicia sesión para dejar un comentario
              </Alert>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ComentProd;