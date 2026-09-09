"use client";

import React, { useState } from "react";

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function PetalBackground() {
  const [petals] = useState<Petal[]>(() => {
    // Generate initial set of petals
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: ((i * 5.5 + 3) % 94) + 3,
      size: 12 + (i % 5) * 2.5,
      duration: 10 + (i % 6) * 1.5,
      delay: (i * 0.7) % 6,
      opacity: 0.35 + (i % 4) * 0.1,
    }));
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-particle"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 0.75}px`,
            opacity: petal.opacity,
            animation: `floatPetal ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
