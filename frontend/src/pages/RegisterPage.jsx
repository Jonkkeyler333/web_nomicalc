import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register_company ,register_us} from "../services/registerService";

export default function RegisterPage() {
  // Estados para la empresa
  const [companyName, setCompanyName] = useState("");
  const [companyNit, setCompanyNit] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Estados para el usuario
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [nuip, setNuip] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      // 1. Registrar la compañía
      const companyRes = await register_company(
        companyName,
        companyNit,
        companyAddress,
        companyPhone,
        companyEmail,
        companyWebsite
      );
      const company = companyRes.data;
      console.log(company);
      console.log(company)

      // 2. Registrar el usuario con el company_id y role_id = 1
      await register_us({
        name,
        last_name,
        nuip,
        email,
        password,
        company_id: company.id,
        role_id: 1
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al registrar la empresa o el usuario"
      );
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Registro de Empresa y Usuario</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>¡Registro exitoso! Redirigiendo...</p>}
      <h2>Recuerda que si eres empleado , debes solicitar tu registro en tu compañia!</h2>
      <form onSubmit={handleSubmit}>
        <h2>Datos de la Empresa</h2>
        <input placeholder="Nombre" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
        <input placeholder="NIT" value={companyNit} onChange={e => setCompanyNit(e.target.value)} required />
        <input placeholder="Dirección" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} required />
        <input placeholder="Teléfono" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} required />
        <input placeholder="Email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required />
        <input placeholder="Sitio web" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />

        <h2>Datos del Usuario Administrador</h2>
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Apellido" value={last_name} onChange={e => setLastName(e.target.value)} required />
        <input placeholder="NUIP" value={nuip} onChange={e => setNuip(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" style={{ marginTop: "1rem" }}>Registrar</button>
      </form>
      <div>
        <p style={{ marginTop: "1rem" }}>¿Ya tienes cuenta?</p>
        <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}