import { useMemo } from 'react';
import { motion } from 'framer-motion';
import FloatingBg from './FloatingBg';
import { FONDO_DEFAULT } from './fondosSala';

const random = (min, max) => Math.random() * (max - min) + min;

function Aurora() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(120deg, #0f766e, #6d28d9, #db2777, #0ea5e9, #0f766e)',
        backgroundSize: '400% 400%',
        opacity: 0.35,
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function Estrellas({ count = 70 }) {
  const estrellas = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(0, 100),
      y: random(0, 100),
      size: random(1.5, 3.5),
      duration: random(2, 5),
      delay: random(0, 4),
    })),
    [count]
  );
  return (
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 30%, #1e293b, #020617)' }}>
      {estrellas.map((e) => (
        <motion.span
          key={e.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${e.x}%`, top: `${e.y}%`, width: e.size, height: e.size }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function Ondas() {
  const capas = [
    { color: '#7dd3fc', opacity: 0.35, bottom: '0%', duration: 18 },
    { color: '#38bdf8', opacity: 0.25, bottom: '6%', duration: 26 },
    { color: '#0ea5e9', opacity: 0.18, bottom: '12%', duration: 34 },
  ];
  const ola = 'M0 60 Q 150 0 300 60 T 600 60 T 900 60 T 1200 60 V 120 H 0 Z';
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-sky-100">
      {capas.map((c, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute left-0 h-40 w-[200%]"
          style={{ bottom: c.bottom, opacity: c.opacity }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: c.duration, repeat: Infinity, ease: 'linear' }}
        >
          <path d={ola} fill={c.color} />
        </motion.svg>
      ))}
    </div>
  );
}

const COMPONENTES = { burbujas: FloatingBg, aurora: Aurora, estrellas: Estrellas, ondas: Ondas };

// Fondo completo de una sala abierta: imagen subida o animado (default: burbujas)
export default function SalaFondo({ fondoTipo, fondo }) {
  if (fondoTipo === 'imagen' && fondo) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo})` }}
      />
    );
  }
  const Componente = COMPONENTES[fondo] ?? COMPONENTES[FONDO_DEFAULT];
  return <Componente />;
}
