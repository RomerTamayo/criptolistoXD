//barra de navegacion
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CgMenu } from 'react-icons/cg'
import { Container, Nav, Navbar } from 'react-bootstrap';

//miniatura
import p23 from "/src/assets/imgweb/logo.jpg"


export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setExpanded(false);
  }, [location]);
 
  return (

    <>

    <Navbar expand="lg" 
      className="shadow fixed-top"
      expanded={expanded}
      onToggle={() => setExpanded(prev => !prev)}
      
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(6px)'
      }}
    >


        <Container fluid>
          <Navbar.Brand>
          <Link to="/homcompra" className='text-dark text-decoration-none'>

          
          <img 
          src= {p23} 
          alt="Logo" 
          height="30"
          className="d-inline-block align-top rounded"
          />

          <span className="brand-text  text-start w-100 px-2 fw-bold fst-italic">
            Cripto Listo
          </span>

          
          </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='bg-transparent border-0 shadow-none'>
          <CgMenu size={30} className='fw-bold'/>
          </Navbar.Toggle>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav variant="underline" className='ms-auto'>
            <Link to="/homcompra" className='nav-link fw-bold hover-white'>Comprar</Link>
            <Link to="/homventa" className='nav-link fw-bold hover-white'>Vender</Link>
            <Link to="/profile" className='nav-link fw-bold hover-white'>Perfil</Link>
            <Link to="/logreg" className='nav-link fw-bold hover-white'>Cerrar Sesion</Link>

            </Nav>

          </Navbar.Collapse>
        </Container>
        
    </Navbar>

    <div style={{ paddingTop: '60px' }}></div>





       
    </>
    

  );
}
