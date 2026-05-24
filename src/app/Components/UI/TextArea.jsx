// Components/UI/TextArea.jsx
import React from 'react';

export default function TextArea({ value, onChange, placeholder, rows = 4, required = false }) {
  return (
    <textarea
      required={required}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700
      outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none h-full"
    />
  );
}