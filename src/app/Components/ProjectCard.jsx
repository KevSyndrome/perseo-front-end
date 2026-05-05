import { FolderOpen } from "lucide-react";

export default function ProjectCard({ project, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col items-start gap-3 rounded-xl bg-white p-5 text-left shadow-md transition hover:shadow-lg cursor-pointer"
    >
      <div className="flex w-full items-center gap-4">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <FolderOpen size={28} className="text-slate-400" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate text-lg font-semibold text-slate-800">
            {project.name}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-500">
            {project.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-sm text-slate-400">
        <span className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
          {project.owner.charAt(0)}
        </span>
        {project.owner}
      </div>
    </button>
  );
}
