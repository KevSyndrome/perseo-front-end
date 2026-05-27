// Components/UI/FormActions.jsx
import React from 'react';

export default function FormActions({ onCancel, submitLabel = "Guardar" }) {
  return (
    <div 
      className="mt-1 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium
        text-slate-600 transition hover:bg-slate-50 cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white
        transition hover:bg-teal-700 cursor-pointer"
      >
        {submitLabel}
      </button>
    </div>
  );
}