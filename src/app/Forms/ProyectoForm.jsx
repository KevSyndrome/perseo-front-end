import React, { useState, useEffect } from 'react';
import Modal from '../Modals/CreateProyectoModal';
import FormField from '../Components/UI/FormField';
import InputText from '../Components/UI/InputText';
import InputDate from '../Components/UI/InputDate';
import TextArea from '../Components/UI/TextArea';
import ImageUpload from '../Components/UI/ImageUpload';
import FormActions from '../Components/UI/FormActions';
import { crearProyecto, getStatusProyectos, subirLogoProyecto } from '../../services/proyectoService';

export default function ProyectoForm({ isOpen, onClose, onProyectoCreado }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
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
    setLogoFile(file);
  };

  const handleClose = () => {
    setNombre('');
    setDescripcion('');
    setFechaFin('');
    setLogoPreview(null);
    setLogoFile(null);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // El propietario lo toma el backend del token; el logo se sube aparte
      const payload = {
        nombre,
        descripcion,
        fecha_inicial: new Date().toISOString(),
        // fecha_final es opcional: sin fecha se omite
        ...(fechaFin && { fecha_final: new Date(fechaFin).toISOString() }),
        status_id: statusId,
      };

      const resultado = await crearProyecto(payload);
      let proyecto = resultado?.data;

      if (!proyecto?.id) {
        const detail = resultado?.detail;
        // 422 de validación trae detail como lista: [{ msg: "Value error, ..." }]
        const mensaje = typeof detail === 'string' ? detail : detail?.[0]?.msg?.replace(/^Value error, /, '');
        setError(mensaje || 'No se pudo crear el proyecto. Intenta de nuevo.');
        return;
      }
      if (logoFile) {
        try {
          proyecto = (await subirLogoProyecto(proyecto.id, logoFile)).data;
        } catch (err) {
          // El proyecto ya existe: se agrega a la lista y se avisa en el modal
          onProyectoCreado?.(proyecto);
          setError(`Proyecto creado, pero no se pudo subir el logo: ${err.message}`);
          return;
        }
      }
      onProyectoCreado?.(proyecto);
      handleClose();
    } catch (err) {
      console.error('Error submit:', err);
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Proyecto" width="w-[680px]" height="h-auto">
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

        <div className="grid grid-cols-1 gap-4 items-stretch sm:grid-cols-2">
          <FormField label="Descripción" required stretch>
            <TextArea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Añada una breve descripción del proyecto (10 a 200 caracteres)..."
              required
              minLength={10}
              maxLength={200}
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