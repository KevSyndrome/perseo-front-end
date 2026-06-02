import React from 'react';
import "../../styles/branding.css"

const LogoutForm = ({ onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-trans)",
        backdropFilter: 'blur(4px)',
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[450px] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-slate-800 text-center mb-10 max-w-4xl">
          ¿Estas seguro que quieres cerrar sesion?
        </h2>
        <br />

        <p className="text-2xl text-slate-500 mb-24 text-center">
          Esta acción no se puede deshacer.
        </p>
        <br />

        <div className="flex gap-16">
          <button
            onClick={onCancel}
            className="w-64 h-24 rounded-xl border border-slate-300 text-slate-700 text-2xl font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="w-64 h-24 rounded-xl text-white text-2xl font-semibold transition"
            style={{ backgroundColor: "var(--error)" }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutForm;