// Parte un texto en trozos de texto y enlaces http(s) para mostrarlos clickeables.
// Solo http/https: nunca javascript: ni otros esquemas.
const URL_RE = /(https?:\/\/[^\s<>"']+)/gi;
// Puntuación final que casi nunca es parte del link ("mira https://x.com.")
const PUNTUACION_FINAL = /[.,;:!?)\]]+$/;

export function partirEnlaces(texto = '') {
  const partes = [];
  let ultimo = 0;
  for (const m of texto.matchAll(URL_RE)) {
    let url = m[0];
    const sobra = url.match(PUNTUACION_FINAL)?.[0] ?? '';
    url = url.slice(0, url.length - sobra.length);
    if (m.index > ultimo) partes.push({ texto: texto.slice(ultimo, m.index) });
    partes.push({ url });
    ultimo = m.index + url.length;
  }
  if (ultimo < texto.length) partes.push({ texto: texto.slice(ultimo) });
  return partes;
}
