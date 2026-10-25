import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import UnirseForm from '../Forms/UnirseForm';
import { unirseProyecto } from '../../services/proyectoService';
import { generarSlugProyecto } from '../../utils/slug';

const UnirseModal = ({ isOpen, onClose, onUnido }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  // null = formulario; { ok: true, proyecto } o { ok: false, mensaje } = modal de resultado
  const [resultado, setResultado] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setCode('');
    setResultado(null);
    onClose();
  };

  const handleConfirm = async (codigo) => {
    setLoading(true);
    try {
      const res = await unirseProyecto(codigo);
      onUnido?.(res.data);
      setResultado({ ok: true, proyecto: res.data });
    } catch (err) {
      setResultado({ ok: false, mensaje: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!resultado) {
    return (
      <UnirseForm
        onConfirm={handleConfirm}
        onCancel={handleClose}
        code={code}
        onChange={setCode}
        loading={loading}
      />
    );
  }

  const { ok, proyecto, mensaje } = resultado;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <div className="mx-4 flex w-full max-w-md flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-xl">
        {ok
          ? <CheckCircle2 size={56} className="text-green-500" />
          : <XCircle size={56} className="text-red-500" />}

        <h2 className="text-2xl font-bold text-slate-800">
          {ok ? '¡Te uniste al proyecto!' : 'No se pudo unir'}
        </h2>
        <p className="text-slate-600">
          {ok
            ? <>Ahora eres colaborador de <span className="font-semibold">{proyecto?.nombre}</span>.</>
            : mensaje}
        </p>

        <div className="mt-4 flex w-full gap-4">
          {ok ? (
            <>
              <button
                onClick={handleClose}
                className="flex-1 cursor-pointer rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleClose();
                  navigate(`/proyectos/${generarSlugProyecto(proyecto)}`);
                }}
                className="flex-1 cursor-pointer rounded-xl py-3 font-semibold text-white transition"
                style={{ backgroundColor: '#0d3b4a' }}
              >
                Ver proyecto
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleClose}
                className="flex-1 cursor-pointer rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => { setCode(''); setResultado(null); }}
                className="flex-1 cursor-pointer rounded-xl py-3 font-semibold text-white transition"
                style={{ backgroundColor: '#0d3b4a' }}
              >
                Intentar de nuevo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnirseModal;
