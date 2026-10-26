import { useMemo } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import FloatingBg from './FloatingBg';
import { FONDO_DEFAULT } from './fondosSala';

const random = (min, max) => Math.random() * (max - min) + min;

// Aurora: manchas grandes y difuminadas que se desplazan y cambian de tamaño
const MANCHAS_AURORA = [
  { color: '#14b8a6', size: '70%', x: ['-10%', '35%', '5%', '-10%'], y: ['-10%', '15%', '40%', '-10%'], duration: 14 },
  { color: '#8b5cf6', size: '65%', x: ['50%', '10%', '45%', '50%'], y: ['30%', '-5%', '5%', '30%'], duration: 17 },
  { color: '#ec4899', size: '55%', x: ['30%', '60%', '0%', '30%'], y: ['60%', '35%', '15%', '60%'], duration: 12 },
  { color: '#0ea5e9', size: '60%', x: ['60%', '20%', '55%', '60%'], y: ['-15%', '45%', '55%', '-15%'], duration: 19 },
];

function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'var(--fondo-aurora)' }}>
      {MANCHAS_AURORA.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: m.size,
            aspectRatio: '1',
            background: `radial-gradient(circle, ${m.color} 0%, transparent 65%)`,
            filter: 'blur(40px)',
            opacity: 0.55,
          }}
          animate={{ left: m.x, top: m.y, scale: [1, 1.25, 0.9, 1] }}
          transition={{ duration: m.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// Estrellas: parpadeo, cielo que gira lento y estrellas fugaces de vez en cuando
function Estrellas({ count = 220, fugaces = 3 }) {
  const estrellas = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(0, 100),
      y: random(0, 100),
      size: random(1.5, 4),
      duration: random(1.2, 3.5),
      delay: random(0, 3),
    })),
    [count]
  );
  const lluvia = useMemo(
    () => Array.from({ length: fugaces }, (_, i) => ({
      id: i,
      x: random(5, 60),
      y: random(0, 35),
      delay: random(0.5, 5),
      pausa: random(4, 9),
    })),
    [fugaces]
  );
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 30% 20%, #1e293b, #020617 70%)' }}>
      {/* El cielo es más grande que la sala para que al girar no se vean bordes */}
      <motion.div
        className="absolute -inset-1/4"
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
      >
        {estrellas.map((e) => (
          <motion.span
            key={e.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              width: e.size,
              height: e.size,
              boxShadow: e.size > 2.5 ? '0 0 6px 1px rgba(255,255,255,0.7)' : 'none',
            }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {lluvia.map((f) => (
        <motion.span
          key={`f${f.id}`}
          className="absolute h-[2px] w-32 rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            rotate: 30,
            transformOrigin: 'right center',
            background: 'linear-gradient(90deg, transparent, #fff)',
          }}
          animate={{ x: [0, 420], y: [0, 240], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, delay: f.delay, repeat: Infinity, repeatDelay: f.pausa, ease: 'easeIn' }}
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
    <div className="absolute inset-0" style={{ background: 'var(--fondo-ondas)' }}>
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
  // Si el usuario pidió "reducir movimiento" en su sistema, los fondos quedan quietos
  return (
    <MotionConfig reducedMotion="user">
      <Componente />
    </MotionConfig>
  );
}
