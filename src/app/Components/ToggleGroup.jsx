export default function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex w-full rounded-lg bg-slate-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-md py-2.5 text-sm font-medium transition cursor-pointer ${
            value === option.value
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
