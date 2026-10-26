import React from 'react';
import { FileText, Download } from 'lucide-react';
import { partirEnlaces } from '../../utils/enlaces';
import { EXT_IMAGEN } from '../../utils/archivos';

// Texto con links clickeables + adjuntos: imágenes en línea y demás archivos como tarjeta.
// archivos: [{ id, nombre_archivo, fileURL, extension }] (extension sin punto, en minúsculas)
export default function ContenidoMensaje({ texto, archivos = [], propio }) {
  return (
    <>
      {archivos.map((a) =>
        EXT_IMAGEN.includes(`.${a.extension}`) ? (
          <a key={a.id} href={a.fileURL} target="_blank" rel="noopener noreferrer" className="mb-1 block" title="Abrir imagen">
            <img
              src={a.fileURL}
              alt={a.nombre_archivo}
              loading="lazy"
              className="max-h-64 max-w-full rounded-lg object-cover"
            />
          </a>
        ) : (
          <a
            key={a.id}
            href={a.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            download={a.nombre_archivo}
            className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 ${propio ? 'bg-white/15 hover:bg-white/25' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            <FileText size={20} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{a.nombre_archivo}</span>
              <span className={`text-[10px] uppercase ${propio ? 'text-white/70' : 'text-slate-500'}`}>{a.extension}</span>
            </span>
            <Download size={16} className="shrink-0" />
          </a>
        )
      )}
      {texto && (
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {partirEnlaces(texto).map((p, i) =>
            p.url ? (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                {p.url}
              </a>
            ) : (
              <React.Fragment key={i}>{p.texto}</React.Fragment>
            )
          )}
        </p>
      )}
    </>
  );
}
