import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';
import { useBreadcrumb } from '../Components/Breadcrumb';
import AttachmentMenu from '../Components/AttachmentMenu';
import FloatingBg from '../Components/FloatingBg';
import {
  crearConexionWS,
  enviarMensajeWS,
  enviarTypingWS,
  cerrarConexionWS,
  obtenerMensajes,
} from '../../services/mensajesServices';

const Mensajes = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [attachOpen, setAttachOpen] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesContainerRef = useRef(null);
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
    { label: 'Mensajes' },
  ]);

  // Cargar mensajes paginados
  const loadMessages = async (pageNum, append = false) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const mensajesPrevios = await obtenerMensajes(null, pageNum, 20);
      if (mensajesPrevios.length === 0) {
        setHasMore(false);
        return;
      }
      const newMessages = mensajesPrevios.map((m) => ({
        id: m.id,
        text: m.mensaje,
        sender: m.usuario?.nombre || 'Desconocido',
        time: new Date(m.fechaC).toLocaleTimeString('es', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: (m.usuario?.nombre || 'U')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        self: m.usuario?.id === userId,
      }));
      
      if (append) {
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
          null, // null = sala Global
          (msg) => {
            if (msg.type === 'typing') {
              const typingId = msg.usuario_id;
              const typingName = msg.usuario_nombre;
              setTypingUsers((prev) => {
                const exists = prev.find((u) => u.id === typingId);
                if (exists) return prev;
                return [...prev, { id: typingId, nombre: typingName }];
              });
              setTimeout(() => {
                setTypingUsers((prev) => prev.filter((u) => u.id !== typingId));
              }, 3000);
              return;
            }
            // Nuevo mensaje recibido — solo agregar si no existe ya
            setMessages((prev) => {
              const exists = prev.find((m) => m.id === msg.id);
              if (exists) return prev;
              return [
                ...prev,
                {
                  id: msg.id,
                  text: msg.mensaje,
                  sender: msg.usuario?.nombre || 'Desconocido',
                  time: new Date(msg.fechaC).toLocaleTimeString('es', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  avatar: (msg.usuario?.nombre || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2),
                  self: msg.usuario?.id === userId,
                },
              ];
            });
            // Notificación del navegador si la pestaña no está activa
            if (document.hidden && Notification.permission === 'granted') {
              new Notification('Nuevo mensaje', {
                body: `${msg.usuario?.nombre || 'Alguien'}: ${msg.mensaje}`,
                icon: '/IsotipoPrometeoColoresOscuros.png',
              });
            }
            // Actualizar contador de mensajes no leídos
            const currentCount = parseInt(localStorage.getItem('unread_messages') || '0');
            localStorage.setItem('unread_messages', (currentCount + 1).toString());
            window.dispatchEvent(new Event('storage'));
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
          localStorage.setItem('chat_connected', 'true');
          window.dispatchEvent(new Event('storage'));
          setError(null);
        };
        ws.onclose = () => {
          setWsConnected(false);
          localStorage.setItem('chat_connected', 'false');
          window.dispatchEvent(new Event('storage'));
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

  // Auto-scroll al bottom solo cuando llegan mensajes nuevos (no al cargar histórico)
  useEffect(() => {
    if (messages.length > 0 && !loadingMore) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages.length]);

  // Solicitar permiso de notificaciones + resetear contador al entrar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // Resetear contador de no leídos porque el usuario ya está en el chat
    localStorage.setItem('unread_messages', '0');
    window.dispatchEvent(new Event('storage'));
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    if (!wsRef.current || !wsConnected) {
      setError('Chat no conectado. Intenta recargar la página.');
      return;
    }

    // Enviar por WebSocket
    const sent = enviarMensajeWS(wsRef.current, message.trim());
    if (sent) {
      setMessage('');
    } else {
      setError('No se pudo enviar el mensaje');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    // Enviar evento de typing cada vez que se escribe
    if (wsRef.current && wsConnected) {
      enviarTypingWS(wsRef.current);
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden rounded-xl bg-white">
      <FloatingBg />

      
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Lista de mensajes — crece desde abajo como WhatsApp */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex flex-1 flex-col overflow-y-auto px-4 py-4"
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
          {/* Los mensajes se alinean desde abajo con justify-end */}
          <div className="flex flex-col justify-end min-h-0 flex-1">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i === messages.length - 1 ? 0 : i * 0.04 }}
                className={`flex items-end gap-2 mb-3 ${msg.self ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.self && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-slate-400 mb-1">
                    {msg.avatar}
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.self
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white text-slate-800 rounded-bl-md'
                  }`}
                >
                  {!msg.self && (
                    <span className="text-[10px] font-semibold text-slate-500 mb-0.5 block">
                      {msg.sender}
                    </span>
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`mt-1 block text-right text-[10px] ${msg.self ? 'text-white/60' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            ))}
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500 mb-3">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
                <span>
                  {typingUsers.length === 1
                    ? `${typingUsers[0].nombre} está escribiendo`
                    : `${typingUsers.map(u => u.nombre).join(', ')} están escribiendo`}
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="relative z-10 flex items-end gap-2 border-t border-slate-200/50 bg-white/80 backdrop-blur-sm p-3">
          <div className="relative">
            <button
              onClick={() => setAttachOpen(!attachOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 cursor-pointer"
            >
              <Paperclip size={18} />
            </button>
            <AttachmentMenu isOpen={attachOpen} onClose={() => setAttachOpen(false)} onSelect={() => {}} />
          </div>

          <textarea
            value={message}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder={wsConnected ? 'Escribe un mensaje...' : 'Chat desconectado...'}
            rows={1}
            disabled={!wsConnected}
            className="flex-1 resize-none rounded-xl border-0 bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={!wsConnected || !message.trim()}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition cursor-pointer ${
              message.trim() && wsConnected
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-slate-100 text-slate-400'
            } disabled:cursor-not-allowed`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
