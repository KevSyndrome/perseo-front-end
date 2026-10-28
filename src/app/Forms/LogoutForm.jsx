import React from 'react';
import { createPortal } from 'react-dom';

// Portal al body: así el blur cubre también el sidebar y el navbar
const LogoutForm = ({ onConfirm, onCancel }) => {
  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        backgroundColor: "var(--color-trans)",
        backdropFilter: 'blur(4px)',
      }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-titulo"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8"
      >
        <h2 id="logout-titulo" className="text-xl font-bold text-slate-800 sm:text-2xl">
          ¿Estás seguro de que quieres cerrar sesión?
        </h2>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Tendrás que volver a iniciar sesión para entrar.
        </p>

        <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row">
          <button
            onClick={onCancel}
            autoFocus
            className="flex-1 cursor-pointer rounded-xl border border-slate-300 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-xl py-2.5 font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "var(--error)" }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutForm;
