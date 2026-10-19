import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { SlideDef, useSteps } from "../deck/steps";
import { Backdrop, WindowFrame } from "../deck/ui";
import { clamp01, useClock } from "./common";
import { GridFloor, rnd, Rocket, SynthSun, Win } from "./retro";

const HORIZON = 650;
const VX = 960;
const VY = 520;
const THANKS = ["Дякую", "за увагу!"];

const Mountains: React.FC<{ p: number }> = ({ p }) => {
  const left = [
    [46, HORIZON],
    [150, 590],
    [250, 625],
    [380, 520],
    [520, 600],
    [640, 560],
    [760, HORIZON],
  ];
  const right = left.map(([x, y]) => [1920 - x, y]);
  const path = (pts: number[][]) => `M ${pts.map(([x, y]) => `${x},${y}`).join(" L ")} Z`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
      {[left, right].map((pts, i) => (
        <g key={i}>
          <path d={path(pts)} fill="#1d1b12" stroke={C.pink} strokeWidth={2.5} strokeLinejoin="round" />
          {pts.slice(1, -1).map(([x, y], k) => (
            <line key={k} x1={x} y1={y} x2={x + (i === 0 ? 30 : -30)} y2={HORIZON} stroke={C.pink} strokeWidth={1.2} opacity={0.5} />
          ))}
        </g>
      ))}
    </svg>
  );
};

const Warp: React.FC<{ t: number; p: number }> = ({ t, p }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
    <defs>
      <clipPath id="sky">
        <rect x={46} y={68} width={1828} height={HORIZON - 68} />
      </clipPath>
    </defs>
    <g clipPath="url(#sky)">
      {Array.from({ length: 140 }, (_, i) => {
        const ang = rnd(i) * Math.PI * 2;
        const speed = 0.12 + rnd(i + 300) * 0.25;
        const u = (t * speed + rnd(i + 600)) % 1;
        const r = u * u * 1300;
        const r0 = r * 0.82;
        const x1 = VX + Math.cos(ang) * r0;
        const y1 = VY + Math.sin(ang) * r0 * 0.62;
        const x2 = VX + Math.cos(ang) * r;
        const y2 = VY + Math.sin(ang) * r * 0.62;
        const col = [C.cream, C.lav, C.pink][i % 3];
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={0.6 + u * 2.4} opacity={0.15 + 0.7 * u} strokeLinecap="round" />;
      })}
    </g>
  </svg>
);

const Outro: React.FC = () => {
  const { s, frame: f, fps } = useSteps();
  const clock = useClock();
  const t = Math.max(f / fps, clock);
  const scene = s(0, 6);
  const credit = s(0, 100);
  const sweep = interpolate(f, [110, 160], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const launch = (t % 5.2) / 5.2;
  const ry = interpolate(launch, [0, 1], [HORIZON + 60, -260]);
  const rx = VX + Math.sin(launch * Math.PI * 2) * 40;

  const typed = Math.floor(Math.max(0, f - 20) / 3);
  let used = 0;

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Backdrop />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, rgba(154,68,150,0.28) 0%, rgba(41,38,26,0) 60%)`, opacity: scene }} />
      <Warp t={t} p={scene} />
      <SynthSun cx={VX} cy={HORIZON} r={250} p={s(0, 10)} t={t} id="osun" />
      <Mountains p={s(0, 24)} />
      <GridFloor y0={HORIZON} t={t * 2.2} p={scene} vx={VX} />
      {launch > 0.02 && launch < 0.98 && (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            {Array.from({ length: 14 }, (_, k) => {
              const l2 = launch - k * 0.012;
              if (l2 <= 0) {
                return null;
              }
              const yy = interpolate(l2, [0, 1], [HORIZON + 60, -260]) + 70;
              const xx = VX + Math.sin(l2 * Math.PI * 2) * 40;
              return <circle key={k} cx={xx + (rnd(k + f) - 0.5) * 10} cy={yy} r={10 - k * 0.6} fill={k % 2 ? C.amber : C.pink} opacity={0.6 - k * 0.04} />;
            })}
          </svg>
          <Rocket x={rx} y={ry} s={0.7} flame={0.5 + 0.5 * Math.sin(f * 0.9)} />
        </>
      )}
      <div style={{ position: "absolute", left: 0, top: 150, width: 1920, textAlign: "center", fontFamily: F.pixel, fontSize: 76, lineHeight: 1.45, color: C.pink, textShadow: `0 0 24px rgba(246,115,169,0.65), 4px 4px 0 #14120a` }}>
        {THANKS.map((line, li) => {
          const start = used;
          used += line.length;
          const vis = Math.max(0, Math.min(line.length, typed - start));
          return (
            <div key={li}>
              {line.slice(0, vis)}
              <span style={{ opacity: 0 }}>{line.slice(vis)}</span>
            </div>
          );
        })}
      </div>
      <Win x={96} y={790} w={600} h={180} title="swipl" titleColor={C.lav} p={s(0, 60)} pad="10px 22px">
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.text, lineHeight: 1.5 }}>
          {"?- дякую(всім).".slice(0, Math.max(0, Math.floor((f - 70) / 2)))}
        </div>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.mint, opacity: f > 110 ? 1 : 0 }}>true.</div>
      </Win>
      <div style={{ position: "absolute", right: 96, top: 940, opacity: credit, transform: `translateY(${(1 - credit) * 16}px)` }}>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 2,
            backgroundImage: `linear-gradient(100deg, ${C.dim} 0%, ${C.dim} ${sweep - 12}%, #ffffff ${sweep}%, ${C.dim} ${sweep + 12}%, ${C.dim} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          made with Claude Opus 5.5
        </span>
      </div>
      <WindowFrame title={false} />
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [300], C: Outro };
