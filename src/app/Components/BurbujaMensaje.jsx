import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronDown, Reply, Copy, Pencil, Trash2 } from 'lucide-react';
import ContenidoMensaje from './ContenidoMensaje';

// Táctil: deslizar a la derecha responde y mantener presionado abre el menú.
// Con mouse: flechita al pasar el cursor o clic derecho.
const esTactil = () => window.matchMedia('(pointer: coarse)').matches;
const UMBRAL_DESLIZAR = 70;

export default function BurbujaMensaje({ msg, resaltado, onResponder, onEditar, onEliminar, onIrA }) {
  const [menu, setMenu] = useState(null); // { x, y } posición fija del menú
  const burbujaRef = useRef(null);
  const presionRef = useRef(null);
  const x = useMotionValue(0);
  const opacidadIcono = useTransform(x, [0, UMBRAL_DESLIZAR], [0, 1]);

  const abrirMenu = () => {
    const r = burbujaRef.current.getBoundingClientRect();
    const alto = 170;
    // Abajo de la burbuja; si no cabe, arriba
    const y = r.bottom + alto > window.innerHeight ? r.top - alto : r.bottom + 4;
    setMenu({ x: msg.self ? r.right - 180 : r.left, y: Math.max(8, y) });
  };

  const opciones = [
    { id: 'responder', label: 'Responder', Icon: Reply, accion: () => onResponder(msg) },
    msg.text && { id: 'copiar', label: 'Copiar texto', Icon: Copy, accion: () => navigator.clipboard?.writeText(msg.text) },
    msg.self && msg.text && { id: 'editar', label: 'Editar', Icon: Pencil, accion: () => onEditar(msg) },
    msg.self && { id: 'eliminar', label: 'Eliminar', Icon: Trash2, accion: () => onEliminar(msg), peligro: true },
  ].filter(Boolean);

  const tactil = esTactil();

  return (
    <div id={`msg-${msg.id}`} className={`relative mb-3 flex items-end gap-2 ${msg.self ? 'justify-end' : 'justify-start'}`}>
      {/* Ícono que aparece al deslizar para responder */}
      <motion.span style={{ opacity: opacidadIcono }} className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400">
        <Reply size={18} />
      </motion.span>

      <motion.div
        drag={tactil ? 'x' : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 0.5 }}
        dragSnapToOrigin
        style={{ x }}
        onDragEnd={(_, info) => info.offset.x > UMBRAL_DESLIZAR && onResponder(msg)}
        className={`group flex max-w-[85%] items-end gap-2 sm:max-w-[75%] ${msg.self ? 'flex-row-reverse' : ''}`}
      >
        {!msg.self && (
          <div className="mb-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-white">
            {msg.avatar}
          </div>
        )}
        <div
          ref={burbujaRef}
          onContextMenu={(e) => { e.preventDefault(); abrirMenu(); }}
          onTouchStart={() => { presionRef.current = setTimeout(abrirMenu, 500); }}
          onTouchEnd={() => clearTimeout(presionRef.current)}
          onTouchMove={() => clearTimeout(presionRef.current)}
          className={`relative min-w-0 rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-shadow ${
            msg.self ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-white text-slate-800'
          } ${resaltado ? 'ring-2 ring-teal-400' : ''}`}
        >
          {!tactil && (
            <button
              onClick={abrirMenu}
              title="Opciones del mensaje"
              className={`absolute right-1 top-1 hidden cursor-pointer rounded-full p-0.5 group-hover:block ${
                msg.self ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <ChevronDown size={14} />
            </button>
          )}
          {!msg.self && (
            <span className="mb-0.5 block pr-5 text-[10px] font-semibold text-slate-500">{msg.sender}</span>
          )}

          {/* Cita del mensaje al que responde */}
          {msg.respuestaAId && (
            <button
              onClick={() => msg.respuestaA && onIrA(msg.respuestaA.id)}
              className={`mb-1.5 block w-full cursor-pointer rounded-md border-l-4 px-2 py-1 text-left text-xs ${
                msg.self ? 'border-white/70 bg-white/15' : 'border-teal-500 bg-slate-100'
              }`}
            >
              {msg.respuestaA ? (
                <>
                  <span className="block font-semibold">{msg.respuestaA.usuario?.nombre}</span>
                  <span className="line-clamp-2 opacity-80">
                    {msg.respuestaA.mensaje || (msg.respuestaA.tiene_archivo ? '📎 Archivo' : '')}
                  </span>
                </>
              ) : (
                <span className="italic opacity-70">Mensaje eliminado</span>
              )}
            </button>
          )}

          <ContenidoMensaje texto={msg.text} archivos={msg.archivos} propio={msg.self} />
          <span className={`mt-1 block text-right text-[10px] ${msg.self ? 'text-white/60' : 'text-slate-400'}`}>
            {msg.editado && 'editado · '}{msg.time}
          </span>
        </div>
      </motion.div>

      {menu && createPortal(
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setMenu(null)} onContextMenu={(e) => { e.preventDefault(); setMenu(null); }} />
          <div
            className="fixed z-[160] w-44 overflow-hidden rounded-lg bg-white py-1 text-sm text-slate-700 shadow-[var(--shadow-lg)]"
            style={{ left: Math.max(8, menu.x), top: menu.y }}
          >
            {opciones.map(({ id, label, Icon, accion, peligro }) => (
              <button
                key={id}
                onClick={() => { setMenu(null); accion(); }}
                className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left ${peligro ? 'text-red-500 hover:bg-red-50' : 'hover:bg-slate-100'}`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
