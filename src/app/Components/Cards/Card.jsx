// Tarjeta de acción del Dashboard. value (opcional): número grande arriba del texto.
export default function Card({ icon, label, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="flex w-full min-h-[96px] flex-col items-center justify-center gap-1.5 rounded-xl p-3 text-center text-white transition hover:brightness-90 cursor-pointer sm:min-h-[160px] sm:gap-3 sm:p-8 [&_svg]:size-6 sm:[&_svg]:size-9"
    >
      {icon}
      {value !== undefined && <span className="text-2xl font-bold leading-none sm:text-4xl">{value}</span>}
      <span className="text-xs font-medium leading-tight sm:text-base">{label}</span>
    </button>
  );
}
