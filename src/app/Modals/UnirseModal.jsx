import React, { useState } from 'react';
import UnirseForm from '../Forms/UnirseForm';

const UnirseModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = (codigo) => {
    if (codigo.length !== 6 || codigo.includes('')) {
      setError('Por favor rellena todos los campos del código.');
      return;
    }

    // ← Cuando conectes el backend reemplaza esto con la llamada real
    const codigosValidos = ['ABC123'];
    if (!codigosValidos.includes(codigo)) {
      setError('Código incorrecto. Verifica el código con el administrador.');
      return;
    }

    setError('');
    setCode('');
    onClose();
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <UnirseForm
      onConfirm={handleConfirm}
      onCancel={handleClose}
      code={code}
      onChange={(val) => {
        setCode(val);
        setError('');
      }}
      error={error}
    />
  );
};

export default UnirseModal;