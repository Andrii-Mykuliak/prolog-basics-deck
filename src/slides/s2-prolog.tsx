import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Mark, Slide } from "../deck/ui";
import { clamp01, pulse } from "./common";
import { SyntaxBox } from "./kit";
import { Win } from "./retro";

/** Retro terminal with lines that type in over time. */
export const Term: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  lines: { text: string; at: number; color?: string; step?: number }[];
  step: number;
  p?: number;
  size?: number;
}> = ({ x, y, w, h, title = "swipl", lines, step, p = 1, size = 28 }) => {
  const { t, frame } = useSteps();
  const shown = lines.filter((l) => t(l.step ?? step, l.at) >= 0);
  const last = shown[shown.length - 1];
  return (
    <Win x={x} y={y} w={w} h={h} title={title} titleColor={C.lav} p={p} pad="14px 22px">
      {lines.map((l, i) => {
        const tt = t(l.step ?? step, l.at);
        if (tt < 0) {
          return null;
        }
        const typed = l.text.startsWith("?-") ? Math.min(l.text.length, Math.floor(tt * 1.6) + 3) : l.text.length;
        const caret = l === last && typed < l.text.length + 1 && frame % 30 < 18;
        return (
          <div key={i} style={{ fontFamily: F.mono, fontWeight: 600, fontSize: size, lineHeight: 1.5, color: l.color ?? (l.text.startsWith("?-") ? C.text : C.mint), whiteSpace: "pre" }}>
            {l.text.slice(0, typed)}
            {caret && <span style={{ background: C.cream, color: C.cream }}>_</span>}
          </div>
        );
      })}
    </Win>
  );
};

/* Програма як база знань */
const KnowledgeBase: React.FC = () => {
  const { s, t } = useSteps();
  const cards = [
    { title: "Факти", text: "Оголошення фактів про об’єкти та відношення між ними.", code: "друг(іван, олег).", color: C.mint },
    { title: "Правила", text: "Визначення правил, що виводять нові відношення з наявних.", code: "приятель(X, Y) :-\n    друг(X, Y).", color: C.amber },
    { title: "Запити", text: "Формулювання питань, на які система шукає відповідь.", code: "?- друг(іван, X).", color: C.lav },
  ];
  return (
    <Slide title="Програма як база знань">
      <Lead>
        Prolog-програма – <A>сховище фактів і правил</A>, до якого ставлять запитання. Система сама робить висновки.
      </Lead>
      {cards.map((c, i) => (
        <Win key={c.title} x={96 + i * 590} y={340} w={550} h={430} title={c.title} titleColor={c.color} tag={`0${i + 1}`} p={s(1, i * 14, POP)} glow={pulse(t(2, i * 22), 8, 16)}>
          <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 27, lineHeight: 1.4, color: C.text, minHeight: 120 }}>{c.text}</div>
          <div style={{ marginTop: 26, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: c.color, whiteSpace: "pre", lineHeight: 1.5 }}>{c.code}</div>
        </Win>
      ))}
      <At x={96} y={850} w={1720} step={3} size={30} weight={700}>
        Програмування на Prolog – це опис фактів і правил; механізм виведення шукає відповіді за нас.
      </At>
    </Slide>
  );
};

/* Факти */
const PEOPLE: Record<string, { x: number; y: number }> = {
  іван: { x: 1180, y: 420 },
  олег: { x: 1640, y: 420 },
  олена: { x: 1180, y: 700 },
  сергій: { x: 1640, y: 700 },
};
const FRIENDS: [string, string][] = [
  ["іван", "олег"],
  ["олена", "іван"],
  ["сергій", "олена"],
];

const Facts: React.FC = () => {
  const { s, t } = useSteps();
  const R = 66;
  return (
    <Slide title="Факти">
      <Lead>Факт – просте твердження про світ, яке вважається істинним.</Lead>
      <SyntaxBox x={96} y={290} w={860} step={1} size={26} lines={["{відношення}({аргумент1}, {аргумент2}).", "% атоми з малої літери, наприкінці – крапка"]} />
      <Code
        x={96}
        y={460}
        size={32}
        step={1}
        delay={24}
        stagger={12}
        code={`
          друг(іван, олег).
          друг(олена, іван).
          друг(сергій, олена).
        `}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {FRIENDS.map(([a, b], i) => {
          const pa = PEOPLE[a];
          const pb = PEOPLE[b];
          const k = clamp01(t(1, 30 + i * 12) / 16);
          const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
          const sx = pa.x + Math.cos(ang) * R;
          const sy = pa.y + Math.sin(ang) * R;
          const ex = pb.x - Math.cos(ang) * (R + 8);
          const ey = pb.y - Math.sin(ang) * (R + 8);
          return (
            <g key={i} opacity={k > 0 ? 1 : 0}>
              <line x1={sx} y1={sy} x2={mix(sx, ex, k)} y2={mix(sy, ey, k)} stroke={C.mint} strokeWidth={3.5} />
              {k >= 1 && <polygon points={`${ex + Math.cos(ang) * 8},${ey + Math.sin(ang) * 8} ${ex - Math.cos(ang - 0.45) * 16},${ey - Math.sin(ang - 0.45) * 16} ${ex - Math.cos(ang + 0.45) * 16},${ey - Math.sin(ang + 0.45) * 16}`} fill={C.mint} />}
            </g>
          );
        })}
        {(() => {
          const pa = PEOPLE["олег"];
          const pb = PEOPLE["іван"];
          const k = clamp01(t(2, 6) / 16);
          return k > 0 ? (
            <path d={`M ${pa.x - R} ${pa.y + 30} Q ${(pa.x + pb.x) / 2} ${pa.y + 120} ${pb.x + R} ${pb.y + 30}`} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="8 8" opacity={k} />
          ) : null;
        })()}
      </svg>
      {Object.entries(PEOPLE).map(([name, pos], i) => (
        <div
          key={name}
          style={{
            position: "absolute",
            left: pos.x - R,
            top: pos.y - R,
            width: 2 * R,
            height: 2 * R,
            borderRadius: R,
            border: `3px solid ${C.cream}`,
            background: C.panel,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 26,
            color: C.text,
            opacity: clamp01(s(1, 20 + i * 4, POP)),
          }}
        >
          {name}
        </div>
      ))}
      <At x={1220} y={560} w={380} step={2} delay={10} size={22} weight={700} color={C.red} align="center">
        друг(олег, іван) – такого факту немає
      </At>
      <At x={96} y={870} w={1720} step={2} delay={20} size={30} weight={700}>
        Порядок аргументів має значення: <M>друг(іван, олег)</M> – не те саме, що <M c={C.red}>друг(олег, іван)</M>.
      </At>
    </Slide>
  );
};

/* Запити */
const KB_FACTS = ["друг(іван, олег).", "друг(олена, іван).", "друг(сергій, олена)."];
const QUERIES = [
  { q: "?- друг(іван, олег).", a: "true.", hit: 0, color: C.mint },
  { q: "?- друг(олег, іван).", a: "false.", hit: -1, color: C.red },
  { q: "?- друг(X, іван).", a: "X = олена.", hit: 1, color: C.mint },
];
const Q_GAP = 60;

const Queries: React.FC = () => {
  const { s, t } = useSteps();
  return (
    <Slide title="Запити">
      <Lead>Запит – питання до бази знань: Prolog шукає факти й правила, з якими запит збігається.</Lead>
      <SyntaxBox x={96} y={330} w={840} step={1} size={26} lines={["?- {ціль}.", "% відповідь: true, false або значення змінних"]} />
      <Win x={96} y={500} w={840} title="база знань" titleColor={C.mint} p={s(1, 20, POP)}>
        {KB_FACTS.map((f, i) => {
          const glow = Math.max(...QUERIES.map((q, k) => (q.hit === i ? pulse(t(2, k * Q_GAP + 26), 8, 22) : 0)));
          return (
            <div
              key={f}
              style={{
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 30,
                lineHeight: 1.7,
                color: C.mint,
                textShadow: glow > 0.05 ? `0 0 ${20 * glow}px ${C.mint}` : undefined,
                background: glow > 0.05 ? `rgba(147,196,125,${0.18 * glow})` : undefined,
                padding: "0 8px",
              }}
            >
              {f}
            </div>
          );
        })}
      </Win>
      <Term
        x={980}
        y={330}
        w={844}
        h={480}
        step={2}
        p={s(2, 0, POP)}
        lines={QUERIES.flatMap((q, k) => [
          { text: q.q, at: k * Q_GAP },
          { text: q.a, at: k * Q_GAP + 28, color: q.color },
        ])}
      />
      <At x={96} y={870} w={1720} step={3} size={30} weight={700}>
        Якщо в запиті є змінні, Prolog шукає їхні значення, за яких ціль досяжна; без змінних – лише перевіряє істинність.
      </At>
    </Slide>
  );
};

/* Правила */
const Rules: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Правила">
      <Lead>Правило виводить нові відношення з наявних: голова істинна, якщо істинне тіло.</Lead>
      <SyntaxBox
        x={96}
        y={330}
        w={1060}
        step={1}
        size={26}
        lines={["{голова} :- {ціль1}, {ціль2}.", "% «,» – логічне «і» (кон’юнкція)", "% «;» або кілька правил з однаковою головою – «або»"]}
      />
      <Code
        x={96}
        y={540}
        size={32}
        step={2}
        stagger={12}
        code={`
          математик(марія).
          володіє_логікою(X) :- математик(X).
          ?- володіє_логікою(марія).   % true.
        `}
      />
      <div style={{ position: "absolute", left: 96, top: 710, display: "flex", gap: 20, alignItems: "center", fontFamily: F.mono, fontSize: 30, fontWeight: 700, opacity: clamp01(s(3, 0)) }}>
        <span style={{ padding: "8px 18px", border: `2.5px solid ${C.amber}`, color: C.amber, borderRadius: 4 }}>володіє_логікою(X)</span>
        <span style={{ color: C.dim, fontFamily: F.body, fontSize: 26 }}>якщо</span>
        <span style={{ padding: "8px 18px", border: `2.5px solid ${C.mint}`, color: C.mint, borderRadius: 4 }}>математик(X)</span>
      </div>
      <At x={96} y={790} step={3} delay={8} size={24} weight={500} color={C.dim}>
        голова ліворуч від :-, тіло – праворуч
      </At>
      <At x={96} y={880} w={1720} step={4} size={30} weight={700}>
        Змінна <M c={C.amber}>X</M> пов’язує голову з тілом: будь-хто, хто є математиком, володіє логікою.
      </At>
    </Slide>
  );
};

/* Кон’юнкція і диз’юнкція */
const SETS = [
  { name: "ходить", x: 1180, y: 480, r: 150, color: C.mint, members: ["зебра", "тигр"] },
  { name: "літає", x: 1600, y: 470, r: 100, color: C.lav, members: ["орел"] },
  { name: "хижак", x: 1340, y: 660, r: 100, color: C.red, members: ["тигр"] },
];

const AndOr: React.FC = () => {
  const { s, t } = useSteps();
  const or = s(2, 0);
  const and = s(3, 0);
  const animals = [
    { n: "зебра", x: 1100, y: 430 },
    { n: "тигр", x: 1268, y: 585 },
    { n: "орел", x: 1600, y: 470 },
    { n: "дельфін", x: 1690, y: 760 },
  ];
  const inOr = (n: string) => n !== "дельфін";
  return (
    <Slide title="Кон’юнкція і диз’юнкція">
      <Code
        x={96}
        y={190}
        size={25}
        lh={38}
        step={1}
        stagger={4}
        code={`
          ходить(зебра).   ходить(тигр).
          плаває(дельфін). літає(орел).
          хижак(тигр).
          @2 суходільна_тварина(X) :-
          @2     ходить(X) ; літає(X).
          @3 суходільний_хижак(X) :-
          @3     суходільна_тварина(X), хижак(X).
          @3+20 ?- суходільний_хижак(X).   % X = тигр
        `}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {SETS.map((st, i) => (
          <g key={st.name} opacity={clamp01(s(1, 10 + i * 6))}>
            <circle cx={st.x} cy={st.y} r={st.r} fill={st.color} opacity={0.08 + (i < 2 ? 0.1 * or : 0) + (i === 2 ? 0.12 * and : 0)} stroke={st.color} strokeWidth={3} strokeDasharray="10 6" />
          </g>
        ))}
      </svg>
      {SETS.map((st, i) => (
        <At key={st.name} x={st.x - 100} y={i === 2 ? st.y + st.r + 8 : st.y - st.r - 40} w={200} step={1} delay={10 + i * 6} size={24} weight={700} color={st.color} font={F.mono} align="center">
          {st.name}
        </At>
      ))}
      {animals.map((a, i) => {
        const hotOr = inOr(a.n) ? or : 0;
        const hotAnd = a.n === "тигр" ? and : 0;
        return (
          <div
            key={a.n}
            style={{
              position: "absolute",
              left: a.x - 70,
              top: a.y - 22,
              width: 140,
              textAlign: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 26,
              color: hotAnd > 0.5 ? C.pink : hotOr > 0.5 ? C.amber : C.text,
              textShadow: hotAnd > 0.5 ? `0 0 16px ${C.pink}` : undefined,
              opacity: clamp01(s(1, 20 + i * 4)) * (and > 0.5 && a.n !== "тигр" ? 0.4 : 1),
              transform: `scale(${1 + 0.25 * hotAnd})`,
            }}
          >
            {a.n}
          </div>
        );
      })}
      <At x={1000} y={830} w={820} step={2} delay={10} size={26} weight={700} color={C.amber}>
        «;» – або: суходільні тварини – зебра, тигр, орел
      </At>
      <At x={1000} y={880} w={820} step={3} delay={20} size={26} weight={700} color={C.pink}>
        «,» – і: суходільний хижак лише тигр
      </At>
      <At x={96} y={880} w={860} step={3} delay={30} size={24} weight={500} color={C.dim}>
        Орел не підходить: факту хижак(орел) у базі немає.
      </At>
    </Slide>
  );
};

/* Змінні */
const Variables: React.FC = () => {
  const { s, t } = useSteps();
  const bound = s(2, 0);
  const rebind = t(3, 0);
  const shake = rebind > 0 ? Math.sin(rebind * 1.6) * 10 * Math.max(0, 1 - rebind / 20) : 0;
  const rules = [
    { k: "Імена", v: "починаються з великої літери або _: X, Animal, _a" },
    { k: "Єдина прив’язка", v: "отримавши значення в межах запиту, змінна його не змінює" },
    { k: "Анонімна _", v: "значення не важливе; кожне _ – окрема змінна" },
    { k: "Вільна і зв’язана", v: "вільна ще не має значення, зв’язана вже має" },
  ];
  return (
    <Slide title="Змінні">
      <Lead>Змінна в Prolog – невідоме, яке система намагається визначити, а не комірка пам’яті.</Lead>
      {rules.map((r, i) => (
        <div key={r.k} style={{ position: "absolute", left: 96, top: 340 + i * 100, width: 900, opacity: clamp01(s(1, i * 10)), transform: `translateX(${(1 - s(1, i * 10)) * -24}px)` }}>
          <div style={{ fontFamily: F.title, fontWeight: 700, fontSize: 30, color: C.pink }}>{r.k}</div>
          <div style={{ marginTop: 4, fontFamily: F.body, fontWeight: 500, fontSize: 25, color: C.text }}>{r.v}</div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 1160,
          top: 320,
          width: 560,
          height: 200,
          border: `3px ${bound > 0.5 ? "solid" : "dashed"} ${bound > 0.5 ? C.amber : C.faint}`,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 54,
          color: C.amber,
          transform: `translateX(${shake}px)`,
          opacity: clamp01(s(1, 0, POP)),
        }}
      >
        <span>X =</span>
        <span style={{ color: bound > 0.5 ? C.text : C.faint }}>{bound > 0.5 ? "олена" : "?"}</span>
        {bound > 0.5 && (
          <svg width={36} height={36} viewBox="0 0 24 24">
            <rect x={5} y={11} width={14} height={10} rx={2} fill="none" stroke={C.amber} strokeWidth={2} />
            <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" fill="none" stroke={C.amber} strokeWidth={2} />
          </svg>
        )}
      </div>
      <At x={1160} y={540} w={560} step={1} delay={10} size={24} weight={600} color={C.dim} align="center">
        {bound > 0.5 ? "зв’язана: друг(X, іван) дає X = олена" : "вільна змінна"}
      </At>
      <At x={1160} y={600} w={560} step={3} size={28} weight={700} color={C.red} align="center" font={F.mono}>
        X = олег ✗
      </At>
      <At x={1160} y={644} w={560} step={3} delay={6} size={22} weight={600} color={C.red} align="center">
        у межах того самого запиту – ні
      </At>
      <Code x={1160} y={730} size={28} step={4} code={`?- друг(_, іван).   % true`} />
      <At x={1160} y={790} w={660} step={4} delay={10} size={22} weight={600} color={C.dim}>
        «хтось дружить з Іваном», хто саме – не важливо
      </At>
    </Slide>
  );
};

/* Детерміновані і недетерміновані предикати */
const DetNondet: React.FC = () => {
  const { s, t } = useSteps();
  const facts = ["друг(іван, олег).", "друг(олена, іван).", "друг(сергій, олена)."];
  const pointer = Math.min(2, Math.max(0, Math.floor(Math.max(0, t(2, 10)) / 40)));
  return (
    <Slide title="Детерміновані й недетерміновані предикати">
      <Win x={96} y={190} w={820} h={300} title="Детермінований" titleColor={C.lav} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 25, lineHeight: 1.45, color: C.text }}>
          Знаходить одне рішення або жодного; якщо рішення є, інших немає.
        </div>
        <div style={{ marginTop: 18, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.mint, whiteSpace: "pre" }}>{"?- друг(сергій, Y).\nY = олена."}</div>
      </Win>
      <Win x={96} y={520} w={820} h={340} title="Недетермінований" titleColor={C.pink} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 25, lineHeight: 1.45, color: C.text }}>
          Може знайти кілька рішень: запам’ятовує місце, де зупинився, і на запит «;» продовжує пошук звідти.
        </div>
      </Win>
      <Term
        x={980}
        y={190}
        w={844}
        h={420}
        step={2}
        p={s(2, 0, POP)}
        lines={[
          { text: "?- друг(X, Y).", at: 0 },
          { text: "X = іван, Y = олег ;", at: 22 },
          { text: "X = олена, Y = іван ;", at: 62 },
          { text: "X = сергій, Y = олена.", at: 102 },
        ]}
      />
      <Win x={980} y={640} w={844} h={220} title="база знань" titleColor={C.mint} p={s(2, 6, POP)} pad="10px 22px">
        {facts.map((f, i) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: F.mono, fontWeight: 700, fontSize: 25, lineHeight: 1.5, color: i === pointer ? C.amber : C.mint }}>
            <span style={{ width: 22, color: C.amber }}>{i === pointer && t(2, 10) >= 0 ? "▶" : ""}</span>
            {f}
          </div>
        ))}
      </Win>
      <At x={96} y={900} w={1720} step={3} size={28} weight={700}>
        Маркер ▶ – запам’ятоване місце пошуку: після «;» Prolog продовжує з наступного речення бази знань.
      </At>
    </Slide>
  );
};

export const s2Slides: SlideDef[] = [
  { id: "kb", title: "База знань", steps: [45, 70, 90, 60], C: KnowledgeBase },
  { id: "facts", title: "Факти", steps: [40, 90, 60], C: Facts },
  { id: "queries", title: "Запити", steps: [45, 60, 3 * Q_GAP + 40, 60], C: Queries },
  { id: "rules", title: "Правила", steps: [40, 50, 70, 50, 60], C: Rules },
  { id: "and-or", title: "Кон’юнкція і диз’юнкція", steps: [20, 60, 60, 80], C: AndOr },
  { id: "variables", title: "Змінні", steps: [40, 60, 50, 50, 60], C: Variables },
  { id: "det", title: "Детермінованість", steps: [20, 50, 160, 60], C: DetNondet },
];
