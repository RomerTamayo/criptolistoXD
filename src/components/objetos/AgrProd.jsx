//src/components/objetos/AgrProd.jsx
import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { db, collection, addDoc, serverTimestamp } from '../firebase/firebase';
import { auth, doc, getDoc } from "../firebase/firebase";


const AgrProd = ({ onProductAdded }) => {
  
  // Estado inicial con todos los campos como strings vacíos
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    walletAddress: '',
    walletType: '' // 'trust' o 'metamask'
  });

  const [usuarioAlias, setUserAlias] = useState('');

  // Obtener el alias del usuario al cargar el componente
  useEffect(() => {
    const fetchUserAlias = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserAlias(userDoc.data().alias);
        }
      }
    };
    
    fetchUserAlias();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Asegúrate que todos los campos tienen valor
      if (!product.name || !product.price || !product.description || !product.imageUrl || !product.walletAddress || !product.walletType) {
        alert('Por favor completa todos los campos');
        return;
      }

      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        walletAddress: product.walletAddress,
        walletType: product.walletType,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userAlias: usuarioAlias
      });
      
      //console.log("Document written with ID: ", docRef.id);
      onProductAdded();
      
      // Limpiar el formulario con valores por defecto
      setProduct({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        walletAddress: '',
        walletType: ''
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Agregar nuevo producto</Card.Title>
        <Form onSubmit={handleSubmit}>
          {/* Nombre del Producto */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name || ''} // Aseguramos que nunca sea undefined
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Precio */}
          <Form.Group className="mb-3">
            <Form.Label>Precio (USDC)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={product.price || ''} // Aseguramos que nunca sea undefined
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={product.description || ''} // Aseguramos que nunca sea undefined
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* URL de la Imagen */}
          <Form.Group className="mb-3">
            <Form.Label>URL de la Imagen</Form.Label>
            <Form.Control
              type="url"
              name="imageUrl"
              value={product.imageUrl || ''} // Aseguramos que nunca sea undefined
              onChange={handleChange}
              required
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </Form.Group>

          {/* Sección de Billetera */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Información de Billetera</Card.Title>
              
              {/* Tipo de Billetera */}
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Billetera</Form.Label>
                <Form.Select 
                  name="walletType"
                  value={product.walletType || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="trust">Trust Wallet</option>
                  <option value="metamask">MetaMask</option>
                </Form.Select>
              </Form.Group>

              {/* Dirección de la Billetera */}
              <Form.Group className="mb-3">
                <Form.Label>Dirección de la Billetera</Form.Label>
                <Form.Control
                  type="text"
                  name="walletAddress"
                  value={product.walletAddress || ''}
                  onChange={handleChange}
                  required
                  placeholder="0x..."
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <Button variant="primary" type="submit">
            Publicar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AgrProd;