import React, { useState } from 'react';
import UnirseForm from '../Forms/UnirseForm';

const UnirseModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleConfirm = (codigo) => {
    console.log('Código ingresado:', codigo);
    setCode('');
    onClose();
  };

  const handleClose = () => {
    setCode('');
    onClose();
  };

  return (
    <UnirseForm
      onConfirm={handleConfirm}
      onCancel={handleClose}
      code={code}
      onChange={setCode}
    />
  );
};

export default UnirseModal;