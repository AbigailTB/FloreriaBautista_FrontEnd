import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  const isAuthenticated = !!token;
  const isAdmin = usuario?.roles?.includes('ADMIN');

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setToken(null);
    navigate('/login');
  };

  return { usuario, token, isAuthenticated, isAdmin, logout };
};
