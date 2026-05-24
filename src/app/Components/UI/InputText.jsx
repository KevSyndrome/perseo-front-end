// Components/UI/InputText.jsx
import React from 'react';

export default function InputText({ value, onChange, placeholder, required = false }) {
  return (
    <input
      type="text"
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700
      outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    />
  );
}