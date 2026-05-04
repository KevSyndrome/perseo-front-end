import { FolderOpen } from "lucide-react";

export default function ProjectCarousel({ projects = [] }) {
  if (!projects.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-12 text-slate-400">
        <FolderOpen size={48} className="mb-3" />
        <p className="text-lg font-medium">No hay proyectos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-4 overflow-x-auto py-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex min-w-[260px] flex-col rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg"
        >
          <h3 className="font-semibold text-slate-800">{project.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{project.description}</p>
        </div>
      ))}
    </div>
  );
}
