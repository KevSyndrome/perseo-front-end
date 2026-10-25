import React, { useRef } from 'react';

// Código de invitación del backend: 8 caracteres A-Z / 2-9
const LARGO = 8;

const UnirseForm = ({ onConfirm, onCancel, code, onChange, loading, entidad = 'proyecto' }) => {
  const esSala = entidad === 'sala';
  const completo = code.length === LARGO;

  const inputs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const newCode = code.split('');
        newCode[index] = '';
        onChange(newCode.join(''));
      } else if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-1);
    if (!val) return;
    const newCode = code.split('').concat(Array(LARGO).fill('')).slice(0, LARGO);
    newCode[index] = val;
    onChange(newCode.join(''));
    if (index < LARGO - 1) inputs.current[index + 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, LARGO);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, LARGO - 1);
    inputs.current[focusIndex].focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4" style={{ padding: '2.5rem' }}>

        <h2 className="text-2xl font-bold text-slate-800 text-center tracking-wide uppercase mb-2">
          {esSala ? 'Unirse a una sala' : 'Unirse a Proyecto'}
        </h2>
        <hr style={{ borderColor: '#1a8fa0', marginBottom: '1.5rem' }} />

        <p className="text-slate-600 text-base text-center mb-6">
          {esSala ? 'Ingresa el código para unirte a la sala' : 'Ingresa el código para unirte al proyecto'}
        </p>

        {/* Cajas con input dentro de cada una */}
        <div className="flex justify-center items-center gap-2 mb-2">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              maxLength={1}
              value={code[i] || ''}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              autoFocus={i === 0}
              className="w-11 h-14 rounded-lg text-center text-xl font-bold text-slate-700 border-2 focus:outline-none focus:border-teal-500"
              style={{ backgroundColor: '#8ecdd4', borderColor: code[i] ? '#0d3b4a' : '#8ecdd4' }}
            />
          ))}

          <span className="text-slate-400 text-2xl font-light mx-1">—</span>

          {[4, 5, 6, 7].map((i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              maxLength={1}
              value={code[i] || ''}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="w-11 h-14 rounded-lg text-center text-xl font-bold text-slate-700 border-2 focus:outline-none focus:border-teal-500"
              style={{ backgroundColor: '#8ecdd4', borderColor: code[i] ? '#0d3b4a' : '#8ecdd4' }}
            />
          ))}
        </div>

        <p className="text-slate-400 text-xs text-center mb-8">
          Utiliza el código de 8 caracteres que te compartió {esSala ? 'el creador de la sala' : 'el dueño del proyecto'}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(code)}
            disabled={!completo || loading}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition"
            style={{
              backgroundColor: completo && !loading ? '#0d3b4a' : '#94a3b8',
              cursor: completo && !loading ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Uniendo...' : esSala ? 'Unirse a la sala' : 'Unirse al proyecto'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UnirseForm;