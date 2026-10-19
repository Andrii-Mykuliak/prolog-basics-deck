import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { SlideDef, useSteps } from "../deck/steps";
import { Backdrop, WindowFrame } from "../deck/ui";
import { clamp01, useClock } from "./common";
import { GridFloor, Stars, SynthSun, Win } from "./retro";

const HORIZON = 650;
const VX = 960;
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

/* Knowledge constellations: facts are stars joined by lines; a query comet searches them, backtracks from dead ends and lights the answer. */
type Star = { x: number; y: number; name: string };
type Cluster = {
  stars: Star[];
  edges: [number, number][];
  path: { n: number; fail?: boolean }[];
  answer: number;
  query: string;
  result: string;
  qx: number;
  color: string;
};

const CLUSTERS: Cluster[] = [
  {
    stars: [
      { x: 200, y: 380, name: "іван" },
      { x: 390, y: 440, name: "петро" },
      { x: 590, y: 390, name: "анна" },
      { x: 280, y: 520, name: "марія" },
      { x: 500, y: 540, name: "олег" },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
    ],
    path: [{ n: 0 }, { n: 3 }, { n: 4, fail: true }, { n: 3 }, { n: 0 }, { n: 1 }, { n: 2 }],
    answer: 0,
    query: "?- дід(X, анна).",
    result: "X = іван",
    qx: 110,
    color: C.lav,
  },
  {
    stars: [
      { x: 1360, y: 380, name: "олена" },
      { x: 1560, y: 450, name: "іван" },
      { x: 1760, y: 380, name: "сергій" },
      { x: 1730, y: 540, name: "олег" },
      { x: 1430, y: 540, name: "петро" },
    ],
    edges: [
      [0, 1],
      [2, 0],
      [1, 3],
      [4, 2],
    ],
    path: [{ n: 1 }, { n: 3, fail: true }, { n: 1 }, { n: 0 }],
    answer: 0,
    query: "?- друг(X, іван).",
    result: "X = олена",
    qx: 1330,
    color: C.pink,
  },
];
const SEG = 0.55;
const LEAD_IN = 0.9;
const FLARE = 2.2;
const cycleOf = (c: Cluster) => LEAD_IN + (c.path.length - 1) * SEG + FLARE + 0.6;
const LOOP = CLUSTERS.reduce((a, c) => a + cycleOf(c), 0);

const pointOn = (c: Cluster, u: number) => {
  const k = Math.max(0, Math.min(c.path.length - 2, Math.floor(u)));
  const f = Math.max(0, Math.min(1, u - k));
  const e = f * f * (3 - 2 * f);
  const a = c.stars[c.path[k].n];
  const b = c.stars[c.path[k + 1].n];
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
};

const Constellations: React.FC<{ t: number; p: number }> = ({ t, p }) => {
  const loopT = t % LOOP;
  let acc = 0;
  let active = 0;
  for (let i = 0; i < CLUSTERS.length; i++) {
    if (loopT < acc + cycleOf(CLUSTERS[i])) {
      active = i;
      break;
    }
    acc += cycleOf(CLUSTERS[i]);
  }
  const local = loopT - acc;
  const svg: React.ReactNode[] = [];
  const html: React.ReactNode[] = [];
  CLUSTERS.forEach((c, ci) => {
    const on = ci === active;
    const lead = on ? clamp01(local / LEAD_IN) : 0;
    const travel = on ? Math.max(0, (local - LEAD_IN) / SEG) : -1;
    const travelDone = on && travel >= c.path.length - 1;
    const flareT = on ? local - LEAD_IN - (c.path.length - 1) * SEG : -1;
    const fadeOut = on ? clamp01((cycleOf(c) - local) / 0.6) : 0;
    const hl = lead * fadeOut;
    const visited = new Set<number>();
    const failed = new Set<number>();
    if (on) {
      c.path.forEach((st, k) => {
        if (travel >= k) {
          visited.add(st.n);
          if (st.fail) {
            failed.add(st.n);
          }
        }
      });
    }
    c.edges.forEach(([a, b], i) => {
      const A = c.stars[a];
      const B = c.stars[b];
      const lit = on && visited.has(a) && visited.has(b);
      const bad = lit && (failed.has(a) || failed.has(b));
      const col = bad ? C.red : lit ? c.color : C.cream;
      svg.push(<line key={`eg${ci}-${i}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={col} strokeWidth={10} opacity={(lit ? 0.18 : 0.04) * (lit ? hl : 1)} strokeLinecap="round" />);
      svg.push(<line key={`e${ci}-${i}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={col} strokeWidth={2.2} opacity={lit ? 0.95 * hl : 0.28} strokeDasharray={lit ? undefined : "3 7"} />);
    });
    c.stars.forEach((st, i) => {
      const tw = 0.6 + 0.4 * Math.sin(t * 2.2 + i * 1.7 + ci * 3);
      const isAns = i === c.answer;
      const flare = on && travelDone && isAns ? clamp01(flareT / 0.4) * fadeOut : 0;
      const bad = failed.has(i) && on;
      const col = bad ? C.red : visited.has(i) && on ? c.color : C.cream;
      const r = 6 + 2.5 * tw + 10 * flare;
      svg.push(
        <g key={`s${ci}-${i}`}>
          <circle cx={st.x} cy={st.y} r={r * 3.2} fill={col} opacity={0.08 + 0.12 * tw + 0.3 * flare} />
          <path d={`M ${st.x - r * 2.6} ${st.y} L ${st.x + r * 2.6} ${st.y} M ${st.x} ${st.y - r * 2.6} L ${st.x} ${st.y + r * 2.6}`} stroke={col} strokeWidth={1.4} opacity={0.5 + 0.5 * flare} />
          <circle cx={st.x} cy={st.y} r={r} fill={col} />
          <circle cx={st.x} cy={st.y} r={r * 0.45} fill="#ffffff" opacity={0.9} />
        </g>,
      );
      if (flare > 0 && flareT < 1.4) {
        const q = clamp01(flareT / 1.4);
        svg.push(<circle key={`ring${ci}-${i}`} cx={st.x} cy={st.y} r={20 + 120 * q} fill="none" stroke={c.color} strokeWidth={4 * (1 - q)} opacity={1 - q} />);
        for (let j = 0; j < 16; j++) {
          const ang = (j / 16) * Math.PI * 2;
          const d = 20 + 110 * (1 - (1 - q) * (1 - q));
          svg.push(<circle key={`sp${ci}-${i}-${j}`} cx={st.x + Math.cos(ang) * d} cy={st.y + Math.sin(ang) * d} r={3 * (1 - q) + 0.5} fill={j % 2 ? c.color : "#ffffff"} opacity={1 - q} />);
        }
      }
      html.push(
        <div
          key={`n${ci}-${i}`}
          style={{
            position: "absolute",
            left: st.x - 80,
            top: st.y + 18,
            width: 160,
            textAlign: "center",
            fontFamily: F.body,
            fontWeight: 700,
            fontSize: 27,
            color: flare > 0.3 ? c.color : bad ? C.red : C.cream,
            textShadow: flare > 0.3 ? `0 0 14px ${c.color}` : undefined,
          }}
        >
          {st.name}
        </div>,
      );
    });
    if (on && travel >= 0 && !travelDone) {
      for (let j = 14; j >= 0; j--) {
        const pt = pointOn(c, Math.max(0, travel - j * 0.045));
        svg.push(<circle key={`c${ci}-${j}`} cx={pt.x} cy={pt.y} r={j === 0 ? 9 : 7 * (1 - j / 15)} fill={j === 0 ? "#ffffff" : C.amber} opacity={j === 0 ? 1 : 0.7 * (1 - j / 15)} />);
      }
      const head = pointOn(c, travel);
      svg.push(<circle key={`ch${ci}`} cx={head.x} cy={head.y} r={24} fill={C.amber} opacity={0.25} />);
    }
    const resultOn = on && travelDone ? clamp01(flareT / 0.3) * fadeOut : 0;
    html.push(
      <div key={`q${ci}`} style={{ position: "absolute", left: c.qx, top: 262, fontFamily: F.mono, fontWeight: 700, fontSize: 30, whiteSpace: "pre", opacity: 0.35 + 0.65 * hl }}>
        <span style={{ color: C.text }}>{c.query}</span>
      </div>,
    );
    html.push(
      <div key={`r${ci}`} style={{ position: "absolute", left: c.qx, top: 308, fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: C.mint, textShadow: `0 0 14px ${C.mint}`, opacity: resultOn }}>
        {c.result}
      </div>,
    );
  });
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
        {svg}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: clamp01(p) }}>{html}</div>
    </>
  );
};

const Outro: React.FC = () => {
  const { s, frame: f, fps } = useSteps();
  const clock = useClock();
  const t = Math.max(f / fps, clock);
  const scene = s(0, 6);
  const credit = s(0, 100);
  const sweep = interpolate(f, [110, 160], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const typed = Math.floor(Math.max(0, f - 20) / 3);
  let used = 0;

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Backdrop />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, rgba(154,68,150,0.28) 0%, rgba(41,38,26,0) 60%)`, opacity: scene }} />
      <Stars t={t} n={70} y0={80} h={HORIZON - 120} opacity={scene * 0.8} />
      <SynthSun cx={VX} cy={HORIZON} r={250} p={s(0, 10)} t={t} id="osun" />
      <Mountains p={s(0, 24)} />
      <GridFloor y0={HORIZON} t={t * 2.2} p={scene} vx={VX} />
      <Constellations t={Math.max(0, t - 1.2)} p={s(0, 30)} />
      <div style={{ position: "absolute", left: 0, top: 104, width: 1920, textAlign: "center", fontFamily: F.pixel, fontSize: 70, lineHeight: 1.45, color: C.pink, textShadow: `0 0 24px rgba(246,115,169,0.65), 4px 4px 0 #14120a` }}>
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
