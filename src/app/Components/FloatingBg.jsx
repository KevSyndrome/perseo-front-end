import { useMemo } from 'react';
import { motion } from 'framer-motion';

const palette = [
  '#60a5fa',
  '#34d399',
  '#f472b6',
  '#a78bfa',
  '#fbbf24',
  '#22d3ee',
  '#fb923c',
];

const shapes = ['circle', 'square', 'pill'];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Fondo "burbujas": figuras que flotan con recorrido amplio + burbujas pequeñas que suben
export default function FloatingBg({ count = 16, rising = 14 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(0, 90),
      y: random(0, 90),
      size: random(60, 170),
      color: pick(palette),
      shape: pick(shapes),
      // Recorrido en px: suficientemente amplio para que se note el movimiento
      dx: [random(-140, 140), random(-140, 140), random(-140, 140)],
      dy: [random(-120, 120), random(-120, 120), random(-120, 120)],
      duration: random(10, 18),
      delay: random(-10, 0),
      opacity: random(0.14, 0.26),
    }));
  }, [count]);

  const burbujas = useMemo(() => {
    return Array.from({ length: rising }, (_, i) => ({
      id: i,
      x: random(2, 96),
      size: random(10, 34),
      color: pick(palette),
      duration: random(9, 17),
      // Delay negativo: arrancan ya repartidas por la pantalla, no todas desde abajo
      delay: random(-17, 0),
      sway: random(15, 40),
    }));
  }, [rising]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            borderRadius:
              p.shape === 'circle'
                ? '50%'
                : p.shape === 'pill'
                ? '9999px'
                : '22px',
            filter: 'blur(2px)',
          }}
          animate={{
            x: [0, ...p.dx, 0],
            y: [0, ...p.dy, 0],
            scale: [1, 1.2, 0.85, 1.1, 1],
            rotate: [0, 25, -15, 20, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {burbujas.map((b) => (
        <motion.span
          key={`b${b.id}`}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            bottom: -40,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            border: `2px solid ${b.color}`,
            background: `radial-gradient(circle at 30% 30%, #ffffffcc, ${b.color}33)`,
          }}
          animate={{
            y: ['0vh', '-115vh'],
            x: [0, b.sway, -b.sway, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: b.delay,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 80%, rgba(96,165,250,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(52,211,153,0.06) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
