import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";
import { clamp01, useClock } from "./common";
import { GridFloor, Planet, RetroTitle, Stars, SynthSun, Win } from "./retro";

const TitleSlide: React.FC = () => {
  const { s, frame, fps } = useSteps();
  const clock = useClock();
  const t = Math.max(frame / fps, clock);
  return (
    <Slide>
      <RetroTitle lecture="ЛЕКЦІЯ 10" lead="Основні принципи" lines={["логічного", "програмування"]} plaque="факти + правила → відповіді" t={t} s={s} />
      <AuthorBlock />
    </Slide>
  );
};

/* Epigraph: Kowalski's equation, with a knowledge base under Logic and a search under Control. */
const KB = ["Іван – батько Петра.", "Петро – батько Анни.", "Дід – це батько батька."];
const TREE = [
  { x: 310, y: 40, label: "Чий дід Іван?" },
  { x: 160, y: 130, label: "Іван – батько кого?" },
  { x: 460, y: 130, label: "Петра" },
  { x: 310, y: 220, label: "Петро – батько кого?" },
  { x: 310, y: 300, label: "Анни ✓" },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [2, 3],
  [3, 4],
];
const EQ_STOP = 190;

const Equation: React.FC = () => {
  const { s, t } = useSteps();
  const parts = [
    { text: "Algorithm", color: C.cream, at: 4 },
    { text: "=", color: C.dim, at: 16 },
    { text: "Logic", color: C.pink, at: 26 },
    { text: "+", color: C.dim, at: 38 },
    { text: "Control", color: C.lav, at: 48 },
  ];
  const visit = Math.floor(Math.max(0, t(0, 90)) / 18);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 120, width: 1920, display: "flex", justifyContent: "center", gap: 34, fontFamily: F.head, fontSize: 84 }}>
        {parts.map((pt) => {
          const p = s(0, pt.at, POP);
          return (
            <span
              key={pt.text}
              style={{
                color: pt.color,
                opacity: clamp01(p),
                transform: `translateY(${(1 - p) * 40}px) scale(${mix(0.7, 1, p)})`,
                textShadow: pt.color === C.dim ? undefined : `0 0 24px ${pt.color}66`,
                display: "inline-block",
              }}
            >
              {pt.text}
            </span>
          );
        })}
      </div>
      <Win x={300} y={300} w={620} title="Logic: що відомо" p={s(0, 64, POP)}>
        {KB.map((l, i) => (
          <div key={i} style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, lineHeight: 1.6, color: i < 2 ? C.mint : C.amber, opacity: clamp01(s(0, 70 + i * 6)) }}>
            {l}
          </div>
        ))}
      </Win>
      <Win x={1000} y={300} w={620} h={392} title="Control: як шукати" titleColor={C.lav} p={s(0, 76, POP)} pad="0">
        <svg width={620} height={330} style={{ position: "absolute", left: 0, top: 62 }}>
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={TREE[a].x} y1={TREE[a].y + 14} x2={TREE[b].x} y2={TREE[b].y - 14} stroke={visit > b - 1 ? C.lav : C.line} strokeWidth={2.5} />
          ))}
        </svg>
        {TREE.map((n, i) => {
          const on = visit >= i;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: n.x - 190,
                top: 62 + n.y - 16,
                width: 380,
                whiteSpace: "nowrap",
                textAlign: "center",
                fontFamily: F.body,
                fontSize: 28,
                fontWeight: 700,
                color: on ? (i === 4 ? C.mint : C.text) : C.faint,
                textShadow: visit === i ? `0 0 14px ${C.lav}` : undefined,
              }}
            >
              {n.label}
            </div>
          );
        })}
      </Win>
    </>
  );
};

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide>
      <Equation />
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 740,
          height: 6,
          width: mix(0, 420, s(1, 0)),
          background: `linear-gradient(90deg, ${C.pink}, ${C.lav})`,
          borderRadius: 3,
        }}
      />
      <At x={110} y={768} w={1700} step={1} delay={6} size={40} weight={700} color={C.text}>
        Алгоритм = логіка + керування: логіка описує, <span style={{ color: C.pink }}>що</span> відомо про задачу, керування – <span style={{ color: C.lav }}>як</span> шукати розв’язок.
      </At>
      <At x={110} y={890} step={1} delay={24} size={30} weight={400} color={C.dim} font={F.mono}>
        Robert Kowalski
      </At>
      <At x={110} y={936} w={1600} step={1} delay={36} size={30} weight={700} color={C.dim}>
        «Algorithm = Logic + Control», Communications of the ACM, 1979
      </At>
    </Slide>
  );
};

const AGENDA = ["Історія логічного програмування", "Основи мови Prolog", "Типи даних у Prolog"];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  const Y0 = 290;
  const GAP = 170;
  return (
    <Slide title="План">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 6, POP) : 1;
        const on = full ? 1 : i === active ? s(0, 10) : 0;
        const dim = full ? 1 : i === active ? 1 : 0.35;
        const color = [C.pink, C.lav, C.mint][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 110,
              top: Y0 + i * GAP,
              width: 1200,
              height: 120,
              display: "flex",
              alignItems: "center",
              gap: 34,
              border: `2.5px solid ${on > 0.5 && !full ? color : C.cream}`,
              borderRadius: 6,
              padding: "0 34px",
              boxSizing: "border-box",
              background: on > 0.5 && !full ? `${color}1a` : "rgba(20,18,10,0.25)",
              boxShadow: on > 0.5 && !full ? `0 0 ${28 * on}px ${color}66` : undefined,
              opacity: clamp01(p) * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            <div style={{ fontFamily: F.pixel, fontSize: 34, color }}>{`0${i + 1}`}</div>
            <div style={{ fontFamily: F.title, fontSize: 50, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{item}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [110], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [EQ_STOP, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
