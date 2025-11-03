// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

import NavBar from "/src/components/blocks/NavBar.jsx";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError("No se encontraron datos del usuario");
        }
      } catch (err) {
        setError("Error al cargar los datos del usuario");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setError("Error al cerrar sesión");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
    
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <NavBar/>
      <Card style={{ width: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Perfil de Usuario</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {userData && (
            <div className="user-info">
              <div className="mb-3">
                <strong>Nombre: </strong>
                <span>{userData.name}</span>
              </div>
              
              <div className="mb-3">
                <strong>Alias: </strong>
                <span>{userData.alias}</span>
              </div>
              
              <div className="mb-3">
                <strong>Email: </strong>
                <span>
                    {userData.email.replace(/(.{2})(.*)(@.*)/, (match, p1, p2, p3) => 
                    `${p1}${p2.replace(/./g, '*')}${p3}`
                    )}
                </span>
                </div>
              
              
            </div>
          )}

          <div className="d-grid gap-2 mt-4">
            <Button variant="primary" onClick={() => navigate("/homcompra")}>
              Volver al inicio
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
}

export default Profile;