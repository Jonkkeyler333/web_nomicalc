import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ToggleRole from '../components/ToggleRole';
import FormInput from '../components/FormInput';
import FormSection from '../components/FormSection';
import SubmitButton from '../components/SubmitButton';
import { register_company ,register_us ,register_employee} from "../services/registerService";
import { register_bank } from "../services/bankService";
import { checkCompany } from "../services/checkService";

export default function RegisterPage() {
  // Estados para la empresa
  const [companyName, setCompanyName] = useState("");
  const [companyNit, setCompanyNit] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Estados para el usuario y empleado
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [nuip, setNuip] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // const [empleado, setEmpleado] = useState("");
  // const [admin , setAdmin] = useState("");

  // Estados para el empleado
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companycode, setCompanyCode] = useState("");

  // Estados para el banco
  const [bankcode, setBankyCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNit, setBankNit] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [bankType,setBankType] = useState("");

  // Estados
  const [role, setRole] = useState(null);
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

  const handleSubmitEmpleado = async e => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      // 1. Verificar si la compañia existe
      const companyRes = await checkCompany(companycode);
      const company = companyRes.data;
      console.log(company);
      console.log(company.id);

      // 2. Registrar el empleado role_id = 2
      const employeeRest = await register_employee({
        name,
        last_name,
        nuip,
        email,
        phone,
        password,
        address,
        role_id : 2,
        company_id : company.id
      });

      await register_bank({
        account_number: bankcode,
        employee_id: employeeRest.data.id,
        bank_name: bankName,
        nit: bankNit,
        address: bankAddress,
        account_type: bankType
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al registrar el usuario"
      );
    }
  }

  return (
    <div style={{ maxWidth: 500, textAlign: 'center' ,margin: '2rem auto' }}>
      <h1>Registro</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && (
        <p style={{ color: 'green' }}>
          Registro exitoso, redirigiendo...
        </p>
      )}
      <ToggleRole role={role} onSelect={setRole} />
      {role === 'empleado' && (
        <>
        <h2>Registro de Empleado y su cuenta bancaria</h2>
        <form onSubmit={handleSubmitEmpleado}>
          <FormSection title='Datos del Banco'>
            <FormInput label="Número de cuenta" placeholder="Número de cuenta" value={bankcode} onChange={e => setBankyCode(e.target.value)} required />
            <FormInput label="Nombre del banco" placeholder="Nombre del banco" value={bankName} onChange={e => setBankName(e.target.value)} required />
            <FormInput label="NIT del banco" placeholder="NIT del banco" value={bankNit} onChange={e => setBankNit(e.target.value)} required />
            <FormInput label="Dirección del banco" placeholder="Dirección del banco" value={bankAddress} onChange={e => setBankAddress(e.target.value)} required />
            <FormInput label="Tipo de cuenta (ahorros/corriente)" placeholder="Tipo de cuenta" value={bankType} onChange={e => setBankType(e.target.value)} required />
          </FormSection>
          
          <FormSection title="Datos del Usuario">
            <FormInput label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
            <FormInput label="Apellido" value={last_name} onChange={e => setLastName(e.target.value)} required />
            <FormInput label="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} required />
            <FormInput label="Dirección" value={address} onChange={e => setAddress(e.target.value)} required />
            <FormInput label="NUIP" value={nuip} onChange={e => setNuip(e.target.value)} required />
            <FormInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <FormInput label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <FormInput label='Código de empresa' placeholder='El código que tio tu admin de compañia' value={companycode} onChange={e => setCompanyCode(e.target.value)} required />
          </FormSection>
          <SubmitButton>Registrar Empleado</SubmitButton>
        </form>
        </>
      )}

      {role === 'admin' && (
        <>
          <h2>Registro de Empresa y Compañia</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>¡Registro exitoso! Redirigiendo...</p>}
          <form onSubmit={handleSubmit}>
          <FormSection title="Datos de la Empresa">
              <FormInput label="Nombre de la empresa" placeholder="Nombre" value={companyName} onChange={e => setCompanyName(e.target.value)} required/>
              <FormInput label="NIT" placeholder="NIT" value={companyNit} onChange={e => setCompanyNit(e.target.value)} required/>
              <FormInput label="Dirección" placeholder="Dirección" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} required/>
              <FormInput label="Teléfono" placeholder="Teléfono" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} required/>
              <FormInput label="Email" placeholder="Email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required/>
              <FormInput label="Sitio web" placeholder="Sitio web" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />
            </FormSection>

            <FormSection title="Datos del Usuario Administrador">
              <FormInput label="Nombre" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required/>
              <FormInput label="Apellido" placeholder="Apellido" value={last_name} onChange={e => setLastName(e.target.value)} required/>
              <FormInput label="NUIP" placeholder="NUIP" value={nuip} onChange={e => setNuip(e.target.value)} required/>
              <FormInput label="Email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
              <FormInput label="Contraseña" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required/>
            </FormSection>
            <SubmitButton>Registrar Administrador</SubmitButton>
          </form>
        </>
      )}
      <div style={{ marginTop: '1rem' }}>
            <p>¿Ya tienes cuenta?</p>
            <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>
              Inicia sesión aquí
            </Link>
      </div>
    </div>
  );

}