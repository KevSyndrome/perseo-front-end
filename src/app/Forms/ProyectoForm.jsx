import React, { useState, useEffect } from 'react';
import Modal from '../Modals/CreateProyectoModal';
import FormField from '../Components/UI/FormField';
import InputText from '../Components/UI/InputText';
import InputDate from '../Components/UI/InputDate';
import TextArea from '../Components/UI/TextArea';
import ToggleGroup from '../Components/UI/ToggleGroup';
import ImageUpload from '../Components/UI/ImageUpload';
import FormActions from '../Components/UI/FormActions';
import { crearProyecto, getStatusProyectos } from '../../services/proyectoService';

const tipoOptions = [
  { value: 'privado', label: 'Propio', icon: '👤' },
  { value: 'colaborativo', label: 'Colaborativo', icon: '👥' },
];

export default function ProyectoForm({ isOpen, onClose, onProyectoCreado }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipo, setTipo] = useState('privado');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoBase64, setLogoBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusId, setStatusId] = useState('');

  useEffect(() => {
  if (!isOpen) return;
  getStatusProyectos()
    .then((data) => {
      console.log('Status data recibida:', JSON.stringify(data, null, 2));
      const lista = data?.data || data;
      const activo = Array.isArray(lista)
        ? lista.find((s) => s.nombre?.toLowerCase() === 'activo')
        : null;
      console.log('Activo encontrado:', activo);
      if (activo) {
        setStatusId(activo.id);
        console.log('StatusId seteado:', activo.id);
      }
    })
    .catch((err) => console.error('Error al obtener status:', err));
}, [isOpen]);

  const handleFile = (file) => {
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setLogoBase64 (reader.result);
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setNombre('');
    setDescripcion('');
    setFechaFin('');
    setTipo('privado');
    setLogoPreview(null);
    setLogoBase64('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

      console.log('statusId en submit:', statusId); 

      const payload = {
        nombre,
        descripcion,
        logo: logoBase64 || 'https://via.placeholder.com/150/default',
        tipo,
        fecha_inicial: new Date().toISOString(),
        fecha_final: fechaFin
          ? new Date(fechaFin).toISOString()
          : new Date().toISOString(),
        status_id: statusId,
        propietario_id: usuario.id,
      };

      console.log('Payload enviado:', JSON.stringify(payload, null, 2));
      const resultado = await crearProyecto(payload);
      console.log('Respuesta backend:', resultado);

      if (resultado?.id || resultado?.data?.id) {
        onProyectoCreado?.(resultado?.data || resultado);
        handleClose();
      } else {
        setError('No se pudo crear el proyecto. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error submit:', err);
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Proyecto" width="w-[680px]" height="h-[490px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {error && (
          <p style={{ color: "var(--error)", fontSize: "0.85rem" }}>{error}</p>
        )}

        <FormField label="Nombre" required>
          <InputText
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Eje. Easy Way"
            required
          />
        </FormField>

        <FormField label="Tipo de proyecto" required>
          <ToggleGroup options={tipoOptions} value={tipo} onChange={setTipo} />
        </FormField>

        <div className="grid grid-cols-2 gap-4 items-stretch">
          <FormField label="Descripción" required stretch>
            <TextArea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Añada una breve descripción del proyecto..."
              required
            />
          </FormField>

          <FormField label="Foto" stretch>
            <ImageUpload
              onFile={handleFile}
              preview={logoPreview}
              className="h-full min-h-[130px]"
            />
          </FormField>
        </div>

        <FormField label="Fecha Final">
          <div className="w-1/2">
            <InputDate value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
        </FormField>

        <FormActions
          onCancel={handleClose}
          submitLabel={loading ? "Creando..." : "Crear Proyecto"}
          disabled={loading}
        />

      </form>
    </Modal>
  );
}