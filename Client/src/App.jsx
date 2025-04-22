import { useState, useEffect } from "react";
import AppRouter from "./routes";

function App() {
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const guardado = localStorage.getItem("carrito");
    if (guardado) {
      setCarrito(JSON.parse(guardado));
    }
  }, []);

  // Guardar carrito cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  return <AppRouter carrito={carrito} setCarrito={setCarrito} />;
}

export default App;
