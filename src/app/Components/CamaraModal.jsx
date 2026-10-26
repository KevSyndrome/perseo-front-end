import React, { useEffect, useRef, useState } from 'react';
import { Camera, Laptop } from 'lucide-react';
import Modal from '../Modals/CreateProyectoModal';

// Cámara en computadora: avisa que la calidad suele ser menor y, si el usuario sigue,
// usa la webcam (getUserMedia) para tomar la foto. En celular no se usa: el input con
// capture abre la cámara nativa.
export default function CamaraModal({ isOpen, onClose, onFoto }) {
  const [paso, setPaso] = useState('aviso'); // 'aviso' | 'camara'
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const apagar = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const cerrar = () => {
    apagar();
    setPaso('aviso');
    setError('');
    onClose();
  };

  // Apaga la webcam si el componente se desmonta con la cámara encendida
  useEffect(() => apagar, []);

  const encender = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 } }, audio: false });
      streamRef.current = stream;
      setPaso('camara');
      // El <video> existe hasta el siguiente render
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setError('No se pudo usar la cámara. Revisa que el navegador tenga permiso y que no la esté usando otra app.');
    }
  };

  const tomarFoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      onFoto(new File([blob], `foto-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      cerrar();
    }, 'image/jpeg', 0.9);
  };

  return (
    <Modal isOpen={isOpen} onClose={cerrar} title="Tomar foto">
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      {paso === 'aviso' ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Laptop size={40} className="text-slate-400" />
          <p className="text-sm text-slate-600">
            Estás en una computadora o en un dispositivo que no es móvil. Las fotos con la cámara web
            no suelen salir con la mejor calidad. <span className="font-semibold">Te recomendamos usar esta opción desde tu celular.</span>
          </p>
          <div className="flex w-full gap-3">
            <button onClick={cerrar} className="flex-1 cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Cancelar
            </button>
            <button onClick={encender} className="flex-1 cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
              Usar la cámara de todos modos
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg bg-black" />
          <button
            onClick={tomarFoto}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Camera size={16} /> Tomar foto
          </button>
        </div>
      )}
    </Modal>
  );
}
