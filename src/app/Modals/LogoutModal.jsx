import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutForm from '../Forms/LogoutForm';

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Limpia la sesión
    localStorage.clear();
    sessionStorage.clear();

    // Redirige al login reemplazando el historial
    // "replace: true" evita que las flechas del navegador regresen al dashboard
    navigate('/login', { replace: true });
  };

  return (
    <LogoutForm
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};

export default LogoutModal;