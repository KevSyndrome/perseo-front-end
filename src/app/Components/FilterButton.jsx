import { Filter } from "lucide-react";

export default function FilterButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
    >
      <Filter size={16} />
      Filtros
    </button>
  );
}
