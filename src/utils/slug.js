// Convierte un texto a formato URL: quita acentos, espacios y caracteres especiales
export function slugify(texto = '') {
  return texto
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos (á, é, í, ó, ú, ñ...)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Genera la URL amigable para un proyecto: "mi-proyecto--9ab39658"
// Usamos doble guion (--) como separador para poder distinguir
// el nombre (que puede tener guiones simples) del id corto al final.
export function generarSlugProyecto(proyecto) {
  const idCorto = proyecto.id.slice(0, 8);
  return `${slugify(proyecto.nombre)}--${idCorto}`;
}

// Extrae el fragmento de id desde el slug de la URL
export function extraerIdCortoDeSlug(slugParam = '') {
  const partes = slugParam.split('--');
  return partes[partes.length - 1];
}