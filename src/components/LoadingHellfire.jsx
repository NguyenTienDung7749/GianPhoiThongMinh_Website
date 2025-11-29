// src/components/LoadingHellfire.jsx
export function LoadingHellfire() {
  return (
    <div className="loading-hellfire">
      {/* Volcanic Lava Background */}
      <div className="lava-bg" />
      
      <div className="relative z-10">
        {/* Fire Spinner */}
        <div className="fire-spinner">🔥</div>
        
        {/* Text */}
        <p className="text-lava-orange text-lg animate-glow mt-4">
          Đang tải...
        </p>
      </div>
    </div>
  );
}

export default LoadingHellfire;
