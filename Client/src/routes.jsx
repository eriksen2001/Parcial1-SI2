import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cliente from "./pages/Cliente";
import PrivateRoute from "./helpers/PrivateRoute";
import AdminPanel from "./pages/AdminPanel";
import Checkout from "./pages/Checkout";

const AppRouter = ({ carrito, setCarrito }) => {
  return (
    <Router basename="/PrimerParcialSI2">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/cliente"
          element={
            <PrivateRoute role="Cliente">
              <Cliente carrito={carrito} setCarrito={setCarrito} />
            </PrivateRoute>
          }
        />

        <Route path="/admin" element={<AdminPanel />} />

        <Route
          path="/checkout"
          element={<Checkout carrito={carrito} setCarrito={setCarrito} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
