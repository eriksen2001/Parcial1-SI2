import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [productos, setProductos] = useState([]);

  const handleChange = (index, campo, valor) => {
    const actualizados = [...productos];
    actualizados[index][campo] = valor;
    setProductos(actualizados);
  }

  useEffect(() => {
    axios
      .get(
        "https://primerparcialsi2-production.up.railway.app/api/products/getallproducts/"
      )
      .then((res) => {
        setProductos(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  const guardarCambios = (producto) => {
    axios.post(`https://primerparcialsi2-production.up.railway.app/api/products/update/${producto.id}/`, {
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock)
    })
    .then(() => alert("Producto actualizado con éxito"))
    .catch((err) => console.error("Error al actualizar:", err));
  };

  return (
    <>
      <div className="container">
        <h3 className="mb-4">Gestión de Productos</h3>

        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>Nombre</th>
              <th>Precio (Bs)</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto, index) => (
              <tr key={producto.id} className="align-middle text-center">
                <td>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={producto.nombre}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={producto.precio}
                    onChange={(e) => handleChange(index, "precio", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={producto.stock}
                    onChange={(e) => handleChange(index, "stock", e.target.value)}
                  />
                </td>
                <td>
                  <span
                    className={`badge ${
                      producto.estado ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {producto.estado ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => guardarCambios(producto)}>
                    Guardar
                  </button>
                  <button
                    className={`btn btn-${
                      producto.estado ? "warning" : "success"
                    } btn-sm`}
                  >
                    {producto.estado ? "Ocultar" : "Mostrar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminProducts;
