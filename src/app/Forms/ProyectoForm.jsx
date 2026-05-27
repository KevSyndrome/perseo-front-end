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

  const handleFile = (file) => {
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombre, descripcion, fechaFin, tipo });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Proyecto" width="w-[680px]" height="h-[490px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

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

        <FormActions onCancel={onClose} submitLabel="Crear Proyecto" />

      </form>
    </Modal>
  );
}