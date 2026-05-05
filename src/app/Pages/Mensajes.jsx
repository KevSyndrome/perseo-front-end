import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';
import { useBreadcrumb } from '../Components/Breadcrumb';
import AttachmentMenu from '../Components/AttachmentMenu';
import FloatingBg from '../Components/FloatingBg';

const hardcodedMessages = [
  { id: 1, text: 'Hola! Cómo va el sprint de esta semana?', sender: 'Ana G.', time: '09:15', avatar: 'AG', self: false },
  { id: 2, text: 'Bien! Ya terminé el diseño del dashboard, lo estoy subiendo al repo', sender: 'Zio Zukey', time: '09:17', avatar: 'ZZ', self: true },
  { id: 3, text: 'Genial! Voy a revisar los tickets pendientes, hay varios en "En Progreso"', sender: 'Carlos R.', time: '09:20', avatar: 'CR', self: false },
  { id: 4, text: 'Sí, el de la API está bloqueado, necesito que me pasen las credenciales del staging', sender: 'Ana G.', time: '09:22', avatar: 'AG', self: false },
  { id: 5, text: 'Ahora te las paso por aquí', sender: 'Zio Zukey', time: '09:23', avatar: 'ZZ', self: true },
  { id: 6, text: 'Perfecto! También agendé una llamada para el viernes para revisar los sprints completados', sender: 'Carlos R.', time: '09:30', avatar: 'CR', self: false },
  { id: 7, text: 'Me parece bien, confirmen para coordinar el horario', sender: 'Zio Zukey', time: '09:31', avatar: 'ZZ', self: true },
];

const avatarColors = {
  'AG': 'bg-pink-500',
  'ZZ': 'bg-primary',
  'CR': 'bg-emerald-500',
};

const Mensajes = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(hardcodedMessages);
  const [attachOpen, setAttachOpen] = useState(false);
  const bottomRef = useRef(null);

  useBreadcrumb([
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Mensajes' },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        sender: 'Zio Zukey',
        time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
        avatar: 'ZZ',
        self: true,
      },
    ]);
    setMessage('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden rounded-xl bg-white">
      <FloatingBg />

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 gap-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-end gap-2 ${msg.self ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.self && (
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColors[msg.avatar] || 'bg-slate-400'}`}>
                  {msg.avatar}
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.self
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white text-slate-800 shadow-sm rounded-bl-md'
                }`}
              >
                {!msg.self && (
                  <span className="text-[10px] font-semibold text-slate-500 mb-0.5 block">
                    {msg.sender}
                  </span>
                )}
                <p>{msg.text}</p>
                <span className={`mt-1 block text-right text-[10px] ${msg.self ? 'text-white/60' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

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
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 resize-none rounded-xl border-0 bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            onClick={handleSend}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition cursor-pointer ${
              message.trim()
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
