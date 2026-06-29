import React, { useState } from 'react';
import Modal from '../Modals/CreateProyectoModal';
import FormField from '../Components/UI/FormField';
import InputText from '../Components/UI/InputText';
import InputDate from '../Components/UI/InputDate';
import TextArea from '../Components/UI/TextArea';
import ToggleGroup from '../Components/UI/ToggleGroup';
import ImageUpload from '../Components/UI/ImageUpload';
import FormActions from '../Components/UI/FormActions';

const tipoOptions = [
  { value: 'Propio', label: 'Propio', icon: '👤' },
  { value: 'Colaborativo', label: 'Colaborativo', icon: '👥' },
];

export default function ProyectoForm({ isOpen, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipo, setTipo] = useState('Propio');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [creado, setCreado] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setFechaFin('');
    setTipo('Propio');
    setLogoPreview(null);
    setLogoFile(null);
    setCreado(false);
    setError('');
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre del proyecto es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }
    if (!fechaFin) {
      setError('La fecha final es obligatoria.');
      return;
    }

    setError('');
    console.log({ nombre, descripcion, fecha_final: fechaFin, tipo, logo: logoFile });
    setCreado(true);
  };

  const handleContinuar = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Crear Nuevo Proyecto" width="w-[680px]" height="h-[490px]">

      {creado ? (
        // ← Pantalla de éxito
        <div className="flex flex-col items-center justify-center h-full gap-6 py-10">
          <div
            className="w-full rounded-2xl flex flex-col items-center justify-center gap-6 py-10 px-8"
            style={{ backgroundColor: 'var(--color-selection)' }}
          >
            <p className="text-2xl font-bold text-white text-center">
              Su proyecto ha sido creado
            </p>
            <button
              onClick={handleContinuar}
              className="px-8 py-3 rounded-xl font-bold text-white"
              style={{ backgroundColor: '#0d3b4a' }}
            >
              CONTINUAR
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <FormField label="Nombre" required>
            <InputText
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setError(''); }}
              placeholder="Eje. Easy Way"
            />
          </FormField>

          <FormField label="Tipo de proyecto" required>
            <ToggleGroup options={tipoOptions} value={tipo} onChange={setTipo} />
          </FormField>

          <div className="grid grid-cols-2 gap-4 items-stretch">
            <FormField label="Descripción" required stretch>
              <TextArea
                value={descripcion}
                onChange={(e) => { setDescripcion(e.target.value); setError(''); }}
                placeholder="Añada una breve descripción del proyecto..."
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

          <FormField label="Fecha Final" required>
            <div className="w-1/2">
              <InputDate
                value={fechaFin}
                onChange={(e) => { setFechaFin(e.target.value); setError(''); }}
              />
            </div>
          </FormField>

          {/* ← Mensaje de error */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <FormActions onCancel={handleCancel} submitLabel="Crear Proyecto" />
        </form>
      )}
    </Modal>
  );
}