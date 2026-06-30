// RegularIrregular.jsx
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: "Regular (Weak)",
    colorKey: "primary",
    feature:
      "Stable stem, predictable endings, regular Präteritum and Partizip II",
    examples: ["machen", "kaufen", "arbeiten"],
  },
  {
    name: "Irregular (Strong)",
    colorKey: "error",
    feature:
      "Stem vowel often changes, especially in past forms and sometimes in present singular",
    examples: [
      "lesen",
      "fahren",
      "sprechen",
      "nehmen",
      "sehen",
      "geben",
      "laufen",
    ],
  },
  {
    name: "Mixed",
    colorKey: "gold",
    feature:
      "Stem changes like irregular verbs, but some endings follow the regular pattern",
    examples: ["denken", "bringen", "kennen", "nennen", "wissen"],
  },
];

const REGULAR_FEATURES = [
  "Keep the stem stable",
  "Take predictable present endings",
  "Form Präteritum with the regular marker -te-",
  "Form Partizip II with ge- + stem + -t in normal cases",
];

const IRREGULAR_FEATURES = [
  "Often change the stem vowel",
  "May show a stem change in the present tense, especially in du and er/sie/es",
  "Usually form Präteritum without the regular -te pattern",
  "Usually form Partizip II with ge- + changed stem + -en",
];

const IDENTIFICATION_RULES = [
  {
    rule: "Präteritum ends in -te and Partizip II ends in -t",
    verdict: "Usually regular",
    colorKey: "primary",
  },
  {
    rule: "Stem vowel changes in present singular (du/er)",
    verdict: "Likely irregular in present — and often in past too",
    colorKey: "error",
  },
  {
    rule: "Partizip II ends in -en with a changed stem",
    verdict: "Usually irregular",
    colorKey: "error",
  },
  {
    rule: "Stem changes but past ending looks regular (-te, -t)",
    verdict: "Likely a mixed verb",
    colorKey: "gold",
  },
];

const PRESENT_STEM_CHANGES = [
  {
    pattern: "e → ie",
    colorKey: "primary",
    examples: [
      { verb: "geben", du: "du gibst", er: "er gibt" },
      { verb: "lesen", du: "du liest", er: "er liest" },
      { verb: "sehen", du: "du siehst", er: "er sieht" },
    ],
  },
  {
    pattern: "a → ä",
    colorKey: "gold",
    examples: [
      { verb: "fahren", du: "du fährst", er: "er fährt" },
      { verb: "schlafen", du: "du schläfst", er: "er schläft" },
      { verb: "tragen", du: "du trägst", er: "er trägt" },
    ],
  },
  {
    pattern: "e → i",
    colorKey: "error",
    examples: [
      { verb: "nehmen", du: "du nimmst", er: "er nimmt" },
      { verb: "sprechen", du: "du sprichst", er: "er spricht" },
      { verb: "helfen", du: "du hilfst", er: "er hilft" },
    ],
  },
];

const CONJUGATION_MODELS = [
  {
    label: "Regular: machen",
    colorKey: "primary",
    note: "Follows the predictable weak pattern.",
    praesens: [
      "ich mache",
      "du machst",
      "er macht",
      "wir machen",
      "ihr macht",
      "sie machen",
    ],
    praeteritum: [
      "ich machte",
      "du machtest",
      "er machte",
      "wir machten",
      "ihr machtet",
      "sie machten",
    ],
    perfekt: "ich habe gemacht",
    partizip: "gemacht",
  },
  {
    label: "Regular (-t/-d rule): arbeiten",
    colorKey: "primary",
    note: "Still regular despite the extra -e-. The -e- is inserted for pronunciation only.",
    praesens: [
      "ich arbeite",
      "du arbeitest",
      "er arbeitet",
      "wir arbeiten",
      "ihr arbeitet",
      "sie arbeiten",
    ],
    praeteritum: ["ich arbeitete"],
    perfekt: "ich habe gearbeitet",
    partizip: "gearbeitet",
  },
  {
    label: "Irregular: lesen",
    colorKey: "error",
    note: "Present stem change in du/er; completely different Präteritum stem.",
    praesens: [
      "ich lese",
      "du liest",
      "er liest",
      "wir lesen",
      "ihr lest",
      "sie lesen",
    ],
    praeteritum: ["ich las"],
    perfekt: "ich habe gelesen",
    partizip: "gelesen",
  },
  {
    label: "Irregular: fahren",
    colorKey: "error",
    note: "Uses sein as auxiliary — but this is separate from its irregularity.",
    praesens: [
      "ich fahre",
      "du fährst",
      "er fährt",
      "wir fahren",
      "ihr fahrt",
      "sie fahren",
    ],
    praeteritum: ["ich fuhr"],
    perfekt: "ich bin gefahren",
    partizip: "gefahren",
  },
  {
    label: "Irregular: nehmen",
    colorKey: "error",
    note: "Consonant change as well as vowel change in du/er present forms.",
    praesens: [
      "ich nehme",
      "du nimmst",
      "er nimmt",
      "wir nehmen",
      "ihr nehmt",
      "sie nehmen",
    ],
    praeteritum: ["ich nahm"],
    perfekt: "ich habe genommen",
    partizip: "genommen",
  },
  {
    label: "Mixed: denken",
    colorKey: "gold",
    note: "Stem changes (denk → dach) but uses regular-looking -te ending and -t participle.",
    praesens: [
      "ich denke",
      "du denkst",
      "er denkt",
      "wir denken",
      "ihr denkt",
      "sie denken",
    ],
    praeteritum: ["ich dachte"],
    perfekt: "ich habe gedacht",
    partizip: "gedacht",
  },
];

const PARTIZIP_PATTERNS = [
  {
    type: "Regular",
    formula: "ge- + stem + -t",
    colorKey: "primary",
    examples: [
      { verb: "machen", partizip: "gemacht" },
      { verb: "lernen", partizip: "gelernt" },
      { verb: "kaufen", partizip: "gekauft" },
    ],
  },
  {
    type: "Irregular",
    formula: "ge- + changed stem + -en",
    colorKey: "error",
    examples: [
      { verb: "sprechen", partizip: "gesprochen" },
      { verb: "fahren", partizip: "gefahren" },
      { verb: "nehmen", partizip: "genommen" },
      { verb: "schreiben", partizip: "geschrieben" },
    ],
  },
  {
    type: "Mixed",
    formula: "ge- + changed stem + -t",
    colorKey: "gold",
    examples: [
      { verb: "denken", partizip: "gedacht" },
      { verb: "bringen", partizip: "gebracht" },
      { verb: "kennen", partizip: "gekannt" },
    ],
  },
];

const PREFIX_RULES = [
  {
    rule: "Separable verbs insert ge- between prefix and stem",
    examples: ["aufmachen → aufgemacht", "aufstehen → aufgestanden"],
    colorKey: "primary",
  },
  {
    rule: "Inseparable prefixes (be-, ver-, er-, ge-, ent-, emp-, zer-) block ge-",
    examples: [
      "besuchen → besucht",
      "verstehen → verstanden",
      "bekommen → bekommen",
    ],
    colorKey: "gold",
  },
];

const TENSES_COMPARISON = [
  {
    tense: "Präsens",
    regular: {
      example: "Ich lerne Deutsch.",
      note: "Regular endings throughout",
    },
    irregular: {
      example: "Ich lese ein Buch.",
      note: "Stem may change in du/er/sie/es",
    },
  },
  {
    tense: "Präteritum",
    regular: { example: "Ich lernte Deutsch.", note: "-te marker + ending" },
    irregular: {
      example: "Ich las ein Buch.",
      note: "Changed stem, usually no -te",
    },
  },
  {
    tense: "Perfekt",
    regular: {
      example: "Ich habe Deutsch gelernt.",
      note: "Partizip II ends in -t",
    },
    irregular: {
      example: "Ich habe ein Buch gelesen. / Ich bin nach Berlin gefahren.",
      note: "Partizip II often ends in -en",
    },
  },
  {
    tense: "Plusquamperfekt",
    regular: {
      example: "Ich hatte Deutsch gelernt.",
      note: "hatte/war + Partizip II",
    },
    irregular: {
      example: "Ich hatte ein Buch gelesen. / Ich war nach Berlin gefahren.",
      note: "Same structure, irregular participle",
    },
  },
  {
    tense: "Futur I",
    regular: {
      example: "Ich werde Deutsch lernen.",
      note: "werden + infinitive",
    },
    irregular: {
      example: "Ich werde ein Buch lesen.",
      note: "werden + infinitive (no change)",
    },
  },
  {
    tense: "Futur II",
    regular: {
      example: "Ich werde Deutsch gelernt haben.",
      note: "werden + Partizip II + haben/sein",
    },
    irregular: {
      example: "Ich werde das Buch gelesen haben.",
      note: "Irregular participle, same frame",
    },
  },
];

const SENTENCE_STRUCTURE = [
  {
    type: "Main clause (V2)",
    examples: [
      "Ich lerne heute.",
      "Ich lese heute.",
      "Heute lerne ich.",
      "Heute lese ich.",
    ],
    rule: "Finite verb always in position 2 — same for regular and irregular.",
  },
  {
    type: "Yes/No question",
    examples: ["Lernst du heute?", "Liest du heute?"],
    rule: "Finite verb first — same for regular and irregular.",
  },
  {
    type: "Subordinate clause",
    examples: [
      "..., weil ich heute lerne.",
      "..., weil ich heute lese.",
      "..., weil er das Buch gelesen hat.",
    ],
    rule: "Finite verb at the end — same for regular and irregular.",
  },
  {
    type: "With modal verbs",
    examples: [
      "Ich muss lernen.",
      "Ich muss lesen.",
      "..., weil ich lernen muss.",
      "..., weil ich lesen muss.",
    ],
    rule: "Modal in V2; infinitive at end — same for regular and irregular.",
  },
  {
    type: "Perfekt in subordinate clause",
    examples: ["..., weil ich gelernt habe.", "..., weil ich gelesen habe."],
    rule: "Auxiliary at end — same for regular and irregular.",
  },
];

const CASE_USE = [
  {
    verb: "kaufen (regular)",
    case_: "Accusative",
    example: "Ich kaufe einen Mantel.",
  },
  {
    verb: "lesen (irregular)",
    case_: "Accusative",
    example: "Ich lese das Buch.",
  },
  { verb: "danken (regular)", case_: "Dative", example: "Ich danke dir." },
  {
    verb: "gefallen (irregular)",
    case_: "Dative",
    example: "Das gefällt mir.",
  },
  {
    verb: "warten auf (regular)",
    case_: "Prep + Acc",
    example: "Ich warte auf den Bus.",
  },
  {
    verb: "denken an (mixed)",
    case_: "Prep + Acc",
    example: "Ich denke an dich.",
  },
];

const MIXED_VERBS = [
  { inf: "denken", prat: "dachte", part: "gedacht" },
  { inf: "bringen", prat: "brachte", part: "gebracht" },
  { inf: "kennen", prat: "kannte", part: "gekannt" },
  { inf: "nennen", prat: "nannte", part: "genannt" },
  { inf: "wissen", prat: "wusste", part: "gewusst" },
];

const HIGH_FREQ_IRREGULAR = [
  "sein",
  "haben",
  "werden",
  "gehen",
  "kommen",
  "nehmen",
  "geben",
  "sehen",
  "lesen",
  "sprechen",
  "essen",
  "fahren",
  "schlafen",
  "finden",
];

const MEMORY_SETS = [
  {
    inf: "machen",
    du: "machst",
    er: "macht",
    prat: "machte",
    part: "gemacht",
    type: "regular",
    colorKey: "primary",
  },
  {
    inf: "arbeiten",
    du: "arbeitest",
    er: "arbeitet",
    prat: "arbeitete",
    part: "gearbeitet",
    type: "regular",
    colorKey: "primary",
  },
  {
    inf: "lesen",
    du: "liest",
    er: "liest",
    prat: "las",
    part: "gelesen",
    type: "irregular",
    colorKey: "error",
  },
  {
    inf: "fahren",
    du: "fährst",
    er: "fährt",
    prat: "fuhr",
    part: "gefahren",
    type: "irregular",
    colorKey: "error",
  },
  {
    inf: "nehmen",
    du: "nimmst",
    er: "nimmt",
    prat: "nahm",
    part: "genommen",
    type: "irregular",
    colorKey: "error",
  },
  {
    inf: "denken",
    du: "denkst",
    er: "denkt",
    prat: "dachte",
    part: "gedacht",
    type: "mixed",
    colorKey: "gold",
  },
  {
    inf: "sprechen",
    du: "sprichst",
    er: "spricht",
    prat: "sprach",
    part: "gesprochen",
    type: "irregular",
    colorKey: "error",
  },
  {
    inf: "geben",
    du: "gibst",
    er: "gibt",
    prat: "gab",
    part: "gegeben",
    type: "irregular",
    colorKey: "error",
  },
  {
    inf: "sehen",
    du: "siehst",
    er: "sieht",
    prat: "sah",
    part: "gesehen",
    type: "irregular",
    colorKey: "error",
  },
  {
    inf: "schreiben",
    du: "schreibst",
    er: "schreibt",
    prat: "schrieb",
    part: "geschrieben",
    type: "irregular",
    colorKey: "error",
  },
  {
    inf: "bringen",
    du: "bringst",
    er: "bringt",
    prat: "brachte",
    part: "gebracht",
    type: "mixed",
    colorKey: "gold",
  },
  {
    inf: "finden",
    du: "findest",
    er: "findet",
    prat: "fand",
    part: "gefunden",
    type: "irregular",
    colorKey: "error",
  },
];

const COMMON_MISTAKES = [
  {
    mistake:
      "Assuming all verbs with normal present endings are regular in every tense",
    example: "gehen looks fine in present — but: ging, gegangen",
  },
  {
    mistake: "Ignoring mixed verbs as a separate category",
    example: "denken is not weak (dachte ≠ denkte) and not fully strong",
  },
  {
    mistake: "Confusing pronunciation adjustment with true irregularity",
    example:
      "arbeiten → arbeitest is regular — the -e- is just for pronunciation",
  },
  {
    mistake: "Treating irregularity as a syntax issue",
    example:
      "Irregular verbs still follow V2 and verb-final rules exactly like regular ones",
  },
  {
    mistake:
      "Forgetting that present stem changes affect only du and er/sie/es",
    example: "fahren: ich fahre ✅ · du fährst ✅ · wir fahren ✅",
  },
  {
    mistake: "Memorizing Partizip II without learning Präteritum",
    example: "gelesen ≠ enough; you also need las",
  },
  {
    mistake: "Confusing participle prefix rules with regularity rules",
    example:
      "besucht = inseparable prefix blocking ge-, not a sign of regularity type",
  },
];

const MEMORY_FORMULA = [
  {
    rule: "Regular",
    detail: "Stable stem · Präteritum often -te · Partizip II often -t",
    colorKey: "primary",
  },
  {
    rule: "Irregular",
    detail: "Stem change · Special Präteritum · Partizip II often -en",
    colorKey: "error",
  },
  {
    rule: "Mixed",
    detail: "Stem changes + regular-looking endings · e.g. dachte, gebracht",
    colorKey: "gold",
  },
  {
    rule: "Learn 3-part sets",
    detail:
      "Infinitive → Präteritum → Partizip II · For common verbs: also du / er present",
    colorKey: "success",
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const COLOR_MAP = {
  primary: {
    badge: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
  },
  gold: { badge: "var(--color-gold-highlight)", color: "var(--color-gold)" },
  success: {
    badge: "var(--color-success-highlight)",
    color: "var(--color-success)",
  },
  error: { badge: "var(--color-error-highlight)", color: "var(--color-error)" },
};

function Badge({ label, colorKey }) {
  const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--text-xs)",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: c.badge,
        color: c.color,
        border: `1px solid ${c.color}22`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SectionCard({ children, accentColor, delay = 0, style = {} }) {
  const c = COLOR_MAP[accentColor] || COLOR_MAP.primary;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        padding: "var(--space-6)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: `3px solid ${c.color}`,
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-sm)",
        animation: `fade-up 400ms cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, children, colorKey = "primary" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-lg)",
        color: COLOR_MAP[colorKey]?.color || "var(--color-primary)",
      }}
    >
      {icon && <span>{icon}</span>}
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
                    color: "var(--color-text)",
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

function ExamplesToggle({ examples }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <button className="examples-toggle" onClick={() => setOpen((o) => !o)}>
        <span>{open ? "▲" : "▼"}</span>
        {open ? "Hide examples" : "Show examples"}
      </button>
      {open && (
        <div className="examples-list">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="example-row"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="example-de">{ex.de}</span>
              {ex.en && <span className="example-en">{ex.en}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "identify", label: "How to Identify" },
  { id: "present", label: "Present Tense" },
  { id: "past", label: "Past Forms" },
  { id: "models", label: "Conjugation Models" },
  { id: "partizip", label: "Partizip II" },
  { id: "tenses", label: "All Tenses" },
  { id: "structure", label: "Sentence Structure" },
  { id: "memory", label: "Memory Sets" },
  { id: "mistakes", label: "Common Mistakes" },
  { id: "formula", label: "Master Formula" },
];

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Core idea */}
      <SectionCard accentColor="primary" delay={0}>
        <SectionTitle icon="💡" colorKey="primary">
          Core Idea
        </SectionTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {[
            {
              label: "Regular (Weak)",
              desc: "Follows the normal conjugation pattern. Keeps the same stem throughout its core forms, especially in Präteritum and Partizip II formation.",
              colorKey: "primary",
            },
            {
              label: "Irregular (Strong)",
              desc: "Does not fully follow that pattern — usually because the stem vowel changes and the past forms must be learned individually.",
              colorKey: "error",
            },
            {
              label: "Mixed",
              desc: "A hybrid type: stem change like an irregular verb, but regular-looking endings in some forms.",
              colorKey: "gold",
            },
          ].map((item, i) => {
            const c = COLOR_MAP[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  alignItems: "flex-start",
                  padding: "var(--space-4)",
                  background: c.badge,
                  border: `1px solid ${c.color}33`,
                  borderRadius: "var(--radius-xl)",
                }}
              >
                <span
                  style={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: "var(--radius-lg)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--color-surface)",
                    border: `1.5px solid ${c.color}`,
                    color: c.color,
                    fontWeight: 900,
                    fontSize: "var(--text-xs)",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
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
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                      marginTop: "var(--space-1)",
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Category table */}
      <SectionCard accentColor="gold" delay={80}>
        <SectionTitle icon="📊" colorKey="gold">
          Three Categories
        </SectionTitle>
        <Table
          headers={["Category", "Other Name", "Main Feature", "Examples"]}
          rows={CATEGORIES.map((cat) => [
            <Badge label={cat.name} colorKey={cat.colorKey} />,
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
              }}
            >
              {cat.name.includes("Regular")
                ? "Weak verbs"
                : cat.name.includes("Irregular")
                  ? "Strong verbs"
                  : "Mixed verbs"}
            </span>,
            <span
              style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }}
            >
              {cat.feature}
            </span>,
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-1)",
              }}
            >
              {cat.examples.map((ex, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  {ex}
                </span>
              ))}
            </div>,
          ])}
        />
      </SectionCard>

      {/* Regular vs Irregular features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <SectionCard accentColor="primary" delay={160}>
          <SectionTitle icon="✅" colorKey="primary">
            Regular Verbs
          </SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {REGULAR_FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-divider)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                }}
              >
                ✓ {f}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-2)" }}>
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                marginBottom: "var(--space-2)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Example: machen
            </div>
            {[
              ["Infinitive", "machen"],
              ["Präsens", "ich mache · du machst · er macht"],
              ["Präteritum", "ich machte"],
              ["Partizip II", "gemacht"],
            ].map(([label, val], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-1)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    minWidth: 90,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--color-primary)",
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard accentColor="error" delay={200}>
          <SectionTitle icon="⚡" colorKey="error">
            Irregular Verbs
          </SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {IRREGULAR_FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-divider)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                }}
              >
                ⚡ {f}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-2)" }}>
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                marginBottom: "var(--space-2)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Example: lesen
            </div>
            {[
              ["Infinitive", "lesen"],
              ["Präsens", "ich lese · du liest · er liest"],
              ["Präteritum", "ich las"],
              ["Partizip II", "gelesen"],
            ].map(([label, val], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-1)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    minWidth: 90,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--color-error)",
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* High-frequency irregular verbs */}
      <SectionCard accentColor="gold" delay={240}>
        <SectionTitle icon="🔥" colorKey="gold">
          High-Frequency Irregular Verbs
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          These appear constantly across all tenses and structures — memorize
          them as complete systems first.
        </p>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}
        >
          {HIGH_FREQ_IRREGULAR.map((v, i) => (
            <span
              key={i}
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                background: "var(--color-gold-highlight)",
                color: "var(--color-gold)",
                border: "1px solid var(--color-gold)33",
              }}
            >
              {v}
            </span>
          ))}
        </div>
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            fontStyle: "italic",
          }}
        >
          ⚠️ <strong>sein</strong> is highly irregular across the <em>whole</em>{" "}
          paradigm — not just in du/er forms.
        </div>
      </SectionCard>
    </div>
  );
}

function IdentifySection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SectionCard accentColor="primary" delay={0}>
        <SectionTitle icon="🔍" colorKey="primary">
          Rule-of-Thumb Indicators
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          You usually cannot identify every verb perfectly from the infinitive
          alone. The most reliable method: learn the{" "}
          <strong>principal parts</strong> — infinitive, Präteritum, Partizip
          II.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {IDENTIFICATION_RULES.map((item, i) => {
            const c = COLOR_MAP[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  alignItems: "flex-start",
                  padding: "var(--space-3) var(--space-4)",
                  background: c.badge,
                  border: `1px solid ${c.color}33`,
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <span style={{ fontSize: "var(--text-base)" }}>→</span>
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    If: <em>{item.rule}</em>
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      color: c.color,
                      marginTop: "var(--space-1)",
                    }}
                  >
                    ▸ {item.verdict}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard accentColor="gold" delay={80}>
        <SectionTitle icon="⚠️" colorKey="gold">
          Important: Don't Confuse These
        </SectionTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {[
            {
              label: "Conjugation class",
              desc: "Regular / Irregular / Mixed — about how verb forms are built",
              colorKey: "primary",
            },
            {
              label: "Syntax / Valency",
              desc: "What complements (cases, prepositions) the verb takes — completely separate",
              colorKey: "gold",
            },
            {
              label: "Separability",
              desc: "Separable vs inseparable is a different dimension from regular vs irregular",
              colorKey: "success",
            },
            {
              label: "Auxiliary choice",
              desc: "haben vs sein in Perfekt is separate from regularity",
              colorKey: "error",
            },
          ].map((item, i) => {
            const c = COLOR_MAP[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border)",
                  borderLeft: `3px solid ${c.color}`,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: c.color,
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            fontStyle: "italic",
          }}
        >
          Example: <strong>helfen</strong> is notable not because of its
          conjugation class, but because it takes <strong>dative</strong>.{" "}
          <strong>lesen</strong> is irregular in conjugation but syntactically a
          normal transitive verb.
        </div>
      </SectionCard>
    </div>
  );
}

function PresentSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Regular endings */}
      <SectionCard accentColor="primary" delay={0}>
        <SectionTitle icon="📐" colorKey="primary">
          Regular Verbs — Standard Endings
        </SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "var(--space-2)",
              }}
            >
              Endings
            </div>
            {[
              ["ich", "-e"],
              ["du", "-st"],
              ["er/sie/es", "-t"],
              ["wir", "-en"],
              ["ihr", "-t"],
              ["sie/Sie", "-en"],
            ].map(([pron, end], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  padding: "var(--space-1) 0",
                  borderBottom: "1px solid var(--color-divider)",
                  fontSize: "var(--text-sm)",
                }}
              >
                <span
                  style={{ minWidth: 60, color: "var(--color-text-muted)" }}
                >
                  {pron}
                </span>
                <span
                  style={{ fontWeight: 700, color: "var(--color-primary)" }}
                >
                  {end}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "var(--space-2)",
              }}
            >
              Example: lernen
            </div>
            {[
              "ich lerne",
              "du lernst",
              "er lernt",
              "wir lernen",
              "ihr lernt",
              "sie lernen",
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                  padding: "var(--space-1) 0",
                  borderBottom: "1px solid var(--color-divider)",
                  fontStyle: "italic",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-primary-highlight)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-primary)33",
            fontSize: "var(--text-xs)",
            color: "var(--color-text)",
          }}
        >
          <strong style={{ color: "var(--color-primary)" }}>
            📌 -t/-d stem rule:
          </strong>{" "}
          If the stem ends in <strong>-d</strong> or <strong>-t</strong>, German
          inserts <strong>-e-</strong> before some endings for pronunciation
          (e.g. arbeiten → du arbeitest). This is still <em>regular</em>, not
          irregular.
        </div>
      </SectionCard>

      {/* Irregular present */}
      <SectionCard accentColor="error" delay={80}>
        <SectionTitle icon="⚡" colorKey="error">
          Irregular Verbs — Present Stem Changes
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Many irregular verbs are regular in most persons but irregular only in{" "}
          <strong style={{ color: "var(--color-error)" }}>du</strong> and{" "}
          <strong style={{ color: "var(--color-error)" }}>er/sie/es</strong>. A
          verb may look almost regular in present tense — learners often don't
          notice it's irregular until Präteritum.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {PRESENT_STEM_CHANGES.map((group, gi) => {
            const c = COLOR_MAP[group.colorKey];
            return (
              <div
                key={gi}
                style={{
                  padding: "var(--space-4)",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderLeft: `3px solid ${c.color}`,
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: c.color,
                    fontSize: "var(--text-base)",
                    marginBottom: "var(--space-3)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {group.pattern}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}
                >
                  {group.examples.map((ex, ei) => (
                    <div
                      key={ei}
                      style={{
                        display: "flex",
                        gap: "var(--space-4)",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          minWidth: 80,
                          color: "var(--color-text)",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        {ex.verb}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--color-text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        {ex.du}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--color-text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        {ex.er}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-error-highlight)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-error)33",
            fontSize: "var(--text-xs)",
            color: "var(--color-text)",
          }}
        >
          <strong style={{ color: "var(--color-error)" }}>⚠️ Remember:</strong>{" "}
          These stem changes affect <em>only</em> du and er/sie/es — not ich,
          wir, ihr, sie. Example: <em>ich fahre ✅ · wir fahren ✅</em> ·{" "}
          <strong>sein</strong> is the big exception — irregular across the
          whole paradigm.
        </div>
      </SectionCard>
    </div>
  );
}

function PastSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        {/* Regular */}
        <SectionCard accentColor="primary" delay={0}>
          <SectionTitle icon="📐" colorKey="primary">
            Regular Pattern
          </SectionTitle>
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-primary-highlight)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-primary)33",
              fontSize: "var(--text-sm)",
            }}
          >
            <div style={{ marginBottom: "var(--space-1)" }}>
              <strong style={{ color: "var(--color-primary)" }}>
                Präteritum:
              </strong>{" "}
              <span>
                stem + <strong>-te</strong> + ending
              </span>
            </div>
            <div>
              <strong style={{ color: "var(--color-primary)" }}>
                Partizip II:
              </strong>{" "}
              <span>
                <strong>ge-</strong> + stem + <strong>-t</strong>
              </span>
            </div>
          </div>
          {[
            { verb: "kaufen", prat: "kaufte", part: "gekauft" },
            { verb: "arbeiten", prat: "arbeitete", part: "gearbeitet" },
            { verb: "lernen", prat: "lernte", part: "gelernt" },
          ].map((ex, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
                fontSize: "var(--text-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                {ex.verb}
              </span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                }}
              >
                Präteritum: {ex.prat}
              </span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                }}
              >
                Partizip II: {ex.part}
              </span>
            </div>
          ))}
        </SectionCard>

        {/* Irregular */}
        <SectionCard accentColor="error" delay={80}>
          <SectionTitle icon="⚡" colorKey="error">
            Irregular Pattern
          </SectionTitle>
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-error-highlight)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-error)33",
              fontSize: "var(--text-sm)",
            }}
          >
            <div style={{ marginBottom: "var(--space-1)" }}>
              <strong style={{ color: "var(--color-error)" }}>
                Präteritum:
              </strong>{" "}
              <span>
                changed stem, often <strong>no -te</strong>
              </span>
            </div>
            <div>
              <strong style={{ color: "var(--color-error)" }}>
                Partizip II:
              </strong>{" "}
              <span>
                <strong>ge-</strong> + changed stem + <strong>-en</strong>
              </span>
            </div>
          </div>
          {[
            { verb: "gehen", prat: "ging", part: "gegangen" },
            { verb: "finden", prat: "fand", part: "gefunden" },
            { verb: "schreiben", prat: "schrieb", part: "geschrieben" },
          ].map((ex, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
                fontSize: "var(--text-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--color-error)" }}>
                {ex.verb}
              </span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                }}
              >
                Präteritum: {ex.prat}
              </span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                }}
              >
                Partizip II: {ex.part}
              </span>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Mixed verbs */}
      <SectionCard accentColor="gold" delay={160}>
        <SectionTitle icon="🔀" colorKey="gold">
          Mixed Verbs
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Stem change like irregular verbs, but use regular-style{" "}
          <strong>-te</strong> and <strong>-t</strong> endings. Learners often
          assume these are purely regular or purely strong — they belong to a
          third, distinct category.
        </p>
        <Table
          headers={["Infinitive", "Präteritum", "Partizip II"]}
          rows={MIXED_VERBS.map((v) => [
            <strong style={{ color: "var(--color-gold)" }}>{v.inf}</strong>,
            <span style={{ fontStyle: "italic", color: "var(--color-text)" }}>
              {v.prat}
            </span>,
            <span style={{ fontStyle: "italic", color: "var(--color-text)" }}>
              {v.part}
            </span>,
          ])}
        />
      </SectionCard>
    </div>
  );
}

function ModelsSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
        }}
      >
        💡 These are the most useful <strong>blueprint verbs</strong>. Learn
        their full paradigm and you can predict most other verbs in the same
        class.
      </div>
      {CONJUGATION_MODELS.map((model, i) => {
        const c = COLOR_MAP[model.colorKey];
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderLeft: `3px solid ${c.color}`,
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              animation: `fade-up 400ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
            }}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-4) var(--space-6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <Badge
                  label={
                    model.colorKey === "primary"
                      ? "Regular"
                      : model.colorKey === "error"
                        ? "Irregular"
                        : "Mixed"
                  }
                  colorKey={model.colorKey}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontSize: "var(--text-base)",
                  }}
                >
                  {model.label}
                </span>
              </div>
              <span
                style={{
                  color: c.color,
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                }}
              >
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: "0 var(--space-6) var(--space-5)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  {model.note}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--space-4)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      Präsens
                    </div>
                    {model.praesens.map((f, fi) => (
                      <div
                        key={fi}
                        style={{
                          fontSize: "var(--text-sm)",
                          fontStyle: "italic",
                          padding: "var(--space-1) 0",
                          borderBottom: "1px solid var(--color-divider)",
                          color:
                            fi === 1 || fi === 2
                              ? c.color
                              : "var(--color-text)",
                          fontWeight: fi === 1 || fi === 2 ? 700 : 400,
                        }}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      Past Forms
                    </div>
                    {model.praeteritum.map((f, fi) => (
                      <div
                        key={fi}
                        style={{
                          fontSize: "var(--text-sm)",
                          fontStyle: "italic",
                          padding: "var(--space-1) 0",
                          borderBottom: "1px solid var(--color-divider)",
                          color: c.color,
                          fontWeight: 700,
                        }}
                      >
                        {f}
                      </div>
                    ))}
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        fontStyle: "italic",
                        padding: "var(--space-1) 0",
                        borderBottom: "1px solid var(--color-divider)",
                        color: "var(--color-text-muted)",
                        marginTop: "var(--space-2)",
                      }}
                    >
                      Perfekt: {model.perfekt}
                    </div>
                    <div style={{ marginTop: "var(--space-2)" }}>
                      <Badge
                        label={`Partizip II: ${model.partizip}`}
                        colorKey={model.colorKey}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PartizipSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {PARTIZIP_PATTERNS.map((pat, i) => {
          const c = COLOR_MAP[pat.colorKey];
          return (
            <SectionCard key={i} accentColor={pat.colorKey} delay={i * 80}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  flexWrap: "wrap",
                }}
              >
                <Badge label={pat.type} colorKey={pat.colorKey} />
                <code
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: c.color,
                    background: c.badge,
                    padding: "2px 10px",
                    borderRadius: "var(--radius-full)",
                    border: `1px solid ${c.color}33`,
                  }}
                >
                  {pat.formula}
                </code>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-3)",
                }}
              >
                {pat.examples.map((ex, ei) => (
                  <div
                    key={ei}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      padding: "var(--space-2) var(--space-3)",
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {ex.verb}
                    </span>
                    <span style={{ color: "var(--color-text-faint)" }}>→</span>
                    <span style={{ fontWeight: 700, color: c.color }}>
                      {ex.partizip}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          );
        })}
      </div>

      {/* Prefix rules */}
      <SectionCard accentColor="success" delay={240}>
        <SectionTitle icon="🔗" colorKey="success">
          Prefix Rules for Partizip II
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          About participle formation — not directly about regularity, but
          essential for conjugation memory.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {PREFIX_RULES.map((rule, i) => {
            const c = COLOR_MAP[rule.colorKey];
            return (
              <div
                key={i}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderLeft: `3px solid ${c.color}`,
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {rule.rule}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-1)",
                  }}
                >
                  {rule.examples.map((ex, ei) => (
                    <span
                      key={ei}
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        fontStyle: "italic",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: c.badge,
                        color: c.color,
                        border: `1px solid ${c.color}33`,
                      }}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function TensesSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SectionCard accentColor="primary" delay={0}>
        <SectionTitle icon="⏱️" colorKey="primary">
          Regular vs Irregular Across All Tenses
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          The irregularity mostly matters in the{" "}
          <strong>lexical verb form</strong> (participles, stems) — not in the
          position rules of auxiliaries.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {TENSES_COMPARISON.map((row, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-4)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                animation: `fade-up 350ms cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`,
              }}
            >
              <Badge label={row.tense} colorKey="primary" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "var(--space-4)",
                  marginTop: "var(--space-3)",
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
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    Regular
                  </div>
                  <div
                    style={{
                      fontStyle: "italic",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    {row.regular.example}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-faint)",
                      marginTop: "var(--space-1)",
                    }}
                  >
                    {row.regular.note}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      color: "var(--color-error)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    Irregular
                  </div>
                  <div
                    style={{
                      fontStyle: "italic",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    {row.irregular.example}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-faint)",
                      marginTop: "var(--space-1)",
                    }}
                  >
                    {row.irregular.note}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function StructureSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SectionCard accentColor="success" delay={0}>
        <SectionTitle icon="🏗️" colorKey="success">
          Verb Type Does Not Change Clause Structure
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Regular and irregular verbs follow the <strong>exact same</strong>{" "}
          structural placement patterns. The difference is in <em>form</em>, not
          in the syntax frame.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {SENTENCE_STRUCTURE.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-4)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderLeft: "3px solid var(--color-success)",
                borderRadius: "var(--radius-lg)",
                animation: `fade-up 350ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--color-success)",
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {item.type}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {item.examples.map((ex, ei) => (
                  <span
                    key={ei}
                    style={{
                      fontStyle: "italic",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-faint)",
                  borderTop: "1px solid var(--color-divider)",
                  paddingTop: "var(--space-2)",
                }}
              >
                {item.rule}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Case use */}
      <SectionCard accentColor="gold" delay={160}>
        <SectionTitle icon="🎯" colorKey="gold">
          Case Government Is Independent of Regularity
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Case is determined by the verb's <strong>valency and meaning</strong>,
          not by whether it is regular or irregular.
        </p>
        <Table
          headers={["Verb", "Case", "Example"]}
          rows={CASE_USE.map((row) => [
            <span style={{ fontWeight: 600, color: "var(--color-text)" }}>
              {row.verb}
            </span>,
            <Badge
              label={row.case_}
              colorKey={
                row.case_.includes("Acc")
                  ? "gold"
                  : row.case_.includes("Dat")
                    ? "success"
                    : "primary"
              }
            />,
            <span
              style={{
                fontStyle: "italic",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
              }}
            >
              {row.example}
            </span>,
          ])}
        />
      </SectionCard>
    </div>
  );
}

function MemorySection() {
  const [flipped, setFlipped] = useState({});
  const toggle = (i) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SectionCard accentColor="primary" delay={0}>
        <SectionTitle icon="🧩" colorKey="primary">
          Learn Verbs in 3-Part Sets
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Don't memorize just the infinitive. Tap a card to reveal full forms.
          For common irregular verbs, also learn the present du / er forms.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {MEMORY_SETS.map((v, i) => {
            const c = COLOR_MAP[v.colorKey];
            const isFlipped = flipped[i];
            return (
              <div
                key={i}
                onClick={() => toggle(i)}
                style={{
                  padding: "var(--space-4)",
                  background: isFlipped ? c.badge : "var(--color-surface-2)",
                  border: `1px solid ${isFlipped ? c.color + "55" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-xl)",
                  cursor: "pointer",
                  transition: "all var(--transition-interactive)",
                  animation: `fade-up 350ms cubic-bezier(0.16,1,0.3,1) ${i * 30}ms both`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "var(--text-base)",
                    color: c.color,
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {v.inf}
                </div>
                {!isFlipped ? (
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-faint)",
                      fontStyle: "italic",
                    }}
                  >
                    tap to reveal forms
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
                      ["du/er", `${v.du} · ${v.er}`],
                      ["Prät.", v.prat],
                      ["Part. II", v.part],
                    ].map(([label, val], li) => (
                      <div
                        key={li}
                        style={{
                          display: "flex",
                          gap: "var(--space-2)",
                          fontSize: "var(--text-xs)",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-text-muted)",
                            minWidth: 42,
                          }}
                        >
                          {label}
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
                  <Badge label={v.type} colorKey={v.colorKey} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* High-value memory rules */}
      <SectionCard accentColor="gold" delay={80}>
        <SectionTitle icon="📌" colorKey="gold">
          High-Value Memory Rules
        </SectionTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {[
            { text: "Most German verbs are regular.", colorKey: "primary" },
            {
              text: "Irregular verbs must often be learned individually — especially their past forms.",
              colorKey: "error",
            },
            {
              text: "Present-tense stem change usually appears only in du and er/sie/es.",
              colorKey: "gold",
            },
            {
              text: "Regular verbs: Präteritum in -te and participle in -t.",
              colorKey: "primary",
            },
            {
              text: "Irregular verbs: Präteritum without -te and participle in -en.",
              colorKey: "error",
            },
            {
              text: "Mixed verbs are real and important — don't force every verb into only two categories.",
              colorKey: "gold",
            },
            {
              text: "Conjugation class does not determine case government.",
              colorKey: "success",
            },
            {
              text: "Conjugation class does not change V2 / verb-final sentence structure rules.",
              colorKey: "success",
            },
          ].map((item, i) => {
            const c = COLOR_MAP[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  alignItems: "flex-start",
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-divider)",
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
                  ✓
                </span>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                  }}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function MistakesSection() {
  return (
    <SectionCard accentColor="error" delay={0}>
      <SectionTitle icon="🚫" colorKey="error">
        Common Mistakes
      </SectionTitle>
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
    </SectionCard>
  );
}

function FormulaSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SectionCard accentColor="success" delay={0}>
        <SectionTitle icon="🧠" colorKey="success">
          Ultra-Short Master Formula
        </SectionTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {MEMORY_FORMULA.map((item, i) => {
            const c = COLOR_MAP[item.colorKey];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-3)",
                  padding: "var(--space-4) var(--space-5)",
                  background: c.badge,
                  border: `1px solid ${c.color}33`,
                  borderRadius: "var(--radius-xl)",
                  animation: `fade-up 400ms cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                }}
              >
                <span
                  style={{
                    minWidth: 32,
                    height: 32,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-surface)",
                    border: `1.5px solid ${c.color}`,
                    color: c.color,
                    fontWeight: 900,
                    fontSize: "var(--text-sm)",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
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
      </SectionCard>

      {/* Mini reference set */}
      <SectionCard accentColor="primary" delay={160}>
        <SectionTitle icon="📎" colorKey="primary">
          Good Mini-Reference Set to Memorize First
        </SectionTitle>
        <Table
          headers={["Infinitive", "Präteritum", "Partizip II", "Type"]}
          rows={[
            {
              inf: "machen",
              prat: "machte",
              part: "gemacht",
              type: "regular",
              colorKey: "primary",
            },
            {
              inf: "arbeiten",
              prat: "arbeitete",
              part: "gearbeitet",
              type: "regular",
              colorKey: "primary",
            },
            {
              inf: "lesen",
              prat: "las",
              part: "gelesen",
              type: "irregular",
              colorKey: "error",
            },
            {
              inf: "fahren",
              prat: "fuhr",
              part: "gefahren",
              type: "irregular",
              colorKey: "error",
            },
            {
              inf: "nehmen",
              prat: "nahm",
              part: "genommen",
              type: "irregular",
              colorKey: "error",
            },
            {
              inf: "denken",
              prat: "dachte",
              part: "gedacht",
              type: "mixed",
              colorKey: "gold",
            },
          ].map((v) => [
            <strong
              style={{
                color: COLOR_MAP[v.colorKey].color,
                fontFamily: "var(--font-display)",
              }}
            >
              {v.inf}
            </strong>,
            <span style={{ fontStyle: "italic" }}>{v.prat}</span>,
            <span style={{ fontStyle: "italic" }}>{v.part}</span>,
            <Badge label={v.type} colorKey={v.colorKey} />,
          ])}
        />
      </SectionCard>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function RegularIrregular() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderSection = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "identify":
        return <IdentifySection />;
      case "present":
        return <PresentSection />;
      case "past":
        return <PastSection />;
      case "models":
        return <ModelsSection />;
      case "partizip":
        return <PartizipSection />;
      case "tenses":
        return <TensesSection />;
      case "structure":
        return <StructureSection />;
      case "memory":
        return <MemorySection />;
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
          marginBottom: "var(--space-8)",
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
          Regular & Irregular Verbs
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Complete reference A1 → B2 · Conjugation classes · Present changes ·
          Partizip II · All tenses · Memory sets
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-1)",
          marginBottom: "var(--space-8)",
          padding: "var(--space-1)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: "1 1 auto",
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                border: "none",
                cursor: "pointer",
                fontSize: "var(--text-xs)",
                fontWeight: active ? 700 : 500,
                letterSpacing: "0.03em",
                transition: "all var(--transition-interactive)",
                background: active ? "var(--color-primary)" : "transparent",
                color: active ? "#fff" : "var(--color-text-muted)",
                boxShadow: active ? "var(--shadow-sm)" : "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active section */}
      <div className="pronouns-sections">{renderSection()}</div>
    </div>
  );
}
