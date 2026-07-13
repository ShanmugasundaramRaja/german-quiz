// SeparableVerbs.jsx
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SEPARABLE_PREFIXES = [
  "ab-",
  "an-",
  "auf-",
  "aus-",
  "bei-",
  "ein-",
  "her-",
  "hin-",
  "los-",
  "mit-",
  "nach-",
  "vor-",
  "weg-",
  "zu-",
  "zurück-",
];

const INSEPARABLE_PREFIXES = [
  "be-",
  "emp-",
  "ent-",
  "er-",
  "ge-",
  "miss-",
  "ver-",
  "zer-",
];

const AMBIGUOUS_PREFIXES = [
  "durch-",
  "hinter-",
  "über-",
  "um-",
  "unter-",
  "wider-",
];

const SEPARABLE_EXAMPLES = [
  {
    verb: "anrufen",
    present: "ruft an",
    partizip: "angerufen",
    type: "irregular",
  },
  {
    verb: "aufstehen",
    present: "steht auf",
    partizip: "aufgestanden",
    type: "irregular",
  },
  {
    verb: "einkaufen",
    present: "kauft ein",
    partizip: "eingekauft",
    type: "regular",
  },
  {
    verb: "zuhören",
    present: "hört zu",
    partizip: "zugehört",
    type: "regular",
  },
  {
    verb: "mitkommen",
    present: "kommt mit",
    partizip: "mitgekommen",
    type: "irregular",
  },
  {
    verb: "zurückgehen",
    present: "geht zurück",
    partizip: "zurückgegangen",
    type: "irregular",
  },
  {
    verb: "zumachen",
    present: "macht zu",
    partizip: "zugemacht",
    type: "regular",
  },
  {
    verb: "einladen",
    present: "lädt ein",
    partizip: "eingeladen",
    type: "irregular",
  },
];

const INSEPARABLE_EXAMPLES = [
  {
    verb: "bekommen",
    present: "bekommt",
    partizip: "bekommen",
    type: "irregular",
  },
  {
    verb: "empfinden",
    present: "empfindet",
    partizip: "empfunden",
    type: "irregular",
  },
  {
    verb: "entdecken",
    present: "entdeckt",
    partizip: "entdeckt",
    type: "regular",
  },
  {
    verb: "erklären",
    present: "erklärt",
    partizip: "erklärt",
    type: "regular",
  },
  {
    verb: "missverstehen",
    present: "missversteht",
    partizip: "missverstanden",
    type: "irregular",
  },
  {
    verb: "verlieren",
    present: "verliert",
    partizip: "verloren",
    type: "irregular",
  },
  {
    verb: "zerstören",
    present: "zerstört",
    partizip: "zerstört",
    type: "regular",
  },
  {
    verb: "verstehen",
    present: "versteht",
    partizip: "verstanden",
    type: "irregular",
  },
  {
    verb: "besuchen",
    present: "besucht",
    partizip: "besucht",
    type: "regular",
  },
];

const AMBIGUOUS_CONTRASTS = [
  {
    prefix: "um-",
    pairs: [
      {
        verb: "umfahren",
        sep: {
          meaning: "drive around something",
          stress: "UM·fahren",
          example: "Er fährt den Baum um.",
          en: "He drives around the tree.",
        },
        insep: {
          meaning: "run something over",
          stress: "um·FAH·ren",
          example: "Er umfährt den Baum.",
          en: "He runs the tree over.",
        },
      },
    ],
  },
  {
    prefix: "über-",
    pairs: [
      {
        verb: "übersetzen",
        sep: {
          meaning: "ferry across",
          stress: "Ü·ber·setzen",
          example: "Der Fährmann setzt die Passagiere über.",
          en: "The ferryman ferries the passengers across.",
        },
        insep: {
          meaning: "translate",
          stress: "ü·ber·SET·zen",
          example: "Sie übersetzt den Text ins Englische.",
          en: "She translates the text into English.",
        },
      },
    ],
  },
  {
    prefix: "durch-",
    pairs: [
      {
        verb: "durchbrechen",
        sep: {
          meaning: "break through (physically)",
          stress: "DURCH·brechen",
          example: "Er bricht die Mauer durch.",
          en: "He breaks through the wall.",
        },
        insep: {
          meaning: "break through (figuratively)",
          stress: "durch·BRE·chen",
          example: "Sie durchbricht alle Grenzen.",
          en: "She breaks through all limits.",
        },
      },
    ],
  },
];

const TENSES_DATA = [
  {
    tense: "Präsens",
    colorKey: "primary",
    sep: [
      { de: "Ich rufe dich später an.", en: "I'll call you later." },
      { de: "Er steht früh auf.", en: "He gets up early." },
    ],
    insep: [
      { de: "Ich verstehe dich.", en: "I understand you." },
      { de: "Sie bekommt Hilfe.", en: "She gets help." },
    ],
    rule: "Separable: prefix to end. Inseparable: stays as one.",
  },
  {
    tense: "Präteritum",
    colorKey: "gold",
    sep: [
      { de: "Ich rief dich gestern an.", en: "I called you yesterday." },
      { de: "Er stand früh auf.", en: "He got up early." },
    ],
    insep: [
      { de: "Ich verstand dich nicht.", en: "I didn't understand you." },
      { de: "Sie bekam Hilfe.", en: "She got help." },
    ],
    rule: "Same split rule applies in simple main-clause past.",
  },
  {
    tense: "Perfekt",
    colorKey: "success",
    sep: [
      { de: "Ich habe dich angerufen.", en: "I called you." },
      { de: "Er ist früh aufgestanden.", en: "He got up early." },
    ],
    insep: [
      { de: "Ich habe dich nicht verstanden.", en: "I didn't understand you." },
      { de: "Sie hat Hilfe bekommen.", en: "She got help." },
    ],
    rule: "Separable: ge- inserted after prefix. Inseparable: no ge-.",
  },
  {
    tense: "Plusquamperfekt",
    colorKey: "error",
    sep: [{ de: "Ich hatte dich angerufen.", en: "I had called you." }],
    insep: [
      {
        de: "Ich hatte dich nicht verstanden.",
        en: "I hadn't understood you.",
      },
    ],
    rule: "Same participle rules apply as in Perfekt.",
  },
  {
    tense: "Futur I",
    colorKey: "primary",
    sep: [
      { de: "Ich werde dich später anrufen.", en: "I will call you later." },
    ],
    insep: [{ de: "Ich werde dich verstehen.", en: "I will understand you." }],
    rule: "Infinitive form — separable stays together after werden.",
  },
  {
    tense: "Futur II",
    colorKey: "gold",
    sep: [
      {
        de: "Ich werde dich später angerufen haben.",
        en: "I will have called you later.",
      },
    ],
    insep: [
      {
        de: "Ich werde dich richtig verstanden haben.",
        en: "I will have understood you correctly.",
      },
    ],
    rule: "Participle used — same ge- rules apply.",
  },
];

const MODAL_EXAMPLES = [
  {
    modal: "müssen",
    sep: "Ich muss früh aufstehen.",
    insep: "Ich muss das verstehen.",
  },
  {
    modal: "wollen",
    sep: "Er will früh aufstehen.",
    insep: "Ich kann das nicht verstehen.",
  },
  {
    modal: "sollen",
    sep: "Du solltest besser zuhören.",
    insep: "Er soll das erklären.",
  },
];

const ZU_INFINITIVE = [
  {
    type: "Separable",
    formula: "prefix + zu + base verb",
    example: "aufzustehen",
    sentence: "Ich versuche, früh aufzustehen.",
  },
  {
    type: "Separable",
    formula: "prefix + zu + base verb",
    example: "anzurufen",
    sentence: "Es ist schön, dich anzurufen.",
  },
  {
    type: "Separable",
    formula: "prefix + zu + base verb",
    example: "zuzuhören",
    sentence: "Es ist schwer, richtig zuzuhören.",
  },
  {
    type: "Inseparable",
    formula: "zu + whole verb",
    example: "zu verstehen",
    sentence: "Ich hoffe, das Problem zu verstehen.",
  },
  {
    type: "Inseparable",
    formula: "zu + whole verb",
    example: "zu besuchen",
    sentence: "Er plant, seine Tante zu besuchen.",
  },
];

const SUB_CLAUSE_EXAMPLES = [
  {
    sep: "..., weil ich morgen früh aufstehe.",
    insep: "..., weil ich das Problem verstehe.",
  },
  {
    sep: "..., weil ich dich gestern angerufen habe.",
    insep: "..., weil ich dich nicht verstanden habe.",
  },
  {
    sep: "..., dass wir am Samstag einkaufen.",
    insep: "..., dass sie eine Nachricht bekommt.",
  },
];

const FOUR_COMBOS = [
  {
    verb: "zumachen",
    sep: true,
    reg: true,
    partizip: "zugemacht",
    example: "Ich mache die Tür zu.",
  },
  {
    verb: "aufstehen",
    sep: true,
    reg: false,
    partizip: "aufgestanden",
    example: "Er steht früh auf.",
  },
  {
    verb: "besuchen",
    sep: false,
    reg: true,
    partizip: "besucht",
    example: "Ich besuche meine Tante.",
  },
  {
    verb: "verstehen",
    sep: false,
    reg: false,
    partizip: "verstanden",
    example: "Ich verstehe dich.",
  },
];

const DIAGNOSTIC = [
  {
    question: "Does the prefix split in a simple main clause?",
    yes: "→ Separable",
    no: "→ Inseparable",
    colorKey: "primary",
  },
  {
    question: "Does the participle have ge- after the prefix (e.g. angerufen)?",
    yes: "→ Separable",
    no: "→ Inseparable (no ge-)",
    colorKey: "gold",
  },
  {
    question: "Is the prefix stressed when you say it aloud?",
    yes: "→ Likely separable",
    no: "→ Likely inseparable",
    colorKey: "success",
  },
  {
    question:
      "Is the prefix one of be-, ver-, ent-, er-, ge-, miss-, zer-, emp-?",
    yes: "→ Inseparable",
    no: "→ Check further",
    colorKey: "error",
  },
];

const COMMON_MISTAKES = [
  {
    mistake: "Splitting a separable verb inside a subordinate clause",
    example: "❌ ..., weil ich an rufe → ✅ ..., weil ich anrufe",
  },
  {
    mistake: "Adding ge- to inseparable verbs in Partizip II",
    example: "❌ gebesucht → ✅ besucht · ❌ geverstanden → ✅ verstanden",
  },
  {
    mistake: "Forgetting to split a separable verb in a simple main clause",
    example: "❌ Ich anrufe dich. → ✅ Ich rufe dich an.",
  },
  {
    mistake: "Assuming all um-, über-, unter-, durch- verbs behave the same",
    example: "übersetzen (sep) = ferry across / übersetzen (insep) = translate",
  },
  {
    mistake: "Confusing separability with regularity",
    example:
      "These are different systems — a verb can be any combination of the two",
  },
  {
    mistake: "Wrong zu placement in infinitive constructions",
    example: "❌ zu aufstehen → ✅ aufzustehen · ❌ aufzuzu → ✅ aufzustehen",
  },
];

const MEMORY_SET = [
  { verb: "anrufen", finite: "ruft an", partizip: "angerufen", sep: true },
  {
    verb: "aufstehen",
    finite: "steht auf",
    partizip: "aufgestanden",
    sep: true,
  },
  { verb: "verstehen", finite: "versteht", partizip: "verstanden", sep: false },
  { verb: "besuchen", finite: "besucht", partizip: "besucht", sep: false },
  {
    verb: "übersetzen",
    finite: "setzt über / übersetzt",
    partizip: "übergesetzt / übersetzt",
    sep: null,
  },
];

// ─── COLOR SYSTEM ─────────────────────────────────────────────────────────────

const C = {
  primary: {
    bg: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
  },
  gold: { bg: "var(--color-gold-highlight)", color: "var(--color-gold)" },
  success: {
    bg: "var(--color-success-highlight)",
    color: "var(--color-success)",
  },
  error: { bg: "var(--color-error-highlight)", color: "var(--color-error)" },
};

// Section accent colors for each page section

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Chip({ label, colorKey, size = "sm" }) {
  const c = C[colorKey] || C.primary;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: size === "xs" ? "1px 7px" : "3px 11px",
        borderRadius: "var(--radius-full)",
        fontSize: size === "xs" ? "11px" : "var(--text-xs)",
        fontWeight: 700,
        letterSpacing: "0.04em",
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.color}33`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Card({ children, colorKey = "primary", style = {}, delay = 0 }) {
  const c = C[colorKey] || C.primary;
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: `3px solid ${c.color}`,
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-sm)",
        padding: "var(--space-5)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        animation: `fade-up 380ms cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ icon, children, colorKey = "primary" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-lg)",
        color: C[colorKey]?.color || "var(--color-primary)",
        fontWeight: 700,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
}

function InfoBox({ children, colorKey = "primary" }) {
  const c = C[colorKey] || C.primary;
  return (
    <div
      style={{
        padding: "var(--space-3) var(--space-4)",
        background: c.bg,
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${c.color}33`,
        fontSize: "var(--text-xs)",
        color: "var(--color-text)",
      }}
    >
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "var(--text-sm)",
        }}
      >
        <thead>
          <tr style={{ background: "var(--color-surface-2)" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderBottom: "1px solid var(--color-divider)",
                background:
                  ri % 2 === 0 ? "transparent" : "var(--color-surface-2)",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
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

function ExRow({ de, en }) {
  return (
    <div
      style={{
        padding: "var(--space-2) var(--space-3)",
        background: "var(--color-surface-2)",
        borderRadius: "var(--radius-md)",
        borderLeft: "2px solid var(--color-divider)",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <span
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--color-text)",
          fontStyle: "italic",
        }}
      >
        {de}
      </span>
      {en && (
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            fontStyle: "italic",
          }}
        >
          {en}
        </span>
      )}
    </div>
  );
}

// ─── NAV SECTIONS ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview", label: "Overview", icon: "💡", colorKey: "primary" },
  { id: "prefixes", label: "Prefix Lists", icon: "🔖", colorKey: "gold" },
  {
    id: "splitting",
    label: "Splitting Rules",
    icon: "✂️",
    colorKey: "success",
  },
  { id: "partizip", label: "Partizip II", icon: "📎", colorKey: "error" },
  { id: "ambiguous", label: "Both Types", icon: "⚖️", colorKey: "gold" },
  { id: "tenses", label: "All Tenses", icon: "⏱️", colorKey: "primary" },
  { id: "modals", label: "Modals & zu", icon: "🔧", colorKey: "success" },
  { id: "combos", label: "4 Combinations", icon: "🔀", colorKey: "error" },
  { id: "diagnose", label: "Diagnose It", icon: "🔍", colorKey: "primary" },
  { id: "mistakes", label: "Mistakes", icon: "🚫", colorKey: "error" },
  { id: "formula", label: "Formula", icon: "🧠", colorKey: "success" },
];

// ─── PAGE SECTIONS ────────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      {/* Core contrast */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <Card colorKey="primary" delay={0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-lg)",
                background: "var(--color-primary-highlight)",
                color: "var(--color-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--text-lg)",
                fontWeight: 900,
              }}
            >
              ✂
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "var(--text-lg)",
                color: "var(--color-primary)",
              }}
            >
              Separable
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-sm)",
              color: "var(--color-text)",
            }}
          >
            Prefix <strong>breaks off</strong> in finite main clauses and moves
            to the end.
          </p>
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-primary-highlight)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-primary)33",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "var(--color-primary)",
                fontSize: "var(--text-xs)",
                marginBottom: "var(--space-1)",
              }}
            >
              anrufen
            </div>
            <div
              style={{
                fontStyle: "italic",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
              }}
            >
              Ich{" "}
              <strong style={{ color: "var(--color-primary)" }}>rufe</strong>{" "}
              dich morgen{" "}
              <strong style={{ color: "var(--color-primary)" }}>an</strong>.
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                marginTop: 2,
              }}
            >
              I'll call you tomorrow.
            </div>
          </div>
          <div
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            🔊 Stress on{" "}
            <strong style={{ color: "var(--color-primary)" }}>prefix</strong>:{" "}
            <em>AN·rufen</em>
          </div>
        </Card>

        <Card colorKey="error" delay={60}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-lg)",
                background: "var(--color-error-highlight)",
                color: "var(--color-error)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--text-lg)",
                fontWeight: 900,
              }}
            >
              ⛓
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "var(--text-lg)",
                color: "var(--color-error)",
              }}
            >
              Inseparable
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-sm)",
              color: "var(--color-text)",
            }}
          >
            Prefix <strong>stays attached</strong> at all times in normal
            conjugation. Never splits.
          </p>
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-error-highlight)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-error)33",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "var(--color-error)",
                fontSize: "var(--text-xs)",
                marginBottom: "var(--space-1)",
              }}
            >
              verstehen
            </div>
            <div
              style={{
                fontStyle: "italic",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
              }}
            >
              Ich{" "}
              <strong style={{ color: "var(--color-error)" }}>verstehe</strong>{" "}
              dich.
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                marginTop: 2,
              }}
            >
              I understand you.
            </div>
          </div>
          <div
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            🔊 Stress on{" "}
            <strong style={{ color: "var(--color-error)" }}>stem</strong>:{" "}
            <em>ver·STEH·en</em>
          </div>
        </Card>
      </div>

      {/* What changes */}
      <Card colorKey="gold" delay={120}>
        <CardTitle icon="⚡" colorKey="gold">
          What the Prefix Changes
        </CardTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {[
            {
              label: "Meaning",
              desc: "The prefix is not decorative — it creates a new lexical meaning.",
              example:
                "stehen = stand · aufstehen = get up · verstehen = understand",
            },
            {
              label: "Pronunciation",
              desc: "Stress shifts: stressed prefix = separable; unstressed = inseparable.",
              example: "ANrufen (sep) vs verSTEHen (insep)",
            },
            {
              label: "Word order",
              desc: "In finite main clauses, separable prefix moves to end.",
              example: "Ich rufe dich an. (not: Ich anrufe dich.)",
            },
            {
              label: "Partizip II",
              desc: "ge- is inserted after separable prefix; blocked by inseparable prefix.",
              example: "angerufen (sep) · verstanden (insep, no ge-)",
            },
          ].map((item, i) => {
            const keys = ["primary", "gold", "success", "error"];
            const ck = keys[i];
            const c = C[ck];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: c.bg,
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${c.color}22`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    color: c.color,
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text)",
                  }}
                >
                  {item.desc}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  {item.example}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Three groups */}
      <Card colorKey="success" delay={180}>
        <CardTitle icon="🗂️" colorKey="success">
          Three Groups of Prefix Verbs
        </CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--space-3)",
          }}
        >
          {[
            {
              label: "Always Separable",
              desc: "ab-, an-, auf-, aus-, ein-, mit-, ...",
              colorKey: "primary",
            },
            {
              label: "Always Inseparable",
              desc: "be-, emp-, ent-, er-, ge-, miss-, ver-, zer-",
              colorKey: "error",
            },
            {
              label: "Can be Either",
              desc: "durch-, über-, um-, unter-, wider-, hinter-",
              colorKey: "gold",
            },
          ].map((g, i) => {
            const c = C[g.colorKey];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-3)",
                  background: c.bg,
                  border: `1px solid ${c.color}33`,
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    color: c.color,
                    fontSize: "var(--text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {g.label}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {g.desc}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function PrefixesSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      {/* Separable */}
      <Card colorKey="primary" delay={0}>
        <CardTitle icon="✂️" colorKey="primary">
          Always Separable Prefixes
        </CardTitle>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}
        >
          {SEPARABLE_PREFIXES.map((p, i) => (
            <Chip key={i} label={p} colorKey="primary" />
          ))}
        </div>
        <Table
          headers={["Verb", "Finite (er/sie)", "Partizip II", "Regularity"]}
          rows={SEPARABLE_EXAMPLES.map((v) => [
            <strong
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              {v.verb}
            </strong>,
            <span style={{ fontStyle: "italic", color: "var(--color-text)" }}>
              {v.present}
            </span>,
            <Chip label={v.partizip} colorKey="primary" size="xs" />,
            <Chip
              label={v.type}
              colorKey={v.type === "regular" ? "success" : "gold"}
              size="xs"
            />,
          ])}
        />
      </Card>

      {/* Inseparable */}
      <Card colorKey="error" delay={80}>
        <CardTitle icon="⛓️" colorKey="error">
          Always Inseparable Prefixes
        </CardTitle>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}
        >
          {INSEPARABLE_PREFIXES.map((p, i) => (
            <Chip key={i} label={p} colorKey="error" />
          ))}
        </div>
        <Table
          headers={["Verb", "Finite (er/sie)", "Partizip II", "Regularity"]}
          rows={INSEPARABLE_EXAMPLES.map((v) => [
            <strong
              style={{
                color: "var(--color-error)",
                fontFamily: "var(--font-display)",
              }}
            >
              {v.verb}
            </strong>,
            <span style={{ fontStyle: "italic", color: "var(--color-text)" }}>
              {v.present}
            </span>,
            <Chip label={v.partizip} colorKey="error" size="xs" />,
            <Chip
              label={v.type}
              colorKey={v.type === "regular" ? "success" : "gold"}
              size="xs"
            />,
          ])}
        />
        <InfoBox colorKey="error">
          <strong style={{ color: "var(--color-error)" }}>Key:</strong> No ge-
          in participle for inseparable verbs. besuchen → besucht (not: ✗
          gebesucht)
        </InfoBox>
      </Card>

      {/* Ambiguous */}
      <Card colorKey="gold" delay={160}>
        <CardTitle icon="⚖️" colorKey="gold">
          Ambiguous Prefixes (Can Be Either)
        </CardTitle>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}
        >
          {AMBIGUOUS_PREFIXES.map((p, i) => (
            <Chip key={i} label={p} colorKey="gold" />
          ))}
        </div>
        <InfoBox colorKey="gold">
          For these, <strong>meaning + stress</strong> decides the type. Always
          check in a dictionary, as the same written form can be separable or
          inseparable with different meanings.
        </InfoBox>
      </Card>
    </div>
  );
}

function SplittingSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      {/* Central principle */}
      <Card colorKey="success" delay={0}>
        <CardTitle icon="⚖️" colorKey="success">
          The Central Principle
        </CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
          }}
        >
          {[
            {
              condition: "Finite verb in main clause",
              result: "Separable prefix moves to end",
              colorKey: "primary",
              icon: "✂️",
            },
            {
              condition: "Subordinate clause",
              result: "Separable verb stays together at end",
              colorKey: "gold",
              icon: "🔗",
            },
            {
              condition: "Infinitive (after modal, werden...)",
              result: "Separable stays together",
              colorKey: "success",
              icon: "⚙️",
            },
            {
              condition: "Inseparable prefix — any context",
              result: "Never splits, ever",
              colorKey: "error",
              icon: "⛓️",
            },
          ].map((item, i) => {
            const c = C[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: c.bg,
                  border: `1px solid ${c.color}33`,
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <span style={{ fontSize: "var(--text-lg)" }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {item.condition}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: c.color,
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {item.result}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main clause */}
      <Card colorKey="primary" delay={60}>
        <CardTitle icon="🏗️" colorKey="primary">
          Main Clause: Separable Splits
        </CardTitle>
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-primary-highlight)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-primary)33",
          }}
        >
          <code
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-primary)",
              fontWeight: 700,
            }}
          >
            subject + finite verb [pos 2] + middle field + <u>prefix [end]</u>
          </code>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {[
            {
              de: "Ich rufe dich später an.",
              en: "I'll call you later.",
              highlight: ["rufe", "an"],
            },
            {
              de: "Er steht um sieben Uhr auf.",
              en: "He gets up at seven.",
              highlight: ["steht", "auf"],
            },
            {
              de: "Wir kaufen am Samstag ein.",
              en: "We go shopping on Saturday.",
              highlight: ["kaufen", "ein"],
            },
          ].map((ex, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                borderLeft: "2px solid var(--color-primary)",
                fontSize: "var(--text-sm)",
              }}
            >
              <span style={{ fontStyle: "italic", color: "var(--color-text)" }}>
                {ex.de}
              </span>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  marginLeft: "var(--space-3)",
                }}
              >
                {ex.en}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Subordinate clause */}
      <Card colorKey="gold" delay={120}>
        <CardTitle icon="🔗" colorKey="gold">
          Subordinate Clause: No Split
        </CardTitle>
        <InfoBox colorKey="gold">
          In subordinate clauses, the finite verb is no longer in position 2 —
          it goes to the end. The separable verb therefore stays together as one
          unit.
        </InfoBox>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {SUB_CLAUSE_EXAMPLES.map((ex, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-primary-highlight)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-xs)",
                  fontStyle: "italic",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                }}
              >
                {ex.sep}
              </div>
              <div
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-error-highlight)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-xs)",
                  fontStyle: "italic",
                  color: "var(--color-error)",
                  fontWeight: 600,
                }}
              >
                {ex.insep}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PartizipSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      {/* Side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <Card colorKey="primary" delay={0}>
          <CardTitle icon="✂️" colorKey="primary">
            Separable → ge- inserted
          </CardTitle>
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-primary-highlight)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-primary)33",
            }}
          >
            <code
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-primary)",
                fontWeight: 700,
              }}
            >
              prefix + <u>ge</u> + base stem + ending
            </code>
          </div>
          {[
            ["anrufen", "an·ge·rufen"],
            ["aufstehen", "auf·ge·standen"],
            ["einkaufen", "ein·ge·kauft"],
            ["einladen", "ein·ge·laden"],
          ].map(([v, p], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                fontSize: "var(--text-sm)",
              }}
            >
              <span style={{ color: "var(--color-text-muted)", minWidth: 90 }}>
                {v}
              </span>
              <span style={{ color: "var(--color-text-faint)" }}>→</span>
              <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                {p}
              </span>
            </div>
          ))}
        </Card>

        <Card colorKey="error" delay={60}>
          <CardTitle icon="⛓️" colorKey="error">
            Inseparable → no ge-
          </CardTitle>
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-error-highlight)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-error)33",
            }}
          >
            <code
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-error)",
                fontWeight: 700,
              }}
            >
              prefix + base stem + ending (no ge-)
            </code>
          </div>
          {[
            ["verstehen", "verstanden"],
            ["bekommen", "bekommen"],
            ["erklären", "erklärt"],
            ["verlieren", "verloren"],
          ].map(([v, p], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                fontSize: "var(--text-sm)",
              }}
            >
              <span style={{ color: "var(--color-text-muted)", minWidth: 90 }}>
                {v}
              </span>
              <span style={{ color: "var(--color-text-faint)" }}>→</span>
              <span style={{ fontWeight: 700, color: "var(--color-error)" }}>
                {p}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Sentence examples */}
      <Card colorKey="success" delay={120}>
        <CardTitle icon="📝" colorKey="success">
          Partizip II in Sentences (Perfekt)
        </CardTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {[
            {
              de: "Ich habe dich gestern angerufen.",
              en: "I called you yesterday.",
              colorKey: "primary",
            },
            {
              de: "Er ist früh aufgestanden.",
              en: "He got up early.",
              colorKey: "primary",
            },
            {
              de: "Ich habe dich nicht verstanden.",
              en: "I didn't understand you.",
              colorKey: "error",
            },
            {
              de: "Sie hat eine Nachricht bekommen.",
              en: "She got a message.",
              colorKey: "error",
            },
          ].map((ex, i) => {
            const c = C[ex.colorKey];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: c.bg,
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${c.color}22`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    fontWeight: 600,
                  }}
                >
                  {ex.de}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  {ex.en}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AmbiguousSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      <Card colorKey="gold" delay={0}>
        <CardTitle icon="⚖️" colorKey="gold">
          Same Prefix, Two Verbs, Two Meanings
        </CardTitle>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          The prefixes{" "}
          <strong>durch-, hinter-, über-, um-, unter-, wider-</strong> can
          produce both a separable and an inseparable verb from the same base —
          with different meanings. Stress is the key clue.
        </p>
        <InfoBox colorKey="gold">
          🔊 <strong>Stressed prefix</strong> → separable ·{" "}
          <strong>Unstressed prefix / stressed stem</strong> → inseparable
        </InfoBox>
      </Card>

      {AMBIGUOUS_CONTRASTS.map((group, gi) => (
        <Card key={gi} colorKey="gold" delay={gi * 80}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-base)",
              fontWeight: 800,
              color: "var(--color-gold)",
            }}
          >
            <Chip label={group.prefix} colorKey="gold" /> prefix
          </div>
          {group.pairs.map((pair, pi) => (
            <div key={pi}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text)",
                  marginBottom: "var(--space-3)",
                  fontWeight: 700,
                }}
              >
                {pair.verb}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "var(--space-3)",
                }}
              >
                {/* Separable */}
                <div
                  style={{
                    padding: "var(--space-4)",
                    background: "var(--color-primary-highlight)",
                    border: "1px solid var(--color-primary)33",
                    borderRadius: "var(--radius-xl)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}
                >
                  <Chip label="Separable" colorKey="primary" />
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {pair.sep.meaning}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    🔊 {pair.sep.stress}
                  </div>
                  <div
                    style={{
                      fontStyle: "italic",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    {pair.sep.example}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    {pair.sep.en}
                  </div>
                </div>
                {/* Inseparable */}
                <div
                  style={{
                    padding: "var(--space-4)",
                    background: "var(--color-error-highlight)",
                    border: "1px solid var(--color-error)33",
                    borderRadius: "var(--radius-xl)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}
                >
                  <Chip label="Inseparable" colorKey="error" />
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--color-error)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {pair.insep.meaning}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    🔊 {pair.insep.stress}
                  </div>
                  <div
                    style={{
                      fontStyle: "italic",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    {pair.insep.example}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    {pair.insep.en}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      ))}

      <Card colorKey="error" delay={240}>
        <CardTitle icon="⚠️" colorKey="error">
          Why This Matters at B1–B2
        </CardTitle>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-sm)",
            color: "var(--color-text)",
          }}
        >
          Ambiguous prefix verbs create meaning contrasts and pronunciation
          differences that native speakers rely on. At B1–B2, learners are
          expected to know the most common contrasts and use correct stress and
          sentence structure for each.
        </p>
        <InfoBox colorKey="error">
          Always look up ambiguous prefix verbs in a dictionary. Don't assume
          one spelling = one behavior.
        </InfoBox>
      </Card>
    </div>
  );
}

function TensesSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <Card colorKey="primary" delay={0}>
        <CardTitle icon="⏱️" colorKey="primary">
          Separable/Inseparable Behavior Across All Tenses
        </CardTitle>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          The split/no-split distinction is clearest in simple finite clauses
          and participle formation. In infinitive structures (modal, werden,
          zu), separable verbs stay together.
        </p>
      </Card>
      {TENSES_DATA.map((row, i) => {
        const c = C[row.colorKey];
        return (
          <div
            key={i}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              animation: `fade-up 380ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
            }}
          >
            <div
              style={{
                padding: "var(--space-3) var(--space-5)",
                background: c.bg,
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
              }}
            >
              <Chip label={row.tense} colorKey={row.colorKey} />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                }}
              >
                {row.rule}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "var(--space-4) var(--space-5)",
                gap: "var(--space-4)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Separable
                </div>
                {row.sep.map((ex, ei) => (
                  <ExRow key={ei} de={ex.de} en={ex.en} />
                ))}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    color: "var(--color-error)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Inseparable
                </div>
                {row.insep.map((ex, ei) => (
                  <ExRow key={ei} de={ex.de} en={ex.en} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModalsSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      {/* Modal verbs */}
      <Card colorKey="success" delay={0}>
        <CardTitle icon="⚙️" colorKey="success">
          With Modal Verbs
        </CardTitle>
        <InfoBox colorKey="success">
          When a separable verb appears as an <strong>infinitive</strong> after
          a modal, it is non-finite — so it stays together as one word. The
          split only happens when the verb is finite.
        </InfoBox>
        <Table
          headers={[
            "Modal",
            "Separable stays together",
            "Inseparable (same rule)",
          ]}
          rows={MODAL_EXAMPLES.map((row) => [
            <Chip label={row.modal} colorKey="success" />,
            <span
              style={{
                fontStyle: "italic",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
              }}
            >
              {row.sep}
            </span>,
            <span
              style={{
                fontStyle: "italic",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
              }}
            >
              {row.insep}
            </span>,
          ])}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            In subordinate clause
          </div>
          {[
            "..., weil ich früh aufstehen muss.",
            "..., weil er früh aufstehen will.",
          ].map((ex, i) => (
            <ExRow key={i} de={ex} />
          ))}
        </div>
      </Card>

      {/* zu + infinitive */}
      <Card colorKey="gold" delay={80}>
        <CardTitle icon="🔗" colorKey="gold">
          With zu + Infinitive
        </CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-primary-highlight)",
              border: "1px solid var(--color-primary)33",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "var(--color-primary)",
                fontSize: "var(--text-sm)",
                marginBottom: "var(--space-2)",
              }}
            >
              Separable
            </div>
            <code
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-primary)",
              }}
            >
              prefix + zu + base verb
            </code>
          </div>
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-error-highlight)",
              border: "1px solid var(--color-error)33",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "var(--color-error)",
                fontSize: "var(--text-sm)",
                marginBottom: "var(--space-2)",
              }}
            >
              Inseparable
            </div>
            <code
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-error)",
              }}
            >
              zu + whole verb
            </code>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {ZU_INFINITIVE.map((ex, i) => {
            const ck = ex.type === "Separable" ? "primary" : "error";
            const c = C[ck];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: c.bg,
                  border: `1px solid ${c.color}22`,
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-2)",
                    alignItems: "center",
                  }}
                >
                  <Chip label={ex.type} colorKey={ck} size="xs" />
                  <code
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 700,
                      color: c.color,
                    }}
                  >
                    {ex.example}
                  </code>
                </div>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontStyle: "italic",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {ex.sentence}
                </span>
              </div>
            );
          })}
        </div>
        <InfoBox colorKey="error">
          ❌ <strong>Common mistake:</strong> zu aufstehen → ✅ aufzustehen ·
          The zu goes <em>inside</em> the separable verb, not before it.
        </InfoBox>
      </Card>
    </div>
  );
}

function CombosSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      <Card colorKey="error" delay={0}>
        <CardTitle icon="🔀" colorKey="error">
          Separability ≠ Regularity — 4 Combinations
        </CardTitle>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          These are two independent classification systems. Any combination is
          possible. Don't confuse prefix behavior with stem-change/conjugation
          behavior.
        </p>
      </Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        {FOUR_COMBOS.map((item, i) => {
          const sepColor = item.sep ? "primary" : "error";
          const regColor = item.reg ? "success" : "gold";
          const c = C[sepColor];
          return (
            <Card key={i} colorKey={sepColor} delay={i * 60}>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={item.sep ? "Separable" : "Inseparable"}
                  colorKey={sepColor}
                />
                <Chip
                  label={item.reg ? "Regular" : "Irregular"}
                  colorKey={regColor}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 900,
                  color: c.color,
                }}
              >
                {item.verb}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <ExRow de={item.example} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  <span style={{ color: "var(--color-text-muted)" }}>
                    Partizip II:
                  </span>
                  <Chip label={item.partizip} colorKey={sepColor} size="xs" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Card colorKey="gold" delay={280}>
        <CardTitle icon="📌" colorKey="gold">
          Also Note
        </CardTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {[
            {
              text: "Separability does NOT determine case government (accusative, dative, etc.)",
              colorKey: "gold",
            },
            {
              text: "Separability does NOT change V2 or verb-final sentence structure rules",
              colorKey: "success",
            },
            {
              text: "Ich rufe dich an → accusative · Ich höre dir zu → dative · both separable",
              colorKey: "primary",
            },
          ].map((item, i) => {
            const c = C[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: c.bg,
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${c.color}22`,
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text)",
                  fontStyle: i === 2 ? "italic" : "normal",
                }}
              >
                {item.text}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function DiagnoseSection() {
  const [answers, setAnswers] = useState({});
  const toggle = (i, val) =>
    setAnswers((prev) => ({ ...prev, [i]: prev[i] === val ? null : val }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      <Card colorKey="primary" delay={0}>
        <CardTitle icon="🔍" colorKey="primary">
          Fast Diagnostic Checklist
        </CardTitle>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          Use these four questions to identify any verb. Tap Yes or No to see
          the verdict.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {DIAGNOSTIC.map((item, i) => {
            const c = C[item.colorKey];
            const selected = answers[i];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-4)",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderLeft: `3px solid ${c.color}`,
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-text)",
                  }}
                >
                  {i + 1}. {item.question}
                </span>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  {["Yes", "No"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggle(i, opt)}
                      style={{
                        padding: "var(--space-1) var(--space-4)",
                        borderRadius: "var(--radius-full)",
                        border: `1.5px solid ${selected === opt ? c.color : "var(--color-border)"}`,
                        background: selected === opt ? c.bg : "transparent",
                        color:
                          selected === opt
                            ? c.color
                            : "var(--color-text-muted)",
                        fontWeight: selected === opt ? 700 : 500,
                        fontSize: "var(--text-xs)",
                        cursor: "pointer",
                        transition: "all var(--transition-interactive)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {selected && (
                  <div
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      background: c.bg,
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${c.color}33`,
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      color: c.color,
                      animation:
                        "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both",
                    }}
                  >
                    {selected === "Yes" ? item.yes : item.no}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Best identification methods */}
      <Card colorKey="success" delay={80}>
        <CardTitle icon="🗺️" colorKey="success">
          Best Identification Methods
        </CardTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {[
            {
              method: "Learn the prefix list",
              detail:
                "Memorize always-separable and always-inseparable prefix sets",
              colorKey: "primary",
            },
            {
              method: "Check stress pattern",
              detail:
                "Stressed prefix = separable · Unstressed prefix = inseparable",
              colorKey: "gold",
            },
            {
              method: "Observe the main-clause finite form",
              detail: "Does the prefix split off? → separable",
              colorKey: "success",
            },
            {
              method: "Check the Partizip II form",
              detail: "ge- after prefix → separable · no ge- → inseparable",
              colorKey: "error",
            },
            {
              method: "Use a dictionary for ambiguous prefixes",
              detail:
                "um-, über-, unter-, durch- cannot be determined by spelling alone",
              colorKey: "gold",
            },
          ].map((item, i) => {
            const c = C[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  alignItems: "flex-start",
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-surface-2)",
                  border: `1px solid var(--color-divider)`,
                  borderLeft: `2px solid ${c.color}`,
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <span
                  style={{
                    color: c.color,
                    fontWeight: 900,
                    fontSize: "var(--text-xs)",
                    marginTop: 2,
                  }}
                >
                  ▸
                </span>
                <div>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--color-text)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {item.method}
                  </span>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function MistakesSection() {
  return (
    <Card colorKey="error" delay={0}>
      <CardTitle icon="🚫" colorKey="error">
        Common Mistakes
      </CardTitle>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {COMMON_MISTAKES.map((item, i) => (
          <div
            key={i}
            style={{
              padding: "var(--space-4)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderLeft: "3px solid var(--color-error)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
              animation: `fade-up 350ms cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  minWidth: 22,
                  height: 22,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-error-highlight)",
                  color: "var(--color-error)",
                  fontWeight: 800,
                  fontSize: "var(--text-xs)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                {item.mistake}
              </span>
            </div>
            <p
              style={{
                margin: "0 0 0 30px",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {item.example}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FormulaSection() {
  const [flipped, setFlipped] = useState({});
  const toggle = (i) => setFlipped((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      {/* Formula cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {[
          {
            rule: "Separable",
            detail:
              "Prefix splits in simple main clauses · Participle: prefix + ge + stem",
            colorKey: "primary",
            icon: "✂️",
          },
          {
            rule: "Inseparable",
            detail:
              "Prefix never splits · Participle: no ge- · prefix always attached",
            colorKey: "error",
            icon: "⛓️",
          },
          {
            rule: "Ambiguous prefixes",
            detail:
              "Meaning + stress decides · um-, über-, durch-, unter- can be either",
            colorKey: "gold",
            icon: "⚖️",
          },
          {
            rule: "Main clause finite → may split",
            detail: "Only when the verb is finite and in position 2",
            colorKey: "success",
            icon: "🏗️",
          },
          {
            rule: "Subordinate / infinitive → stays together",
            detail:
              "Modal, werden, zu-infinitive, subordinate clause — no split",
            colorKey: "primary",
            icon: "🔗",
          },
        ].map((item, i) => {
          const c = C[item.colorKey];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-3)",
                padding: "var(--space-4) var(--space-5)",
                background: c.bg,
                border: `1px solid ${c.color}33`,
                borderRadius: "var(--radius-xl)",
                animation: `fade-up 400ms cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both`,
              }}
            >
              <span
                style={{
                  minWidth: 34,
                  height: 34,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-surface)",
                  border: `1.5px solid ${c.color}`,
                  fontSize: "var(--text-base)",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: c.color,
                    fontSize: "var(--text-base)",
                  }}
                >
                  {item.rule}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {item.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Memory set flip cards */}
      <Card colorKey="success" delay={300}>
        <CardTitle icon="🧩" colorKey="success">
          Compact Memory Set — Tap to Flip
        </CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {MEMORY_SET.map((v, i) => {
            const colorKey =
              v.sep === true ? "primary" : v.sep === false ? "error" : "gold";
            const c = C[colorKey];
            const isFlipped = flipped[i];
            return (
              <div
                key={i}
                onClick={() => toggle(i)}
                style={{
                  padding: "var(--space-4)",
                  cursor: "pointer",
                  background: isFlipped ? c.bg : "var(--color-surface-2)",
                  border: `1px solid ${isFlipped ? c.color + "55" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-xl)",
                  transition: "all var(--transition-interactive)",
                  animation: `fade-up 350ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "var(--text-base)",
                    color: c.color,
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {v.verb}
                </div>
                {!isFlipped ? (
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-faint)",
                      fontStyle: "italic",
                    }}
                  >
                    tap to reveal
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-1)",
                    }}
                  >
                    {[
                      ["finite", v.finite],
                      ["Partizip II", v.partizip],
                    ].map(([l, val], li) => (
                      <div
                        key={li}
                        style={{
                          fontSize: "var(--text-xs)",
                          display: "flex",
                          gap: "var(--space-1)",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-text-muted)",
                            minWidth: 52,
                          }}
                        >
                          {l}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--color-text)",
                            fontStyle: "italic",
                          }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: "var(--space-2)" }}>
                  <Chip
                    label={
                      v.sep === true
                        ? "Separable"
                        : v.sep === false
                          ? "Inseparable"
                          : "Both!"
                    }
                    colorKey={colorKey}
                    size="xs"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SeparableVerbs() {
  const [activeId, setActiveId] = useState("overview");

  const renderSection = () => {
    switch (activeId) {
      case "overview":
        return <OverviewSection />;
      case "prefixes":
        return <PrefixesSection />;
      case "splitting":
        return <SplittingSection />;
      case "partizip":
        return <PartizipSection />;
      case "ambiguous":
        return <AmbiguousSection />;
      case "tenses":
        return <TensesSection />;
      case "modals":
        return <ModalsSection />;
      case "combos":
        return <CombosSection />;
      case "diagnose":
        return <DiagnoseSection />;
      case "mistakes":
        return <MistakesSection />;
      case "formula":
        return <FormulaSection />;
      default:
        return null;
    }
  };

  return (
    <div className="pronouns-page">
      {/* Page header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          marginBottom: "var(--space-6)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Separable & Inseparable Verbs
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Prefix behavior · Partizip II · Tenses · Modal & zu structures ·
          Ambiguous prefixes · Diagnosis
        </p>
      </div>

      {/* Sidebar + content layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "var(--space-6)",
          alignItems: "start",
        }}
      >
        {/* Sidebar nav */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
            position: "sticky",
            top: "var(--space-4)",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2)",
          }}
        >
          {SECTIONS.map((sec) => {
            const isActive = activeId === sec.id;
            const c = C[sec.colorKey];
            return (
              <button
                key={sec.id}
                onClick={() => setActiveId(sec.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-lg)",
                  border: "none",
                  cursor: "pointer",
                  background: isActive ? c.bg : "transparent",
                  color: isActive ? c.color : "var(--color-text-muted)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "var(--text-xs)",
                  textAlign: "left",
                  borderLeft: isActive
                    ? `2px solid ${c.color}`
                    : "2px solid transparent",
                  transition: "all var(--transition-interactive)",
                }}
              >
                <span style={{ fontSize: "14px" }}>{sec.icon}</span>
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div className="pronouns-sections">{renderSection()}</div>
      </div>
    </div>
  );
}
