// src/LoginRegister.jsx
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { loginUser } from "./AutServ";
import p23 from '/src/assets/imgweb/logo.jpg';
import './Auth.css'


function LogReg() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate(`/homcompra`);
    } catch (error) {
      setError('Usuario no registrado');
    }
  };

  return (
    <>
    <Container
      className="d-flex justify-content-center align-items-center position-relative"
      style={{ minHeight: "100vh", zIndex: 1, overflow: "hidden" }}
    >
      <div className="background-animated">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Logo animado */}
      <div className="logo-wrapper text-center">
        <img src={p23} alt="Logo" className="logo-animated rounded" />
        <h2 className='mt-4 text-white fw-bolder fst-italic cri-list'>
          Cripto Listo
        </h2>
      </div>
      
      

      <Card
        style={{ width: "400px", padding: "20px", zIndex: 2 }}
        className="glass-card"
      >
        <Card.Body>
          <h2 className="text-center text-white">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group>
              <Form.Label className="text-white">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label className="text-white">Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" className="mt-3 w-100" onClick={handleLogin}>
              Iniciar sesión
            </Button>
            <Button
              variant="success"
              className="mt-3 w-100"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>


    </>
  );
}

export default LogReg;