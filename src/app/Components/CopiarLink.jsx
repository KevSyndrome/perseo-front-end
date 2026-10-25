import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';

// Link de invitación: /unirse/<tipo>/<codigo>. Si el código se regenera, el link viejo deja de funcionar.
const linkInvitacion = (tipo, codigo) => `${window.location.origin}/unirse/${tipo}/${codigo}`;

// Botón "Copiar link". Si el navegador no deja usar el portapapeles (http sin TLS, o la
// promesa nunca responde), muestra el link en un campo seleccionado para copiarlo a mano.
export default function CopiarLink({ tipo, codigo, oscuro = false }) {
  const [copiado, setCopiado] = useState(false);
  const [manual, setManual] = useState(false);
  const url = linkInvitacion(tipo, codigo);

  const copiar = async () => {
    try {
      await Promise.race([
        navigator.clipboard.writeText(url),
        new Promise((_, rechazar) => setTimeout(rechazar, 1500)),
      ]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setManual(true);
    }
  };

  if (manual) {
    return (
      <input
        readOnly
        value={url}
        autoFocus
        onFocus={(e) => e.target.select()}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
      />
    );
  }

  return (
    <button
      onClick={copiar}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        oscuro ? 'text-[var(--color-terciario)] hover:bg-white/10' : 'text-teal-600 hover:bg-teal-50'
      }`}
    >
      {copiado ? <Check size={14} /> : <Link2 size={14} />}
      {copiado ? '¡Link copiado!' : 'Copiar link de invitación'}
    </button>
  );
}
