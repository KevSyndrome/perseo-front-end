import { motion } from 'framer-motion';
import { Grid3x3, List } from 'lucide-react';

export default function ViewToggle({ view, onChange }) {
  const options = [
    { label: 'Mosaico', value: 'grid', icon: Grid3x3 },
    { label: 'Lista', value: 'list', icon: List },
  ];

  const activeIndex = options.findIndex((o) => o.value === view);

  return (
    <div className="flex rounded-lg border border-slate-200 bg-white p-1">
      {options.map((option, index) => {
        const Icon = option.icon;
        const isActive = index === activeIndex;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {isActive && (
              <motion.div
                layoutId="viewToggleBg"
                className="absolute inset-0 rounded-md bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={16} className="relative z-10" />
            <span className="relative z-10 hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
