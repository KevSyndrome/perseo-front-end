// Tarjeta de acción del Dashboard. value (opcional): número grande arriba del texto.
export default function Card({ icon, label, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="flex w-full min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl p-8 text-white transition hover:brightness-90 cursor-pointer"
    >
      {icon}
      {value !== undefined && <span className="text-4xl font-bold leading-none">{value}</span>}
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}
