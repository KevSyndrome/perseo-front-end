import { forwardRef } from 'react';

const Input = forwardRef(({ label, icon, ...props }, ref) => (
  <div className="flex w-full flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        {...props}
        className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${icon ? 'pl-10' : ''} ${props.className || ''}`}
      />
    </div>
  </div>
));

export default Input;
