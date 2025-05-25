import { useState } from 'react';
import { useNavigate ,Link } from 'react-router-dom';
import { loginService } from '../services/authService';
import { useAuth } from '../context/authContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await loginService(email, password);
      console.log(data);
      // localStorage.setItem('access_token', data.access_token);
      // login(data.user, data.access_token);
      login(data);
      setError('');
      setSuccess(true);
      //esperamos 2 segundos para que el usuario vea el mensaje de exito
      setTimeout(() => {
          setError('');
          setSuccess(false);
      }, 10000);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación');
    }
  };

  return (
    <div style={{ maxWidth: 400, textAlign: 'center',margin: '2rem auto' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && (
        <p style={{ color: 'green' }}>
          Login exitoso, redirigiendo...
        </p>
      )}
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
