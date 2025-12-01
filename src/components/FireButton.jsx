// src/components/FireButton.jsx

export function FireButton({ children, onClick, disabled = false, variant = "primary", icon, loading = false, title }) {
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
    // Green button variant for "Thu Vào" (Retract) action
    success: `
      bg-gradient-to-r from-green-600 to-green-500
      hover:from-green-500 hover:to-green-400
      shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]
      text-white
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
      disabled={disabled || loading}
      title={title}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl
        font-semibold text-sm uppercase tracking-wider
        transition-all duration-300
        transform active:scale-95
        ${disabled || loading ? disabledClass : variants[variant]}
        flex items-center justify-center gap-2
        btn-molten btn-boil
      `}
    >
      {/* Fire glow effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
      )}
      
      {/* Molten glow overlay on hover */}
      {!disabled && !loading && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-radial from-lava-yellow/20 to-transparent animate-molten-glow"></div>
        </div>
      )}
      
      {loading ? (
        <>
          <span className="fire-loading-spinner text-lg">🔥</span>
          <span className="relative z-10">Đang xử lý...</span>
        </>
      ) : (
        <>
          {icon && <span className="text-lg">{icon}</span>}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </button>
  );
}

export default FireButton;
