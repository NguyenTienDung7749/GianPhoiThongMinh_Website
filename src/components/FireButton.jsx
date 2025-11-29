// src/components/FireButton.jsx

export function FireButton({ children, onClick, disabled = false, variant = "primary", icon }) {
  const variants = {
    primary: `
      bg-gradient-to-r from-lava-red to-lava-orange
      hover:from-lava-orange hover:to-lava-yellow
      shadow-lava hover:shadow-fire
      text-white
    `,
    secondary: `
      bg-gradient-to-r from-hell-blood to-hell-black
      hover:from-lava-red/20 hover:to-hell-blood
      border-2 border-lava-red/50
      hover:border-lava-orange
      text-lava-orange hover:text-lava-yellow
    `,
    danger: `
      bg-gradient-to-r from-red-900 to-red-700
      hover:from-red-700 hover:to-red-500
      shadow-lava
      text-white
    `,
    mode: `
      bg-gradient-to-r from-lava-yellow/80 to-lava-orange
      hover:from-lava-yellow hover:to-lava-red
      shadow-fire
      text-hell-black font-bold
    `,
  };

  const disabledClass = `
    bg-gray-800 text-gray-500
    cursor-not-allowed opacity-50
    border-gray-700
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl
        font-semibold text-sm uppercase tracking-wider
        transition-all duration-300
        transform active:scale-95
        ${disabled ? disabledClass : variants[variant]}
        flex items-center justify-center gap-2
      `}
    >
      {/* Fire glow effect */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
      )}
      
      {icon && <span className="text-lg">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default FireButton;
