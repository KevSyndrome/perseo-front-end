import React from 'react';

const UnirseForm = ({ onConfirm, onCancel, code, onChange }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "var(--color-trans)", backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl px-10 py-8 w-full max-w-lg text-center">

        <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-wide uppercase">
          Unirse a Proyecto
        </h2>

        <hr style={{ borderColor: "var(--color-selection)", marginBottom: '1.25rem' }} />

        <p className="text-slate-600 text-base mb-6">
          Ingresa el codigo para unirte al proyecto
        </p>

        {/* Cajas de dígitos */}
        <div className="flex justify-center items-center gap-3 mb-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-700"
              style={{ backgroundColor: "var(--color-terciario)" }}
            >
              {code[i] || ''}
            </div>
          ))}

          <span className="text-slate-400 text-2xl mx-1">—</span>

          {[3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-700"
              style={{ backgroundColor: "var(--color-terciario)" }}
            >
              {code[i] || ''}
            </div>
          ))}
        </div>

        {/* Input oculto real donde el usuario escribe */}
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
          className="w-48 text-center border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-teal-500 mb-2"
          placeholder="Escribe el código"
          autoFocus
        />

        <p className="text-slate-400 text-xs mb-8">
          Utiliza el codigo de 6 digitos dados por el administrador del proyecto
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(code)}
            disabled={code.length !== 6}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition"
            style={{
              backgroundColor: code.length === 6 ? "var(--color-selection)" : "var(--color-gris)",
              cursor: code.length === 6 ? 'pointer' : 'not-allowed'
            }}
          >
            Unirse al proyecto
          </button>
        </div>

      </div>
    </div>
  );
};

export default UnirseForm;