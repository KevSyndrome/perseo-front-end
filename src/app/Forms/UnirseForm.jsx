import React, { useRef } from 'react';

const UnirseForm = ({ onConfirm, onCancel, code, onChange, error }) => {
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
    const newCode = code.split('').concat(Array(6).fill('')).slice(0, 6);
    newCode[index] = val;
    onChange(newCode.join(''));
    if (index < 5) inputs.current[index + 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    const focusIndex = Math.min(pasted.length, 5);
    inputs.current[focusIndex].focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4" style={{ padding: '2.5rem' }}>

        <h2 className="text-2xl font-bold text-slate-800 text-center tracking-wide uppercase mb-2">
          Unirse a Proyecto
        </h2>
        <hr style={{ borderColor: '#1a8fa0', marginBottom: '1.5rem' }} />

        <p className="text-slate-600 text-base text-center mb-6">
          Ingresa el codigo para unirte al proyecto
        </p>

        <div className="flex justify-center items-center gap-3 mb-2">
          {[0, 1, 2].map((i) => (
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
              className="w-16 h-16 rounded-xl text-center text-2xl font-bold text-slate-700 border-2 focus:outline-none focus:border-teal-500"
              style={{ backgroundColor: '#8ecdd4', borderColor: code[i] ? '#0d3b4a' : '#8ecdd4' }}
            />
          ))}

          <span className="text-slate-400 text-2xl font-light mx-1">—</span>

          {[3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              maxLength={1}
              value={code[i] || ''}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="w-16 h-16 rounded-xl text-center text-2xl font-bold text-slate-700 border-2 focus:outline-none focus:border-teal-500"
              style={{ backgroundColor: '#8ecdd4', borderColor: code[i] ? '#0d3b4a' : '#8ecdd4' }}
            />
          ))}
        </div>

        <p className="text-slate-400 text-xs text-center mb-3">
          Utiliza el codigo de 6 digitos dados por el administrador del proyecto
        </p>

        {/* ← Error message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <div className="flex gap-4 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(code)}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition"
            style={{
              backgroundColor: code.length === 6 && !code.includes('') ? '#0d3b4a' : '#94a3b8',
              cursor: code.length === 6 && !code.includes('') ? 'pointer' : 'not-allowed'
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