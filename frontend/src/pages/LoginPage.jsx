import { useState } from 'react';
import { useNavigate ,Link } from 'react-router-dom';
import { login } from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      // Guardamos token en localStorage
      localStorage.setItem('access_token', data.access_token);
      // Redirigimos a la página principal
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Contraseña</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Entrar
        </button>
      </form>
      <div>
        <p style={{ marginTop: '1rem' }}>¿No tienes cuenta?</p>
        <Link to="/register" style={{ textDecoration: 'none', color: 'blue' }}>
          Regístrate aquí</Link>
      </div>
    </div>
  );
}
