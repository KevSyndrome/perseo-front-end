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

export default function FloatingBg({ count = 18 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(5, 95),
      y: random(5, 95),
      size: random(60, 180),
      color: palette[Math.floor(Math.random() * palette.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      duration: random(18, 35),
      delay: random(0, 10),
      opacity: random(0.08, 0.18),
    }));
  }, [count]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
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
                : '16px',
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -40, 20, -30, 0],
            x: [0, 25, -15, 20, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
            rotate: [0, 10, -5, 8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
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
