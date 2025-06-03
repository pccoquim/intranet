// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Carregando...</p>;
  
  return user ? children : <Navigate to="/userLogin" />;
};

export default PrivateRoute;
