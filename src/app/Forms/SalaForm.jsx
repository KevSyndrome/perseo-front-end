import React, { useState, useEffect } from 'react';
import Modal from '../Modals/CreateProyectoModal';
import FormField from '../Components/UI/FormField';
import InputText from '../Components/UI/InputText';
import TextArea from '../Components/UI/TextArea';
import Select from '../Components/UI/Select';
import FormActions from '../Components/UI/FormActions';
import { crearSala } from '../../services/salaService';
import { getProyectos } from '../../services/proyectoService';
import { usePermisosStore, tieneModulo } from '../Components/PermisosStore';

// privada: cualquiera; proyecto: solo el dueño (canal extra); libre: requiere "configuracion"
export default function SalaForm({ isOpen, onClose, onSalaCreada }) {
  const permisos = usePermisosStore((s) => s.permisos);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('privada');
  const [proyectoId, setProyectoId] = useState('');
  const [misProyectos, setMisProyectos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getProyectos(1, 100, { solo_propios: true })
      .then((res) => setMisProyectos(res.data || []))
      .catch(() => setMisProyectos([]));
  }, [isOpen]);

  const tipos = [
    { value: 'privada', label: 'Privada (con código de invitación)' },
    ...(misProyectos.length > 0 ? [{ value: 'proyecto', label: 'Canal de un proyecto mío' }] : []),
    ...(tieneModulo(permisos, 'configuracion') ? [{ value: 'libre', label: 'General (todos la ven)' }] : []),
  ];

  const handleClose = () => {
    setNombre('');
    setDescripcion('');
    setTipo('privada');
    setProyectoId('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await crearSala({
        nombre,
        ...(descripcion && { descripcion }),
        tipo,
        ...(tipo === 'proyecto' && { proyecto_id: proyectoId }),
      });
      onSalaCreada?.(res.data);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear sala">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <p className="text-sm text-red-500">{error}</p>}

        <FormField label="Nombre" required>
          <InputText value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Equipo frontend" required />
        </FormField>

        <FormField label="Descripción">
          <TextArea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="¿De qué trata esta sala?" rows={3} />
        </FormField>

        <FormField label="Tipo" required>
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)} options={tipos} placeholder="Selecciona el tipo" required />
        </FormField>

        {tipo === 'proyecto' && (
          <FormField label="Proyecto" required>
            <Select
              value={proyectoId}
              onChange={(e) => setProyectoId(e.target.value)}
              options={misProyectos.map((p) => ({ value: p.id, label: p.nombre }))}
              placeholder="Selecciona el proyecto"
              required
            />
          </FormField>
        )}

        <FormActions onCancel={handleClose} submitLabel={loading ? 'Creando...' : 'Crear sala'} />
      </form>
    </Modal>
  );
}
