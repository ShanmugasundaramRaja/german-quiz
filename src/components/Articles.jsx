import React, { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const DEFINITE_ARTICLE = {
  title: "Definite Articles",
  subtitle: "der / die / das",
  description:
    "German nouns are commonly used with articles, and those articles must be declined by case. The article often signals the noun's role in the sentence more clearly than English does.",
  youtubeId: "tK7dzUeKx30",
  headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
  rows: [
    { case: "Nominativ", m: "der", f: "die", n: "das", pl: "die" },
    { case: "Akkusativ", m: "den", f: "die", n: "das", pl: "die" },
    { case: "Dativ", m: "dem", f: "der", n: "dem", pl: "den + n" },
    { case: "Genitiv", m: "des", f: "der", n: "des", pl: "der" },
  ],
  examples: [
    { de: "Der Hund ist hier.", en: "The dog is here. (Nominativ)" },
    { de: "Ich sehe den Hund.", en: "I see the dog. (Akkusativ)" },
    { de: "Ich gebe dem Hund Wasser.", en: "I give the dog water. (Dativ)" },
    {
      de: "Wegen des Hundes bleibe ich hier.",
      en: "Because of the dog I stay here. (Genitiv)",
    },
  ],
};

const INDEFINITE_ARTICLE = {
  title: "Indefinite Articles",
  subtitle: "ein / eine / ein",
  description:
    "There is no true plural indefinite article in German; you usually use no article or words like einige or welche. This is one of the first details learners often miss.",
  youtubeId: "tK7dzUeKx30",
  headers: ["Case", "Masculine", "Feminine", "Neuter"],
  rows: [
    { case: "Nominativ", m: "ein", f: "eine", n: "ein" },
    { case: "Akkusativ", m: "einen", f: "eine", n: "ein" },
    { case: "Dativ", m: "einem", f: "einer", n: "einem" },
    { case: "Genitiv", m: "eines", f: "einer", n: "eines" },
  ],
  examples: [
    { de: "Ein Mann wartet.", en: "A man is waiting. (Nominativ)" },
    { de: "Ich sehe einen Mann.", en: "I see a man. (Akkusativ)" },
    { de: "Ich helfe einem Mann.", en: "I help a man. (Dativ)" },
    { de: "Wegen eines Mannes.", en: "Because of a man. (Genitiv)" },
  ],
};

const KEIN_ARTICLE = {
  title: "Negative Article: kein",
  subtitle: "kein / keine / kein",
  description:
    'Kein works like an indefinite article, but means "no / not any." It declines like ein but also has plural forms.',
  youtubeId: "tK7dzUeKx30",
  headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
  rows: [
    { case: "Nominativ", m: "kein", f: "keine", n: "kein", pl: "keine" },
    { case: "Akkusativ", m: "keinen", f: "keine", n: "kein", pl: "keine" },
    { case: "Dativ", m: "keinem", f: "keiner", n: "keinem", pl: "keinen + n" },
    { case: "Genitiv", m: "keines", f: "keiner", n: "keines", pl: "keiner" },
  ],
  examples: [
    { de: "Ich habe kein Geld.", en: "I have no money. (Neuter)" },
    { de: "Sie kauft keine Tasche.", en: "She buys no bag. (Feminine)" },
    { de: "Wir helfen keinem Kind.", en: "We help no child. (Dativ)" },
    { de: "Er hat keine Freunde.", en: "He has no friends. (Plural)" },
  ],
};

const POSSESSIVE_ARTICLE = {
  title: "Possessive Articles",
  subtitle: "mein / dein / sein / ihr / unser …",
  description:
    "Possessive words like mein, dein, sein, ihr, unser decline like ein. They behave like article words, not like unchanging labels.",
  youtubeId: "tK7dzUeKx30",
  exampleWord: "mein",
  headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
  rows: [
    { case: "Nominativ", m: "mein", f: "meine", n: "mein", pl: "meine" },
    { case: "Akkusativ", m: "meinen", f: "meine", n: "mein", pl: "meine" },
    { case: "Dativ", m: "meinem", f: "meiner", n: "meinem", pl: "meinen + n" },
    { case: "Genitiv", m: "meines", f: "meiner", n: "meines", pl: "meiner" },
  ],
  examples: [
    { de: "Mein Bruder kommt.", en: "My brother is coming. (Nominativ)" },
    { de: "Ich sehe meinen Bruder.", en: "I see my brother. (Akkusativ)" },
    { de: "Ich helfe meinem Bruder.", en: "I help my brother. (Dativ)" },
    {
      de: "Das ist wegen meines Bruders.",
      en: "That is because of my brother. (Genitiv)",
    },
  ],
  allPossessives: [
    { pronoun: "ich", possessive: "mein", en: "my" },
    { pronoun: "du", possessive: "dein", en: "your (informal)" },
    { pronoun: "er", possessive: "sein", en: "his" },
    { pronoun: "sie", possessive: "ihr", en: "her" },
    { pronoun: "es", possessive: "sein", en: "its" },
    { pronoun: "wir", possessive: "unser", en: "our" },
    { pronoun: "ihr", possessive: "euer", en: "your (plural)" },
    { pronoun: "Sie/sie", possessive: "ihr/Ihr", en: "their / your (formal)" },
  ],
};

const GENDER_PATTERNS = {
  masculine: [
    { pattern: "Male persons/professions", examples: "der Arzt, der Vater" },
    {
      pattern: "Days, months, seasons",
      examples: "der Montag, der Januar, der Sommer",
    },
    { pattern: "Directions", examples: "der Norden, der Süden" },
    { pattern: "Ending -ling", examples: "der Lehrling" },
    { pattern: "Ending -ismus", examples: "der Kapitalismus" },
  ],
  feminine: [
    { pattern: "Female persons/professions", examples: "die Frau, die Ärztin" },
    {
      pattern: "Ending -heit, -keit",
      examples: "die Freiheit, die Möglichkeit",
    },
    { pattern: "Ending -schaft", examples: "die Freundschaft" },
    { pattern: "Ending -ung", examples: "die Zeitung, die Meinung" },
    {
      pattern: "Ending -ion, -tät, -ik, -ei, -enz",
      examples: "die Nation, die Universität, die Musik",
    },
  ],
  neuter: [
    { pattern: "Young humans/animals", examples: "das Kind, das Baby" },
    { pattern: "Infinitives used as nouns", examples: "das Essen, das Lesen" },
    {
      pattern: "Diminutives -chen, -lein",
      examples: "das Mädchen, das Büchlein",
    },
    { pattern: "Many nouns with Ge-", examples: "das Gebäude, das Geschenk" },
  ],
};

const CASE_USE = [
  {
    case: "Nominativ",
    badge: "NOM",
    color: "nom",
    question: "Wer? / Was?",
    uses: [
      "Subject of the sentence",
      "Predicate noun after sein, werden, bleiben",
    ],
    examples: [
      { de: "Der Student lernt.", en: "The student is learning." },
      { de: "Das ist ein Problem.", en: "That is a problem." },
    ],
  },
  {
    case: "Akkusativ",
    badge: "AKK",
    color: "acc",
    question: "Wen? / Was?",
    uses: [
      "Direct object",
      "Motion toward a destination with two-way prepositions",
      "Time expressions in some contexts",
    ],
    examples: [
      { de: "Ich kaufe den Computer.", en: "I buy the computer." },
      { de: "Ich gehe in den Park.", en: "I go into the park." },
      { de: "Ich warte einen Tag.", en: "I wait one day." },
    ],
  },
  {
    case: "Dativ",
    badge: "DAT",
    color: "dat",
    question: "Wem?",
    uses: [
      "Indirect object",
      "After many fixed prepositions",
      "Location with two-way prepositions (no change of place)",
    ],
    examples: [
      {
        de: "Ich gebe dem Lehrer das Buch.",
        en: "I give the teacher the book.",
      },
      { de: "Ich wohne in der Stadt.", en: "I live in the city." },
      { de: "Er sitzt auf dem Stuhl.", en: "He sits on the chair." },
    ],
  },
  {
    case: "Genitiv",
    badge: "GEN",
    color: "gen",
    question: "Wessen?",
    uses: [
      "Possession or belonging",
      "After some formal prepositions and expressions",
      "Common in written/formal German, less in casual speech",
    ],
    examples: [
      { de: "Das Haus des Lehrers.", en: "The teacher's house." },
      {
        de: "Wegen des Wetters bleiben wir.",
        en: "Because of the weather we stay.",
      },
    ],
  },
];

const PREPOSITIONS = [
  {
    type: "acc",
    label: "Always Akkusativ",
    chips: ["durch", "für", "gegen", "ohne", "um"],
    examples: ["für den Kunden", "ohne eine Antwort"],
  },
  {
    type: "dat",
    label: "Always Dativ",
    chips: ["aus", "bei", "mit", "nach", "seit", "von", "zu"],
    examples: ["mit dem Auto", "bei der Firma"],
  },
  {
    type: "gen",
    label: "Always Genitiv",
    chips: ["während", "trotz", "wegen", "statt"],
    examples: ["wegen des Regens", "trotz der Probleme"],
  },
  {
    type: "wechsel",
    label: "Two-Way Prepositions",
    chips: [
      "an",
      "auf",
      "hinter",
      "in",
      "neben",
      "über",
      "unter",
      "vor",
      "zwischen",
    ],
    rule: 'Akkusativ → movement/change of place ("Where to?") · Dativ → position/location ("Where?")',
    examples: [
      "Ich lege das Buch auf den Tisch. (Akkusativ – movement)",
      "Das Buch liegt auf dem Tisch. (Dativ – location)",
    ],
  },
];

const PRO_HACKS = [
  {
    title: "Memorise in chunks",
    icon: "🧠",
    body: 'Memorise nouns in this format: article + noun + plural + sample sentence. Example: der Tisch, die Tische, "Der Tisch ist alt." — Gender and plural become automatic together.',
  },
  {
    title: "Color method",
    icon: "🎨",
    body: "Assign one color per gender: blue = der, red = die, green = das. Then mark case changes visually: der → den → dem → des.",
  },
  {
    title: "Sentence skeleton",
    icon: "🦴",
    body: "Build sentences with this order: Time · Verb · Subject · Middle field · Non-finite verb/end piece. Example: Heute habe ich im Büro lange gearbeitet.",
  },
  {
    title: "Two-way shortcut",
    icon: "↔️",
    body: '"Where to?" → Akkusativ (Ich gehe in die Schule.) · "Where?" → Dativ (Ich bin in der Schule.)',
  },
  {
    title: "Article memory trick",
    icon: "🔁",
    body: "Masculine: der → den → dem → des · Feminine: die → die → der → der · Neuter: das → das → dem → des. These patterns repeat so often they become automatic with drills.",
  },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function YoutubeChip({ videoId }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        color: "#ff4444",
        background: "rgba(255,68,68,0.08)",
        border: "1px solid rgba(255,68,68,0.2)",
        borderRadius: "var(--radius-full)",
        padding: "2px var(--space-2)",
        textDecoration: "none",
        transition: "background var(--transition-interactive)",
      }}
    >
      ▶ Watch
    </a>
  );
}

function ArticleTable({ headers, rows }) {
  const caseColors = {
    Nominativ: "var(--color-primary)",
    Akkusativ: "var(--color-gold)",
    Dativ: "var(--color-success)",
    Genitiv: "var(--color-error)",
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "var(--text-sm)",
        }}
      >
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  textAlign: "left",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                  background: "var(--color-surface-2)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.case}
              style={{ borderBottom: "1px solid var(--color-divider)" }}
            >
              <td
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  fontWeight: 700,
                  color: caseColors[row.case] || "var(--color-text)",
                  whiteSpace: "nowrap",
                }}
              >
                {row.case}
              </td>
              {[row.m, row.f, row.n, row.pl]
                .filter((v) => v !== undefined)
                .map((val, i) => (
                  <td
                    key={i}
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      fontWeight: 600,
                      color: "var(--color-text)",
                      fontFamily: "var(--font-mono, monospace)",
                    }}
                  >
                    {val}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExamplesBlock({ examples }) {
  const [open, setOpen] = useState(false);
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
        aria-expanded={open}
      >
        <span>{open ? "▲" : "▼"}</span>
        {open ? "Hide examples" : "Show examples"}
      </button>
      {open && (
        <div className="examples-list">
          {examples.map((ex, i) => (
            <div
              className="example-row"
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="example-de">{ex.de}</span>
              <span className="example-en">{ex.en}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ data, index }) {
  return (
    <div className="case-section" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="case-header">
        <div className="case-header-left">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <span className="case-title">{data.title}</span>
            <span className="case-sublabel">{data.subtitle}</span>
          </div>
        </div>
        <div className="case-header-right">
          <YoutubeChip videoId={data.youtubeId} />
        </div>
      </div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        {data.description}
      </p>
      <div className="boss-table-wrap">
        <ArticleTable headers={data.headers} rows={data.rows} />
      </div>
      {data.exampleWord && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-full)",
            padding: "var(--space-1) var(--space-3)",
            alignSelf: "flex-start",
          }}
        >
          <span>Example word:</span>
          <strong style={{ color: "var(--color-primary)" }}>
            {data.exampleWord}
          </strong>
        </div>
      )}
      {data.allPossessives && <PossessiveGrid items={data.allPossessives} />}
      <ExamplesBlock examples={data.examples} />
    </div>
  );
}

function PossessiveGrid({ items }) {
  const [open, setOpen] = useState(false);
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
        aria-expanded={open}
      >
        <span>{open ? "▲" : "▼"}</span>
        {open ? "Hide all possessives" : "All possessive words"}
      </button>
      {open && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "var(--space-2)",
          }}
        >
          {items.map((item) => (
            <div
              key={item.pronoun}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                }}
              >
                {item.pronoun}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {item.possessive}
              </span>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-faint)",
                  fontStyle: "italic",
                }}
              >
                {item.en}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GenderSection() {
  const [activeGender, setActiveGender] = useState("masculine");
  const config = {
    masculine: {
      label: "Masculine (der)",
      color: "var(--color-primary)",
      bg: "var(--color-primary-highlight)",
      patterns: GENDER_PATTERNS.masculine,
    },
    feminine: {
      label: "Feminine (die)",
      color: "var(--color-error)",
      bg: "var(--color-error-highlight)",
      patterns: GENDER_PATTERNS.feminine,
    },
    neuter: {
      label: "Neuter (das)",
      color: "var(--color-success)",
      bg: "var(--color-success-highlight)",
      patterns: GENDER_PATTERNS.neuter,
    },
  };
  const active = config[activeGender];
  return (
    <div className="case-section" style={{ animationDelay: "320ms" }}>
      <div className="case-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          <span className="case-title">How to Know Gender</span>
          <span className="case-sublabel">
            Patterns that help predict article gender
          </span>
        </div>
        <YoutubeChip videoId="tK7dzUeKx30" />
      </div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        German noun gender must often be learned together with the noun. Still,
        some endings and semantic groups help predict gender more accurately.
      </p>
      {/* Gender tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {Object.entries(config).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActiveGender(key)}
            style={{
              padding: "var(--space-2) var(--space-4)",
              borderRadius: "var(--radius-full)",
              border: `1.5px solid ${activeGender === key ? val.color : "var(--color-border)"}`,
              background: activeGender === key ? val.bg : "transparent",
              color:
                activeGender === key ? val.color : "var(--color-text-muted)",
              fontWeight: 700,
              fontSize: "var(--text-xs)",
              cursor: "pointer",
              transition: "all var(--transition-interactive)",
            }}
          >
            {val.label}
          </button>
        ))}
      </div>
      {/* Pattern table */}
      <div className="boss-table-wrap">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "var(--text-sm)",
          }}
        >
          <thead>
            <tr>
              {["Pattern", "Examples"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    textAlign: "left",
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    borderBottom: "1px solid var(--color-border)",
                    background: "var(--color-surface-2)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.patterns.map((p, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid var(--color-divider)" }}
              >
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    fontWeight: 600,
                    color: active.color,
                  }}
                >
                  {p.pattern}
                </td>
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  {p.examples}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Warning */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          alignItems: "flex-start",
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-gold-highlight)",
          border: "1px solid var(--color-gold)",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text)",
        }}
      >
        <span>⚠️</span>
        <span>
          <strong>Important:</strong> These are patterns, not absolute truth.
          German has many exceptions — the safest method is to memorise noun +
          article together: <em>der Tisch</em>, not just <em>Tisch</em>.
        </span>
      </div>
    </div>
  );
}

function CaseUseSection() {
  const [openExamples, setOpenExamples] = useState({});
  const toggle = (caseKey) =>
    setOpenExamples((s) => ({ ...s, [caseKey]: !s[caseKey] }));

  const badgeStyles = {
    nom: {
      bg: "var(--color-primary-highlight)",
      color: "var(--color-primary)",
      border: "var(--color-primary)",
    },
    acc: {
      bg: "var(--color-gold-highlight)",
      color: "var(--color-gold)",
      border: "var(--color-gold)",
    },
    dat: {
      bg: "var(--color-success-highlight)",
      color: "var(--color-success)",
      border: "var(--color-success)",
    },
    gen: {
      bg: "var(--color-error-highlight)",
      color: "var(--color-error)",
      border: "var(--color-error)",
    },
  };

  return (
    <div className="case-boss-card">
      <div className="case-boss-title">📚 Use Cases by Case</div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        Case choice depends on sentence role and on prepositions. German
        requires you to connect article form, noun form, and sometimes adjective
        form to the chosen case.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {CASE_USE.map((c) => {
          const bs = badgeStyles[c.color];
          return (
            <div
              key={c.case}
              style={{
                padding: "var(--space-4)",
                background: "var(--color-surface-2)",
                border: `1px solid var(--color-border)`,
                borderLeft: `3px solid ${bs.border}`,
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className={`case-badge case-badge-${c.color}`}
                  style={{ background: bs.bg, color: bs.color }}
                >
                  {c.badge}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--color-text)",
                      fontSize: "var(--text-base)",
                    }}
                  >
                    {c.case}
                  </div>
                  <div
                    className="case-question"
                    style={{
                      marginTop: "var(--space-1)",
                      alignSelf: "flex-start",
                    }}
                  >
                    {c.question}
                  </div>
                </div>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "var(--space-5)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                {c.uses.map((u, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {u}
                  </li>
                ))}
              </ul>
              <button
                className="examples-toggle"
                onClick={() => toggle(c.case)}
                aria-expanded={!!openExamples[c.case]}
              >
                <span>{openExamples[c.case] ? "▲" : "▼"}</span>
                {openExamples[c.case] ? "Hide examples" : "Show examples"}
              </button>
              {openExamples[c.case] && (
                <div className="examples-list">
                  {c.examples.map((ex, i) => (
                    <div
                      className="example-row"
                      key={i}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span className="example-de">{ex.de}</span>
                      <span className="example-en">{ex.en}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrepositionSection() {
  const typeColors = {
    acc: { color: "var(--color-gold)", bg: "var(--color-gold-highlight)" },
    dat: {
      color: "var(--color-success)",
      bg: "var(--color-success-highlight)",
    },
    gen: { color: "var(--color-error)", bg: "var(--color-error-highlight)" },
    wechsel: {
      color: "var(--color-primary)",
      bg: "var(--color-primary-highlight)",
    },
  };
  return (
    <div className="case-boss-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <div className="case-boss-title">🔗 Prepositions and Case</div>
        <YoutubeChip videoId="tK7dzUeKx30" />
      </div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        Many German case problems come from prepositions, not the noun alone.
        Learning prepositions in groups is one of the fastest ways to improve
        accuracy.
      </p>
      <div className="prep-groups">
        {PREPOSITIONS.map((group) => {
          const tc = typeColors[group.type];
          return (
            <div className={`prep-group prep-${group.type}`} key={group.type}>
              <span className="prep-case-tag" style={{ color: tc.color }}>
                {group.label}
              </span>
              <div className="prep-chips">
                {group.chips.map((chip) => (
                  <span
                    key={chip}
                    className="prep-chip"
                    style={{
                      background: tc.bg,
                      borderColor: tc.color,
                      color: tc.color,
                      fontWeight: 700,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              {group.rule && (
                <p className="prep-note" style={{ margin: 0 }}>
                  {group.rule}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                {group.examples.map((ex, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      color: "var(--color-text)",
                      padding: "2px var(--space-2)",
                      background: "var(--color-surface)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-divider)",
                      display: "inline-block",
                      width: "fit-content",
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
    </div>
  );
}

function ProHacksSection() {
  const [activeHack, setActiveHack] = useState(0);
  return (
    <div className="case-boss-card">
      <div className="case-boss-title">⚡ Pro Hacks</div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        The best way to learn German articles is to memorise patterns in chunks,
        not as isolated facts.
      </p>
      {/* Hack selector */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {PRO_HACKS.map((hack, i) => (
          <button
            key={i}
            onClick={() => setActiveHack(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-full)",
              border: `1.5px solid ${activeHack === i ? "var(--color-primary)" : "var(--color-border)"}`,
              background:
                activeHack === i
                  ? "var(--color-primary-highlight)"
                  : "transparent",
              color:
                activeHack === i
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 600,
              fontSize: "var(--text-xs)",
              cursor: "pointer",
              transition: "all var(--transition-interactive)",
            }}
          >
            <span>{hack.icon}</span>
            {hack.title}
          </button>
        ))}
      </div>
      {/* Active hack content */}
      <div
        key={activeHack}
        style={{
          padding: "var(--space-4) var(--space-5)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text)",
          lineHeight: 1.7,
          animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: "var(--space-2)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span style={{ fontSize: "1.2em" }}>
            {PRO_HACKS[activeHack].icon}
          </span>
          {PRO_HACKS[activeHack].title}
        </div>
        {PRO_HACKS[activeHack].body}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Articles() {
  return (
    <div className="pronouns-page">
      {/* Page header */}
      <div
        style={{
          marginBottom: "var(--space-8)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
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
          Articles
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          German articles decline by case — mastering them unlocks sentence
          structure across all topics.
        </p>
      </div>

      <div className="pronouns-sections">
        {/* Article type cards */}
        <ArticleCard data={DEFINITE_ARTICLE} index={0} />
        <ArticleCard data={INDEFINITE_ARTICLE} index={1} />
        <ArticleCard data={KEIN_ARTICLE} index={2} />
        <ArticleCard data={POSSESSIVE_ARTICLE} index={3} />

        {/* How to know gender */}
        <GenderSection />

        {/* Case use cases */}
        <CaseUseSection />

        {/* Prepositions */}
        <PrepositionSection />

        {/* Pro hacks */}
        <ProHacksSection />
      </div>
    </div>
  );
}
