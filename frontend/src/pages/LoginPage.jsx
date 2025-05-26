import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginService } from '../services/authService';
import { useAuth } from '../context/authContext';
import './LoginPage.css';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await loginService(email, password);
      console.log(data);
      login(data);
      setError('');
      setSuccess(true);
      const userType = data.user_type;
      setTimeout(() => {
        setError('');
        setSuccess(false);
        if (userType === 'employee') {
          navigate('/home_employee');
        } else {
          navigate('/home');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación');
    }
  };

  return (
    <div className="page-container">
      <header className="header">
        <div className="logo">Web_Nomicalc</div>
      </header>
      <main className="main-content">
        <div className="login-form">
          <h1>Login</h1>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">Login exitoso, redirigiendo...</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Entrar
            </button>
          </form>
          <div className="register-link">
            <p>¿No tienes cuenta?</p>
            <Link to="/register">Regístrate aquí</Link>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>© 2025 Web Nomic. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
