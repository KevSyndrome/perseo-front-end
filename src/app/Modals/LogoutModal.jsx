import React from 'react';
import LogoutForm from '../Forms/LogoutForm';
import { logoutUsuario } from '../../services/authService';

const LogoutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await logoutUsuario();
    // Recarga completa: cierra el canal de avisos y limpia los stores en memoria.
    // replace evita que las flechas del navegador regresen al dashboard.
    window.location.replace('/login');
  };

  return (
    <LogoutForm
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};

export default LogoutModal;