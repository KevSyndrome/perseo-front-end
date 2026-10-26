import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarSlugProyecto } from '../../utils/slug';
import { MoreVertical, Palette, KeyRound, Users, LogOut, Trash2, RefreshCw, ImageUp, X, Check } from 'lucide-react';
import Modal from '../Modals/CreateProyectoModal';
import CopiarLink from './CopiarLink';
import { FONDOS_ANIMADOS, FONDO_DEFAULT } from './fondosSala';
import {
  cambiarFondoSala,
  subirFondoImagenSala,
  quitarFondoSala,
  regenerarCodigoSala,
  getMiembrosSala,
  eliminarMiembroSala,
  eliminarSala,
} from '../../services/salaService';

// Menú ⋮ de una sala abierta. Lo que se muestra depende de lo que el backend
// dice que puede hacer el usuario (puede_administrar, codigo_invitacion, tipo).
export default function SalaOpciones({ sala, usuarioId, onSalaActualizada, onSalir }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modal, setModal] = useState(null); // 'fondo' | 'invitar' | 'miembros' | 'eliminar'
  const [miembros, setMiembros] = useState([]);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const esCreador = sala.creador_id === usuarioId;
  const esPrivada = sala.tipo === 'privada';
  // La sala Global no se puede borrar (el backend responde 400)
  const puedeBorrar = sala.puede_administrar && !(sala.tipo === 'libre' && sala.nombre === 'Global');

  const abrir = (nombre) => {
    setMenuAbierto(false);
    setError('');
    setModal(nombre);
    if (nombre === 'miembros') {
      getMiembrosSala(sala.id)
        .then((res) => setMiembros(res.data || []))
        .catch((err) => setError(err.message));
    }
  };

  // Ejecuta una acción del backend y muestra su error en el modal abierto
  const ejecutar = async (accion) => {
    setError('');
    try {
      await accion();
    } catch (err) {
      setError(err.message);
    }
  };

  const actualizarCon = (promesa) => ejecutar(async () => onSalaActualizada((await promesa()).data));

  const fondoActual = sala.fondo_tipo === 'imagen' ? null : sala.fondo || FONDO_DEFAULT;

  const items = [
    sala.puede_administrar && { id: 'fondo', label: 'Cambiar fondo', Icon: Palette },
    sala.codigo_invitacion && { id: 'invitar', label: 'Invitar (código o link)', Icon: KeyRound },
    // Las salas de proyecto no tienen código propio: se invita al proyecto (solo su dueño)
    sala.tipo === 'proyecto' && sala.puede_administrar && sala.proyecto && {
      id: 'invitarProyecto', label: 'Invitar al proyecto', Icon: KeyRound,
      accion: () => navigate(`/proyectos/${generarSlugProyecto(sala.proyecto)}?invitar=1`),
    },
    { id: 'miembros', label: 'Miembros', Icon: Users },
    esPrivada && !esCreador && {
      id: 'salir', label: 'Salir de la sala', Icon: LogOut, peligro: true,
      accion: () => ejecutar(async () => { await eliminarMiembroSala(sala.id, usuarioId); onSalir(); }),
    },
    puedeBorrar && { id: 'eliminar', label: 'Eliminar sala', Icon: Trash2, peligro: true },
  ].filter(Boolean);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuAbierto((v) => !v)}
        title="Opciones de la sala"
        className="flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
      >
        <MoreVertical size={20} />
      </button>

      {menuAbierto && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setMenuAbierto(false)} />
          <div className="absolute right-0 z-30 mt-1 flex w-56 flex-col overflow-hidden rounded-lg bg-white py-1 text-sm text-slate-700 shadow-[var(--shadow-lg)]">
            {items.map(({ id, label, Icon, peligro, accion }) => (
              <button
                key={id}
                onClick={() => {
                  if (!accion) return abrir(id);
                  setMenuAbierto(false);
                  accion();
                }}
                className={`flex cursor-pointer items-center gap-2 bg-transparent px-4 py-2 text-left ${peligro ? 'text-red-500 hover:bg-red-50' : 'hover:bg-slate-100'}`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Error de "salir" (se ejecuta sin modal) */}
      {!modal && error && <p className="absolute right-0 mt-1 w-56 text-xs text-red-500">{error}</p>}

      <Modal isOpen={modal === 'fondo'} onClose={() => setModal(null)} title="Fondo de la sala">
        <div className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            {FONDOS_ANIMADOS.map((f) => (
              <button
                key={f.clave}
                onClick={() => actualizarCon(() => cambiarFondoSala(sala.id, f.clave))}
                className={`relative flex h-20 cursor-pointer items-end rounded-lg p-2 text-left text-sm font-semibold shadow-sm ring-2 ${fondoActual === f.clave ? 'ring-teal-500' : 'ring-transparent hover:ring-slate-300'}`}
                style={{ background: f.preview }}
              >
                <span className="rounded bg-white/80 px-2 py-0.5 text-slate-700">{f.nombre}</span>
                {fondoActual === f.clave && <Check size={16} className="absolute right-2 top-2 rounded-full bg-teal-500 p-0.5 text-white" />}
              </button>
            ))}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            hidden
            onChange={(e) => e.target.files[0] && actualizarCon(() => subirFondoImagenSala(sala.id, e.target.files[0]))}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fileRef.current.click()}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <ImageUp size={15} /> {sala.fondo_tipo === 'imagen' ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {sala.fondo_tipo && (
              <button
                onClick={() => actualizarCon(() => quitarFondoSala(sala.id))}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <X size={15} /> Volver al fondo por defecto
              </button>
            )}
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal === 'invitar'} onClose={() => setModal(null)} title="Código de invitación">
        <div className="flex flex-col items-center gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-center text-sm text-slate-500">Comparte el link o el código; con el código se entra desde "Unirse con código".</p>
          <span className="rounded-lg bg-slate-100 px-4 py-2 font-mono text-2xl font-bold tracking-[0.3em] text-slate-800">
            {sala.codigo_invitacion}
          </span>
          <button
            onClick={() => ejecutar(async () => {
              const res = await regenerarCodigoSala(sala.id);
              onSalaActualizada({ ...sala, codigo_invitacion: res.data.codigo_invitacion });
            })}
            title="El código anterior dejará de funcionar"
            className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-teal-600 hover:bg-teal-50"
          >
            <RefreshCw size={14} /> Generar nuevo
          </button>
          <CopiarLink tipo="sala" codigo={sala.codigo_invitacion} />
        </div>
      </Modal>

      <Modal isOpen={modal === 'miembros'} onClose={() => setModal(null)} title={`Miembros (${miembros.length})`}>
        <div className="flex flex-col gap-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {miembros.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50">
              {m.imagen
                ? <img src={m.imagen} alt={m.nombre} className="h-8 w-8 rounded-full object-cover" />
                : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-white">{m.nombre?.[0]}</span>}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{m.nombre}{m.id === sala.creador_id && esPrivada && <span className="ml-2 text-xs text-slate-400">creador</span>}</p>
                <p className="text-xs text-slate-400">{m.correo}</p>
              </div>
              {esPrivada && esCreador && m.id !== usuarioId && (
                <button
                  onClick={() => ejecutar(async () => {
                    await eliminarMiembroSala(sala.id, m.id);
                    setMiembros((prev) => prev.filter((x) => x.id !== m.id));
                    onSalaActualizada({ ...sala, total_miembros: sala.total_miembros - 1 });
                  })}
                  className="cursor-pointer rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={modal === 'eliminar'} onClose={() => setModal(null)} title="Eliminar sala">
        <div className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-sm text-slate-600">
            Se borrará <span className="font-semibold">{sala.nombre}</span> con todos sus mensajes. Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setModal(null)} className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Cancelar
            </button>
            <button
              onClick={() => ejecutar(async () => { await eliminarSala(sala.id); onSalir(); })}
              className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
