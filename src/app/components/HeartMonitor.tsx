import { motion } from 'motion/react';

export function HeartMonitor() {
  // ECG heartbeat pattern coordinates
  const createHeartbeatPath = (offsetX: number = 0) => {
    const points = [
      { x: 0, y: 50 },      // baseline
      { x: 10, y: 50 },     // baseline
      { x: 15, y: 50 },     // start P wave
      { x: 18, y: 45 },     // P wave peak
      { x: 21, y: 50 },     // end P wave
      { x: 28, y: 50 },     // baseline
      { x: 30, y: 52 },     // Q wave
      { x: 32, y: 20 },     // R wave (sharp peak)
      { x: 34, y: 55 },     // S wave
      { x: 36, y: 50 },     // back to baseline
      { x: 42, y: 50 },     // baseline
      { x: 45, y: 48 },     // T wave start
      { x: 50, y: 45 },     // T wave peak
      { x: 55, y: 48 },     // T wave end
      { x: 60, y: 50 },     // baseline
      { x: 100, y: 50 },    // long baseline
    ];

    return points.map(p => `${p.x + offsetX},${p.y}`).join(' ');
  };

  // Create multiple heartbeat patterns across the screen
  const patterns = Array.from({ length: 20 }, (_, i) => i * 100);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <svg className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(20, 184, 166, 0.1)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#grid)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="rgba(20, 184, 166, 0.2)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#grid-major)" />

        {/* Animated heartbeat lines */}
        {[0, 1, 2].map((row) => (
          <g key={row} transform={`translate(0, ${row * 200 + 100})`}>
            {patterns.map((offset, i) => (
              <motion.polyline
                key={i}
                points={createHeartbeatPath(offset)}
                fill="none"
                stroke="rgba(20, 184, 166, 0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ x: 0 }}
                animate={{ x: [-2000, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </g>
        ))}

        {/* Glow effect on the lines */}
        {[0, 1, 2].map((row) => (
          <g key={`glow-${row}`} transform={`translate(0, ${row * 200 + 100})`}>
            {patterns.slice(0, 3).map((offset, i) => (
              <motion.polyline
                key={i}
                points={createHeartbeatPath(offset)}
                fill="none"
                stroke="rgba(20, 184, 166, 0.4)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="blur(4px)"
                initial={{ x: 0 }}
                animate={{ x: [-2000, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Corner labels like a real monitor */}
      <div className="absolute top-4 left-4 text-teal-500 text-xs font-mono opacity-40">
        <div>HR: 72 bpm</div>
        <div className="mt-1">Dr. Spill Monitor</div>
      </div>
      
      <div className="absolute top-4 right-4 text-teal-500 text-xs font-mono opacity-40">
        <div>BP: 120/80</div>
        <div className="mt-1">Active</div>
      </div>

      {/* Pulsing indicator */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-teal-500 text-xs font-mono opacity-40"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <div className="w-2 h-2 bg-teal-500 rounded-full" />
        <span>MONITORING</span>
      </motion.div>
    </div>
  );
}
