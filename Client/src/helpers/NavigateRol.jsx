
const redireccionamiento = (role, navigate) => {
  switch (role) {
    case "Admin":
      navigate("/admin");
      break;
    case "Empleado":
      navigate("/empleado");
      break;
    case "Cliente":
      navigate("/cliente");
      break;
    default:
      navigate("/");
      break;
  }
};

export default redireccionamiento;
