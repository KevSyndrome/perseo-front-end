// Components/UI/ToggleGroup.jsx
import React from 'react';

export default function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="grid rounded-lg border border-slate-200 overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition cursor-pointer
          ${index !== 0 ? 'border-l border-slate-200' : ''}
          ${value === option.value
            ? 'bg-teal-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {option.icon && <span>{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}