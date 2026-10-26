// Mismas reglas que el backend (cloudinary_service.py): extensiones permitidas y 10 MB
export const MAX_MB = 10;
export const EXT_IMAGEN = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
export const EXT_DOCUMENTO = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];
export const EXT_PERMITIDAS = [...EXT_IMAGEN, ...EXT_DOCUMENTO, '.zip'];

const extension = (nombre = '') => {
  const limpio = nombre.split('?')[0].toLowerCase();
  const i = limpio.lastIndexOf('.');
  return i === -1 ? '' : limpio.slice(i);
};

export const esImagen = (nombreOUrl) => EXT_IMAGEN.includes(extension(nombreOUrl));

// Devuelve el mensaje de error o null si el archivo se puede enviar
export const validarArchivo = (file) => {
  if (!EXT_PERMITIDAS.includes(extension(file.name))) {
    return `Tipo de archivo no permitido. Usa: ${EXT_PERMITIDAS.join(', ')}`;
  }
  if (file.size > MAX_MB * 1024 * 1024) return `El archivo pesa más de ${MAX_MB} MB.`;
  return null;
};

export const formatoTamano = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Celular o tablet: ahí el input con capture abre la cámara nativa
export const esMovil = () =>
  navigator.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
