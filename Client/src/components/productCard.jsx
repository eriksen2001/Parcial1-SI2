import React from "react";
import { FaCartPlus } from "react-icons/fa";

const ProductCard = ({ producto, carrito, setCarrito }) => {
  // Asegurarse que se usa el campo correcto como identificador
  const id = producto.producto_id || producto.id;
  const nombre = producto.producto_nombre || producto.nombre;
  const { precio, imagen } = producto;

  const handleAgregar = () => {
    const productoExistente = carrito.find(
      (item) => item.producto_id === id || item.id === id
    );

    if (productoExistente) {
      const actualizado = carrito.map((item) =>
        item.producto_id === id || item.id === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setCarrito(actualizado);
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1,
          producto_id: id,
          producto_nombre: nombre,
        },
      ]);
    }
  };

  return (
    <div
      className="card shadow-sm"
      style={{ width: "16rem", marginBottom: "20px" }}
    >
      <img
        src={imagen}
        className="card-img-top"
        alt={nombre}
        style={{ height: "180px", objectFit: "contain", padding: "1rem" }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title text-center" style={{ minHeight: "40px" }}>
          {nombre}
        </h6>
        <p className="card-text fw-bold text-success text-center">
          Bs {precio}
        </p>
        <button
          className="btn btn-primary mt-auto"
          onClick={handleAgregar}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaCartPlus className="me-2" />
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
