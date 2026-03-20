"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

/* ─── State type driven by parent or global audio/speech state ─── */
export type AvatarState = "idle" | "listening" | "thinking" | "speaking";

interface AvatarProps {
  /** Current AI state — drives visual feedback animations */
  state?: AvatarState;
}

export default function Avatar({ state = "idle" }: AvatarProps) {
  /* ─── Mouse-follow parallax ─── */
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Normalize to -1..1 range, then scale for subtle movement
    const x = ((e.clientX - cx) / cx) * 8;   // max ±8px
    const y = ((e.clientY - cy) / cy) * 6;   // max ±6px
    setOffset({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  /* ─── Derive CSS class based on state ─── */
  const stateClass =
    state === "listening"
      ? "avatar-listening"
      : state === "thinking"
        ? "avatar-thinking"
        : state === "speaking"
          ? "avatar-speaking"
          : "avatar-idle";

  return (
    <div className={`avatar-container ${stateClass}`}>
      {/* Ambient glow ring (behind image) */}
      <div className="avatar-glow" />

      {/* Outer ring indicator */}
      <div className="avatar-ring" />

      {/* The avatar image */}
      <div
        className="avatar-image-wrapper"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <Image
          src="/regen-eliza-final.png"
          alt="Regen Eliza — Autonomous ERC-8004 Agent"
          width={600}
          height={600}
          priority
          className="avatar-image"
          draggable={false}
        />
      </div>

      {/* Floating particles (pure CSS) */}
      <div className="avatar-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="particle" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>

      {/* State indicator badge */}
      <div className="avatar-state-badge">
        <span className="avatar-state-dot" />
        <span className="avatar-state-label">
          {state === "idle" && "STANDBY"}
          {state === "listening" && "LISTENING"}
          {state === "thinking" && "PROCESSING"}
          {state === "speaking" && "TRANSMITTING"}
        </span>
      </div>

      {/* ─── Scoped styles ─── */}
      <style jsx>{`
        .avatar-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(ellipse at center, rgba(6, 64, 6, 0.08) 0%, transparent 70%);
        }

        /* ── Ambient glow ── */
        .avatar-glow {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107, 163, 104, 0.15) 0%, transparent 70%);
          filter: blur(40px);
          transition: all 0.6s ease;
          z-index: 0;
        }
        .avatar-listening .avatar-glow {
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(107, 163, 104, 0.25) 0%, transparent 70%);
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .avatar-thinking .avatar-glow {
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(107, 163, 104, 0.2) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%);
          animation: glow-think 1.5s ease-in-out infinite;
        }
        .avatar-speaking .avatar-glow {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(107, 163, 104, 0.3) 0%, transparent 60%);
          animation: glow-speak 0.8s ease-in-out infinite;
        }

        /* ── Ring indicator ── */
        .avatar-ring {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(107, 163, 104, 0.15);
          transition: all 0.5s ease;
          z-index: 1;
        }
        .avatar-listening .avatar-ring {
          border-color: rgba(107, 163, 104, 0.4);
          animation: ring-pulse 2s ease-in-out infinite;
        }
        .avatar-thinking .avatar-ring {
          border-color: rgba(107, 163, 104, 0.3);
          animation: ring-spin 3s linear infinite;
          border-style: dashed;
        }
        .avatar-speaking .avatar-ring {
          border-color: rgba(107, 163, 104, 0.5);
          box-shadow: 0 0 20px rgba(107, 163, 104, 0.15);
          animation: ring-speak 0.8s ease-in-out infinite;
        }

        /* ── Image wrapper (parallax target) ── */
        .avatar-image-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease-out;
          will-change: transform;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 12px;
          border: 1px solid rgba(107, 163, 104, 0.15);
          box-shadow:
            0 0 30px rgba(107, 163, 104, 0.1),
            0 0 60px rgba(0, 0, 0, 0.4);
          transition: all 0.5s ease;
          user-select: none;
          filter: grayscale(0.15) contrast(1.1) brightness(0.9);
        }
        .avatar-idle .avatar-image {
          animation: idle-breathe 4s ease-in-out infinite;
        }
        .avatar-listening .avatar-image {
          border-color: rgba(107, 163, 104, 0.5);
          box-shadow:
            0 0 30px rgba(107, 163, 104, 0.2),
            0 0 60px rgba(107, 163, 104, 0.1);
          filter: grayscale(0) contrast(1.15) brightness(0.95);
        }
        .avatar-thinking .avatar-image {
          border-color: rgba(107, 163, 104, 0.4);
          animation: think-pulse 1.5s ease-in-out infinite;
          filter: grayscale(0.05) contrast(1.1) brightness(0.85) hue-rotate(5deg);
        }
        .avatar-speaking .avatar-image {
          border-color: rgba(107, 163, 104, 0.6);
          box-shadow:
            0 0 40px rgba(107, 163, 104, 0.25),
            0 0 80px rgba(107, 163, 104, 0.1);
          filter: grayscale(0) contrast(1.2) brightness(1);
          animation: speak-glow 0.8s ease-in-out infinite;
        }

        /* ── Floating particles ── */
        .avatar-particles {
          position: absolute;
          width: 400px;
          height: 400px;
          z-index: 1;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(107, 163, 104, 0.4);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          animation: float-particle 6s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.5s);
          opacity: 0;
        }
        .avatar-idle .particle { opacity: 0.3; }
        .avatar-listening .particle,
        .avatar-thinking .particle,
        .avatar-speaking .particle {
          opacity: 0.7;
          background: rgba(107, 163, 104, 0.6);
        }

        /* ── State badge ── */
        .avatar-state-badge {
          position: absolute;
          bottom: 12%;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(107, 163, 104, 0.2);
          border-radius: 20px;
          z-index: 3;
          backdrop-filter: blur(8px);
        }
        .avatar-state-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6ba368;
          animation: dot-blink 2s ease-in-out infinite;
        }
        .avatar-listening .avatar-state-dot {
          background: #ef4444;
          animation: dot-blink 0.8s ease-in-out infinite;
        }
        .avatar-thinking .avatar-state-dot {
          background: #f59e0b;
          animation: dot-blink 0.5s ease-in-out infinite;
        }
        .avatar-speaking .avatar-state-dot {
          background: #6ba368;
          animation: dot-blink 0.4s ease-in-out infinite;
        }
        .avatar-state-label {
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(107, 163, 104, 0.7);
          text-transform: uppercase;
        }

        /* ─── Keyframes ─── */
        @keyframes idle-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes glow-think {
          0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.9; transform: scale(1.05) rotate(3deg); }
        }
        @keyframes glow-speak {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ring-speak {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes think-pulse {
          0%, 100% { transform: scale(1); filter: brightness(0.85); }
          50% { transform: scale(1.02); filter: brightness(1); }
        }
        @keyframes speak-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(107, 163, 104, 0.25), 0 0 80px rgba(107, 163, 104, 0.1); }
          50% { box-shadow: 0 0 50px rgba(107, 163, 104, 0.35), 0 0 100px rgba(107, 163, 104, 0.15); }
        }
        @keyframes float-particle {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
            transform: translate(
              calc(cos(var(--i) * 30deg) * 120px),
              calc(sin(var(--i) * 30deg) * -80px)
            ) scale(1);
          }
          80% {
            opacity: 0.3;
            transform: translate(
              calc(cos(var(--i) * 30deg) * 180px),
              calc(sin(var(--i) * 30deg) * -160px)
            ) scale(0.6);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(cos(var(--i) * 30deg) * 200px),
              calc(sin(var(--i) * 30deg) * -200px)
            ) scale(0);
          }
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
