export default function ToggleGroup({ options, value, onChange, disabled = false }) {
  return (
    <div className="flex w-full rounded-xl bg-slate-100 p-1.5">
      {options.map((option, index) => {
        const isDisabled = disabled || option.disabled;
        
        return (
          <button
            key={option.value}
            onClick={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            className={`
              flex-1 
              py-5
              text-base 
              font-semibold
              transition-all 
              duration-200
              
              ${index === 0 ? "rounded-l-lg" : ""}
              ${index === options.length - 1 ? "rounded-r-lg" : ""}
              ${index !== 0 && index !== options.length - 1 ? "rounded-none" : ""}
              
              ${!isDisabled ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
              
              // Usando tus colores personalizados
              ${!isDisabled 
                ? (value === option.value
                    ? "bg-primary text-white shadow-md z-10"
                    : "bg-tertiary-disabled text-white/80 hover:bg-tertiary-hover hover:text-white")
                : (value === option.value
                    ? "bg-primary-disabled text-gray-600"     // Activo deshabilitado
                    : "bg-tertiary-disabled text-gray-600"    // Inactivo deshabilitado
                  )
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}