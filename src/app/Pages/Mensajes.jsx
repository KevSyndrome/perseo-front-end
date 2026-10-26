import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, ArrowLeft, Globe, FolderKanban, Lock, X, FileText, Loader2, Reply, Pencil, Images } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBreadcrumb } from '../Components/Breadcrumb';
import AttachmentMenu from '../Components/AttachmentMenu';
import BurbujaMensaje from '../Components/BurbujaMensaje';
import PanelCompartido from '../Components/PanelCompartido';
import Modal from '../Modals/CreateProyectoModal';
import CamaraModal from '../Components/CamaraModal';
import { validarArchivo, formatoTamano, esMovil, esImagen, EXT_IMAGEN, EXT_DOCUMENTO, EXT_PERMITIDAS } from '../../utils/archivos';
import SalaFondo from '../Components/SalaFondo';
import SalaOpciones from '../Components/SalaOpciones';
import { getSalaPorId } from '../../services/salaService';
import { useNotificacionesStore } from '../Components/NotificacionesStore';
import {
  crearConexionWS,
  enviarMensajeWS,
  enviarTypingWS,
  cerrarConexionWS,
  obtenerMensajes,
  enviarMensajeConArchivo,
  editarMensaje,
  eliminarMensaje,
} from '../../services/mensajesServices';

const ICONO_TIPO = { libre: Globe, proyecto: FolderKanban, privada: Lock };

// Qué acepta el selector según la opción del menú del clip
const ACEPTA = {
  imagen: EXT_IMAGEN.join(','),
  documento: EXT_DOCUMENTO.join(','),
  archivo: EXT_PERMITIDAS.join(','),
  camara: 'image/*',
};

// Mensaje del backend (historial o WS) → burbuja
const aVista = (m, userId) => ({
  id: m.id,
  text: m.mensaje,
  archivos: m.archivos || [],
  respuestaAId: m.respuesta_a_id ?? null,
  respuestaA: m.respuesta_a ?? null,
  editado: Boolean(m.editado),
  sender: m.usuario?.nombre || 'Desconocido',
  time: new Date(m.fechaC).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
  avatar: (m.usuario?.nombre || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
  self: m.usuario?.id === userId,
});

// Chat de una sala: /mensajes/:salaId (el panel de salas está en /mensajes)
const Mensajes = () => {
  const { salaId } = useParams();
  const navigate = useNavigate();
  const [sala, setSala] = useState(null);
  const abrirSala = useNotificacionesStore((s) => s.abrirSala);
  const cerrarSala = useNotificacionesStore((s) => s.cerrarSala);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [attachOpen, setAttachOpen] = useState(false);
  const [adjunto, setAdjunto] = useState(null); // File elegido, aún sin enviar
  const [respondiendo, setRespondiendo] = useState(null); // mensaje (vista) al que se responde
  const [editando, setEditando] = useState(null); // mensaje propio que se está editando
  const [porEliminar, setPorEliminar] = useState(null);
  const [resaltado, setResaltado] = useState(null);
  const [compartidoOpen, setCompartidoOpen] = useState(false);
  const textareaRef = useRef(null);
  const [enviando, setEnviando] = useState(false);
  const [camaraOpen, setCamaraOpen] = useState(false);
  const inputArchivoRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);
  // Un temporizador por usuario: se reinicia con cada aviso (antes cada aviso ponía el suyo
  // y el primero que vencía borraba el indicador aunque siguiera escribiendo → parpadeo)
  const typingTimersRef = useRef({});
  const ultimoTypingRef = useRef(0);
  const messagesContainerRef = useRef(null);
  // Alto del scroll antes de anteponer mensajes viejos, para no perder la posición
  const alturaPreviaRef = useRef(null);
  const isConnecting = useRef(false);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const userId = usuario?.id;
  const userName = usuario?.nombre || 'Usuario';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useBreadcrumb([
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Chat', path: '/mensajes' },
    { label: sala?.nombre || 'Sala' },
  ]);

  useEffect(() => {
    getSalaPorId(salaId)
      .then((res) => setSala(res.data))
      .catch((err) => setError(err.message));
  }, [salaId]);

  // Cargar mensajes paginados
  const loadMessages = async (pageNum, append = false) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const mensajesPrevios = await obtenerMensajes(salaId, pageNum, 20);
      if (mensajesPrevios.length === 0) {
        setHasMore(false);
        return;
      }
      const newMessages = mensajesPrevios.map((m) => aVista(m, userId));
      
      if (append) {
        alturaPreviaRef.current = messagesContainerRef.current?.scrollHeight ?? null;
        setMessages((prev) => [...newMessages, ...prev]);
      } else {
        setMessages(newMessages);
      }
      setHasMore(mensajesPrevios.length === 20);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Scroll infinito - cargar más al scrollear hacia arriba
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (container.scrollTop < 50 && hasMore && !loadingMore) {
      setPage((prev) => prev + 1);
      loadMessages(page + 1, true);
    }
  };

  // Quita un mensaje y marca como "eliminado" la cita de quienes le respondían
  const quitarMensajeLocal = (id) => {
    setMessages((prev) => prev
      .filter((m) => m.id !== id)
      .map((m) => (m.respuestaAId === id ? { ...m, respuestaA: null } : m)));
  };

  const quitarEscribiendo = (id) => {
    if (!id) return;
    clearTimeout(typingTimersRef.current[id]);
    delete typingTimersRef.current[id];
    setTypingUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Al salir de la sala no deben quedar temporizadores vivos
  useEffect(() => () => Object.values(typingTimersRef.current).forEach(clearTimeout), []);

  // Conectar WebSocket al montar (solo una vez)
  useEffect(() => {
    // Evitar conexión duplicada por StrictMode
    if (isConnecting.current) return;
    isConnecting.current = true;

    let ws = null;

    const connect = async () => {
      try {
        // 1. Cargar mensajes iniciales
        await loadMessages(1, false);

        // 2. Conectar WebSocket
        ws = crearConexionWS(
          salaId,
          (msg) => {
            if (msg.type === 'typing') {
              const typingId = msg.usuario_id;
              setTypingUsers((prev) => (
                prev.some((u) => u.id === typingId) ? prev : [...prev, { id: typingId, nombre: msg.usuario_nombre }]
              ));
              clearTimeout(typingTimersRef.current[typingId]);
              typingTimersRef.current[typingId] = setTimeout(() => quitarEscribiendo(typingId), 4000);
              return;
            }
            if (msg.type === 'error') {
              setError(msg.mensaje);
              return;
            }
            if (msg.type === 'mensaje_editado') {
              setMessages((prev) => prev.map((m) => (m.id === msg.data.id ? aVista(msg.data, userId) : m)));
              return;
            }
            if (msg.type === 'mensaje_eliminado') {
              quitarMensajeLocal(msg.data.id);
              return;
            }
            // Si mandó su mensaje, ya terminó de escribir
            quitarEscribiendo(msg.usuario?.id);
            // Nuevo mensaje recibido — solo agregar si no existe ya
            setMessages((prev) => {
              const exists = prev.find((m) => m.id === msg.id);
              if (exists) return prev;
              return [...prev, aVista(msg, userId)];
            });
            // Notificación del navegador si la pestaña no está activa
            if (document.hidden && Notification.permission === 'granted') {
              new Notification('Nuevo mensaje', {
                body: `${msg.usuario?.nombre || 'Alguien'}: ${msg.mensaje || 'Envió un archivo'}`,
                icon: '/IsotipoPrometeoColoresOscuros.png',
              });
            }
          },
          (err) => {
            setError('Error de conexión con el chat');
            setWsConnected(false);
          },
          () => {
            setWsConnected(false);
          }
        );

        wsRef.current = ws;
        ws.onopen = () => {
          setWsConnected(true);
          setError(null);
        };
        ws.onclose = (event) => {
          setWsConnected(false);
          // 1008 = rechazo del backend con motivo (ej. "No tienes acceso a esta sala")
          if (event.code === 1008) setError(event.reason || 'Conexión rechazada');
        };
      } catch (err) {
        setError(err.message || 'Error al conectar al chat');
        console.error(err);
      } finally {
        isConnecting.current = false;
      }
    };

    connect();

    return () => {
      cerrarConexionWS(ws);
    };
  }, []);

  // Al cargar historial viejo se conserva la posición; si no (carga inicial o mensaje nuevo), al fondo
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;
    if (alturaPreviaRef.current !== null) {
      container.scrollTop = container.scrollHeight - alturaPreviaRef.current;
      alturaPreviaRef.current = null;
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Permiso de notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Sala abierta: sus avisos se ignoran (llegan por este WS) y su contador queda en 0
  useEffect(() => {
    abrirSala(salaId);
    return cerrarSala;
  }, [salaId, abrirSala, cerrarSala]);

  const elegirArchivo = (file) => {
    if (!file) return;
    const problema = validarArchivo(file);
    if (problema) return setError(problema);
    setError(null);
    setAdjunto(file);
  };

  // Opción del menú del clip. Cámara: en celular abre la nativa (capture); en
  // computadora, el modal con el aviso y la webcam.
  const handleAdjuntar = (opcion) => {
    if (opcion === 'camara' && !esMovil()) return setCamaraOpen(true);
    const input = inputArchivoRef.current;
    input.accept = ACEPTA[opcion];
    if (opcion === 'camara') input.setAttribute('capture', 'environment');
    else input.removeAttribute('capture');
    input.value = '';
    input.click();
  };

  const handleSend = async () => {
    if (editando) {
      if (!message.trim()) return;
      setEnviando(true);
      try {
        const editado = await editarMensaje(editando.id, message.trim());
        setMessages((prev) => prev.map((m) => (m.id === editado.id ? aVista(editado, userId) : m)));
        setEditando(null);
        setMessage('');
      } catch (err) {
        setError(err.message);
      } finally {
        setEnviando(false);
      }
      return;
    }
    if (adjunto) {
      // Con archivo va por REST; el mensaje llega por el WS de la sala como cualquier otro
      setEnviando(true);
      try {
        await enviarMensajeConArchivo(salaId, message.trim(), adjunto, respondiendo?.id);
        setAdjunto(null);
        setRespondiendo(null);
        setMessage('');
      } catch (err) {
        setError(err.message);
      } finally {
        setEnviando(false);
      }
      return;
    }
    if (!message.trim()) return;
    if (!wsRef.current || !wsConnected) {
      setError('Chat no conectado. Intenta recargar la página.');
      return;
    }

    // Enviar por WebSocket
    const sent = enviarMensajeWS(wsRef.current, message.trim(), respondiendo?.id);
    if (sent) {
      setMessage('');
      setRespondiendo(null);
    } else {
      setError('No se pudo enviar el mensaje');
    }
  };

  // URL temporal de la miniatura; se libera al cambiar o quitar el archivo
  const vistaPrevia = useMemo(() => (adjunto && esImagen(adjunto.name) ? URL.createObjectURL(adjunto) : null), [adjunto]);
  useEffect(() => () => vistaPrevia && URL.revokeObjectURL(vistaPrevia), [vistaPrevia]);

  const puedeEnviar = wsConnected && !enviando && (Boolean(message.trim()) || (Boolean(adjunto) && !editando));

  const responder = (msg) => {
    cancelarEdicion();
    setRespondiendo(msg);
    textareaRef.current?.focus();
  };

  const empezarEdicion = (msg) => {
    setRespondiendo(null);
    setAdjunto(null);
    setEditando(msg);
    setMessage(msg.text);
    textareaRef.current?.focus();
  };

  const cancelarEdicion = () => {
    if (editando) setMessage('');
    setEditando(null);
  };

  const confirmarEliminar = async () => {
    const msg = porEliminar;
    setPorEliminar(null);
    try {
      await eliminarMensaje(msg.id);
      quitarMensajeLocal(msg.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Lleva al mensaje citado y lo resalta un momento (si está cargado en la lista)
  const irAMensaje = (id) => {
    const el = document.getElementById(`msg-${id}`);
    if (!el) return setError('Ese mensaje es más antiguo: sube en el chat para cargarlo.');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setResaltado(id);
    setTimeout(() => setResaltado(null), 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && (editando || respondiendo)) {
      cancelarEdicion();
      setRespondiendo(null);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    // Un aviso cada 2 s como máximo (antes, uno por tecla); el receptor lo mantiene 4 s
    const ahora = Date.now();
    if (wsRef.current && wsConnected && ahora - ultimoTypingRef.current > 2000) {
      ultimoTypingRef.current = ahora;
      enviarTypingWS(wsRef.current);
    }
  };

  return (
    // Pantalla completa en todos los tamaños: entre el Navbar y el borde inferior, a la
    // derecha del sidebar (--contenido-left lo define el Layout). Sin depender de dvh.
    <div className="fixed bottom-0 right-0 left-[var(--contenido-left)] top-[var(--navbar-height)] z-[90] flex flex-col overflow-hidden bg-white transition-[left] duration-300">
      <SalaFondo fondoTipo={sala?.fondo_tipo} fondo={sala?.fondo} />

      {/* Encabezado de la sala */}
      {/* Sin backdrop-blur: Safari recorta lo que sobresale de él y el menú ⋮ quedaba invisible */}
      <div className="relative z-20 flex items-center gap-3 border-b border-slate-200/50 bg-white/95 px-3 py-2">
        <button
          onClick={() => navigate('/mensajes')}
          title="Volver a las salas"
          className="flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </button>
        {sala && (() => {
          const Icono = ICONO_TIPO[sala.tipo] ?? Globe;
          return (
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-bold text-slate-800">
                <Icono size={15} className="shrink-0 text-slate-500" /> {sala.nombre}
              </p>
              {sala.descripcion && <p className="truncate text-xs text-slate-500">{sala.descripcion}</p>}
            </div>
          );
        })()}
        {sala && (
          <button
            onClick={() => setCompartidoOpen(true)}
            title="Fotos, archivos y enlaces"
            aria-label="Fotos, archivos y enlaces"
            className="flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
          >
            <Images size={18} />
          </button>
        )}
        {sala && (
          <SalaOpciones
            sala={sala}
            usuarioId={userId}
            onSalaActualizada={setSala}
            onSalir={() => navigate('/mensajes')}
          />
        )}
      </div>

      {error && (
        <div className="relative z-20 flex items-center justify-between bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
          <button onClick={() => setError(null)} className="cursor-pointer px-2 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Lista de mensajes — crece desde abajo como WhatsApp */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4"
        >
          {loadingMore && (
            <div className="flex justify-center py-2">
              <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-primary animate-spin" />
            </div>
          )}
          {!hasMore && messages.length > 20 && (
            <div className="text-center text-xs text-slate-400 py-2">
              No hay más mensajes
            </div>
          )}
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-slate-400 text-sm min-h-0">
              <div className="text-center">
                <p className="mb-2">No hay mensajes aún</p>
                <p className="text-xs opacity-60">Sé el primero en escribir!</p>
              </div>
            </div>
          )}
          {/* mt-auto los pega abajo; justify-end dejaba los viejos fuera del alcance del scroll */}
          <div className="mt-auto flex flex-col">
            {messages.map((msg) => (
              <BurbujaMensaje
                key={msg.id}
                msg={msg}
                resaltado={resaltado === msg.id}
                onResponder={responder}
                onEditar={empezarEdicion}
                onEliminar={setPorEliminar}
                onIrA={irAMensaje}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* "Escribiendo…" flota sobre la caja de mensaje: no cambia el alto de la lista */}
        <div className="relative z-20">
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-4 mb-2 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs text-slate-500 shadow-sm"
              >
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-slate-400"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </span>
                {typingUsers.length === 1
                  ? `${typingUsers[0].nombre} está escribiendo`
                  : `${typingUsers.map((u) => u.nombre).join(', ')} están escribiendo`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Respondiendo a / editando: barra sobre la caja de mensaje */}
        {(respondiendo || editando) && (
          <div className="relative z-10 flex items-center gap-3 border-t border-slate-200/50 bg-white/95 px-4 py-2">
            {editando ? <Pencil size={16} className="shrink-0 text-teal-600" /> : <Reply size={16} className="shrink-0 text-teal-600" />}
            <div className="min-w-0 flex-1 border-l-4 border-teal-500 pl-2">
              <p className="text-xs font-semibold text-teal-600">
                {editando ? 'Editando mensaje' : `Respondiendo a ${respondiendo.self ? 'ti' : respondiendo.sender}`}
              </p>
              <p className="truncate text-xs text-slate-500">
                {(editando || respondiendo).text || '📎 Archivo'}
              </p>
            </div>
            <button
              onClick={() => (editando ? cancelarEdicion() : setRespondiendo(null))}
              title="Cancelar (Esc)"
              className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Vista previa del archivo elegido, antes de enviarlo */}
        {adjunto && (
          <div className="relative z-10 flex items-center gap-3 border-t border-slate-200/50 bg-white/95 px-4 py-2">
            {vistaPrevia ? (
              <img src={vistaPrevia} alt={adjunto.name} className="h-12 w-12 rounded-md object-cover" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500"><FileText size={22} /></span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">{adjunto.name}</p>
              <p className="text-xs text-slate-400">{formatoTamano(adjunto.size)} · puedes agregar un mensaje</p>
            </div>
            <button
              onClick={() => setAdjunto(null)}
              disabled={enviando}
              title="Quitar archivo"
              className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="relative z-10 flex items-end gap-2 border-t border-slate-200/50 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="relative">
            <button
              onClick={() => setAttachOpen(!attachOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 cursor-pointer"
            >
              <Paperclip size={18} />
            </button>
            <AttachmentMenu isOpen={attachOpen} onClose={() => setAttachOpen(false)} onSelect={handleAdjuntar} />
            <input
              ref={inputArchivoRef}
              type="file"
              hidden
              onChange={(e) => elegirArchivo(e.target.files[0])}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder={wsConnected ? 'Escribe un mensaje...' : 'Chat desconectado...'}
            rows={1}
            disabled={!wsConnected}
            className="flex-1 resize-none rounded-xl border-0 bg-slate-100 px-4 py-2.5 text-base text-slate-800 outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={!puedeEnviar}
            title={adjunto ? 'Enviar archivo' : 'Enviar'}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition cursor-pointer ${
              puedeEnviar
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-slate-100 text-slate-400'
            } disabled:cursor-not-allowed`}
          >
            {enviando ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>

      <PanelCompartido
        salaId={salaId}
        isOpen={compartidoOpen}
        onClose={() => setCompartidoOpen(false)}
        onIrAMensaje={irAMensaje}
      />

      <CamaraModal isOpen={camaraOpen} onClose={() => setCamaraOpen(false)} onFoto={elegirArchivo} />

      <Modal isOpen={Boolean(porEliminar)} onClose={() => setPorEliminar(null)} title="Eliminar mensaje">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">Se eliminará para todos en la sala. Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setPorEliminar(null)} className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Cancelar
            </button>
            <button onClick={confirmarEliminar} className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Mensajes;
