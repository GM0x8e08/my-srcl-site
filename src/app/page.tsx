"use client";

import { useEffect, useState } from "react";

// Helper to generate a grid for 81/86 in binary art
const binaryLogo = [
  "000110000  000110000",
  "001001000  001001000",
  "010000100  010000100",
  "010000100  010000100",
  "010000100  010000100",
  "010000100  010000100",
  "001001000  001001000",
  "000110000  000110000",
  "",
  "000110000  000110000",
  "001001000  001001000",
  "010000100  010000100",
  "010000100  010000100",
  "010000100  010000100",
  "001001000  001001000",
  "000110000  000110000",
];

function getShapeMask(shape: string, size: number) {
  // Returns a 2D array of 1/0 for the given shape and size
  const mask = [];
  const center = (size - 1) / 2;
  for (let y = 0; y < size; y++) {
    let row = [];
    for (let x = 0; x < size; x++) {
      if (shape === "square") {
        row.push(1);
      } else if (shape === "circle") {
        const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
        row.push(dist < size / 2.1 ? 1 : 0);
      } else if (shape === "triangle") {
        row.push(y > x ? 1 : 0);
      } else {
        row.push(0);
      }
    }
    mask.push(row);
  }
  return mask;
}

function BinaryMorphingShapes({ size = 24 }) {
  const [phase, setPhase] = useState(0);
  const shapes = ["square", "circle", "triangle"];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => p + 1);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Morph between shapes
  const shapeIdx = Math.floor(phase / 40) % shapes.length;
  const nextShapeIdx = (shapeIdx + 1) % shapes.length;
  const t = (phase % 40) / 40;
  const maskA = getShapeMask(shapes[shapeIdx], size);
  const maskB = getShapeMask(shapes[nextShapeIdx], size);

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, width: '100vw', height: '100vh', opacity: 0.13 }}>
        {Array.from({ length: size * size }).map((_, idx) => {
          const x = idx % size;
          const y = Math.floor(idx / size);
          // Morph value between two shapes
          const morph = maskA[y][x] * (1 - t) + maskB[y][x] * t;
          // Flicker some digits
          const flicker = Math.random() > 0.995;
          return (
            <span
              key={idx}
              className={`text-[0.9vw] md:text-[0.6vw] font-mono ${flicker ? 'text-green-400 animate-pulse' : 'text-white'}`}
              style={{
                opacity: morph > 0.5 ? (flicker ? 0.7 : 1) : 0.05,
                transition: 'opacity 0.2s',
                letterSpacing: '0.05em',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {Math.random() > 0.5 ? '0' : '1'}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function FlickerBinaryLogo() {
  const [flicker, setFlicker] = useState(
    () => binaryLogo.map(row => row.split("").map(() => false))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(
        binaryLogo.map(row =>
          row.split("").map(() => Math.random() > 0.95)
        )
      );
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <pre
      className="font-mono text-[2.2vw] md:text-[1.5vw] leading-[1.1] text-center text-white/90 select-none drop-shadow-lg"
      style={{ letterSpacing: '0.2em', fontWeight: 700 }}
    >
      {binaryLogo.map((row, i) => (
        <span key={i}>
          {row.split("").map((char, j) =>
            char === " " ? (
              <span key={j}>&nbsp;</span>
            ) : (
              <span
                key={j}
                className={
                  flicker[i][j]
                    ? "text-green-400 animate-pulse"
                    : ""
                }
              >
                {char}
              </span>
            )
          )}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-0 relative overflow-hidden">
      <BinaryMorphingShapes />
      <main className="flex-1 flex flex-col items-center justify-center z-10 relative">
        {/* Binary logo */}
        <FlickerBinaryLogo />
        <div className="mt-8 text-center">
          <span className="text-3xl md:text-5xl font-mono tracking-widest text-white/80">CAPITAL</span>
        </div>
      </main>
      <footer className="text-center text-gray-500 text-sm font-mono relative z-10 bg-black/80 pt-4 pb-2 mb-4">
        ©2020 - 2025 • 8186 Capital. All Rights Reserved. 
      </footer>
    </div>
  );
}
