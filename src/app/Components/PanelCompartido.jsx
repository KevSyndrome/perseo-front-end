import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Link2, Loader2 } from 'lucide-react';
import { getCompartidoSala } from '../../services/salaService';

const TABS = [
  { id: 'imagenes', label: 'Fotos' },
  { id: 'archivos', label: 'Archivos' },
  { id: 'enlaces', label: 'Enlaces' },
];

const fecha = (iso) => new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

// Panel lateral "Fotos, archivos y enlaces" de una sala (pantalla completa en celular)
export default function PanelCompartido({ salaId, isOpen, onClose, onIrAMensaje }) {
  const [tab, setTab] = useState('imagenes');
  const [items, setItems] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async (tipo, page) => {
    setCargando(true);
    setError('');
    try {
      const res = await getCompartidoSala(salaId, tipo, page);
      setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setPagina(page);
      setTotalPaginas(res.pagination?.total_pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Recarga al abrir o cambiar de pestaña (lo compartido cambia mientras se chatea)
  useEffect(() => {
    if (!isOpen) return;
    setItems([]);
    cargar(tab, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tab, salaId]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[130] bg-black/30"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 right-0 z-[140] flex w-full flex-col bg-white shadow-[var(--shadow-xl)] sm:w-[400px]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="font-bold text-slate-800">Fotos, archivos y enlaces</h2>
              <button onClick={onClose} title="Cerrar" className="cursor-pointer rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b border-slate-200">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 cursor-pointer border-b-2 py-2.5 text-sm font-medium ${
                    tab === t.id ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
              {!cargando && !error && items.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-400">
                  {tab === 'imagenes' ? 'No hay fotos todavía.' : tab === 'archivos' ? 'No hay archivos todavía.' : 'No hay enlaces todavía.'}
                </p>
              )}

              {tab === 'imagenes' && (
                <div className="grid grid-cols-3 gap-1.5">
                  {items.map((a) => (
                    <a key={a.id} href={a.fileURL} target="_blank" rel="noopener noreferrer" title={`${a.nombre_archivo} · ${a.usuario?.nombre}`}>
                      <img src={a.fileURL} alt={a.nombre_archivo} loading="lazy" className="aspect-square w-full rounded-md object-cover hover:opacity-90" />
                    </a>
                  ))}
                </div>
              )}

              {tab === 'archivos' && (
                <ul className="flex flex-col gap-1">
                  {items.map((a) => (
                    <li key={a.id}>
                      <a
                        href={a.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={a.nombre_archivo}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                          <FileText size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-700">{a.nombre_archivo}</span>
                          <span className="text-xs text-slate-400">{a.extension?.toUpperCase()} · {a.usuario?.nombre} · {fecha(a.fechaC)}</span>
                        </span>
                        <Download size={16} className="shrink-0 text-slate-400" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'enlaces' && (
                <ul className="flex flex-col gap-1">
                  {items.map((e, i) => (
                    <li key={`${e.mensaje_id}-${i}`} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                        <Link2 size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <a href={e.url} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-medium text-teal-600 hover:underline">
                          {e.url}
                        </a>
                        <span className="text-xs text-slate-400">{e.usuario?.nombre} · {fecha(e.fechaC)}</span>
                        <button
                          onClick={() => { onClose(); onIrAMensaje(e.mensaje_id); }}
                          className="ml-2 cursor-pointer text-xs text-slate-500 underline hover:text-slate-700"
                        >
                          Ver en el chat
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {cargando && (
                <div className="flex justify-center py-4 text-slate-400"><Loader2 size={20} className="animate-spin" /></div>
              )}
              {!cargando && pagina < totalPaginas && (
                <button
                  onClick={() => cargar(tab, pagina + 1)}
                  className="mx-auto mt-3 block cursor-pointer rounded-full px-4 py-1.5 text-sm text-teal-600 hover:bg-teal-50"
                >
                  Cargar más
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
