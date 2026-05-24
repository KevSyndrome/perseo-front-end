// Components/UI/ImageUpload.jsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import "../../../styles/branding.css";

export default function ImageUpload({ onFile, preview }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onFile(e.dataTransfer.files[0]);
  };

  return (
    <label
    style={{backgroundColor: "var(--color-dark-grey)"}}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
      cursor-pointer transition min-h-[120px]
      ${dragOver ? 'border-teal-400 bg-teal-50' : 'border-slate-300 bg-slate-100 hover:bg-slate-200'}`}
    >
      {preview
        ? <img 
        
        src={preview} alt="preview" className="h-full w-full object-cover rounded-lg" />
        : <>
            <Upload size={28} 
            style={{color: "var(--color-negro)"}}
            className="text-slate-500" />
            <span 
            style={{color: "var(--color-negro)"}}
            className="text-xs text-slate-500 text-center px-2">
              Haz clic o arrastra para subir una imagen
            </span>
          </>
      }
      <input type="file" hidden accept="image/*" onChange={(e) => onFile(e.target.files[0])} />
    </label>
  );
}