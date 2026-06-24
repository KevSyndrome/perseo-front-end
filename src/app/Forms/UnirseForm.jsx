import React from 'react';

const UnirseForm = ({ onConfirm, onCancel, code, onChange }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4" style={{ padding: '2.5rem' }}>

        {/* Título */}
        <h2 className="text-2xl font-bold text-slate-800 text-center tracking-wide uppercase mb-2">
          Unirse a Proyecto
        </h2>
        <hr style={{ borderColor: '#1a8fa0', marginBottom: '1.5rem' }} />

        {/* Subtítulo */}
        <p className="text-slate-600 text-base text-center mb-6">
          Ingresa el codigo para unirte al proyecto
        </p>

        {/* Cajas de dígitos */}
        <div className="flex justify-center items-center gap-3 mb-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-700"
              style={{ backgroundColor: '#8ecdd4' }}
            >
              {code[i] || ''}
            </div>
          ))}
          <span className="text-slate-400 text-2xl font-light mx-1">—</span>
          {[3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-700"
              style={{ backgroundColor: '#8ecdd4' }}
            >
              {code[i] || ''}
            </div>
          ))}
        </div>

        {/* Input real pero discreto */}
        <div className="flex justify-center mb-1">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
            className="w-48 text-center border-b border-slate-300 py-1 text-slate-600 text-sm focus:outline-none focus:border-teal-500 bg-transparent"
            placeholder="Escribe el código"
            autoFocus
          />
        </div>

        {/* Hint */}
        <p className="text-slate-400 text-xs text-center mb-8">
          Utiliza el codigo de 6 digitos dados por el administrador del proyecto
        </p>

        {/* Botones */}
        <div className="flex gap-4">
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
              backgroundColor: code.length === 6 ? '#0d3b4a' : '#94a3b8',
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