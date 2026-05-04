export default function Card({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl p-8 text-white transition hover:brightness-90 cursor-pointer ${color}`}
    >
      {icon}
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}
