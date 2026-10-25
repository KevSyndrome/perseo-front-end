import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function CreateProyectoModal({ isOpen, onClose, title, children, width = "w-[580px]", height = "h-auto" }) {
  // Portal a body: un ancestro con transform/backdrop-filter rompería el position: fixed
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
          style={{padding: "min(20px, 3vw)"}}
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed left-1/2 top-1/2 z-50 ${width} ${height} max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 
            -translate-y-1/2 rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 shrink-0 sm:px-8 sm:py-5">
              <h3 className="text-xl font-bold text-slate-800">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 
                hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido */}
            <div className="overflow-y-auto flex-1 px-4 py-4 sm:px-8 sm:py-6">
              {children}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
