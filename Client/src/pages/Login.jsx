import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseServices";
import axios from "axios";

import GoogleLogo from "../assets/google.png";
import redireccionamiento from "../helpers/NavigateRol"

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //validaciones
    if (values.email === "") {
      alert("El correo electrónico es requerido");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      alert("Por favor, ingrese un correo electrónico válido");
      return;
    }

    if (values.password === "") {
      alert("La contraseña es requerida");
      return;
    }

    // Conectamos con el backend en Django
    try {
      const response = await axios.post(
        "https://primerparcialsi2-production.up.railway.app/api/users/login/",
        values
      );

      console.log(response.data)

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redireccionar al dashboard del usuario según su rol
      redireccionamiento(response.data.user.rol, navigate);
    } catch(error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        auth_provider: "google",
      };

      console.log(userData);

      // Guardamos los datos del usuario en localStorage
      const response = await axios.post(
        "http://localhost:8000/api/auth/google",
        userData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      //Redireccionamos a la pantalla correspondiente según su rol
      redireccionamiento(response.data.user.rol);
    } catch {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 bg-white border shadow p-4 rounded">
            <div className="text-center fs-3 mb-4">
              <p>Inicia Sesión en Smart Cart</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control bg-secondary"
                  placeholder="Correo Electrónico"
                  name="email"
                  id="email"
                  onChange={handleChangeInputs}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  className="form-control bg-secondary"
                  placeholder="Contraseña"
                  name="password"
                  id="password"
                  onChange={handleChangeInputs}
                />
              </div>
              <div className="form-text mb-4">
                Recupera tu contraseña <a href="#">aquí</a>
              </div>
              <button type="submit" className="btn btn-warning w-100 mb-3">
                Iniciar Sesión
              </button>
            </form>

            <div className="text-center mb-3">o</div>

            <button
              className="btn btn-dark w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
              onClick={googleLogin}
            >
              <img src={GoogleLogo} alt="Google" style={{ width: "20px" }} />
              Iniciar Sesión con Google
            </button>

            <div className="text-center">
              <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
