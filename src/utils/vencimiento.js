// "vence en 12 días" / "vence hoy" / "venció hace 3 días"
export function textoVencimiento(fechaIso, ahora = new Date()) {
  if (!fechaIso) return null;
  const dia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dias = Math.round((dia(new Date(fechaIso)) - dia(ahora)) / 86400000);
  if (dias === 0) return 'vence hoy';
  if (dias === 1) return 'vence mañana';
  if (dias > 1) return `vence en ${dias} días`;
  return dias === -1 ? 'venció ayer' : `venció hace ${-dias} días`;
}
