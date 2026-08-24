'use client';

import { motion } from 'framer-motion';

// Purely decorative network graphic — abstract "global" visual, not a
// representation of any real trade routes or logistics data.
const NODES = [
  { x: 120, y: 90 }, { x: 220, y: 60 }, { x: 300, y: 140 },
  { x: 180, y: 200 }, { x: 260, y: 240 }, { x: 340, y: 190 },
  { x: 90, y: 220 }, { x: 320, y: 80 },
];

const LINKS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 5], [3, 4], [4, 5], [0, 3], [1, 7], [6, 3], [2, 7],
];

export function HeroGlobe() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 400 320" className="h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="globe-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="210" cy="150" r="150" fill="url(#globe-glow)" />
        {/* latitude/longitude mesh */}
        {[60, 100, 140, 180, 220, 260].map((ry) => (
          <ellipse key={ry} cx="210" cy="150" rx="150" ry={ry} fill="none" stroke="#3b82f6" strokeOpacity="0.15" />
        ))}
        <ellipse cx="210" cy="150" rx="60" ry="150" fill="none" stroke="#3b82f6" strokeOpacity="0.15" />
        <ellipse cx="210" cy="150" rx="110" ry="150" fill="none" stroke="#3b82f6" strokeOpacity="0.15" />

        {LINKS.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#60a5fa"
            strokeWidth="1"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
          />
        ))}
        {NODES.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={4}
            fill="#3b82f6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </svg>
    </div>
  );
}
