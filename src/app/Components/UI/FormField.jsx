// Components/UI/FormField.jsx
import React from 'react';

export default function FormField({ label, required = false, children, stretch = false }) {
  return (
    <div className={`flex flex-col gap-1.5 ${stretch ? 'flex-1' : ''}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}