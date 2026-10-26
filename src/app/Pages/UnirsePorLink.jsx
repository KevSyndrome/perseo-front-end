import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, XCircle } from 'lucide-react';
import { unirseSala } from '../../services/salaService';
import { unirseProyecto } from '../../services/proyectoService';
import { guardarRutaPendiente } from '../../services/api';
import { generarSlugProyecto } from '../../utils/slug';

// /unirse/sala/:codigo y /unirse/proyecto/:codigo (link de invitación).
// Sin sesión: guarda esta ruta y manda a login; al volver se completa la unión.
// unirse es idempotente: si ya era miembro también responde 200 con el recurso.
const DESTINO = {
  sala: { unirse: unirseSala, ruta: (s) => `/mensajes/${s.id}` },
  proyecto: { unirse: unirseProyecto, ruta: (p) => `/proyectos/${generarSlugProyecto(p)}` },
};

const UnirsePorLink = () => {
  const { tipo, codigo } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  // Una sola petición aunque StrictMode monte el efecto dos veces
  const peticion = useRef(null);

  useEffect(() => {
    const destino = DESTINO[tipo];
    if (!destino) {
      setError('El link de invitación no es válido.');
      return;
    }
    if (!localStorage.getItem('token')) {
      // Desde los params: window.location ya podría ser /login si el efecto corre dos veces
      guardarRutaPendiente(`/unirse/${tipo}/${codigo}`);
      navigate('/login', { replace: true });
      return;
    }
    let cancelado = false;
    peticion.current ??= destino.unirse(codigo);
    peticion.current
      .then((res) => !cancelado && navigate(destino.ruta(res.data), { replace: true }))
      .catch((err) => {
        if (cancelado) return;
        // 404 = código inválido o regenerado
        if (/inválido/i.test(err.message)) {
          setError('El link de invitación no es válido o fue regenerado.');
        } else {
          setError(err.message);
        }
      });
    return () => { cancelado = true; };
  }, [tipo, codigo, navigate]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-secondary)] p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-xl">
        {error ? (
          <>
            <XCircle size={52} className="text-red-500" />
            <h1 className="text-xl font-bold text-slate-800">No se pudo unir</h1>
            <p className="text-slate-600">{error}</p>
            <button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="mt-3 w-full cursor-pointer rounded-xl py-3 font-semibold text-white"
              style={{ backgroundColor: 'var(--color-boton)' }}
            >
              Ir al inicio
            </button>
          </>
        ) : (
          <>
            <Loader2 size={40} className="animate-spin text-teal-600" />
            <p className="text-slate-600">Uniéndote {tipo === 'sala' ? 'a la sala' : 'al proyecto'}...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UnirsePorLink;
