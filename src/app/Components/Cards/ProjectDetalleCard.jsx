import { User, FolderOpen, Calendar, Plus, RefreshCw, X, MoreVertical, KeyRound, ImageUp, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const ProjectDetalleCard = ({
  project,
  codigoInvitacion,
  onRegenerarCodigo,
  colaboradores = [],
  esPropietario,
  usuarioActualId,
  onQuitarColaborador,
  onLogo,
  error,
}) => {
  const logoInputRef = useRef(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  // El código existe desde que se crea el proyecto; solo se muestra a petición
  const [mostrarCodigo, setMostrarCodigo] = useState(false);

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        backgroundColor: "var(--color-primary)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "var(--radius-xl)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
        position: "relative",
      }}
      className="p-4 sm:p-8"
    >
      {/* Menú de opciones: solo el propietario */}
      {esPropietario && (
        <div className="absolute right-4 top-4">
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            title="Opciones del proyecto"
            className="flex cursor-pointer items-center justify-center rounded-full bg-transparent p-2 text-[var(--color-blanco)] hover:bg-white/10"
          >
            <MoreVertical size={20} />
          </button>
          {menuAbierto && (
            <>
              {/* Capa invisible para cerrar al hacer clic fuera */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
              <div className="absolute right-0 z-20 mt-1 flex w-52 flex-col overflow-hidden rounded-lg bg-white py-1 text-sm text-slate-700 shadow-[var(--shadow-lg)]">
                <button
                  onClick={() => { setMenuAbierto(false); setMostrarCodigo(true); }}
                  className="flex cursor-pointer items-center gap-2 bg-transparent px-4 py-2 text-left hover:bg-slate-100"
                >
                  <KeyRound size={15} /> Generar código
                </button>
                <button
                  onClick={() => { setMenuAbierto(false); logoInputRef.current.click(); }}
                  className="flex cursor-pointer items-center gap-2 bg-transparent px-4 py-2 text-left hover:bg-slate-100"
                >
                  <ImageUp size={15} /> Cambiar logo
                </button>
                {project.image && (
                  <button
                    onClick={() => { setMenuAbierto(false); onLogo(null); }}
                    className="flex cursor-pointer items-center gap-2 bg-transparent px-4 py-2 text-left text-red-500 hover:bg-red-50"
                  >
                    <ImageOff size={15} /> Quitar logo
                  </button>
                )}
              </div>
            </>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            hidden
            onChange={(e) => e.target.files[0] && onLogo(e.target.files[0])}
          />
        </div>
      )}

      {/* Header: logo + nombre + owner */}
      <div className="flex items-start gap-3 pr-8 sm:gap-6">
        <div className="h-16 w-16 sm:h-[100px] sm:w-[100px]" style={{
          borderRadius: "var(--radius-md)",
          overflow: "hidden", flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {project.image && project.image !== 'https://via.placeholder.com/150/default'
            ? <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <FolderOpen size={40} color="var(--color-terciario)" />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="break-words text-xl sm:text-[2rem]" style={{
            color: "var(--color-blanco)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            margin: 0,
            lineHeight: 1.1,
          }}>
            {project.name}
          </h1>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            marginTop: "0.5rem", color: "var(--color-dark-grey)", fontSize: "0.8rem"
          }}>
            <User size={13} />
            <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {project.owner}
            </span>
          </div>
        </div>
      </div>

      {/* Body: fechas + descripción */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr] sm:gap-8">

        {/* Fechas */}
        <div className="flex flex-row gap-6 sm:flex-col">
          <div>
            <p style={{ color: "var(--color-dark-grey)", fontSize: "0.75rem", margin: "0 0 0.25rem 0" }}>
              Fecha de inicio:
            </p>
            <p style={{ color: "var(--color-blanco)", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
              {formatFecha(project.fechaInicial)}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--color-dark-grey)", fontSize: "0.75rem", margin: "0 0 0.25rem 0" }}>
              Fecha de finalización:
            </p>
            <p style={{ color: "var(--color-blanco)", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
              {formatFecha(project.fechaFinal)}
            </p>
          </div>
        </div>

        {/* Descripción */}
        <p style={{
          color: "var(--color-blanco)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          margin: 0,
          fontWeight: 400,
        }}>
          {project.description}
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

      {/* Invitación y colaboradores */}
      <div className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-400">{error}</p>}

        {mostrarCodigo && codigoInvitacion && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[var(--color-dark-grey)]">Código de invitación:</span>
            <span className="rounded-lg bg-white/10 px-3 py-1 font-mono text-lg font-bold tracking-[0.3em] text-[var(--color-blanco)]">
              {codigoInvitacion}
            </span>
            <button
              onClick={onRegenerarCodigo}
              title="El código anterior dejará de funcionar"
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-transparent px-3 py-1 text-xs font-semibold text-[var(--color-terciario)] hover:bg-white/10"
            >
              <RefreshCw size={13} />
              Generar nuevo
            </button>
            <button
              onClick={() => setMostrarCodigo(false)}
              title="Ocultar código"
              className="flex cursor-pointer items-center rounded-full bg-transparent p-1 text-[var(--color-dark-grey)] hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div>
          <h2 className="mb-2 text-xl font-bold text-[var(--color-blanco)]">
            Colaboradores ({colaboradores.length})
          </h2>
          {colaboradores.length === 0 ? (
            <p className="text-sm text-[var(--color-dark-grey)]">
              {esPropietario ? 'Usa el menú ⋮ → "Generar código" para invitar colaboradores.' : 'Sin colaboradores.'}
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {colaboradores.map(({ usuario }) => {
                const esYo = usuario.id === usuarioActualId;
                return (
                  <li
                    key={usuario.id}
                    className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-3 pr-1 text-sm text-[var(--color-blanco)]"
                  >
                    {usuario.nombre}
                    {(esPropietario || esYo) && (
                      <button
                        onClick={() => onQuitarColaborador(usuario.id)}
                        title={esYo ? 'Salir del proyecto' : 'Quitar del proyecto'}
                        className="flex cursor-pointer items-center gap-1 rounded-full bg-transparent px-2 py-0.5 text-xs text-red-300 hover:bg-white/10"
                      >
                        <X size={12} />
                        {esYo ? 'Salir' : 'Quitar'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

      {/* Sprints */}
      <div>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "1rem"
        }}>
          <h2 style={{ color: "var(--color-blanco)", fontWeight: 700, fontSize: "1.25rem", margin: 0 }}>
            Sprints
          </h2>
          
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button style={{
            backgroundColor: "var(--color-selection)",
            color: "var(--color-blanco)",
            border: "none",
            borderRadius: "999px",
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
            <Plus size={14} />
            Crear sprint
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetalleCard;