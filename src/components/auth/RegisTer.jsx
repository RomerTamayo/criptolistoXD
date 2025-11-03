// src/RegisTer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { registerUser } from "./AutServ";
import { db, doc, setDoc } from "../firebase/firebase";

//para almacenar en db: db, doc,setDoc

function RegisTer() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    alias: "",
    birthDate: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    if (!formData.email || !formData.password || !formData.name || !formData.birthDate || !formData.alias) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const userCredential = await registerUser(formData.email, formData.password);
      const user = userCredential;
    //despues del registro almacena una copia de los datos en la DB luego ingresa
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        alias: formData.alias,
        email: formData.email,
        birthDate: formData.birthDate,
        createdAt: new Date()
        });
      navigate(`/homcompra`);
    } catch (error) {
      //setError(error.message);
      setError('Este usuario esta registrado');
    }
  };

  return (
    <Container
          className="d-flex justify-content-center align-items-center position-relative"
          style={{ minHeight: "100vh", zIndex: 1, overflow: "hidden" }}
        >
       <div className="background-animated">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <Card
          style={{ width: "500px", zIndex: 2 }}
          className="glass-card"
        >
        <Card.Body>
          <h2 className="text-center text-white">Registro</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 text-white">
              <Form.Label>Nombre completo*</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3 text-white">
              <Form.Label>Alias*</Form.Label>
              <Form.Control 
                type="text" 
                name="alias" 
                value={formData.alias} 
                onChange={handleChange}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3 text-white">
              <Form.Label>Email*</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3 text-white">
              <Form.Label>Contraseña*</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3 text-white">
              <Form.Label>Confirmar contraseña*</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3 text-white">
              <Form.Label>Fecha de nacimiento*</Form.Label>
              <Form.Control 
                type="date" 
                name="birthDate" 
                value={formData.birthDate} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mt-3">
              Registrarse
            </Button>
            <Button variant="secondary" type="submit" className="w-100 mt-3" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
    </Container>
  );
}

export default RegisTer;