import React, { useState, useEffect } from 'react';
import Modal from '../Modals/CreateProyectoModal';
import FormField from '../Components/UI/FormField';
import InputText from '../Components/UI/InputText';
import Select from '../Components/UI/Select';
import FormActions from '../Components/UI/FormActions';
import { crearUsuario, actualizarUsuario } from '../../services/usuariosService';
import { getCargos } from '../../services/cargosService';

const CONTRASEÑA_GENERICA = "Cambiar123!";

const FORM_VACIO = {
  nombre: '', apellido_paterno: '', apellido_materno: '',
  correo: '', contraseña: '', cargo_id: '',
};

export default function UsuarioForm({ isOpen, onClose, usuario, onGuardado }) {
  const esEdicion = Boolean(usuario);

  const [form, setForm] = useState(FORM_VACIO);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar lista de cargos cada vez que se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    getCargos(1, 50)
      .then((data) => {
        const lista = Array.isArray(data?.data) ? data.data : [];
        setCargos(lista);
      })
      .catch((err) => console.error('Error al obtener cargos:', err));
  }, [isOpen]);

  // Precargar el form según el modo (crear vs editar)
  useEffect(() => {
    if (!isOpen) return;
    if (esEdicion) {
      setForm({
        nombre: usuario.nombre || '',
        apellido_paterno: usuario.apellido_paterno || '',
        apellido_materno: usuario.apellido_materno || '',
        correo: usuario.correo || '',
        contraseña: '', // vacío = no cambiar, salvo que se use "genérica"
        cargo_id: usuario.cargo_id || usuario.cargo?.id || '',
      });
    } else {
      setForm(FORM_VACIO);
    }
    setError('');
  }, [isOpen, usuario, esEdicion]);

  const handleClose = () => {
    setForm(FORM_VACIO);
    setError('');
    onClose();
  };

  const handleUsarContraseñaGenerica = () => {
    setForm((prev) => ({ ...prev, contraseña: CONTRASEÑA_GENERICA }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre || !form.apellido_paterno || !form.apellido_materno || !form.correo || !form.cargo_id) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!esEdicion && !form.contraseña) {
      setError('La contraseña es obligatoria al crear un usuario.');
      return;
    }

    setLoading(true);
    try {
      let resultado;

      if (esEdicion) {
        // En edición, solo mandamos contraseña si se escribió/generó una nueva
        const payload = {
          nombre: form.nombre,
          apellido_paterno: form.apellido_paterno,
          apellido_materno: form.apellido_materno,
          correo: form.correo,
          cargo_id: form.cargo_id,
        };
        if (form.contraseña.trim()) {
          payload.contraseña = form.contraseña.trim();
        }
        resultado = await actualizarUsuario(usuario.id, payload);
      } else {
        resultado = await crearUsuario(form);
      }

      if (resultado?.detail) {
        const mensaje = Array.isArray(resultado.detail)
          ? resultado.detail.map((d) => d.msg).join(' | ')
          : resultado.detail;
        setError(mensaje);
        return;
      }

      onGuardado?.();
      handleClose();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError('Ocurrió un error inesperado al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const opcionesCargo = cargos.map((c) => ({ value: c.id, label: c.nombre }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={esEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      width="w-[560px]"
      height="h-auto"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {error && (
          <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{error}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nombre" required>
            <InputText
              value={form.nombre}
              onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej. Daniel"
              required
            />
          </FormField>

          <FormField label="Apellido Paterno" required>
            <InputText
              value={form.apellido_paterno}
              onChange={(e) => setForm((prev) => ({ ...prev, apellido_paterno: e.target.value }))}
              placeholder="Ej. Mendoza"
              required
            />
          </FormField>

          <FormField label="Apellido Materno" required>
            <InputText
              value={form.apellido_materno}
              onChange={(e) => setForm((prev) => ({ ...prev, apellido_materno: e.target.value }))}
              placeholder="Ej. Domínguez"
              required
            />
          </FormField>

          <FormField label="Correo" required>
            <InputText
              type="email"
              value={form.correo}
              onChange={(e) => setForm((prev) => ({ ...prev, correo: e.target.value }))}
              placeholder="correo@ejemplo.com"
              required
            />
          </FormField>
        </div>

        <FormField label="Cargo" required>
          <Select
            value={form.cargo_id}
            onChange={(e) => setForm((prev) => ({ ...prev, cargo_id: e.target.value }))}
            options={opcionesCargo}
            required
          />
        </FormField>

        <FormField label={esEdicion ? "Nueva contraseña (dejar vacío para no cambiarla)" : "Contraseña"} required={!esEdicion}>
          <div className="flex gap-2">
            <div className="flex-1">
              <InputText
                type="text"
                value={form.contraseña}
                onChange={(e) => setForm((prev) => ({ ...prev, contraseña: e.target.value }))}
                placeholder={esEdicion ? "Nueva contraseña..." : "Contraseña"}
                required={!esEdicion}
              />
            </div>
            {esEdicion && (
              <button
                type="button"
                onClick={handleUsarContraseñaGenerica}
                className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Usar genérica
              </button>
            )}
          </div>
          {esEdicion && form.contraseña && (
            <p className="mt-1 text-xs text-slate-400">
              Se guardará: <span className="font-mono">{form.contraseña}</span> — comunícasela al usuario.
            </p>
          )}
        </FormField>

        <FormActions
          onCancel={handleClose}
          submitLabel={loading ? "Guardando..." : (esEdicion ? "Guardar Cambios" : "Crear Usuario")}
          disabled={loading}
        />

      </form>
    </Modal>
  );
}