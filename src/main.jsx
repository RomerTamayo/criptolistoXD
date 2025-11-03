import "bootstrap/dist/css/bootstrap.min.css";

import React from 'react';
import ReactDOM from 'react-dom/client';

// Directorio de componentes
import App from './App.jsx'; // Este es tu layout principal que contendrá el <Outlet>
import FormPago from './components/payments/FormPago.jsx';
import PayMeta from './components/payments/PayMeta.jsx';
import PayTrust from './components/payments/PayTrust.jsx';

import LogReg from './components/auth/LogReg.jsx';
import RegisTer from './components/auth/RegisTer.jsx';
import HomVenta from './components/pages/HomVenta.jsx';
import HomCompra from './components/pages/HomCompra.jsx';
import DetalleProd from './components/objetos/DetalleProd.jsx';
import LandingPage from './landingpage/LandingPage.jsx';
import Profile from './components/pages/Profile.jsx';

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'; // Asegúrate de importar Navigate si la usas

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App es tu componente de layout principal con <Outlet>
    children: [
      // Usamos 'index' para la ruta por defecto cuando el path es exactamente "/"
      {
        index: true, // Esto significa que cuando la URL es "/", se renderiza LandingPage
        element: <LandingPage />
      },
      // Si también quieres que "/landing" funcione explícitamente
      {
        path: "landing", // No es necesario el '/' inicial en rutas hijas
        element: <LandingPage />
      },
      {
        path: "homventa",
        element: <HomVenta />
      },
      {
        path: "homcompra",
        element: <HomCompra />
      },
      {
        path: "detalleprod/:id",
        element: <DetalleProd />
      },
      {
        path: "logreg",
        element: <LogReg />
      },
      {
        path: "register",
        element: <RegisTer />
      },
      {
        path: "formpago",
        element: <FormPago />
      },
      {
        path: "paymeta",
        element: <PayMeta />
      },
      {
        path: "paytrust",
        element: <PayTrust />
      },
      {
        path: "profile",
        element: <Profile />
      },
      // Opcional: una ruta de fallback para URLs no encontradas
      {
        path: "*",
        element: <Navigate to="/landing" replace /> // Redirige a landing si la ruta no existe
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);