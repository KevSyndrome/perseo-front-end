import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, FileText, Folder, Link, Camera } from 'lucide-react';

const items = [
  { icon: Image, label: 'Imagen', color: 'bg-pink-500' },
  { icon: FileText, label: 'Documento', color: 'bg-blue-500' },
  { icon: Folder, label: 'Archivo', color: 'bg-amber-500' },
  { icon: Camera, label: 'Cámara', color: 'bg-purple-500' },
  { icon: Link, label: 'Enlace', color: 'bg-green-500' },
];

export default function AttachmentMenu({ isOpen, onClose, onSelect }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-16 left-4 z-50"
          >
            <div className="rounded-2xl bg-white p-4 shadow-2xl border border-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Adjuntar</span>
                <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer">
                  <X size={14} />
                </button>
              </div>
              <div className="flex gap-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { onSelect?.(item.label); onClose(); }}
                      className="group flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} text-white transition group-hover:scale-110 shadow-sm`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
