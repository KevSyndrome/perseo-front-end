// Components/UI/InputDate.jsx
import React from 'react';

export default function InputDate({ value, onChange, required = false }) {
  return (
    <input
      type="date"
      required={required}
      value={value}
      onChange={onChange}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700
      outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    />
  );
}