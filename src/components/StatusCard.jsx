// src/components/StatusCard.jsx

export function StatusCard({ icon, label, value, unit, variant = "default" }) {
  const variants = {
    default: "from-lava-red/20 to-hell-blood border-lava-red/40",
    warning: "from-lava-orange/20 to-hell-blood border-lava-orange/40",
    success: "from-lava-yellow/20 to-hell-blood border-lava-yellow/40",
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-5
        bg-gradient-to-br ${variants[variant]}
        border-2 shadow-lava
        transition-all duration-300
        hover:shadow-fire hover:scale-[1.02]
        animate-pulse-lava
        card-ember-glow lava-transition
      `}
    >
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lava-red/5 to-transparent opacity-50"></div>
      
      {/* Ember particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ember-particle" style={{ top: '80%' }}></div>
        <div className="ember-particle" style={{ top: '70%' }}></div>
        <div className="ember-particle" style={{ top: '85%' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl animate-ember-float">{icon}</span>
          <span className="text-lava-orange/80 text-sm font-medium uppercase tracking-wider">
            {label}
          </span>
        </div>
        
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-lava-yellow animate-glow">
            {value}
          </span>
          {unit && (
            <span className="text-lava-orange/60 text-lg">{unit}</span>
          )}
        </div>
      </div>

      {/* Lava crack effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lava-red to-transparent opacity-50"></div>
      
      {/* Enhanced bottom glow */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-2 bg-gradient-to-t from-lava-orange/30 to-transparent blur-sm"></div>
    </div>
  );
}

export default StatusCard;
