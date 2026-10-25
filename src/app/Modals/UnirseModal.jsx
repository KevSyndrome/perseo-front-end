import React, { useState } from 'react';
import UnirseForm from '../Forms/UnirseForm';
import { unirseProyecto } from '../../services/proyectoService';

const UnirseModal = ({ isOpen, onClose, onUnido }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  const handleConfirm = async (codigo) => {
    setLoading(true);
    setError('');
    try {
      const resultado = await unirseProyecto(codigo);
      onUnido?.(resultado.data);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnirseForm
      onConfirm={handleConfirm}
      onCancel={handleClose}
      code={code}
      onChange={(c) => { setCode(c); setError(''); }}
      error={error}
      loading={loading}
    />
  );
};

export default UnirseModal;
