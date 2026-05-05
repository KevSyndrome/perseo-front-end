import { motion } from 'framer-motion';
import { FolderOpen, Calendar, User } from 'lucide-react';

const statusColors = {
  activo: 'bg-green-100 text-green-700',
  pendiente: 'bg-amber-100 text-amber-700',
  inactivo: 'bg-slate-100 text-slate-500',
};

export default function ProjectCard({ project, view = 'grid', onClick }) {
  if (view === 'list') {
    return (
      <motion.button
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="group flex w-full items-center gap-5 rounded-xl border border-slate-100 bg-white px-5 py-4 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md cursor-pointer"
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 transition group-hover:from-primary/20 group-hover:to-primary/30">
          {project.image ? (
            <img src={project.image} alt={project.name} className="h-full w-full rounded-lg object-cover" />
          ) : (
            <FolderOpen size={22} className="text-primary" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-800">{project.name}</h3>
            <p className="truncate text-sm text-slate-500">{project.description}</p>
          </div>

          <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
            <User size={12} />
            {project.owner}
          </div>

          {project.startDate && (
            <div className="hidden items-center gap-1.5 text-xs text-slate-400 md:flex">
              <Calendar size={12} />
              {project.startDate}
            </div>
          )}

          {project.status && (
            <span className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block ${statusColors[project.status] || statusColors.inactivo}`}>
              {project.status}
            </span>
          )}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="group flex w-full flex-col items-start overflow-hidden rounded-xl border border-slate-100 bg-white text-left shadow-sm transition hover:border-primary/30 hover:shadow-lg cursor-pointer"
    >
      <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-primary/5 group-hover:to-primary/10 transition-colors">
        {project.image ? (
          <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
        ) : (
          <FolderOpen size={36} className="text-slate-300 group-hover:text-primary transition-colors" />
        )}
      </div>

      <div className="flex w-full flex-col gap-2 p-4">
        <h3 className="truncate text-base font-semibold text-slate-800">{project.name}</h3>
        <p className="line-clamp-2 text-xs text-slate-500">{project.description}</p>

        <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
              {project.owner.charAt(0)}
            </div>
            <span className="truncate max-w-[80px]">{project.owner}</span>
          </div>

          {project.status && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[project.status] || statusColors.inactivo}`}>
              {project.status}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
