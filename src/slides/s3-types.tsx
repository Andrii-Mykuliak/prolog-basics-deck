import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Slide } from "../deck/ui";
import { clamp01, Num, pulse } from "./common";
import { SyntaxBox } from "./kit";
import { Win } from "./retro";
import { Term } from "./s2-prolog";

/* Типи даних */
const TYPES = [
  { name: "Атоми", ex: "кіт   синій   john_doe   'Hello World'", note: "символьні константи з малої літери або в одинарних лапках", color: C.mint },
  { name: "Числа", ex: "123   -456   3.14", note: "цілі та дійсні", color: C.lav },
  { name: "Змінні", ex: "X   _Y   _", note: "з великої літери або _", color: C.amber },
  { name: "Складені терми", ex: "любить(джон, мері)", note: "ім’я-атом і аргументи в дужках", color: C.pink },
  { name: "Списки", ex: "[a, b, c]   [a | [b, c]]", note: "елементи через кому в квадратних дужках", color: C.orange },
  { name: "Стрічки", ex: "\"Hello World\"", note: "текст у подвійних лапках", color: C.cream },
];

const Types: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Типи даних у Prolog">
      <Lead>Prolog працює переважно із символьними даними: усе в програмі – терми.</Lead>
      {TYPES.map((tp, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <Win key={tp.name} x={96 + col * 580} y={290 + row * 320} w={548} h={290} title={tp.name} titleColor={tp.color} p={s(1, i * 10, POP)}>
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: tp.color, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{tp.ex}</div>
            <div style={{ marginTop: 18, fontFamily: F.body, fontWeight: 700, fontSize: 29, color: C.dim, lineHeight: 1.4 }}>{tp.note}</div>
          </Win>
        );
      })}
    </Slide>
  );
};

/* Складені терми */
type TNode = { x: number; y: number; label: string; kind: "f" | "a" };
const TREE: TNode[] = [
  { x: 1300, y: 330, label: "відрізок/2", kind: "f" },
  { x: 1080, y: 480, label: "точка/2", kind: "f" },
  { x: 1520, y: 480, label: "точка/2", kind: "f" },
  { x: 990, y: 620, label: "1", kind: "a" },
  { x: 1170, y: 620, label: "2", kind: "a" },
  { x: 1430, y: 620, label: "4", kind: "a" },
  { x: 1610, y: 620, label: "6", kind: "a" },
];
const TEDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
];

const Compound: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Складені терми">
      <Lead>Складений терм має ім’я-атом (функтор) і аргументи; аргументами можуть бути інші терми.</Lead>
      <SyntaxBox x={96} y={330} w={760} step={1} size={28} lines={["{функтор}({терм1}, …, {термN})", "% запис {ім’я}/{N} – функтор з N аргументами"]} />
      <Code
        x={96}
        y={500}
        size={30}
        step={1}
        delay={24}
        stagger={12}
        code={`
          любить(джон, мері)        % любить/2
          точка(1, 2)               % точка/2
          відрізок(точка(1, 2), точка(4, 6))
        `}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {TEDGES.map(([a, b], i) => (
          <line key={i} x1={TREE[a].x} y1={TREE[a].y + 26} x2={TREE[b].x} y2={TREE[b].y - 26} stroke={C.cream} strokeWidth={2.5} opacity={clamp01(s(2, 10 + i * 4))} />
        ))}
      </svg>
      {TREE.map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: n.x - (n.kind === "f" ? 90 : 55),
            top: n.y - 26,
            width: n.kind === "f" ? 180 : 110,
            height: 52,
            border: `2.5px solid ${n.kind === "f" ? C.pink : C.lav}`,
            borderRadius: n.kind === "f" ? 4 : 26,
            background: "rgba(20,18,10,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 28,
            color: n.kind === "f" ? C.pink : C.lav,
            opacity: clamp01(s(2, i * 6, POP)),
          }}
        >
          {n.label}
        </div>
      ))}
      <At x={96} y={860} w={1720} step={3} size={34} weight={700}>
        Терм – це дерево: функтор у вузлі, аргументи – у гілках. Так само позначають предикати: <M>append/3</M> – append з трьома аргументами.
      </At>
    </Slide>
  );
};

/* Списки */
const LIST = [1, 2, 3, 4];

const Lists: React.FC = () => {
  const { s } = useSteps();
  const split = s(2, 0);
  const X0 = 1040;
  const Y = 420;
  return (
    <Slide title="Списки">
      <Lead>Список – елементи в квадратних дужках; оператор | відокремлює голову від хвоста.</Lead>
      <SyntaxBox x={96} y={330} w={800} step={1} size={28} lines={["[]                      % порожній список", "[{Голова} | {Хвіст}]    % перший елемент і решта"]} />
      <Code
        x={96}
        y={510}
        size={30}
        step={1}
        delay={20}
        stagger={12}
        code={`
          [a, b, c] = [a | [b, c]]    % true
          ?- [H|T] = [1, 2, 3, 4].
          @2 H = 1,
          @2 T = [2, 3, 4].
        `}
      />
      {LIST.map((v, i) => {
        const dx = i === 0 ? -60 * split : 40 * split;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X0 + i * 150 + dx,
              top: Y,
              width: 120,
              height: 100,
              border: `3px solid ${i === 0 ? (split > 0.5 ? C.pink : C.cream) : split > 0.5 ? C.lav : C.cream}`,
              borderRadius: 6,
              background: "rgba(20,18,10,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 44,
              color: C.text,
              opacity: clamp01(s(1, 10 + i * 6, POP)),
            }}
          >
            {v}
          </div>
        );
      })}
      <At x={X0 - 60} y={Y + 130} w={120} step={2} delay={10} size={34} weight={800} color={C.pink} font={F.mono} align="center">
        H
      </At>
      <At x={X0 + 190} y={Y + 152} w={420} step={2} delay={14} size={34} weight={800} color={C.lav} font={F.mono} align="center">
        T
      </At>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(split) }}>
        <path d={`M ${X0 + 180} ${Y + 120} L ${X0 + 180} ${Y + 140} L ${X0 + 620} ${Y + 140} L ${X0 + 620} ${Y + 120}`} fill="none" stroke={C.lav} strokeWidth={3} />
      </svg>
      <At x={96} y={860} w={1720} step={3} size={34} weight={700}>
        Списки обробляють рекурсією: базовий випадок – порожній список, рекурсивний – голова плюс обробка хвоста.
      </At>
    </Slide>
  );
};

/* Зіставлення зі зразком: як працює | */
const LM_CELLS = [1, 2, 3, 4];
const LM_X = (i: number) => 150 + i * 130;
const LM_W = 104;
const LM_PAT = [
  { v: "X", cx: LM_X(0) + LM_W / 2, at: 0, val: "1" },
  { v: "Y", cx: LM_X(1) + LM_W / 2, at: 26, val: "2" },
  { v: "T", cx: (LM_X(2) + LM_X(3) + LM_W) / 2, at: 52, val: "[3, 4]" },
];

const ListMatch: React.FC = () => {
  const { s, t } = useSteps();
  const PY = 510;
  const LY = 650;
  return (
    <Slide title="Зіставлення зі зразком: як працює |">
      <Lead>Зразок описує форму списку. Prolog зіставляє зразок зі списком і прив’язує змінні до відповідних частин.</Lead>
      <SyntaxBox
        x={96}
        y={290}
        w={820}
        step={1}
        size={27}
        lines={["[{Голова} | {Хвіст}]", "[{E1}, {E2} | {Хвіст}]   % кілька перших", "% хвіст – завжди список, можливо []"]}
      />
      <div style={{ position: "absolute", left: 96, top: PY + 4, fontFamily: F.mono, fontWeight: 700, fontSize: 34, color: C.dim, opacity: clamp01(s(2, 0)) }}>[</div>
      {LM_PAT.map((pt, i) => {
        const tt = t(2, pt.at);
        const p = s(2, pt.at, POP);
        const hot = pulse(tt, 10, 16);
        return (
          <div
            key={pt.v}
            style={{
              position: "absolute",
              left: pt.cx - 40,
              top: PY,
              width: 80,
              height: 60,
              border: `3px solid ${C.amber}`,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 34,
              color: C.amber,
              background: "rgba(242,193,78,0.12)",
              boxShadow: hot > 0.02 ? `0 0 ${26 * hot}px ${C.amber}` : undefined,
              opacity: clamp01(s(2, 0, POP)),
              transform: `translateY(${(1 - clamp01(p)) * -10}px)`,
            }}
          >
            {pt.v}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: (LM_X(1) + LM_W + LM_X(2)) / 2 - 10, top: PY + 4, fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.pink, opacity: clamp01(s(2, 0)) }}>|</div>
      <div style={{ position: "absolute", left: LM_X(3) + LM_W + 14, top: PY + 4, fontFamily: F.mono, fontWeight: 700, fontSize: 34, color: C.dim, opacity: clamp01(s(2, 0)) }}>]</div>
      {LM_CELLS.map((v, i) => {
        const owner = i < 2 ? LM_PAT[i] : LM_PAT[2];
        const bound = t(2, owner.at + 14) >= 0;
        const color = i < 2 ? C.lav : C.mint;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LM_X(i),
              top: LY,
              width: LM_W,
              height: 84,
              border: `3px solid ${bound ? color : C.cream}`,
              borderRadius: 6,
              background: bound ? `${color}22` : "rgba(20,18,10,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 40,
              color: C.text,
              opacity: clamp01(s(1, 20 + i * 5, POP)),
            }}
          >
            {v}
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {LM_PAT.map((pt) => {
          const k = clamp01(t(2, pt.at + 4) / 12);
          return k > 0 ? (
            <line key={pt.v} x1={pt.cx} y1={PY + 62} x2={pt.cx} y2={PY + 62 + (LY - PY - 66) * k} stroke={C.amber} strokeWidth={3} strokeDasharray="6 6" />
          ) : null;
        })}
        <path
          d={`M ${LM_X(2)} ${LY + 96} L ${LM_X(2)} ${LY + 110} L ${LM_X(3) + LM_W} ${LY + 110} L ${LM_X(3) + LM_W} ${LY + 96}`}
          fill="none"
          stroke={C.mint}
          strokeWidth={3}
          opacity={clamp01(s(2, LM_PAT[2].at + 14))}
        />
      </svg>
      {LM_PAT.map((pt, i) => (
        <div
          key={pt.v}
          style={{
            position: "absolute",
            left: pt.cx - 110,
            width: 220,
            top: LY + 120,
            textAlign: "center",
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 30,
            color: i < 2 ? C.lav : C.mint,
            opacity: clamp01(s(2, pt.at + 16)),
          }}
        >
          {`${pt.v} = ${pt.val}`}
        </div>
      ))}
      <Term
        x={980}
        y={290}
        w={844}
        h={580}
        step={3}
        p={s(3, 0, POP)}
        size={28}
        lines={[
          { text: "?- [H|T] = [a].", at: 0 },
          { text: "H = a, T = [].", at: 18 },
          { text: "?- [H|T] = [].", at: 36 },
          { text: "false.", at: 54, color: C.red },
          { text: "?- [_, Y|_] = [a, b, c].", at: 72 },
          { text: "Y = b.", at: 90 },
          { text: "?- [a|T] = [b, c].", at: 108 },
          { text: "false.", at: 126, color: C.red },
          { text: "?- [1, 2] = [1|[2|[]]].", at: 144 },
          { text: "true.", at: 162 },
        ]}
      />
      <At x={96} y={900} w={1720} step={4} size={32} weight={700}>
        Порожній список не має голови, тому <M c={C.red}>[H|T]</M> з ним не зіставляється; <M>_</M> пропускає елемент, не прив’язуючи його.
      </At>
    </Slide>
  );
};

/* Операції через зразки */
const OPS = [
  { title: "Перший елемент", color: C.lav, code: "перший([H|_], H).\n\n?- перший([a, b, c], X).\nX = a." },
  { title: "Останній елемент", color: C.pink, code: "останній([X], X).\nостанній([_|T], X) :-\n    останній(T, X).\n?- останній([a, b, c], X).  X = c." },
  { title: "Належність", color: C.amber, code: "належить(X, [X|_]).\nналежить(X, [_|T]) :-\n    належить(X, T).\n?- належить(b, [a, b, c]).  true." },
  { title: "Склеювання", color: C.mint, code: "склеїти([], L, L).\nсклеїти([H|T], L, [H|R]) :-\n    склеїти(T, L, R).\n?- склеїти([1, 2], [3], L).  L = [1, 2, 3]." },
];

const ListOps: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Операції через зразки">
      <Lead>
        Зразок працює в обидва боки: у тілі й аргументах він <A>розбирає</A> список, а в голові правила <A>будує</A> новий.
      </Lead>
      {OPS.map((o, i) => (
        <Win key={o.title} x={96 + (i % 2) * 878} y={280 + Math.floor(i / 2) * 300} w={850} h={280} title={o.title} titleColor={o.color} tag={`0${i + 1}`} p={s(i + 1, 0, POP)}>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 27, lineHeight: 1.45, color: C.mint, whiteSpace: "pre" }}>{o.code}</div>
        </Win>
      ))}
      <At x={96} y={900} w={1720} step={4} delay={30} size={30} weight={700}>
        У <M>склеїти([H|T], L, [H|R])</M> голова результату та сама, що й першого списку, а хвіст <M>R</M> обчислює рекурсія.
      </At>
    </Slide>
  );
};

/* Рекурсія над списками: довжина */
const FRAMES_LEN = [
  { call: "довжина([a, b, c], N)", res: "N = 3" },
  { call: "довжина([b, c], N1)", res: "N1 = 2" },
  { call: "довжина([c], N2)", res: "N2 = 1" },
  { call: "довжина([], N3)", res: "N3 = 0" },
];
const LEN_GAP = 26;

const Length: React.FC = () => {
  const { s, t } = useSteps();
  return (
    <Slide title="Рекурсія: довжина списку">
      <Lead>Базовий випадок обробляє порожній список; рекурсивний відкидає голову й рахує хвіст.</Lead>
      <Code
        x={96}
        y={330}
        size={30}
        step={1}
        stagger={12}
        code={`
          довжина([], 0).
          довжина([_|T], N) :-
              довжина(T, N1),
              N is N1 + 1.
        `}
      />
      {FRAMES_LEN.map((f, i) => {
        const down = s(2, i * LEN_GAP, POP);
        const upAt = (FRAMES_LEN.length - 1 - i) * LEN_GAP + FRAMES_LEN.length * LEN_GAP;
        const up = s(2, upAt, POP);
        const hot = pulse(t(2, upAt), 4, 14);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 1000 + i * 36,
              top: 330 + i * 116,
              width: 700,
              height: 92,
              border: `2.5px solid ${up > 0.5 ? C.mint : C.cream}`,
              borderRadius: 6,
              background: "rgba(20,18,10,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              boxSizing: "border-box",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 30,
              color: C.text,
              boxShadow: hot > 0.02 ? `0 0 ${26 * hot}px ${C.mint}` : undefined,
              opacity: clamp01(down),
              transform: `translateX(${(1 - down) * 40}px)`,
            }}
          >
            <span>{f.call}</span>
            <span style={{ color: C.mint, opacity: clamp01(up) }}>{f.res}</span>
          </div>
        );
      })}
      <At x={96} y={580} w={820} step={2} delay={10} size={29} weight={700} color={C.dim}>
        вниз – виклики для дедалі коротших хвостів; вгору – N обчислюється на зворотному шляху
      </At>
      <At x={96} y={860} w={1720} step={3} size={34} weight={700}>
        Кожен рекурсивний виклик працює з коротшим списком, тому рекурсія гарантовано доходить до <M>[]</M>.
      </At>
    </Slide>
  );
};

/* Додати та обернути */
const Reverse: React.FC = () => {
  const { s } = useSteps();
  const rows = [
    { call: "обернути([3], R)", r: "[3]" },
    { call: "обернути([2, 3], R)", r: "[3, 2]" },
    { call: "обернути([1, 2, 3], R)", r: "[3, 2, 1]" },
  ];
  return (
    <Slide title="Рекурсія: додати й обернути">
      <Lead>Додавання в голову – один крок; обертання переносить голову в кінець оберненого хвоста.</Lead>
      <Code
        x={96}
        y={330}
        size={29}
        step={1}
        stagger={10}
        code={`
          додати_елемент(X, L, [X|L]).
          обернути([], []).
          обернути([H|T], R) :-
              обернути(T, R1),
              append(R1, [H], R).
        `}
      />
      {rows.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 1040, top: 350 + i * 110, display: "flex", gap: 24, alignItems: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 31, opacity: clamp01(s(2, i * 24, POP)) }}>
          <span style={{ color: C.text }}>{r.call}</span>
          <span style={{ color: C.faint }}>→</span>
          <span style={{ color: C.mint, padding: "6px 14px", border: `2.5px solid ${C.mint}`, borderRadius: 4 }}>{r.r}</span>
        </div>
      ))}
      <Win x={96} y={640} w={1728} title="Чому саме append" titleColor={C.amber} p={s(3, 0, POP)} pad="14px 22px">
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.text, lineHeight: 1.45 }}>
          Якщо замість <M>append(R1, [H], R)</M> додати H у голову, вийде <M c={C.red}>[1, 2, 3]</M> – той самий список: голова має опинитися в кінці.
        </div>
      </Win>
    </Slide>
  );
};

/* Вбудовані предикати для списків */
const Builtins: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Вбудовані предикати для списків">
      <Lead>
        Типові операції вже є в системі; запис <M>append/3</M> означає предикат append з трьома аргументами.
      </Lead>
      <Term
        x={96}
        y={330}
        w={1728}
        h={540}
        step={1}
        p={s(1, 0, POP)}
        size={30}
        lines={[
          { text: "?- append([1, 2], [3], L).", at: 0 },
          { text: "L = [1, 2, 3].", at: 26 },
          { text: "?- member(b, [a, b, c]).", at: 50 },
          { text: "true.", at: 74 },
          { text: "?- length([a, b], N).", at: 98 },
          { text: "N = 2.", at: 122 },
          { text: "?- subset([a], [a, b]).", at: 146 },
          { text: "true.", at: 170 },
        ]}
      />
    </Slide>
  );
};

/* Атоми і стрічки */
const HELLO = ["H", "e", "l", "l", "o"];
const CODES = [72, 101, 108, 108, 111];

const Strings: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Атоми і стрічки">
      <Lead>Атоми й стрічки – різні типи даних, і працюють з ними по-різному.</Lead>
      <Win x={96} y={290} w={820} h={300} title="Атоми" titleColor={C.mint} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: C.mint, lineHeight: 1.6, whiteSpace: "pre" }}>{"hello\n'Hello World'"}</div>
        <div style={{ marginTop: 10, fontFamily: F.body, fontWeight: 700, fontSize: 29, color: C.dim }}>без лапок або в одинарних, якщо є пробіли чи спецсимволи</div>
      </Win>
      <Win x={1004} y={290} w={820} h={300} title="Стрічки" titleColor={C.orange} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: C.orange }}>"Hello World"</div>
        <div style={{ marginTop: 10, fontFamily: F.body, fontWeight: 700, fontSize: 29, color: C.dim, lineHeight: 1.4 }}>
          значення подвійних лапок залежить від системи та прапорця double_quotes
        </div>
      </Win>
      {HELLO.map((ch, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 300 + i * 150, top: 650, width: 110, height: 80, border: `2.5px solid ${C.orange}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.orange, opacity: clamp01(s(3, i * 6, POP)) }}>
            {ch}
          </div>
          <div style={{ position: "absolute", left: 300 + i * 150, top: 760, width: 110, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 34, color: C.lav, opacity: clamp01(s(3, 20 + i * 6)) }}>
            {CODES[i]}
          </div>
        </React.Fragment>
      ))}
      <At x={1100} y={680} w={720} step={3} delay={30} size={30} weight={700} color={C.text}>
        У класичному Prolog <M c={C.orange}>"Hello"</M> – це список кодів символів <M c={C.lav}>[72, 101, 108, 108, 111]</M>.
      </At>
      <At x={96} y={880} w={1720} step={4} size={32} weight={700}>
        У SWI-Prolog 7+ подвійні лапки за замовчуванням створюють окремий тип <A>string</A>; список кодів дає прапорець double_quotes = codes.
      </At>
    </Slide>
  );
};

/* Підсумок */
const POINTS: React.ReactNode[] = [
  <>
    Логічне програмування описує <A>що</A> відомо про задачу, а пошук відповіді бере на себе система виведення.
  </>,
  <>
    Шлях до Prolog пролягає від формальної логіки Фреге через принцип резолюції Робінсона до мови Колмерое та теорії хорнівських диз’юнктів
    Ковальського.
  </>,
  <>
    Prolog-програма складається з <A>фактів</A>, <A>правил</A> і <A>запитів</A>: кома в тілі правила означає «і», крапка з комою – «або».
  </>,
  <>Змінна в Prolog – невідоме: у межах запиту вона прив’язується один раз, а анонімна змінна _ позначає значення, яке не важливе.</>,
  <>Недетермінований предикат може дати кілька відповідей: Prolog запам’ятовує місце пошуку й на запит «;» продовжує звідти.</>,
  <>
    Дані в Prolog – терми: атоми, числа, змінні, складені терми, списки зі структурою <M>[H|T]</M> і стрічки, які обробляють переважно рекурсією.
  </>,
];

const Summary: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Підсумок">
      {POINTS.map((p, i) => {
        const a = s(0, 14 + i * 9, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 110,
              top: 196 + i * 136,
              width: 1690,
              display: "flex",
              alignItems: "flex-start",
              gap: 28,
              opacity: clamp01(a),
              transform: `translateX(${(1 - a) * -30}px)`,
            }}
          >
            <Num n={i + 1} size={46} style={{ marginTop: 2 }} />
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 34, lineHeight: 1.4, color: C.text }}>{p}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "types", title: "Типи даних", steps: [40, 80], C: Types },
  { id: "compound", title: "Складені терми", steps: [40, 60, 60, 60], C: Compound },
  { id: "lists", title: "Списки", steps: [40, 70, 60, 60], C: Lists },
  { id: "list-match", title: "Зіставлення зі зразком", steps: [45, 50, 90, 190, 60], C: ListMatch },
  { id: "list-ops", title: "Операції через зразки", steps: [45, 40, 40, 40, 70], C: ListOps },
  { id: "length", title: "довжина/2", steps: [40, 60, 8 * LEN_GAP + 30, 60], C: Length },
  { id: "reverse", title: "обернути/2", steps: [40, 60, 80, 60], C: Reverse },
  { id: "builtins", title: "Вбудовані предикати", steps: [40, 210], C: Builtins },
  { id: "strings", title: "Атоми і стрічки", steps: [40, 50, 50, 70, 60], C: Strings },
];
export const summarySlide: SlideDef = { id: "summary", title: "Підсумок", steps: [100], C: Summary };
