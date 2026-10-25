import React from 'react';

export default function Select({ value, onChange, options = [], placeholder = "Seleccionar...", required = false, disabled = false }) {
  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}