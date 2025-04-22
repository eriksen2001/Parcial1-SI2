import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
    //rol: "",
  });

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //validaciones
    if (values.name === "") {
      alert("Por favor, ingrese su nombre completo");
      return;
    }

    /* NO ES OBLIGATORIO
        if (values.number === "") {
            alert("Por favor, ingrese su número de teléfono");
            return;
        }
        */

    if (values.email === "") {
      alert("Por favor, ingrese su correo electrónico");
      return;
    }

    if (values.password === "") {
      alert("Por favor, ingrese su contraseña");
      return;
    }

    if (values.password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      alert("Ingrese un correo válido");
      return;
    }

    console.log(values)
    // Conectamos con el backend en Django
    //respuesta del backend
    try {
      const response = await axios.post(
        "https://primerparcialsi2-production.up.railway.app/api/users/register/",
        values
      );
      alert("Cuenta creada exitosamente. Ahora puedes iniciar sesión.");
      window.location.href = "/";
    } catch {
      alert(
        "Hubo un error al registrar la cuenta. Por favor, intente nuevamente."
      );
      return;
    }
  };
  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col col-sm-10 col-md-8 col-lg-6 bg-dark bg-gradient border shadow p-4 rounded">
            <div className="text-center fs-1 mb-4 text-light">
              <p>Smart Cart</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Nombre completo"
                  name="name"
                  id="name"
                  onChange={handleChangeInputs}
                ></input>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Teléfono"
                  name="number"
                  id="number"
                  onChange={handleChangeInputs}
                ></input>
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control bg-light"
                  placeholder="Correo electrónico"
                  name="email"
                  id="email"
                  onChange={handleChangeInputs}
                ></input>
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control bg-light"
                  placeholder="Contraseña"
                  name="password"
                  id="password"
                  onChange={handleChangeInputs}
                ></input>
              </div>
              <button type="submit" className="btn btn-warning w-100 mb-3">
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
