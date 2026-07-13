import { useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const MASTER_PATTERNS = [
  {
    pattern: "-(e)n",
    tendency: "Very common with feminine nouns",
    umlaut: false,
    examples: [
      "die Frau → die Frauen",
      "die Lampe → die Lampen",
      "die Studentin → die Studentinnen",
    ],
    color: "nom",
  },
  {
    pattern: "-e",
    tendency:
      "Common with many masculine nouns, also some neuter and some feminine nouns",
    umlaut: true,
    examples: [
      "der Hund → die Hunde",
      "der Tisch → die Tische",
      "die Hand → die Hände",
    ],
    color: "acc",
  },
  {
    pattern: "-er",
    tendency:
      "Especially common with some neuter nouns, also some masculine nouns",
    umlaut: true,
    examples: [
      "das Kind → die Kinder",
      "das Haus → die Häuser",
      "der Mann → die Männer",
    ],
    color: "dat",
  },
  {
    pattern: "-s",
    tendency:
      "Common with nouns ending in non-e vowels, many loanwords, abbreviations",
    umlaut: false,
    examples: [
      "das Auto → die Autos",
      "die Kamera → die Kameras",
      "der Lkw → die Lkws",
    ],
    color: "gen",
  },
  {
    pattern: "Ø (no ending)",
    tendency: "Often with nouns ending in -er, -el, -en, and diminutives",
    umlaut: true,
    examples: [
      "der Lehrer → die Lehrer",
      "das Mädchen → die Mädchen",
      "der Apfel → die Äpfel",
    ],
    color: "acc",
  },
];

const GENDER_RULES = [
  {
    gender: "Feminine",
    icon: "🟣",
    color: "nom",
    rule: "Very often take -(e)n. Many common suffixes almost always follow this pattern.",
    suffixes: ["-heit", "-keit", "-ung", "-schaft", "-tät", "-ion"],
    examples: [
      ["die Zeitung", "die Zeitungen"],
      ["die Einheit", "die Einheiten"],
      ["die Mannschaft", "die Mannschaften"],
      ["die Identität", "die Identitäten"],
    ],
    exceptions:
      "die Hand → die Hände · die Maus → die Mäuse · die Tochter → die Töchter",
    exceptionNote:
      "Important feminine exceptions with Umlaut and non-(e)n patterns",
  },
  {
    gender: "Masculine",
    icon: "🔵",
    color: "acc",
    rule: "Less uniform. Many one-syllable masculines take -e, often with Umlaut. Many masculines with learned/foreign suffixes take -en.",
    suffixes: ["-ant", "-ent", "-ist", "-and", "-ismus"],
    examples: [
      ["der Hund", "die Hunde"],
      ["der Topf", "die Töpfe"],
      ["der Lieferant", "die Lieferanten"],
      ["der Idealist", "die Idealisten"],
    ],
    exceptions: null,
    exceptionNote: null,
  },
  {
    gender: "Neuter",
    icon: "🟢",
    color: "dat",
    rule: "Often show -er (often with Umlaut) or zero plural, especially with endings like -chen, -lein, -el, -en, -er.",
    suffixes: ["-chen", "-lein", "-el", "-en", "-er"],
    examples: [
      ["das Kind", "die Kinder"],
      ["das Haus", "die Häuser"],
      ["das Mädchen", "die Mädchen"],
      ["das Viertel", "die Viertel"],
    ],
    exceptions: null,
    exceptionNote: null,
  },
];

const FEMININE_EN_PATTERNS = [
  ["die Schule", "die Schulen", "ends in -e → add -n"],
  ["die Gabel", "die Gabeln", "ends in -el → add -n"],
  ["die Feder", "die Federn", "ends in -er → add -n"],
];

const HIGH_VALUE_RULES = [
  "Feminine nouns usually take -(e)n.",
  "Feminine nouns ending in -in double the n: die Studentin → die Studentinnen.",
  "Diminutives ending in -chen or -lein never change in the plural: das Mädchen → die Mädchen.",
  "Nouns ending in -s, -x, or -z usually take -e or remain unchanged.",
  "Foreign/loanword nouns (often ending in a non-e vowel) usually take -s: das Auto → die Autos.",
  "Masculine nouns with suffixes -ant, -ent, -ist, -and take -en: der Student → die Studenten.",
  "Guessing from noun shape and gender often works reasonably well; guessing from meaning alone usually fails.",
];

const UMLAUT_LOGIC = [
  {
    rule: "Only a, o, and u can shift to ä, ö, and ü in plural formation.",
    color: "nom",
  },
  {
    rule: "Umlaut usually appears together with -e, -er, or zero plural — not with -s or -(e)n.",
    color: "acc",
  },
  {
    rule: "If a noun belongs to the -(e)n or -s family, umlaut is much less central.",
    color: "dat",
  },
  {
    rule: "Umlaut is never guaranteed just from sound alone — it still has to be learned with the noun.",
    color: "gen",
  },
];

const UMLAUT_EXAMPLES = [
  ["der Stuhl", "die Stühle"],
  ["das Buch", "die Bücher"],
  ["der Apfel", "die Äpfel"],
  ["die Maus", "die Mäuse"],
  ["die Tochter", "die Töchter"],
  ["der Mann", "die Männer"],
];

const DATIVE_PLURAL = {
  rule: "Dative plural often adds -n if the plural form does not already end in -n or -s.",
  examples: [
    ["die Kinder", "mit den Kindern", "Nominative plural → -n added in dative"],
    ["die Häuser", "in den Häusern", "Nominative plural → -n added in dative"],
    ["die Autos", "mit den Autos", "Ends in -s → no -n added"],
    ["die Frauen", "mit den Frauen", "Already ends in -n → no change"],
  ],
  proTip:
    "Learn three items together: singular · nominative plural · dative plural phrase.",
};

const SPECIAL_CASES = [
  {
    type: "Dual plural forms",
    note: "Some nouns have more than one plural form, sometimes with different meanings or nuances.",
    examples: [
      [
        "das Wort",
        "die Wörter (individual words) / die Worte (words in context, sayings)",
      ],
    ],
    color: "gen",
  },
  {
    type: "Pluraliatantum",
    note: "Nouns that exist mainly or only in the plural — they are lexically plural, not logically plural.",
    examples: [
      ["die Eltern", "parents (no singular Elter)"],
      ["die Ferien", "holidays (no singular Ferie)"],
      ["die Leute", "people (no standard singular)"],
    ],
    color: "dat",
  },
];

const ARTICLE_RULE = {
  rule: "The definite article in the nominative plural is always die, regardless of whether the singular noun is masculine, feminine, or neuter.",
  examples: [
    ["der Hund → die Hunde", "masculine"],
    ["die Frau → die Frauen", "feminine"],
    ["das Kind → die Kinder", "neuter"],
  ],
};

const LEARNING_SYSTEM = {
  format: "article + singular + plural + example phrase",
  example: [
    ["der Hund", "die Hunde", "Ich sehe die Hunde.", "Dative: mit den Hunden."],
    [
      "die Frau",
      "die Frauen",
      "Die Frauen arbeiten.",
      "Dative: mit den Frauen.",
    ],
    [
      "das Kind",
      "die Kinder",
      "Die Kinder spielen.",
      "Dative: mit den Kindern.",
    ],
  ],
};

const PRO_NOTES = [
  "The best organizing principle is: classify by gender, final ending, syllable shape, and common suffixes.",
  "Some grammars list 5 patterns; others expand to 8 by splitting umlaut variants. Both are correct.",
  "Feminine nouns are the highest-value shortcut: most follow -(e)n.",
  "Learn dative plural alongside nominative plural — not separately.",
  "If a noun ends in -chen or -lein, the plural is always identical to the singular.",
  "For loanwords and abbreviations, -s is your safe default.",
  "Purely mechanical rules are never enough. Learn each noun as a bundle: article + singular + plural.",
];

const TABS = [
  { id: "patterns", label: "Master Patterns", icon: "📐" },
  { id: "gender", label: "By Gender", icon: "🏷️" },
  { id: "umlaut", label: "Umlaut Logic", icon: "🔤" },
  { id: "dative", label: "Dative Plural", icon: "🏛️" },
  { id: "special", label: "Special Cases", icon: "⚠️" },
  { id: "system", label: "Learning System", icon: "🎓" },
];

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

function SectionCard({ color = "nom", children }) {
  return (
    <div className={`case-section ${COLOR[color].border}`}>{children}</div>
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

function GrammarTable({ headers, rows }) {
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

function Collapsible({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <button className="examples-toggle" onClick={() => setOpen(!open)}>
        <span
          style={{
            display: "inline-block",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 180ms ease",
          }}
        >
          ▾
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

/* ─────────────────────────────────────────────
   TABS
───────────────────────────────────────────── */

function PatternsTab() {
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
          <CaseBadge color="nom" label="KEY" />
          <div>
            <div className="case-title">Always die in Nominative Plural</div>
            <div className="case-sublabel">
              Regardless of original gender — der, die, das all become die in
              the plural
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            padding: "var(--space-3)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-divider)",
          }}
        >
          {ARTICLE_RULE.examples.map((ex, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-divider)",
                minWidth: 160,
              }}
            >
              <Tag text={ex[1]} color={["acc", "nom", "dat"][i]} />
              <div
                className="example-de"
                style={{ marginTop: "var(--space-1)" }}
              >
                {ex[0]}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <GrammarTable
        headers={["Pattern", "Umlaut?", "Typical Tendency", "Examples"]}
        rows={MASTER_PATTERNS.map((p) => [
          <Tag text={p.pattern} color={p.color} />,
          <span
            style={{
              color: p.umlaut
                ? "var(--color-success)"
                : "var(--color-text-muted)",
              fontWeight: 700,
            }}
          >
            {p.umlaut ? "Often yes" : "No"}
          </span>,
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            {p.tendency}
          </span>,
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            {p.examples.map((ex, i) => (
              <div
                key={i}
                className="example-de"
                style={{ fontSize: "var(--text-xs)" }}
              >
                {ex}
              </div>
            ))}
          </div>,
        ])}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {MASTER_PATTERNS.map((p, i) => (
          <SectionCard key={i} color={p.color}>
            <div className="case-header">
              <div className="case-header-left">
                <CaseBadge color={p.color} label={p.pattern} />
                <div>
                  <div
                    className="case-title"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    {p.tendency.split(",")[0]}
                  </div>
                  {p.umlaut && (
                    <div className="case-sublabel">May add Umlaut</div>
                  )}
                </div>
              </div>
            </div>
            <div className="examples-list">
              {p.examples.map((ex, j) => (
                <div key={j} className="example-row">
                  <div className="example-de">{ex}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

function GenderTab() {
  return (
    <div className="pronouns-sections">
      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--color-primary-highlight)",
          border: "1px solid var(--color-primary)",
          borderRadius: "var(--radius-xl)",
          fontSize: "var(--text-sm)",
          color: "var(--color-primary)",
          fontWeight: 600,
        }}
      >
        💡 If you want the highest-value shortcut, start with{" "}
        <strong>feminine nouns</strong>. They very often form the plural with
        -(e)n.
      </div>

      {GENDER_RULES.map((g, i) => (
        <SectionCard key={i} color={g.color}>
          <div className="case-header">
            <div className="case-header-left">
              <CaseBadge color={g.color} label={g.icon} />
              <div>
                <div className="case-title">{g.gender} Nouns</div>
                <div className="case-sublabel">{g.rule}</div>
              </div>
            </div>
          </div>

          {g.suffixes && (
            <div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--color-text-muted)",
                  marginBottom: "var(--space-1)",
                }}
              >
                Common suffixes → -(e)n
              </div>
              <div className="prep-chips">
                {g.suffixes.map((s, j) => (
                  <span key={j} className="prep-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <GrammarTable
            headers={["Singular", "Plural"]}
            rows={g.examples.map((ex) => [
              ex[0],
              <strong style={{ color: "var(--color-primary)" }}>
                {ex[1]}
              </strong>,
            ])}
          />

          {g.exceptions && (
            <div
              style={{
                padding: "var(--space-3)",
                background: "var(--color-error-highlight)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-error)",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "var(--color-error)",
                  marginBottom: "var(--space-1)",
                }}
              >
                Exceptions
              </div>
              <div
                className="example-de"
                style={{ fontSize: "var(--text-xs)" }}
              >
                {g.exceptions}
              </div>
              {g.exceptionNote && (
                <div className="example-en">{g.exceptionNote}</div>
              )}
            </div>
          )}
        </SectionCard>
      ))}

      <SectionCard color="nom">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="nom" label="FEM" />
          <div>
            <div className="case-title">Feminine -e / -el / -er → add -n</div>
            <div className="case-sublabel">
              A second strong feminine tendency
            </div>
          </div>
        </div>
        <GrammarTable
          headers={["Singular", "Plural", "Rule"]}
          rows={FEMININE_EN_PATTERNS.map((row) => [
            row[0],
            <strong style={{ color: "var(--color-primary)" }}>{row[1]}</strong>,
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {row[2]}
            </span>,
          ])}
        />
      </SectionCard>

      <Collapsible label="High-value rules summary" defaultOpen={true}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {HIGH_VALUE_RULES.map((rule, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  flexShrink: 0,
                }}
              >
                {i + 1}.
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                  lineHeight: 1.6,
                }}
              >
                {rule}
              </p>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}

function UmlautTab() {
  return (
    <div className="pronouns-sections">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {UMLAUT_LOGIC.map((item, i) => (
          <SectionCard key={i} color={item.color}>
            <div
              className="case-header-left"
              style={{
                display: "flex",
                gap: "var(--space-3)",
                alignItems: "center",
              }}
            >
              <CaseBadge color={item.color} label={`${i + 1}`} />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
                lineHeight: 1.6,
              }}
            >
              {item.rule}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard color="dat">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="dat" label="UML" />
          <div>
            <div className="case-title">Umlaut Shifts</div>
            <div className="case-sublabel">Only a → ä · o → ö · u → ü</div>
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
            border: "1px solid var(--color-divider)",
          }}
        >
          {[
            ["a", "ä"],
            ["o", "ö"],
            ["u", "ü"],
          ].map((pair, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  fontSize: "1.4rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "var(--color-text-muted)",
                }}
              >
                {pair[0]}
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>→</span>
              <span
                style={{
                  fontSize: "1.4rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                }}
              >
                {pair[1]}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard color="acc">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="acc" label="EX" />
          <div>
            <div className="case-title">High-Frequency Examples</div>
            <div className="case-sublabel">
              Learn these cold — they appear constantly
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "var(--space-2)",
          }}
        >
          {UMLAUT_EXAMPLES.map((ex, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-3)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
                textAlign: "center",
              }}
            >
              <div className="example-de">{ex[0]}</div>
              <div
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-xs)",
                  margin: "2px 0",
                }}
              >
                →
              </div>
              <div
                style={{
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  fontSize: "var(--text-base)",
                }}
              >
                {ex[1]}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function DativeTab() {
  return (
    <div className="pronouns-sections">
      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--color-gold-highlight)",
          border: "1px solid var(--color-gold)",
          borderRadius: "var(--radius-xl)",
          fontSize: "var(--text-sm)",
          color: "var(--color-gold)",
          fontWeight: 600,
        }}
      >
        💡 <strong>Dative plural</strong> is one of the highest-value follow-up
        rules. Many learners memorize plural only in nominative and then produce
        wrong case forms later.
      </div>

      <SectionCard color="dat">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="dat" label="DAT" />
          <div>
            <div className="case-title">Dative Plural Rule</div>
            <div className="case-sublabel">{DATIVE_PLURAL.rule}</div>
          </div>
        </div>
        <GrammarTable
          headers={["Plural (Nom)", "Dative Form", "Note"]}
          rows={DATIVE_PLURAL.examples.map((row) => [
            row[0],
            <strong style={{ color: "var(--color-success)" }}>{row[1]}</strong>,
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {row[2]}
            </span>,
          ])}
        />
        <div className="mental-model">
          <div className="mental-model-title">Pro Tip</div>
          <ul
            className="mental-steps"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            <li>{DATIVE_PLURAL.proTip}</li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}

function SpecialTab() {
  return (
    <div className="pronouns-sections">
      {SPECIAL_CASES.map((item, i) => (
        <SectionCard key={i} color={item.color}>
          <div
            className="case-header-left"
            style={{
              display: "flex",
              gap: "var(--space-3)",
              alignItems: "center",
            }}
          >
            <CaseBadge color={item.color} label={i === 0 ? "2×" : "PL"} />
            <div>
              <div className="case-title">{item.type}</div>
              <div className="case-sublabel">{item.note}</div>
            </div>
          </div>
          <div className="examples-list">
            {item.examples.map((ex, j) => (
              <div key={j} className="example-row">
                <div className="example-de">{ex[0]}</div>
                <div className="example-en">{ex[1]}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function SystemTab() {
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
          <CaseBadge color="nom" label="FMT" />
          <div>
            <div className="case-title">Best Learning Format</div>
            <div className="case-sublabel">{LEARNING_SYSTEM.format}</div>
          </div>
        </div>
        <GrammarTable
          headers={[
            "Article + Singular",
            "Plural",
            "Example Phrase",
            "Dative Example",
          ]}
          rows={LEARNING_SYSTEM.example.map((row) => [
            <strong>{row[0]}</strong>,
            <strong style={{ color: "var(--color-primary)" }}>{row[1]}</strong>,
            row[2],
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {row[3]}
            </span>,
          ])}
        />
      </SectionCard>

      <SectionCard color="dat">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="dat" label="PRO" />
          <div>
            <div className="case-title">Pro Notes</div>
            <div className="case-sublabel">
              Most efficient strategy for lasting accuracy
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {PRO_NOTES.map((note, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  color: "var(--color-success)",
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                  lineHeight: 1.6,
                }}
              >
                {note}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard color="acc">
        <div
          className="case-header-left"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <CaseBadge color="acc" label="MAP" />
          <div>
            <div className="case-title">Master Decision Map</div>
            <div className="case-sublabel">
              Classify by gender and shape first, then ending
            </div>
          </div>
        </div>
        <div className="mental-model">
          <div className="mental-model-title">Quick logic flow</div>
          <ul
            className="mental-steps"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            <li>
              <span className="case-tag-nom">Feminine</span> → try{" "}
              <strong>-(e)n</strong> first; check for Umlaut exceptions
            </li>
            <li>
              <span className="case-tag-acc">Masculine one-syllable</span> → try{" "}
              <strong>-e</strong>, often with Umlaut
            </li>
            <li>
              <span className="case-tag-acc">
                Masculine with -ant/-ent/-ist
              </span>{" "}
              → <strong>-en</strong>
            </li>
            <li>
              <span className="case-tag-dat">Neuter with -chen/-lein</span> →{" "}
              <strong>Ø (no change)</strong>
            </li>
            <li>
              <span className="case-tag-dat">Neuter one-syllable</span> → often{" "}
              <strong>-er</strong>, sometimes Umlaut
            </li>
            <li>
              <span className="case-tag-gen">Loanword ending in vowel</span> →{" "}
              <strong>-s</strong>
            </li>
            <li>
              Dative plural → add <strong>-n</strong> unless plural already ends
              in -n or -s
            </li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */

export default function Plurals() {
  const [activeTab, setActiveTab] = useState("patterns");

  const renderTab = () => {
    switch (activeTab) {
      case "patterns":
        return <PatternsTab />;
      case "gender":
        return <GenderTab />;
      case "umlaut":
        return <UmlautTab />;
      case "dative":
        return <DativeTab />;
      case "special":
        return <SpecialTab />;
      case "system":
        return <SystemTab />;
      default:
        return null;
    }
  };

  return (
    <div className="pronouns-page">
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
          <span style={{ fontSize: "2rem" }}>📦</span>
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
              German Plurals
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              -(e)n · -e · -er · -s · Ø · Umlaut · dative · special cases
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

      <div
        className="pronouns-sections"
        style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {renderTab()}
      </div>
    </div>
  );
}
