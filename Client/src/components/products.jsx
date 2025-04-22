import React, { useState, useEffect } from "react";
import ProductCard from "./productCard";
import axios from "axios";

const Products = ({ carrito, setCarrito }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://primerparcialsi2-production.up.railway.app/api/products/getproducts/"
      )
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al cargar los productos", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Productos Disponibles</h2>
      <div className="row">
        {products.map((prod) => (
          <div
            key={prod.producto_id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <ProductCard
              producto={prod}
              carrito={carrito}
              setCarrito={setCarrito}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
