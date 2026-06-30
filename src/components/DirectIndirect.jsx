import { useState } from "react";

const C = {
  violet: {
    bg: "var(--color-primary-highlight)",
    border: "var(--color-primary)",
    text: "var(--color-primary)",
    soft: "var(--color-primary-highlight)",
  },
  green: {
    bg: "var(--color-success-highlight)",
    border: "var(--color-success)",
    text: "var(--color-success)",
    soft: "var(--color-success-highlight)",
  },
  amber: {
    bg: "var(--color-gold-highlight)",
    border: "var(--color-gold)",
    text: "var(--color-gold)",
    soft: "var(--color-gold-highlight)",
  },
  rose: {
    bg: "var(--color-error-highlight)",
    border: "var(--color-error)",
    text: "var(--color-error)",
    soft: "var(--color-error-highlight)",
  },
  blue: {
    bg: "var(--color-primary-highlight)",
    border: "var(--color-primary)",
    text: "var(--color-primary)",
    soft: "var(--color-primary-highlight)",
  },
};

/* ── DATA ─────────────────────────────────────────────────────────────── */

const DIRECT_INDIRECT_PAIRS = [
  {
    type: "Statement",
    direct: "Er sagt: „Ich bin müde.",
    indirect: "Er sagt, er sei müde.",
    indirectDass: "Er sagt, dass er müde sei.",
    note: "Accusative object becomes nominative subject in passive; here the verb shifts to Konj. I.",
  },
  {
    type: "Yes/No Question",
    direct: "Sie fragt: „Kommst du morgen?",
    indirect: "Sie fragt, ob ich morgen komme.",
    indirectDass: null,
    note: "ob introduces indirect yes/no questions. Verb goes to the end.",
  },
  {
    type: "W-Question",
    direct: "Er fragt: „Wann kommst du?",
    indirect: "Er fragt, wann ich komme.",
    indirectDass: null,
    note: "The W-word takes over the conjunction role. Verb-final order applies.",
  },
  {
    type: "Request / Command",
    direct: "Er sagt: „Hilf mir bitte.",
    indirect: "Er bittet mich, ihm zu helfen.",
    indirectDass: "Er sagte, ich solle ihm helfen.",
    note: "Commands become zu-infinitive constructions or use soll/solle.",
  },
  {
    type: "Future",
    direct: "Sie sagt: „Ich werde morgen kommen.",
    indirect: "Sie sagt, sie werde morgen kommen.",
    indirectDass: null,
    note: "werde is the Konj. I form of werden here.",
  },
  {
    type: "Completed Past",
    direct: "Er sagt: „Ich habe die Arbeit beendet.",
    indirect: "Er sagt, er habe die Arbeit beendet.",
    indirectDast: null,
    note: "Konj. I of haben + Partizip II signals a completed action.",
  },
  {
    type: "Hypothetical",
    direct: "Sie sagt: „Ich würde bleiben, wenn ich Zeit hätte.",
    indirect: "Sie sagt, sie würde bleiben, wenn sie Zeit hätte.",
    indirectDass: null,
    note: "Konj. II stays intact inside reported speech when the original is hypothetical.",
  },
];

const KONJ1_FORMS = [
  { verb: "sein", ich: "sei", er: "sei", wir: "seien", sie_pl: "seien" },
  { verb: "haben", ich: "habe", er: "habe", wir: "haben", sie_pl: "haben" },
  {
    verb: "werden",
    ich: "werde",
    er: "werde",
    wir: "werden",
    sie_pl: "werden",
  },
  {
    verb: "kommen",
    ich: "komme",
    er: "komme",
    wir: "kommen",
    sie_pl: "kommen",
  },
  { verb: "gehen", ich: "gehe", er: "gehe", wir: "gehen", sie_pl: "gehen" },
  {
    verb: "wissen",
    ich: "wisse",
    er: "wisse",
    wir: "wissen",
    sie_pl: "wissen",
  },
];

const KONJ2_FORMS = [
  {
    verb: "sein",
    form: "wäre",
    polite: "Das wäre besser.",
    unreal: "Wenn ich du wäre, …",
  },
  {
    verb: "haben",
    form: "hätte",
    polite: "Ich hätte gern einen Kaffee.",
    unreal: "Wenn ich Zeit hätte, …",
  },
  {
    verb: "können",
    form: "könnte",
    polite: "Könnten Sie mir helfen?",
    unreal: "Er könnte kommen, wenn …",
  },
  {
    verb: "müssen",
    form: "müsste",
    polite: "Du müsstest das probieren.",
    unreal: "Das müsste reichen.",
  },
  {
    verb: "sollen",
    form: "sollte",
    polite: "Das sollte man wissen.",
    unreal: "Er sagte, er solle warten.",
  },
  {
    verb: "dürfen",
    form: "dürfte",
    polite: "Das dürfte schwierig sein.",
    unreal: "Er dürfte recht haben.",
  },
];

const KONJ1_USES = [
  {
    label: "News reporting",
    example: "Der Minister sagte, die Reform sei notwendig.",
  },
  {
    label: "Official reports",
    example: "Das Unternehmen erklärte, es habe keine Kenntnis davon.",
  },
  { label: "Formal narration", example: "Er behauptet, er wisse von nichts." },
  {
    label: "Distancing from claim",
    example: "Die Lage werde sich verbessern, hieß es.",
  },
];

const KONJ2_USES = [
  {
    label: "Hypothetical",
    example: "Wenn ich mehr Zeit hätte, würde ich mehr lesen.",
  },
  { label: "Wish", example: "Ich wäre jetzt gern zu Hause." },
  { label: "Polite request", example: "Könnten Sie mir bitte helfen?" },
  {
    label: "Counterfactual",
    example: "Wenn er früher gegangen wäre, hätte er den Zug erwischt.",
  },
  {
    label: "Backup in indirect speech",
    example:
      "Er sagte, er käme später. (Konj. I = käme unclear → Konj. II steps in)",
  },
];

const KONJ1_VS_KONJ2_INDIRECT = [
  {
    label: "Preferred formal report",
    sentence: "Er sagte, er sei krank.",
    tag: "Konj. I",
    color: "violet",
    note: "Standard in formal writing and news.",
  },
  {
    label: "Backup when Konj. I is ambiguous",
    sentence: "Er sagte, er wäre krank.",
    tag: "Konj. II",
    color: "green",
    note: "Used when Konj. I form is identical to the indicative.",
  },
];

const MISTAKES = [
  "Treating Konj. I and II as ordinary tenses instead of moods.",
  "Assuming Konj. II belongs only to indirect speech — its main domain is hypothetical and unreal meaning.",
  "Adding quotation marks to indirect speech, which would make it direct speech.",
  "Forgetting ob for indirect yes/no questions.",
  "Forgetting verb-final structure in indirect questions and subordinate reported clauses.",
  "Confusing direct exact quotation with indirect content reporting.",
  "Overusing Konj. I in everyday speech where indicative or würde-forms are more natural.",
];

const LEVELS = [
  {
    level: "A2–B1",
    focus:
      "Direct vs indirect speech basics, ob, indirect question words, dass-clauses.",
  },
  {
    level: "B1–B2",
    focus: "Stronger control of Konj. II for polite and hypothetical meaning.",
  },
  {
    level: "B2",
    focus:
      "Recognition and productive use of Konj. I in formal reported speech, especially in reading and writing.",
  },
];

const MEMORY_RULES = [
  ["Direct speech", "Exact words in quotation marks."],
  ["Indirect speech", "Reported content — no quotation marks."],
  [
    "Konjunktiv I",
    "Classic marker of formal reported speech: 'someone says that …'",
  ],
  [
    "Konjunktiv II",
    "Unreality, wishes, politeness, conditions — and backup in indirect speech.",
  ],
  ["ob", "Needed for indirect yes/no questions."],
  ["W-word", "Takes the conjunction role in indirect W-questions."],
  [
    "worden vs geworden",
    "Passive perfect uses worden; 'to become' uses geworden.",
  ],
];

const TABS = [
  ["direct", "Direct Speech", "blue"],
  ["indirect", "Indirect Speech", "violet"],
  ["konj1", "Konjunktiv I", "green"],
  ["konj2", "Konjunktiv II", "amber"],
  ["compare", "Side by Side", "rose"],
  ["mistakes", "Mistakes", "rose"],
];

/* ── SHARED ───────────────────────────────────────────────────────────── */

function Pill({ text, color = "blue" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "var(--radius-full)",
        background: C[color].soft,
        color: C[color].text,
        fontWeight: 800,
        fontSize: "var(--text-xs)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
}

function Card({ color = "blue", children, style = {} }) {
  return (
    <div
      style={{
        background: C[color].bg,
        border: `1.5px solid ${C[color].border}`,
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-4)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <div
      style={{
        fontWeight: 900,
        fontSize: "var(--text-lg)",
        color: "var(--color-text)",
        marginBottom: "var(--space-3)",
      }}
    >
      {children}
    </div>
  );
}

function MiniTable({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "var(--space-2) var(--space-3)",
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-muted)",
                  background: "var(--color-surface-2)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid var(--color-divider)",
                background:
                  i % 2 === 0 ? "transparent" : "var(--color-surface-2)",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExBox({ children, color = "violet" }) {
  return (
    <div
      style={{
        background: "var(--color-surface-2)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-3) var(--space-4)",
        border: `1px solid ${C[color].border}`,
        fontWeight: 700,
        color: "var(--color-text)",
        fontSize: "var(--text-sm)",
      }}
    >
      {children}
    </div>
  );
}

/* ── DIRECT SPEECH TAB ────────────────────────────────────────────────── */

function DirectTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <Card color="blue">
          <CardTitle>What it is</CardTitle>
          <p
            style={{
              margin: "0 0 var(--space-3)",
              color: "var(--color-text)",
              lineHeight: 1.65,
              fontSize: "var(--text-sm)",
            }}
          >
            Direct speech reproduces the speaker's exact words, usually with
            quotation marks and a reporting clause. Normal indicative forms are
            used — no Konjunktiv required.
          </p>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {[
              "Er sagt: „Ich bin müde.",
              "Sie fragte: „Kommst du morgen?",
              "Der Lehrer erklärte: „Die Prüfung beginnt um neun Uhr.",
            ].map((ex, i) => (
              <ExBox key={i} color="blue">
                {ex}
              </ExBox>
            ))}
          </div>
        </Card>

        <Card color="violet">
          <CardTitle>Reporting clause positions</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {[
              ["Reporting clause first", `Er sagt: „Ich bin müde."`],
              ["Quote first", `„Ich bin müde", sagt er.`],
              ["Clause inserted", `„Ich", sagt er, „bin müde."`],
            ].map(([label, ex], i) => (
              <div key={i} style={{ display: "grid", gap: "var(--space-1)" }}>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {label}
                </div>
                <ExBox color="violet">{ex}</ExBox>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card color="amber">
        <CardTitle>Points to watch</CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {[
            "Direct speech preserves the original person, tense, and wording of the speaker.",
            "Questions and commands stay in their original form inside the quotation.",
            "Adding Konjunktiv inside direct speech is generally not needed — the quote is reproduced as-is.",
            "Punctuation conventions vary, but the grammatical distinction from indirect speech is what matters.",
          ].map((note, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-3)",
                border: "1px solid var(--color-divider)",
                color: "var(--color-text)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
              }}
            >
              {note}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── INDIRECT SPEECH TAB ──────────────────────────────────────────────── */

function IndirectTab() {
  const [index, setIndex] = useState(0);
  const pair = DIRECT_INDIRECT_PAIRS[index];

  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="violet">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          <div>
            <CardTitle>Transformation explorer</CardTitle>
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              Step through each sentence type to see how direct speech becomes
              indirect.
            </div>
          </div>
          <Pill
            text={`${index + 1} / ${DIRECT_INDIRECT_PAIRS.length}`}
            color="violet"
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginBottom: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          {DIRECT_INDIRECT_PAIRS.map((p, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-full)",
                border:
                  index === i
                    ? `2px solid ${C.violet.border}`
                    : "1px solid var(--color-border)",
                background:
                  index === i ? C.violet.soft : "var(--color-surface-2)",
                color: index === i ? C.violet.text : "var(--color-text-muted)",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "var(--text-xs)",
              }}
            >
              {p.type}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-3)",
            }}
          >
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <Pill text="Direct" color="blue" />
              <ExBox color="blue">{pair.direct}</ExBox>
            </div>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <Pill text="Indirect" color="violet" />
              <ExBox color="violet">{pair.indirect}</ExBox>
            </div>
          </div>
          {pair.indirectDass && (
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <Pill text="With dass" color="green" />
              <ExBox color="green">{pair.indirectDass}</ExBox>
            </div>
          )}
          <div
            style={{
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-3)",
              border: "1px solid var(--color-divider)",
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.6,
            }}
          >
            {pair.note}
          </div>
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <Card color="green">
          <CardTitle>When it is used</CardTitle>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.2rem",
              display: "grid",
              gap: "var(--space-2)",
              color: "var(--color-text)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.7,
            }}
          >
            {[
              "The doer is reporting, not asserting.",
              "Journalism and official reports.",
              "Academic or formal writing.",
              "Distancing from the truth value of a claim.",
              "Narration where exact words are not reproduced.",
            ].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card color="amber">
          <CardTitle>Level at a glance</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {LEVELS.map((l, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3)",
                  border: "1px solid var(--color-divider)",
                }}
              >
                <Pill text={l.level} color={["blue", "violet", "green"][i]} />
                <div
                  style={{
                    marginTop: "var(--space-2)",
                    color: "var(--color-text)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                  }}
                >
                  {l.focus}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── KONJUNKTIV I TAB ─────────────────────────────────────────────────── */

function Konj1Tab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "var(--space-4)",
        }}
      >
        <Card color="green">
          <CardTitle>What it does</CardTitle>
          <p
            style={{
              margin: "0 0 var(--space-3)",
              color: "var(--color-text)",
              lineHeight: 1.65,
              fontSize: "var(--text-sm)",
            }}
          >
            Konjunktiv I is the standard formal mood of indirect speech. It
            marks that a statement is being reported from another source rather
            than asserted by the current speaker or writer.
          </p>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {KONJ1_USES.map((item, i) => (
              <div key={i} style={{ display: "grid", gap: "var(--space-1)" }}>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {item.label}
                </div>
                <ExBox color="green">{item.example}</ExBox>
              </div>
            ))}
          </div>
        </Card>

        <Card color="violet">
          <CardTitle>High-frequency forms</CardTitle>
          <div
            style={{
              marginBottom: "var(--space-3)",
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
            }}
          >
            Memorize these first — they appear most often and are visibly
            different from the indicative.
          </div>
          <MiniTable
            headers={["Verb", "ich", "er/sie/es", "wir", "sie/Sie"]}
            rows={KONJ1_FORMS.map((f) => [
              <strong>{f.verb}</strong>,
              <span style={{ color: C.green.text, fontWeight: 800 }}>
                {f.ich}
              </span>,
              <span style={{ color: C.green.text, fontWeight: 800 }}>
                {f.er}
              </span>,
              <span style={{ color: "var(--color-text-muted)" }}>{f.wir}</span>,
              <span style={{ color: "var(--color-text-muted)" }}>
                {f.sie_pl}
              </span>,
            ])}
          />
          <div
            style={{
              marginTop: "var(--space-3)",
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.6,
            }}
          >
            wir and sie/Sie forms often match the indicative, which is exactly
            why Konj. II steps in as a backup.
          </div>
        </Card>
      </div>

      <Card color="amber">
        <CardTitle>With vs without dass</CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
          }}
        >
          {[
            {
              label: "Without dass (verb stays main-clause position)",
              examples: [
                "Er sagt, er sei müde.",
                "Sie erklärte, die Prüfung beginne um neun.",
              ],
            },
            {
              label: "With dass (verb-final in subordinate clause)",
              examples: [
                "Er sagt, dass er müde sei.",
                "Sie erklärte, dass die Prüfung um neun beginne.",
              ],
            },
          ].map((group, i) => (
            <div key={i} style={{ display: "grid", gap: "var(--space-2)" }}>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-muted)",
                }}
              >
                {group.label}
              </div>
              {group.examples.map((ex, j) => (
                <ExBox key={j} color={i === 0 ? "violet" : "green"}>
                  {ex}
                </ExBox>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card color="blue">
        <CardTitle>Time reference inside Konj. I</CardTitle>
        <MiniTable
          headers={["Time frame", "Example", "What signals time"]}
          rows={[
            ["Present", "Er sagt, er sei krank.", "Present Konj. I of sein"],
            [
              "Completed past",
              "Er sagt, er habe die Arbeit beendet.",
              "Konj. I of haben + Partizip II",
            ],
            ["Future", "Er sagt, er werde morgen kommen.", "Konj. I of werden"],
          ]}
        />
      </Card>
    </div>
  );
}

/* ── KONJUNKTIV II TAB ────────────────────────────────────────────────── */

function Konj2Tab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <Card color="amber">
          <CardTitle>Main uses</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {KONJ2_USES.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3)",
                  border: "1px solid var(--color-divider)",
                }}
              >
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-text-muted)",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    color: "var(--color-text)",
                    fontWeight: 700,
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {item.example}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card color="rose">
          <CardTitle>Core forms</CardTitle>
          <MiniTable
            headers={[
              "Verb",
              "Konj. II",
              "Polite use",
              "Unreal / Hypothetical",
            ]}
            rows={KONJ2_FORMS.map((f) => [
              <strong>{f.verb}</strong>,
              <span style={{ color: C.rose.text, fontWeight: 800 }}>
                {f.form}
              </span>,
              f.polite,
              f.unreal,
            ])}
          />
        </Card>
      </div>

      <Card color="violet">
        <CardTitle>würde + infinitive</CardTitle>
        <p
          style={{
            margin: "0 0 var(--space-3)",
            color: "var(--color-text)",
            lineHeight: 1.65,
            fontSize: "var(--text-sm)",
          }}
        >
          The würde + infinitive structure is the most practical form of Konj.
          II in modern German, especially when synthetic Konj. II forms would
          sound unnatural or ambiguous.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {[
            "Ich würde kommen.",
            "Wir würden das anders machen.",
            "Wenn ich genug Geld hätte, würde ich reisen.",
            "Er würde helfen, wenn er Zeit hätte.",
          ].map((ex, i) => (
            <ExBox key={i} color="violet">
              {ex}
            </ExBox>
          ))}
        </div>
      </Card>

      <Card color="green">
        <CardTitle>Konj. II as backup in indirect speech</CardTitle>
        <p
          style={{
            margin: "0 0 var(--space-3)",
            color: "var(--color-text)",
            lineHeight: 1.65,
            fontSize: "var(--text-sm)",
          }}
        >
          When a Konj. I form looks identical to the indicative, German switches
          to Konj. II to preserve the signal of reportedness.
        </p>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {KONJ1_VS_KONJ2_INDIRECT.map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-3)",
                border: `1px solid ${C[item.color].border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  alignItems: "center",
                  marginBottom: "var(--space-2)",
                }}
              >
                <Pill text={item.tag} color={item.color} />
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--color-text)",
                  marginBottom: "var(--space-1)",
                }}
              >
                {item.sentence}
              </div>
              <div
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── SIDE BY SIDE TAB ─────────────────────────────────────────────────── */

function CompareTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="blue">
        <CardTitle>Direct vs indirect — side by side</CardTitle>
        <MiniTable
          headers={["Direct speech", "Indirect speech", "What changes"]}
          rows={[
            [
              `Er sagt: „Ich komme morgen."`,
              "Er sagt, er komme morgen.",
              "Exact quote → Konj. I verb form",
            ],
            [
              `Sie fragt: „Hast du Zeit?"`,
              "Sie fragt, ob ich Zeit habe / hätte.",
              "? → ob + Konj. I or II",
            ],
            [
              `Er fragt: „Wann kommst du?"`,
              "Er fragt, wann ich komme.",
              "W-word takes the conjunction role",
            ],
            [
              `Er sagt: „Hilf mir bitte."`,
              "Er bittet mich, ihm zu helfen.",
              "Command → zu-infinitive",
            ],
          ]}
        />
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <Card color="violet">
          <CardTitle>Konjunktiv I vs II — at a glance</CardTitle>
          <MiniTable
            headers={["", "Konj. I", "Konj. II"]}
            rows={[
              [
                "Core role",
                "Formal reported speech marker",
                "Unreality, wishes, politeness, conditions",
              ],
              [
                "Where used",
                "Indirect speech, journalism, formal writing",
                "Everyday hypotheticals, polite requests, backup in indirect speech",
              ],
              [
                "Key forms",
                "sei, habe, werde, komme",
                "wäre, hätte, könnte, würde + inf.",
              ],
              [
                "Trigger",
                "Reporting what someone said",
                "Imagining, wishing, being polite, conditionality",
              ],
            ]}
          />
        </Card>

        <Card color="amber">
          <CardTitle>Memory rules</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {MEMORY_RULES.map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3)",
                  border: "1px solid var(--color-divider)",
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    color: C.amber.text,
                    flexShrink: 0,
                  }}
                >
                  {rule[0]}
                </span>
                <span
                  style={{
                    color: "var(--color-text)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                  }}
                >
                  {rule[1]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── MISTAKES TAB ─────────────────────────────────────────────────────── */

function MistakesTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="rose">
        <CardTitle>Common mistakes</CardTitle>
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          {MISTAKES.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-3)",
                border: "1px solid var(--color-divider)",
              }}
            >
              <span
                style={{ color: C.rose.text, fontWeight: 900, flexShrink: 0 }}
              >
                {i + 1}.
              </span>
              <span
                style={{
                  color: "var(--color-text)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card color="green">
        <CardTitle>Ultra-short master formula</CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {[
            ["Direct speech", "Exact quote in quotation marks.", "blue"],
            ["Indirect speech", "Reported content — no quote marks.", "violet"],
            [
              "Konjunktiv I",
              '"Someone says that …" — formal reported speech.',
              "green",
            ],
            [
              "Konjunktiv II",
              '"Would, could, were, if only" — and backup in indirect speech.',
              "amber",
            ],
          ].map(([label, desc, col], i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                border: `1px solid ${C[col].border}`,
              }}
            >
              <Pill text={label} color={col} />
              <div
                style={{
                  marginTop: "var(--space-2)",
                  color: "var(--color-text)",
                  fontWeight: 700,
                  lineHeight: 1.55,
                  fontSize: "var(--text-sm)",
                }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────────────────────── */

export default function DirectIndirect() {
  const [tab, setTab] = useState("direct");

  const renderTab = () => {
    switch (tab) {
      case "direct":
        return <DirectTab />;
      case "indirect":
        return <IndirectTab />;
      case "konj1":
        return <Konj1Tab />;
      case "konj2":
        return <Konj2Tab />;
      case "compare":
        return <CompareTab />;
      case "mistakes":
        return <MistakesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="pronouns-page">
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <span style={{ fontSize: "2rem" }}>💬</span>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                color: "var(--color-text)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Direct &amp; Indirect Speech
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              Direct speech · Indirect speech · Konjunktiv I · Konjunktiv II ·
              A2 to B2
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-1)",
          padding: "var(--space-1)",
          background: "var(--color-surface-2)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          marginBottom: "var(--space-6)",
        }}
      >
        {TABS.map(([id, label, color]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-4)",
              borderRadius: "var(--radius-lg)",
              border: "none",
              cursor: "pointer",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              transition: "all 150ms ease",
              background: tab === id ? C[color].border : "transparent",
              color:
                tab === id
                  ? "var(--color-surface-2)"
                  : "var(--color-text-muted)",
              boxShadow: tab === id ? "var(--shadow-sm)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {renderTab()}
      </div>
    </div>
  );
}
