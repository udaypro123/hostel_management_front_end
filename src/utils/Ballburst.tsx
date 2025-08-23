import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import { motion, useAnimationControls } from "framer-motion";

/**
 * BallBurst
 * 5 colored balls emerge from bottom-right, spread across the page in ~1.5s,
 * emitting a soft, color-matched smoke trail. Auto plays on mount.
 *
 * Requirements: @mui/material, framer-motion, React + TS.
 */
export default function BallBurst() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  // Pick 5 pleasing colors
  const colors = useMemo(
    () => ["#fd0000ff", "#0a70ffff", "#00ff22ff", "#ffcc00ff", "#880affff"],
    []
  );

  useEffect(() => {
    // Auto-start once mounted
    const id = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {/* Anchor at bottom-right so x/y travel is left/up (negative) */}
      <Box
        sx={{ position: "absolute", bottom: 16, right: 16, width: 0, height: 0 }}
      >
        {colors.map((c, i) => (
          <BallWithSmoke
            key={c}
            color={c}
            delay={i * 0.08}
            duration={1.6}
            started={started}
            containerRef={containerRef}
          />
        ))}
      </Box>
    </Box>
  );
}

// --- Ball with smoke component ---

type BallProps = {
  color: string;
  delay?: number;
  duration?: number;
  started: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const BallWithSmoke: React.FC<BallProps> = ({
  color,
  delay = 0,
  duration = 1.6,
  started,
}) => {
  const controls = useAnimationControls();
  const [hidden, setHidden] = useState(false);

  // Smoke puffs state
  type Puff = { id: number; x: number; y: number };
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const puffId = useRef(0);
  const lastPuffTime = useRef<number>(0);

  // Random target spread across the viewport (travel left/up from anchor)
  const target = useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1500;
    const vh = typeof window !== "undefined" ? window.innerHeight : 1500;

    // Travel roughly 40%–85% of width and 35%–80% of height
    const dx = -randBetween(vw * 0.4, vw * 0.85);
    const dy = -randBetween(vh * 0.35, vh * 0.8);
    return { dx, dy };
  }, []);

  // Kick off the animation
  useEffect(() => {
    if (!started) return;

    const run = async () => {
      await new Promise((r) => setTimeout(r, delay * 1000));
      controls.start({
        x: [0, target.dx],
        y: [0, target.dy],
        scale: [0.65, 1.2, 1],
        opacity: [1, 1, 0.9],
        transition: {
          duration,
          ease: [0.17, 0.67, 0.22, 0.98], // smooth easeOut
        },
      });

      // After animation, fade the whole ball quickly and stop spawning
      setTimeout(() => setHidden(true), duration * 1000);
    };

    run();
  }, [controls, delay, duration, started, target.dx, target.dy]);

  // Emit smoke puffs while animating
  useEffect(() => {
    if (!started) return;

    let raf = 0;
    const tick = (t: number) => {
      if (!lastPuffTime.current) lastPuffTime.current = t;
      const elapsed = t - lastPuffTime.current;

      // Spawn a puff roughly every 55ms during the travel
      if (elapsed > 55 && !hidden) {
        lastPuffTime.current = t;
        // Read current transform from the motion style (via computed transform matrix)
        // We rely on the element ref for precise position
        const el = ballRef.current;
        const anchor = anchorRef.current;
        if (el && anchor) {
          const rect = el.getBoundingClientRect();
          setPuffs((old) => [
            ...old,
            { id: puffId.current++, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
          ]);
        }
      }
      if (!hidden) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, hidden]);

  const ballRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {/* Smoke canvas layer (DOM-based puffs) */}
      <div
        ref={anchorRef}
        style={{ position: "absolute", inset: 0 }}
      />
      {puffs.map((p) => (
        <SmokePuff key={p.id} x={p.x} y={p.y} color={color} onDone={() => {
          setPuffs((old) => old.filter((x) => x.id !== p.id));
        }} />
      ))}

      {/* The ball */}
      {!hidden && (
        <motion.div
          ref={ballRef}
          animate={controls}
          initial={{ x: 0, y: 0, scale: 0.65, opacity: 1 }}
          style={{
            position: "absolute",
            width: 22,
            height: 22,
            borderRadius: 999,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 1), ${color})`,
            boxShadow: `0 0 14px 4px ${hexToRgba(color, 0.45)}, 0 0 40px 8px ${hexToRgba(
              color,
              0.15
            )}`,
            filter: "saturate(1.1)",
          }}
        />
      )}
    </>
  );
};

// --- Smoke Puff (DOM element with fade + blur) ---

function SmokePuff({
  x,
  y,
  color,
  onDone,
}: {
  x: number;
  y: number;
  color: string;
  onDone: () => void;
}) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      setGone(true);
      setTimeout(onDone, 220); // cleanup after fade
    }, 420);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
        borderRadius: 999,
        background: `radial-gradient(circle at 30% 30%, ${hexToRgba(color, 0.25)}, ${hexToRgba(
          color,
          0.05
        )})`,
        filter: "blur(6px)",
        opacity: gone ? 0 : 0.7,
        transform: `scale(${gone ? 1.6 : 1})`,
        transition: "opacity 220ms ease, transform 350ms ease",
        pointerEvents: "none",
      }}
    />
  );
}

// --- utils ---
function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function hexToRgba(hex: string, alpha = 1) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!res) return hex;
  const r = parseInt(res[1], 16);
  const g = parseInt(res[2], 16);
  const b = parseInt(res[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
