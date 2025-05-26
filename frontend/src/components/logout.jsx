import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ className = '', children = 'Cerrar Sesión' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('Sesión cerrada exitosamente');
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className={`logout-button ${className}`}
      style={{
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.3s',
        ...(!className && { margin: '10px' })
      }}
    >
      {children}
    </button>
  );
}