import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, KeyRound, Globe, FolderKanban, Lock, Users, Loader2 } from 'lucide-react';
import Breadcrumb, { useBreadcrumb } from '../Components/Breadcrumb';
import SalaForm from '../Forms/SalaForm';
import UnirseModal from '../Modals/UnirseModal';
import { estiloPreviewFondo } from '../Components/fondosSala';
import { getSalas } from '../../services/salaService';
import { useNotificacionesStore } from '../Components/NotificacionesStore';

const ICONO_TIPO = { libre: Globe, proyecto: FolderKanban, privada: Lock };

// Mismo orden que el backend: generales primero (en su orden) y luego por actividad reciente
const ordenar = (salas) => [
  ...salas.filter((s) => s.tipo === 'libre'),
  ...salas
    .filter((s) => s.tipo !== 'libre')
    .sort((a, b) => new Date(b.ultimo_mensaje?.fechaC || b.fecha_creacion) - new Date(a.ultimo_mensaje?.fechaC || a.fecha_creacion)),
];

const formatHora = (iso) => {
  if (!iso) return '';
  const fecha = new Date(iso);
  const hoy = new Date().toDateString() === fecha.toDateString();
  return hoy
    ? fecha.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    : fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
};

// Panel de salas tipo Discord: una tarjeta por sala; clic → /mensajes/:salaId
const Salas = () => {
  const navigate = useNavigate();
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [crearOpen, setCrearOpen] = useState(false);
  const [unirseOpen, setUnirseOpen] = useState(false);
  const { noLeidos, ultimoAviso, setDesdeSalas } = useNotificacionesStore();

  useBreadcrumb([
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Chat' },
  ]);

  const cargar = () => {
    getSalas()
      .then((res) => {
        setSalas(res.data || []);
        setDesdeSalas(res.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  // Aviso en tiempo real: actualiza el último mensaje de la tarjeta y la sube
  useEffect(() => {
    if (!ultimoAviso) return;
    setSalas((prev) => ordenar(prev.map((s) => (
      s.id === ultimoAviso.sala_id ? { ...s, ultimo_mensaje: ultimoAviso.data } : s
    ))));
  }, [ultimoAviso]);

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb />
        <div className="flex gap-2">
          <button
            onClick={() => setUnirseOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-lg)] border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <KeyRound size={16} /> Unirse con código
          </button>
          <button
            onClick={() => setCrearOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-selection)] px-4 py-2 text-sm font-semibold text-[var(--color-blanco)] hover:opacity-90"
          >
            <Plus size={16} /> Crear sala
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-slate-500">
          <Loader2 size={22} className="animate-spin" /> Cargando salas...
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {salas.map((sala, i) => {
          const Icono = ICONO_TIPO[sala.tipo] ?? Globe;
          return (
            <motion.button
              key={sala.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/mensajes/${sala.id}`)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="h-20 w-full" style={estiloPreviewFondo(sala)} />
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <div className="flex items-center gap-2">
                  <Icono size={15} className="shrink-0 text-slate-500" />
                  <span className="flex-1 truncate font-bold text-slate-800">{sala.nombre}</span>
                  {noLeidos[sala.id] > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                      {noLeidos[sala.id] > 99 ? '99+' : noLeidos[sala.id]}
                    </span>
                  )}
                </div>
                {sala.proyecto && (
                  <span className="truncate text-xs text-slate-400">Proyecto: {sala.proyecto.nombre}</span>
                )}
                <p className="line-clamp-1 min-h-[1.25rem] text-sm text-slate-500">
                  {sala.ultimo_mensaje
                    ? <><span className="font-semibold text-slate-600">{sala.ultimo_mensaje.usuario?.nombre}:</span> {sala.ultimo_mensaje.mensaje}</>
                    : <span className="italic text-slate-400">Sin mensajes todavía</span>}
                </p>
                <div className="mt-auto flex items-center justify-between pt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Users size={12} /> {sala.total_miembros}</span>
                  <span>{formatHora(sala.ultimo_mensaje?.fechaC)}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <SalaForm
        isOpen={crearOpen}
        onClose={() => setCrearOpen(false)}
        onSalaCreada={(sala) => navigate(`/mensajes/${sala.id}`)}
      />
      <UnirseModal
        isOpen={unirseOpen}
        onClose={() => setUnirseOpen(false)}
        onUnido={cargar}
        entidad="sala"
      />
    </div>
  );
};

export default Salas;
