// src/components/LoadingHellfire.jsx
export function LoadingHellfire() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-hell-black">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-4 border-lava-red/30 animate-pulse"></div>
        
        {/* Inner spinning ring */}
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-lava-orange animate-spin"></div>
        
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-lava-red rounded-full animate-pulse-lava shadow-lava"></div>
        
        {/* Text */}
        <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-lava-orange text-sm animate-glow whitespace-nowrap">
          Đang tải...
        </p>
      </div>
    </div>
  );
}

export default LoadingHellfire;
