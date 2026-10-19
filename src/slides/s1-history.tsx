import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Slide } from "../deck/ui";
import { clamp01, pulse } from "./common";
import { Rocket, Stars, Win } from "./retro";

/* Що таке логічне програмування */
const WhatIs: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Що таке логічне програмування">
      <Lead>
        Логічне програмування спирається на формальну логіку: програма описує <A>відношення й твердження</A>, а не послідовність інструкцій.
      </Lead>
      <Win x={96} y={330} w={840} title="Імперативно: як шукати" titleColor={C.amber} p={s(1, 0, POP)}>
        <Code
          x={0}
          y={0}
          size={26}
          step={1}
          delay={10}
          stagger={6}
          style={{ position: "relative", color: C.dim }}
          code={`
            for (p in people)
              for (q in people)
                if (parent(p, q) && parent(q, "анна"))
                  print(p);
          `}
        />
        <div style={{ marginTop: 26, fontFamily: F.body, fontWeight: 500, fontSize: 26, color: C.dim, opacity: clamp01(s(1, 30)) }}>
          Програміст сам організовує перебір: цикли, умови, порядок дій.
        </div>
      </Win>
      <Win x={984} y={330} w={840} title="Логічно: що відомо" titleColor={C.mint} p={s(2, 0, POP)}>
        <Code
          x={0}
          y={0}
          size={26}
          step={2}
          delay={10}
          stagger={8}
          style={{ position: "relative" }}
          code={`
            батько(іван, петро).
            батько(петро, анна).
            дід(X, Z) :- батько(X, Y), батько(Y, Z).
            ?- дід(X, анна).    % X = іван
          `}
        />
        <div style={{ marginTop: 26, fontFamily: F.body, fontWeight: 500, fontSize: 26, color: C.dim, opacity: clamp01(s(2, 40)) }}>
          Програміст описує знання; перебір і висновки виконує Prolog.
        </div>
      </Win>
      <At x={96} y={860} w={1720} step={3} size={32} weight={700}>
        Prolog сам шукає відповідь: опис задачі одночасно є програмою, а результат – <A>логічним наслідком</A> фактів і правил.
      </At>
    </Slide>
  );
};

/* Історія: від логіки до Prolog */
const EVENTS = [
  { year: "1879", who: "Готлоб Фреге", what: "формальна логіка, «Begriffsschrift»", color: C.lav },
  { year: "1951", who: "Альфред Горн", what: "хорнівські диз’юнкти", color: C.amber },
  { year: "1965", who: "Джон Алан Робінсон", what: "принцип резолюції", color: C.pink },
  { year: "1972", who: "Ален Колмерое", what: "мова Prolog, Марсель", color: C.mint },
  { year: "1974", who: "Роберт Ковальський", what: "процедурне прочитання хорнівських диз’юнктів", color: C.lav },
  { year: "1980-ті", who: "епоха ПК і ООП", what: "інтерес до декларативних мов спадає", color: C.faint },
  { year: "сьогодні", who: "нішеві задачі", what: "ШІ, експертні системи, обробка мови", color: C.pink },
];
const EV_GAP = 26;

const Timeline: React.FC = () => {
  const { s, t, frame, fps } = useSteps();
  const X0 = 170;
  const X1 = 1760;
  const Y = 520;
  const n = EVENTS.length;
  const xAt = (i: number) => X0 + ((X1 - X0) * i) / (n - 1);
  const prog = clamp01(t(1, 0) / (EV_GAP * (n - 1) + 10));
  const rx = mix(X0, X1, prog);
  const ry = Y - 80 + Math.sin(prog * Math.PI * 6) * 14;
  return (
    <Slide title="Історія: від логіки до Prolog">
      <Stars t={frame / fps} n={40} y0={170} h={860} opacity={0.6} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <line x1={X0} y1={Y} x2={X1} y2={Y} stroke={C.line} strokeWidth={3} strokeDasharray="6 10" />
        <line x1={X0} y1={Y} x2={rx} y2={Y} stroke={C.pink} strokeWidth={3} opacity={0.8} />
      </svg>
      {EVENTS.map((e, i) => {
        const at = i * EV_GAP;
        const p = s(1, at, POP);
        const hot = pulse(t(1, at), 6, 16);
        const up = i % 2 === 0;
        return (
          <React.Fragment key={e.year}>
            <div
              style={{
                position: "absolute",
                left: xAt(i) - 22,
                top: Y - 22,
                width: 44,
                height: 44,
                borderRadius: 22,
                background: e.color,
                boxShadow: `0 0 ${12 + 30 * hot}px ${e.color}`,
                opacity: clamp01(p),
                transform: `scale(${mix(0.3, 1, clamp01(p)) * (1 + 0.25 * hot)})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: xAt(i) - 120,
                top: up ? Y - 250 : Y + 60,
                width: 240,
                textAlign: "center",
                opacity: clamp01(p),
                transform: `translateY(${(1 - p) * (up ? 20 : -20)}px)`,
              }}
            >
              <div style={{ fontFamily: F.pixel, fontSize: 24, color: e.color }}>{e.year}</div>
              <div style={{ marginTop: 14, fontFamily: F.title, fontWeight: 700, fontSize: 27, color: C.text, lineHeight: 1.2 }}>{e.who}</div>
              <div style={{ marginTop: 8, fontFamily: F.body, fontWeight: 500, fontSize: 21, color: C.dim, lineHeight: 1.3 }}>{e.what}</div>
            </div>
          </React.Fragment>
        );
      })}
      {prog > 0 && prog < 1 && <Rocket x={rx} y={ry} s={0.5} rot={90} flame={0.5 + 0.5 * Math.sin(frame * 0.8)} />}
      <At x={96} y={880} w={1720} step={2} size={30} weight={700}>
        Prolog став першою мовою логічного програмування; Ковальський дав йому теоретичну основу – хорнівські диз’юнкти.
      </At>
    </Slide>
  );
};

/* Принцип резолюції */
const Clause: React.FC<{ x: number; y: number; p: number; parts: { t: string; c?: string; gone?: number }[]; color?: string; glow?: number }> = ({
  x,
  y,
  p,
  parts,
  color = C.cream,
  glow = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      padding: "14px 26px",
      border: `2.5px solid ${color}`,
      borderRadius: 6,
      background: "rgba(20,18,10,0.35)",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: 34,
      color: C.text,
      whiteSpace: "pre",
      boxShadow: glow > 0.02 ? `0 0 ${30 * glow}px ${color}` : undefined,
      opacity: clamp01(p),
      transform: `scale(${mix(0.7, 1, clamp01(p))})`,
    }}
  >
    {parts.map((pt, i) => (
      <span key={i} style={{ color: pt.c ?? C.text, opacity: 1 - 0.8 * (pt.gone ?? 0), textDecoration: (pt.gone ?? 0) > 0.5 ? "line-through" : undefined }}>
        {pt.t}
      </span>
    ))}
  </div>
);

const Resolution: React.FC = () => {
  const { s, t } = useSteps();
  const g1 = s(1, 30);
  const g2 = s(2, 40);
  return (
    <Slide title="Принцип резолюції">
      <Lead>
        Робінсон (1965): з двох тверджень виводиться нове, яке є їхнім <A>логічним наслідком</A>. Суперечливі літерали скорочуються.
      </Lead>
      <Clause x={150} y={340} p={s(1, 0, POP)} parts={[{ t: "A ∨ " }, { t: "B", c: C.pink, gone: g1 }]} />
      <Clause x={150} y={450} p={s(1, 8, POP)} parts={[{ t: "¬B", c: C.pink, gone: g1 }, { t: " ∨ C" }]} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(s(1, 20)) }}>
        <path d="M 470 380 C 560 380, 560 445, 640 445" fill="none" stroke={C.dim} strokeWidth={3} />
        <path d="M 470 490 C 560 490, 560 445, 640 445" fill="none" stroke={C.dim} strokeWidth={3} />
        <polygon points="652,445 638,437 638,453" fill={C.dim} />
      </svg>
      <Clause x={670} y={400} p={s(1, 30, POP)} parts={[{ t: "A ∨ C" }]} color={C.mint} glow={pulse(t(1, 30), 8, 20)} />
      <Win x={1060} y={320} w={760} title="Силогізм як резолюція" p={s(2, 0, POP)}>
        {[
          { a: "людина(сократ)", b: "", c: C.mint },
          { a: "¬людина(X) ∨ смертний(X)", b: "", c: C.amber },
          { a: "смертний(сократ)", b: "  X = сократ", c: C.lav },
        ].map((r, i) => (
          <div key={i} style={{ fontFamily: F.mono, fontSize: 28, lineHeight: 1.8, color: r.c, whiteSpace: "pre", opacity: clamp01(s(2, 10 + i * 16)) }}>
            {i === 2 ? "⟹ " : "   "}
            {r.a}
            <span style={{ color: C.dim, fontSize: 22 }}>{r.b}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, fontFamily: F.body, fontSize: 22, color: C.dim, opacity: g2 }}>людина(X) і ¬людина(X) скорочуються після підстановки X = сократ</div>
      </Win>
      <At x={96} y={880} w={1720} step={3} size={30} weight={700}>
        Prolog доводить запит, раз за разом застосовуючи резолюцію до фактів і правил бази знань.
      </At>
    </Slide>
  );
};

/* Хорнівські диз’юнкти */
const HORN = [
  { clause: "A", impl: "A", prolog: "a.", kind: "факт", color: C.mint },
  { clause: "A ∨ ¬B ∨ ¬C", impl: "A ← B ∧ C", prolog: "a :- b, c.", kind: "правило", color: C.amber },
  { clause: "¬A ∨ ¬B", impl: "← A ∧ B", prolog: "?- a, b.", kind: "запит", color: C.lav },
];

const Horn: React.FC = () => {
  const { s } = useSteps();
  const COLS = [140, 600, 1020, 1430];
  const Y0 = 490;
  const RH = 104;
  return (
    <Slide title="Хорнівські диз’юнкти">
      <Lead>
        Хорнівський диз’юнкт містить <A>не більше одного</A> позитивного літерала. Названий на честь логіка Альфреда Горна (1951).
      </Lead>
      <At x={96} y={330} step={1} size={30} weight={700} font={F.mono} color={C.text}>
        (A ∨ ¬B) ∧ (¬A ∨ C)
        <span style={{ fontFamily: F.body, fontSize: 24, color: C.dim, fontWeight: 500 }}>{"   – кожна диз’юнкція має рівно один позитивний літерал"}</span>
      </At>
      {["Диз’юнкт", "Імплікація", "Prolog", "Роль"].map((h, i) => (
        <At key={h} x={COLS[i]} y={Y0 - 52} step={2} size={22} weight={700} color={C.faint} font={F.pixel}>
          {h.toUpperCase()}
        </At>
      ))}
      {HORN.map((r, i) => {
        const p = s(2, 10 + i * 14, POP);
        return (
          <div
            key={r.kind}
            style={{
              position: "absolute",
              left: 96,
              top: Y0 + i * RH,
              width: 1728,
              height: RH - 18,
              border: `2.5px solid ${r.color}`,
              borderRadius: 6,
              background: `${r.color}12`,
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            {[r.clause, r.impl, r.prolog, r.kind].map((v, j) => (
              <div
                key={j}
                style={{
                  position: "absolute",
                  left: COLS[j] - 96,
                  top: 0,
                  height: RH - 18,
                  display: "flex",
                  alignItems: "center",
                  fontFamily: j === 3 ? F.title : F.mono,
                  fontWeight: 700,
                  fontSize: j === 3 ? 30 : 30,
                  color: j === 2 ? r.color : C.text,
                  whiteSpace: "pre",
                }}
              >
                {v}
              </div>
            ))}
          </div>
        );
      })}
      <At x={96} y={840} w={1720} step={3} size={30} weight={700}>
        Ковальський показав, що обмеження Prolog відповідають саме цій підмножині логіки предикатів, тому виведення в ній ефективне.
      </At>
    </Slide>
  );
};

/* Переваги і недоліки */
const PROS = [
  "високий рівень машинної незалежності",
  "чітка математична основа",
  "одна мова для специфікації й програми, що спрощує верифікацію",
  "відношення як базове поняття: зручно з реляційними базами даних",
  "природний паралелізм обчислень",
  "автоматичний перебір із поверненнями",
];
const CONS = [
  "«невидимий» порядок побудови виведення",
  "бракує засобів розробки й налагодження великих програм",
  "слабка підтримка модульності",
  "невисока швидкодія",
  "специфічний клас задач",
];

const ProsCons: React.FC = () => {
  const { s } = useSteps();
  const list = (items: string[], step: number, color: string) =>
    items.map((it, i) => (
      <div key={it} style={{ display: "flex", gap: 14, fontFamily: F.body, fontWeight: 500, fontSize: 30, lineHeight: 1.35, color: C.text, marginBottom: 20, opacity: clamp01(s(step, 8 + i * 8)) }}>
        <span style={{ color, fontFamily: F.pixel, fontSize: 18, marginTop: 6 }}>{step === 1 ? "+" : "−"}</span>
        <span>{it}</span>
      </div>
    ));
  return (
    <Slide title="Переваги і недоліки">
      <Win x={96} y={210} w={850} h={640} title="Переваги" titleColor={C.mint} p={s(1, 0, POP)}>
        {list(PROS, 1, C.mint)}
      </Win>
      <Win x={974} y={210} w={850} h={640} title="Недоліки" titleColor={C.red} p={s(2, 0, POP)}>
        {list(CONS, 2, C.red)}
      </Win>
    </Slide>
  );
};

export const s1Slides: SlideDef[] = [
  { id: "what-is", title: "Логічне програмування", steps: [45, 70, 70, 60], C: WhatIs },
  { id: "timeline", title: "Історія", steps: [30, EVENTS.length * EV_GAP + 40, 60], C: Timeline },
  { id: "resolution", title: "Резолюція", steps: [45, 70, 90, 60], C: Resolution },
  { id: "horn", title: "Хорнівські диз’юнкти", steps: [45, 50, 70, 60], C: Horn },
  { id: "pros-cons", title: "Переваги і недоліки", steps: [20, 80, 70], C: ProsCons },
];
