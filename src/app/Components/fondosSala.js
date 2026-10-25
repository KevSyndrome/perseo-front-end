// Fondos animados de las salas. La "clave" es lo que se guarda en el backend
// (PUT /salas/{id}/fondo); "preview" es el degradado que se ve en las tarjetas.
export const FONDOS_ANIMADOS = [
  { clave: 'burbujas', nombre: 'Burbujas', preview: 'linear-gradient(135deg, #e0f2fe, #fce7f3, #ecfccb)' },
  { clave: 'aurora', nombre: 'Aurora', preview: 'linear-gradient(135deg, #0f766e, #6d28d9, #db2777)' },
  { clave: 'estrellas', nombre: 'Estrellas', preview: 'radial-gradient(circle at 30% 30%, #1e293b, #020617)' },
  { clave: 'ondas', nombre: 'Ondas', preview: 'linear-gradient(180deg, #e0f2fe, #7dd3fc)' },
];

export const FONDO_DEFAULT = 'burbujas';

// Fondo de una tarjeta (estático) según fondo_tipo/fondo de la sala
export const estiloPreviewFondo = ({ fondo_tipo, fondo }) => {
  if (fondo_tipo === 'imagen' && fondo) {
    return { backgroundImage: `url(${fondo})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  const animado = FONDOS_ANIMADOS.find((f) => f.clave === fondo) ?? FONDOS_ANIMADOS[0];
  return { background: animado.preview };
};
