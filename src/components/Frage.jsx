import { useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const CORE_PATTERNS = [
  {
    type: "Yes/No Question",
    structure: "Verb + Subject + Rest",
    example: "Kommst du heute?",
    meaning: "Are you coming today?",
    color: "nom",
  },
  {
    type: "W-Question",
    structure: "Question Word + Verb + Subject + Rest",
    example: "Wann kommst du?",
    meaning: "When are you coming?",
    color: "acc",
  },
  {
    type: "Subject Question",
    structure: "Wer + Verb + Rest",
    example: "Wer kommt heute?",
    meaning: "Who is coming today?",
    color: "dat",
  },
  {
    type: "Indirect Question",
    structure: "Main clause + W-word/ob + … + Verb at end",
    example: "Ich weiß nicht, wo er wohnt.",
    meaning: "I don't know where he lives.",
    color: "gen",
  },
];

const W_WORDS = [
  {
    word: "wer",
    meaning: "who",
    asks: "Person as subject",
    note: "Nominative; often acts as subject itself",
    example: "Wer hat dir das Buch gegeben?",
  },
  {
    word: "wen",
    meaning: "whom",
    asks: "Direct object person",
    note: "Accusative",
    example: "Wen habt ihr gesehen?",
  },
  {
    word: "wem",
    meaning: "to whom / whom",
    asks: "Indirect object person",
    note: "Dative",
    example: "Wem hast du das Buch gegeben?",
  },
  {
    word: "wessen",
    meaning: "whose",
    asks: "Possession",
    note: "Genitive meaning",
    example: "Wessen Auto ist das?",
  },
  {
    word: "was",
    meaning: "what",
    asks: "Thing, action",
    note: "Can ask about subject, object, or action",
    example: "Was machst du da?",
  },
  {
    word: "wo",
    meaning: "where",
    asks: "Location",
    note: "Static place",
    example: "Wo wohnst du?",
  },
  {
    word: "wohin",
    meaning: "where to",
    asks: "Direction",
    note: "Movement toward a place",
    example: "Wohin gehst du?",
  },
  {
    word: "woher",
    meaning: "where from",
    asks: "Origin",
    note: "Movement / source",
    example: "Woher kommst du?",
  },
  {
    word: "wann",
    meaning: "when",
    asks: "Time",
    note: "Neutral time question",
    example: "Wann beginnt der Film?",
  },
  {
    word: "wie",
    meaning: "how",
    asks: "Manner / state",
    note: "Also used in set phrases",
    example: "Wie geht es dir?",
  },
  {
    word: "warum / wieso / weshalb",
    meaning: "why",
    asks: "Reason",
    note: "Near-synonyms for reason",
    example: "Warum kommst du so spät?",
  },
  {
    word: "wozu / wofür",
    meaning: "what for",
    asks: "Purpose",
    note: "Purpose, goal, intended use",
    example: "Wozu brauchst du die Schere?",
  },
  {
    word: "welcher/welche/welches",
    meaning: "which",
    asks: "Selection from a known set",
    note: "Must agree with noun gender/number",
    example: "Welches Buch liest du?",
  },
  {
    word: "wie viel",
    meaning: "how much",
    asks: "Amount",
    note: "Uncountable quantity or price",
    example: "Wie viel kostet das?",
  },
  {
    word: "wie viele",
    meaning: "how many",
    asks: "Countable number",
    note: "Used with plural count nouns",
    example: "Wie viele Kinder hast du?",
  },
];

const CASE_LADDER = [
  {
    form: "wer",
    fn: "Subject",
    case_: "Nominative",
    color: "nom",
    example: "Wer kommt heute?",
    en: "Who is coming today?",
  },
  {
    form: "wen",
    fn: "Direct object",
    case_: "Accusative",
    color: "acc",
    example: "Wen siehst du?",
    en: "Whom do you see?",
  },
  {
    form: "wem",
    fn: "Indirect object",
    case_: "Dative",
    color: "dat",
    example: "Wem gibst du das Buch?",
    en: "To whom do you give the book?",
  },
  {
    form: "wessen",
    fn: "Possession",
    case_: "Genitive",
    color: "gen",
    example: "Wessen Auto ist das?",
    en: "Whose car is that?",
  },
];

const PREP_QUESTIONS = [
  {
    meaning: "with what/whom",
    person: "Mit wem gehst du ins Kino?",
    thing: "Womit kann ich helfen?",
  },
  { meaning: "about/of what", person: "—", thing: "Woran denkst du?" },
  {
    meaning: "for what",
    person: "Für wen ist das Geschenk?",
    thing: "Wofür brauchst du das?",
  },
];

const TENSES = [
  {
    tense: "Present yes/no",
    pattern: "Finite verb first",
    example: "Trinkst du Bier?",
    en: "Do you drink beer?",
  },
  {
    tense: "Perfect yes/no",
    pattern: "Auxiliary first, participle later",
    example: "Hat er das Buch gelesen?",
    en: "Has he read the book?",
  },
  {
    tense: "Future yes/no",
    pattern: "Finite verb first, infinitive later",
    example: "Werden wir morgen kommen?",
    en: "Will we come tomorrow?",
  },
  {
    tense: "Modal yes/no",
    pattern: "Modal first, lexical infinitive later",
    example: "Kannst du gut schwimmen?",
    en: "Can you swim well?",
  },
  {
    tense: "W-question present",
    pattern: "W-word first, finite verb second",
    example: "Was machst du?",
    en: "What are you doing?",
  },
  {
    tense: "Indirect question",
    pattern: "Verb goes to the end",
    example: "Ich frage mich, ob er Zeit hat.",
    en: "I wonder if he has time.",
  },
];

const INDIRECT_PAIRS = [
  {
    direct: "Wo wohnt er?",
    indirect: "Ich weiß nicht, wo er wohnt.",
    directEn: "Where does he live?",
    indirectEn: "I don't know where he lives.",
  },
  {
    direct: "Wann kommt sie?",
    indirect: "Er fragt, wann sie kommt.",
    directEn: "When is she coming?",
    indirectEn: "He asks when she is coming.",
  },
  {
    direct: "Hat er Zeit?",
    indirect: "Ich frage mich, ob er Zeit hat.",
    directEn: "Does he have time?",
    indirectEn: "I wonder if he has time.",
  },
  {
    direct: "Was macht ihr?",
    indirect: "Sie will wissen, was ihr macht.",
    directEn: "What are you doing?",
    indirectEn: "She wants to know what you are doing.",
  },
];

const PRO_NOTES = [
  'German does NOT use "do/does" to form questions — verb-first order does the job.',
  "wer-questions are special: wer itself can be the subject, so the sentence may look shorter: Wer kommt heute?",
  "Learn questions by slots, not by translation: slot 1 = question word OR finite verb, slot 2 = finite verb OR subject, then the rest.",
  'Memorize the "who" case ladder as a unit: wer → wen → wem → wessen.',
  "Separate place logic clearly: wo = location · wohin = destination · woher = origin.",
  "For people, use preposition + question word (e.g. mit wem). For things, prefer wo-compounds (e.g. womit, woran).",
  "In indirect questions, expect the verb at the END and use ob for embedded yes/no meaning.",
  "In negative questions, remember doch as the correction word: Kommst du nicht? → Doch, ich komme!",
  "If the preposition begins with a vowel, German inserts an -r-: an + becomes woran, aus + becomes woraus.",
];
const PRACTICE_SET = {
  statement: "Du kommst morgen.",
  conversions: [
    { type: "Yes/No", de: "Kommst du morgen?", en: "Are you coming tomorrow?" },
    { type: "W-Question", de: "Wann kommst du?", en: "When are you coming?" },
    {
      type: "Subject Q",
      de: "Wer kommt morgen?",
      en: "Who is coming tomorrow?",
    },
    {
      type: "Indirect Q",
      de: "Ich weiß nicht, ob du morgen kommst.",
      en: "I don't know if you're coming tomorrow.",
    },
  ],
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const COLOR = {
  nom: {
    badge: "case-badge-nom",
    border: "case-nom",
    tag: "case-tag-nom",
    label: "NOM",
  },
  acc: {
    badge: "case-badge-acc",
    border: "case-acc",
    tag: "case-tag-acc",
    label: "ACC",
  },
  dat: {
    badge: "case-badge-dat",
    border: "case-dat",
    tag: "case-tag-dat",
    label: "DAT",
  },
  gen: {
    badge: "case-badge-gen",
    border: "case-gen",
    tag: "case-tag-gen",
    label: "GEN",
  },
};

function CaseBadge({ color, label }) {
  return (
    <span className={`case-badge ${COLOR[color].badge}`}>
      {label || COLOR[color].label}
    </span>
  );
}

function SectionCard({ color = "nom", children, style = {} }) {
  return (
    <div className={`case-section ${COLOR[color].border}`} style={style}>
      {children}
    </div>
  );
}

function Tag({ text, color }) {
  const colors = {
    nom: {
      bg: "var(--color-primary-highlight)",
      color: "var(--color-primary)",
    },
    acc: { bg: "var(--color-gold-highlight)", color: "var(--color-gold)" },
    dat: {
      bg: "var(--color-success-highlight)",
      color: "var(--color-success)",
    },
    gen: { bg: "var(--color-error-highlight)", color: "var(--color-error)" },
    info: { bg: "var(--color-surface-2)", color: "var(--color-text-muted)" },
  };
  const c = colors[color] || colors.info;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "var(--radius-full)",
        background: c.bg,
        color: c.color,
        fontWeight: 700,
        fontSize: "var(--text-xs)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
}

function Collapsible({ label, icon = "▾", children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <button
        className="examples-toggle"
        onClick={() => setOpen((o) => !o)}
        style={{ width: "fit-content" }}
      >
        <span
          style={{
            transition: "transform 200ms",
            display: "inline-block",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          {icon}
        </span>
        {label}
      </button>
      {open && (
        <div
          style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function GrammarTable({ headers, rows, colorCols = [] }) {
  return (
    <div className="boss-table-wrap" style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "var(--text-sm)",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  background: "var(--color-surface-2)",
                  whiteSpace: "nowrap",
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

/* ─────────────────────────────────────────────
   TAB SYSTEM
───────────────────────────────────────────── */

const TABS = [
  { id: "core", label: "Core Patterns", icon: "⚡" },
  { id: "wwords", label: "W-Words", icon: "❓" },
  { id: "cases", label: "Cases & Preps", icon: "🏷️" },
  { id: "tenses", label: "Tenses", icon: "🕐" },
  { id: "indirect", label: "Indirect Qs", icon: "↪️" },
  { id: "pro", label: "Pro Notes", icon: "🎓" },
  { id: "practice", label: "Practice", icon: "🏋️" },
];

/* ─────────────────────────────────────────────
   SECTION COMPONENTS
───────────────────────────────────────────── */

function CorePatternsTab() {
  return (
    <div className="pronouns-sections">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          German has two main direct question types:{" "}
          <strong>W-questions</strong> for specific information and{" "}
          <strong>yes/no questions</strong> for confirmation. The core rule: in
          a yes/no question, the finite verb comes first; in a W-question, the
          question word comes first and the finite verb comes second.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "var(--color-primary-highlight)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-3) var(--space-4)",
            border: "1px solid var(--color-primary)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-primary)",
            alignSelf: "flex-start",
          }}
        >
          💡 Direct questions = <strong>verb early</strong> · Indirect questions
          = <strong>verb late</strong>
        </div>
      </div>

      <GrammarTable
        headers={["Type", "Structure", "German Example", "English"]}
        rows={CORE_PATTERNS.map((p) => [
          <Tag text={p.type} color={p.color} />,
          <code
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            {p.structure}
          </code>,
          <strong>{p.example}</strong>,
          <span className="td-english">{p.meaning}</span>,
        ])}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {CORE_PATTERNS.map((p, i) => (
          <SectionCard key={i} color={p.color}>
            <div className="case-header">
              <div className="case-header-left">
                <CaseBadge
                  color={p.color}
                  label={["Y/N", "W-Q", "SUB", "IND"][i]}
                />
                <div>
                  <div
                    className="case-title"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    {p.type}
                  </div>
                  <div className="case-sublabel">{p.structure}</div>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "var(--space-3)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
              }}
            >
              <div className="example-de">{p.example}</div>
              <div className="example-en">{p.meaning}</div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

function WWOrdersTab() {
  const [search, setSearch] = useState("");
  const filtered = W_WORDS.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase()) ||
      w.asks.toLowerCase().includes(search.toLowerCase()),
  );

  const PLACE_TRIO = [
    {
      word: "wo",
      label: "WHERE",
      sub: "Static location",
      color: "nom",
      icon: "📍",
    },
    {
      word: "wohin",
      label: "WHERE TO",
      sub: "Movement toward",
      color: "acc",
      icon: "→",
    },
    {
      word: "woher",
      label: "WHERE FROM",
      sub: "Origin / source",
      color: "dat",
      icon: "←",
    },
  ];

  return (
    <div className="pronouns-sections">
      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "var(--space-4)",
          background: "var(--color-surface-2)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            fontWeight: 600,
          }}
        >
          💡 Key Insight:
        </span>
        <span
          style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}
        >
          German separates location and direction more clearly than English.
        </span>
        <div
          style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
        >
          {PLACE_TRIO.map((p) => (
            <div
              key={p.word}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: `1px solid var(--color-border)`,
              }}
            >
              <span style={{ fontSize: "var(--text-lg)" }}>{p.icon}</span>
              <div>
                <span
                  className={`case-tag-${p.color}`}
                  style={{ fontWeight: 800, fontSize: "var(--text-sm)" }}
                >
                  {p.word}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    marginLeft: "var(--space-1)",
                  }}
                >
                  = {p.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <input
        placeholder="🔍  Search W-words…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "var(--space-2) var(--space-4)",
          borderRadius: "var(--radius-full)",
          border: "1.5px solid var(--color-border)",
          background: "var(--color-surface-2)",
          color: "var(--color-text)",
          fontSize: "var(--text-sm)",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      <GrammarTable
        headers={["W-Word", "Meaning", "Asks For", "Grammar Note", "Example"]}
        rows={filtered.map((w) => [
          <strong
            style={{
              color: "var(--color-primary)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-base)",
            }}
          >
            {w.word}
          </strong>,
          <Tag text={w.meaning} color="info" />,
          <span
            style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }}
          >
            {w.asks}
          </span>,
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-faint)",
              fontStyle: "italic",
            }}
          >
            {w.note}
          </span>,
          <span className="example-de">{w.example}</span>,
        ])}
      />
    </div>
  );
}

function CasesTab() {
  return (
    <div className="pronouns-sections">
      <SectionCard color="nom">
        <div className="case-header">
          <div className="case-header-left">
            <CaseBadge color="nom" label="WHO" />
            <div>
              <div className="case-title">The "Who" Case Ladder</div>
              <div className="case-sublabel">
                Memorize as a unit: wer → wen → wem → wessen
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            flexWrap: "wrap",
            padding: "var(--space-3)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {CASE_LADDER.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-1)",
                flex: "1 1 120px",
                padding: "var(--space-3)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1.6rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                }}
                className={`case-tag-${c.color}`}
              >
                {c.form}
              </span>
              <Tag text={c.case_} color={c.color} />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                }}
              >
                {c.fn}
              </span>
              <div
                style={{
                  marginTop: "var(--space-1)",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <div
                  className="example-de"
                  style={{ fontSize: "var(--text-xs)" }}
                >
                  {c.example}
                </div>
                <div className="example-en">{c.en}</div>
              </div>
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          💡 Do NOT translate them all as "who" — learn them as function
          markers: subject, direct object, indirect object, possessor.
        </p>
      </SectionCard>

      <SectionCard color="dat">
        <div className="case-header">
          <div className="case-header-left">
            <CaseBadge color="dat" label="PREP" />
            <div>
              <div className="case-title">Prepositional Questions</div>
              <div className="case-sublabel">
                Person → preposition + wem/wen · Thing → wo(r) + preposition
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--space-2)",
            padding: "var(--space-2)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {["Meaning", "Person", "Thing (wo-compound)"].map((h) => (
            <div
              key={h}
              style={{
                fontWeight: 700,
                fontSize: "var(--text-xs)",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                padding: "var(--space-2) var(--space-3)",
              }}
            >
              {h}
            </div>
          ))}
          {PREP_QUESTIONS.map((row, i) => [
            <div
              key={`m${i}`}
              style={{ padding: "var(--space-2) var(--space-3)" }}
            >
              <Tag text={row.meaning} color="info" />
            </div>,
            <div
              key={`p${i}`}
              style={{ padding: "var(--space-2) var(--space-3)" }}
            >
              <span
                className="example-de"
                style={{ fontSize: "var(--text-xs)" }}
              >
                {row.person}
              </span>
            </div>,
            <div
              key={`t${i}`}
              style={{ padding: "var(--space-2) var(--space-3)" }}
            >
              <span
                className="example-de"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-success)",
                }}
              >
                {row.thing}
              </span>
            </div>,
          ])}
        </div>

        <div className="mental-model">
          <div className="mental-model-title">🔑 The wo(r)- Rule</div>
          <ul
            className="mental-steps"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            <li>
              For <strong>people</strong>: use{" "}
              <span className="case-tag-dat">preposition + wem/wen/wer</span> →{" "}
              <em>mit wem, für wen</em>
            </li>
            <li>
              For <strong>things</strong>: use{" "}
              <span className="case-tag-nom">wo(r) + preposition</span> →{" "}
              <em>womit, wofür, woran</em>
            </li>
            <li>
              If the preposition starts with a vowel → insert{" "}
              <strong>-r-</strong>: <span className="case-tag-acc">an</span> →{" "}
              <strong>wor-an</strong>, <span className="case-tag-acc">aus</span>{" "}
              → <strong>wor-aus</strong>
            </li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}

function TensesTab() {
  return (
    <div className="pronouns-sections">
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-primary-highlight)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-primary)",
          fontSize: "var(--text-sm)",
          color: "var(--color-primary)",
          fontWeight: 600,
        }}
      >
        ⚡ Master Rule: Identify the <strong>finite verb first</strong> — its
        position is controlled by question type, not tense. In compound tenses,
        only the auxiliary moves forward; the participle/infinitive stays at the
        end.
      </div>

      <GrammarTable
        headers={["Tense / Form", "Pattern", "Example", "English"]}
        rows={TENSES.map((t, i) => [
          <Tag
            text={t.tense}
            color={["nom", "acc", "dat", "gen", "nom", "acc"][i]}
          />,
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              fontStyle: "italic",
            }}
          >
            {t.pattern}
          </span>,
          <strong>{t.example}</strong>,
          <span className="td-english">{t.en}</span>,
        ])}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {TENSES.map((t, i) => (
          <div
            key={i}
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <Tag
              text={t.tense}
              color={["nom", "acc", "dat", "gen", "nom", "acc"][i]}
            />
            <div className="example-de" style={{ marginTop: "var(--space-1)" }}>
              {t.example}
            </div>
            <div className="example-en">{t.en}</div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-faint)",
                fontStyle: "italic",
                marginTop: "var(--space-1)",
              }}
            >
              {t.pattern}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndirectTab() {
  return (
    <div className="pronouns-sections">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          padding: "var(--space-4)",
          background: "var(--color-surface-2)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
        >
          <Tag text="Indirect Question Rule" color="gen" />
          <Tag text="Subordinate clause order" color="info" />
        </div>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Indirect questions are embedded inside another sentence and use{" "}
          <strong>subordinate-clause word order</strong> — the verb goes to the
          END. Introduced by a <span className="case-tag-nom">W-word</span> for
          information questions or by <span className="case-tag-gen">ob</span>{" "}
          for yes/no meaning.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            padding: "var(--space-3)",
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-divider)",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "var(--color-text-muted)",
            }}
          >
            Teacher shortcut:
          </span>
          <span style={{ fontSize: "var(--text-sm)" }}>
            Direct → <span className="case-tag-nom">verb early</span> · Indirect
            → <span className="case-tag-gen">verb late</span>
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {INDIRECT_PAIRS.map((pair, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-3)",
              padding: "var(--space-4)",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                padding: "var(--space-3)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-primary-highlight)",
                border: "1px solid var(--color-primary)",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  marginBottom: "var(--space-1)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                ⚡ Direct
              </div>
              <div className="example-de">{pair.direct}</div>
              <div className="example-en">{pair.directEn}</div>
            </div>
            <div
              style={{
                padding: "var(--space-3)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-error-highlight)",
                border: "1px solid var(--color-error)",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "var(--color-error)",
                  marginBottom: "var(--space-1)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                ↪️ Indirect
              </div>
              <div className="example-de">{pair.indirect}</div>
              <div className="example-en">{pair.indirectEn}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard color="acc">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="acc" label="OB" />
          <div>
            <div className="case-title">Negative Questions & Doch</div>
            <div className="case-sublabel">
              Correcting a negative question or statement
            </div>
          </div>
        </div>
        <div className="examples-list" style={{ marginTop: "var(--space-2)" }}>
          <div className="example-row">
            <div className="example-de">Kommst du nicht?</div>
            <div className="example-en">Are you not coming?</div>
          </div>
          <div
            className="example-row"
            style={{ borderLeftColor: "var(--color-success)" }}
          >
            <div
              className="example-de"
              style={{ color: "var(--color-success)" }}
            >
              Doch, ich komme!
            </div>
            <div className="example-en">
              Yes (actually), I am coming! — contradicts the negative
            </div>
          </div>
          <div
            className="example-row"
            style={{ borderLeftColor: "var(--color-error)" }}
          >
            <div className="example-de" style={{ color: "var(--color-error)" }}>
              Nein, ich komme nicht.
            </div>
            <div className="example-en">
              No, I am not coming. — confirms the negative
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function ProNotesTab() {
  const ICONS = ["🚫", "👤", "📦", "🪜", "📍", "🔗", "↪️", "✅", "🔡"];
  return (
    <div className="pronouns-sections">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {PRO_NOTES.map((note, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "var(--space-3)",
              alignItems: "flex-start",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              animation: `fade-up 300ms ${i * 60}ms cubic-bezier(0.16,1,0.3,1) both`,
            }}
          >
            <span
              style={{
                fontSize: "var(--text-lg)",
                flexShrink: 0,
                width: 32,
                textAlign: "center",
              }}
            >
              {ICONS[i] || "📌"}
            </span>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
                lineHeight: 1.6,
                dangerouslySetInnerHTML: undefined,
              }}
              dangerouslySetInnerHTML={{
                __html: note
                  .replace(
                    /wer|wen|wem|wessen/g,
                    (m) => `<span class="case-tag-nom">${m}</span>`,
                  )
                  .replace(/\bwo\b/g, `<span class="case-tag-dat">wo</span>`)
                  .replace(/wohin/g, `<span class="case-tag-acc">wohin</span>`)
                  .replace(/woher/g, `<span class="case-tag-gen">woher</span>`)
                  .replace(/doch/g, `<span class="case-tag-dat">doch</span>`)
                  .replace(/"([^"]+)"/g, `<strong>$1</strong>`),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeTab() {
  const [revealed, setRevealed] = useState({});
  const toggle = (i) => setRevealed((r) => ({ ...r, [i]: !r[i] }));

  const COLORS = ["nom", "acc", "dat", "gen"];

  return (
    <div className="pronouns-sections">
      <SectionCard color="nom">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="nom" label="🏋️" />
          <div>
            <div className="case-title">4-Way Conversion Drill</div>
            <div className="case-sublabel">
              Convert one statement into four question types
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Statement:
          </span>
          <span
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {PRACTICE_SET.statement}
          </span>
          <span className="td-english">"You are coming tomorrow."</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {PRACTICE_SET.conversions.map((conv, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                alignItems: "center",
                flexWrap: "wrap",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
              }}
            >
              <Tag text={conv.type} color={COLORS[i]} />
              <div style={{ flex: 1, minWidth: 180 }}>
                {revealed[i] ? (
                  <div className="answer-revealed">
                    <span>✓</span>
                    <span>{conv.de}</span>
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      — {conv.en}
                    </span>
                  </div>
                ) : (
                  <button className="reveal-btn" onClick={() => toggle(i)}>
                    <span className="reveal-btn-line" />
                    <span className="reveal-btn-text">tap to reveal</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Collapsible
        label="Quick Reference: Verb Position Rules"
        defaultOpen={true}
      >
        <div className="mental-model">
          <div className="mental-model-title">
            ⚡ Slot System — Learn by position, not translation
          </div>
          <ul
            className="mental-steps"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            <li>
              <span className="case-tag-nom">Slot 1</span> = question word OR
              finite verb
            </li>
            <li>
              <span className="case-tag-acc">Slot 2</span> = finite verb (if
              W-word in slot 1) OR subject (if verb in slot 1)
            </li>
            <li>
              <span className="case-tag-dat">Rest</span> = subject, objects,
              adverbs, infinitives/participles
            </li>
            <li>
              <span className="case-tag-gen">Indirect</span> = W-word / ob acts
              as subordinating conjunction → verb at END
            </li>
          </ul>
        </div>
      </Collapsible>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

export default function Frage() {
  const [activeTab, setActiveTab] = useState("core");

  const renderTab = () => {
    switch (activeTab) {
      case "core":
        return <CorePatternsTab />;
      case "wwords":
        return <WWOrdersTab />;
      case "cases":
        return <CasesTab />;
      case "tenses":
        return <TensesTab />;
      case "indirect":
        return <IndirectTab />;
      case "pro":
        return <ProNotesTab />;
      case "practice":
        return <PracticeTab />;
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <span style={{ fontSize: "2rem" }}>❓</span>
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
              German Questions
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              Verb position · W-words · Cases · Tenses · Indirect questions
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
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
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
              background:
                activeTab === tab.id ? "var(--color-primary)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--color-text-muted)",
              boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
            }}
          >
            <span>{tab.icon}</span>
            <span style={{ whiteSpace: "nowrap" }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="pronouns-sections"
        style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {renderTab()}
      </div>
    </div>
  );
}
