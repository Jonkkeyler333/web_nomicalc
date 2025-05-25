import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/authService';

// Crear el contexto
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Cargar el perfil del usuario al iniciar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const loadUserProfile = async () => {
      try {
        const { data } = await getProfile();
        setCurrentUser(data);
      } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Body:", error.response?.data);
        console.error("Error al cargar perfil:", error);
        if (error.response?.status === 422) {
          console.warn("Token inválido, cerrando sesión.");
        }
        localStorage.removeItem('access_token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [token]);

  // Función para actualizar el contexto después del login
  const login = (authData) => {
    localStorage.setItem('access_token',authData.access_token);
    setToken(authData.access_token);
    setCurrentUser(
      {
        ...authData.user,       // Spread de todas las propiedades del usuario
        user_type: authData.user_type  // Añadir el tipo de usuario
      }
     );
    } ;


  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAdmin: currentUser?.user_type === 'user',
    isEmployee: currentUser?.user_type === 'employee',
    companyId: currentUser?.company_id,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);