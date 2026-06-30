import { useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const CORE_SYSTEM = [
  {
    word: "nein",
    meaning: "no",
    use: "Answering yes/no questions negatively",
    shortcut: "Use for standalone answers.",
    example: "Kommst du morgen? – Nein.",
    english: "Are you coming tomorrow? – No.",
    color: "gen",
  },
  {
    word: "nicht",
    meaning: "not",
    use: "Negating verbs, adjectives, adverbs, prepositional phrases, names, definite nouns, or whole clauses",
    shortcut: "Use for almost everything except indefinite-style noun negation.",
    example: "Ich komme nicht.",
    english: "I am not coming.",
    color: "acc",
  },
  {
    word: "kein",
    meaning: "no / not a / not any",
    use: "Negating nouns with no definite article or with an indefinite idea",
    shortcut: "If a noun is being negated and it is not definite, try kein first.",
    example: "Ich habe kein Auto.",
    english: "I have no car / I don't have a car.",
    color: "dat",
  },
];

const NICHT_VS_KEIN = [
  {
    type: "kein + noun",
    use: "Negates a noun directly",
    rule: "Use directly before a noun; declines like ein-words by gender, number, and case.",
    examples: [
      ["Ich habe keinen Hund.", "I don't have a dog."],
      ["Sie trinkt keine Milch.", "She drinks no milk / She doesn't drink milk."],
      ["Wir haben keine Zeit.", "We have no time."],
    ],
    color: "dat",
  },
  {
    type: "nicht",
    use: "Negates verbs, adjectives, adverbs, names, definite nouns, possessives, or whole statements",
    rule: "Use for non-noun negation or when the noun phrase is definite.",
    examples: [
      ["Ich schlafe nicht.", "I am not sleeping."],
      ["Das ist nicht gut.", "That is not good."],
      ["Er kommt nicht heute.", "He is not coming today."],
    ],
    color: "acc",
  },
];

const IMPORTANT_DISTINCTION = [
  {
    de: "Ich habe kein Geld.",
    en: "I have no money.",
    note: "The noun Geld is negated.",
    color: "dat",
  },
  {
    de: "Das Geld ist nicht da.",
    en: "The money is not there.",
    note: "The noun has a definite article, so nicht is used instead of kein.",
    color: "acc",
  },
];

const NICHT_POSITION_RULES = [
  {
    title: "Negating the whole sentence or main verb",
    rule: "In many simple main clauses, nicht comes near the end.",
    pattern: "subject + verb + ... + nicht",
    examples: [
      ["Ich arbeite nicht.", "I am not working."],
      ["Er schläft nicht.", "He is not sleeping."],
      ["Wir gehen heute nicht.", "We are not going today."],
    ],
    color: "acc",
  },
  {
    title: "Negating an adjective or adverb",
    rule: "Place nicht before the adjective or adverb.",
    pattern: "... nicht + adjective/adverb",
    examples: [
      ["Das ist nicht schwer.", "That is not difficult."],
      ["Sie fährt nicht schnell.", "She does not drive fast."],
      ["Er ist nicht müde.", "He is not tired."],
    ],
    color: "nom",
  },
  {
    title: "Negating a prepositional phrase",
    rule: "Place nicht before the preposition.",
    pattern: "... nicht + prepositional phrase",
    examples: [
      ["Ich fahre nicht nach Berlin.", "I'm not going to Berlin."],
      ["Sie ist nicht im Büro.", "She is not in the office."],
      ["Wir sprechen nicht über Politik.", "We are not talking about politics."],
    ],
    color: "dat",
  },
  {
    title: "Negating a specific time, manner, or place expression",
    rule: "Place nicht before the exact expression being negated.",
    pattern: "... nicht + time/place/manner",
    examples: [
      ["Ich komme nicht morgen.", "I'm not coming tomorrow."],
      ["Er arbeitet nicht hier.", "He does not work here."],
      ["Sie lernt nicht gern.", "She does not like studying."],
    ],
    color: "gen",
  },
  {
    title: "With infinitives, modal verbs, or verb-final structures",
    rule: "If another verb appears at the end, nicht often goes directly before that final verb or verbal complex.",
    pattern: "... nicht + final infinitive / participle block",
    examples: [
      ["Ich will nicht gehen.", "I do not want to go."],
      ["Er kann nicht kommen.", "He cannot come."],
      ["Wir haben beschlossen, nicht zu warten.", "We decided not to wait."],
    ],
    color: "acc",
  },
];

const KEIN_DECLENSION = [
  ["Nominative", "kein Mann", "keine Frau", "kein Kind", "keine Kinder"],
  ["Accusative", "keinen Mann", "keine Frau", "kein Kind", "keine Kinder"],
  ["Dative", "keinem Mann", "keiner Frau", "keinem Kind", "keinen Kindern"],
  ["Genitive", "keines Mannes", "keiner Frau", "keines Kindes", "keiner Kinder"],
];

const CASE_EXAMPLES = [
  ["Nominative", "Kein Student ist da.", "No student is there.", "nom"],
  ["Accusative", "Ich sehe keinen Vogel.", "I do not see a bird.", "acc"],
  ["Dative", "Ich helfe keinem Freund.", "I help no friend.", "dat"],
  ["Genitive", "Wegen keines Fehlers …", "Because of no error … (rare, formal style)", "gen"],
];

const TENSE_USAGE = [
  {
    tense: "Present",
    examples: [
      ["Ich esse nicht.", "I am not eating."],
      ["Ich habe kein Brot.", "I have no bread."],
    ],
    color: "nom",
  },
  {
    tense: "Perfekt",
    examples: [
      ["Ich habe nicht gearbeitet.", "I have not worked."],
      ["Er hat keinen Kaffee gekauft.", "He has bought no coffee / He didn't buy any coffee."],
    ],
    color: "acc",
  },
  {
    tense: "Präteritum",
    examples: [
      ["Ich ging nicht.", "I did not go."],
      ["Sie hatte kein Glück.", "She had no luck."],
    ],
    color: "dat",
  },
  {
    tense: "Futur I",
    examples: [
      ["Ich werde nicht kommen.", "I will not come."],
      ["Wir werden keine Zeit haben.", "We will have no time."],
    ],
    color: "gen",
  },
  {
    tense: "Modal constructions",
    examples: [
      ["Du musst nicht gehen.", "You do not have to go / You need not go."],
      ["Du darfst nicht gehen.", "You must not go / You are not allowed to go."],
    ],
    note: "nicht müssen = no necessity · nicht dürfen = prohibition",
    color: "acc",
  },
];

const OTHER_NEGATIVES = [
  {
    word: "nie",
    meaning: "never",
    type: "Negative adverb",
    example: "Ich komme nie zu spät.",
    english: "I am never late.",
    color: "gen",
  },
  {
    word: "niemals",
    meaning: "never",
    type: "Stronger / emphatic negative adverb",
    example: "Ich mache das niemals.",
    english: "I would never do that.",
    color: "gen",
  },
  {
    word: "nichts",
    meaning: "nothing",
    type: "Negative pronoun",
    example: "Ich sehe nichts.",
    english: "I see nothing.",
    color: "acc",
  },
  {
    word: "niemand",
    meaning: "nobody",
    type: "Negative pronoun",
    example: "Niemand ist hier.",
    english: "Nobody is here.",
    color: "dat",
  },
  {
    word: "doch",
    meaning: "yes, on the contrary",
    type: "Answer particle that contradicts a negative statement or question",
    example: "Du sprichst kein Deutsch, oder? – Doch!",
    english: "You don't speak German, right? – Yes, I do!",
    color: "nom",
  },
];

const ANSWER_PARTICLES = [
  {
    particle: "Ja",
    use: "Answers a positive question positively.",
    example: "Kommst du? – Ja.",
    english: "Are you coming? – Yes.",
    color: "nom",
  },
  {
    particle: "Nein",
    use: "Answers negatively.",
    example: "Kommst du? – Nein.",
    english: "Are you coming? – No.",
    color: "gen",
  },
  {
    particle: "Doch",
    use: "Contradicts a negative question or statement and restores a positive meaning.",
    example: "Du hast keine Zeit. – Doch, ich habe Zeit.",
    english: "You don't have time. – On the contrary, I do have time.",
    color: "dat",
  },
];

const PATTERN_GUIDE = [
  ["Negate a yes/no answer", "nein"],
  ["Negate a noun with no definite article", "kein + noun"],
  ["Negate a verb or whole action", "usually nicht near the end"],
  ["Negate an adjective/adverb", "nicht before it"],
  ["Negate a destination/location/prepositional phrase", "nicht before the preposition"],
  ["Negate a final infinitive or participle block", "nicht before that final verb element"],
  ["Use fixed negative pronouns/adverbs for never / nobody / nothing", "nie, niemand, nichts"],
];

const MINI_EXAMPLES = [
  ["Ich bin nicht müde.", "adjective negation"],
  ["Ich fahre nicht mit dem Zug.", "prepositional phrase negation"],
  ["Ich habe keinen Bruder.", "noun negation"],
  ["Ich kann nicht schlafen.", "verb-final structure negation"],
  ["Niemand versteht das.", "negative pronoun"],
];

const COMMON_MISTAKES = [
  ["Ich habe nicht Auto.", "Ich habe kein Auto."],
  ["Ich nicht gehe.", "Ich gehe nicht."],
  ["Ich bin müde nicht.", "Ich bin nicht müde."],
];

const EXAMPLE_SET = [
  {
    de: "Ich esse keinen Kuchen.",
    en: "I am not eating any cake.",
    note: "The noun is negated.",
    color: "dat",
  },
  {
    de: "Ich esse den Kuchen nicht.",
    en: "I am not eating the cake.",
    note: "A definite noun phrase is involved, so nicht is used.",
    color: "acc",
  },
  {
    de: "Ich esse den Kuchen nicht heute.",
    en: "I'm not eating the cake today.",
    note: "Now the time expression is the focus of negation.",
    color: "gen",
  },
];

const PRO_NOTES = [
  'German negation mainly revolves around nein, nicht, and kein, plus words like nie, nichts, and niemand.',
  'Use kein to negate nouns without a definite article; use nicht for almost everything else.',
  'The position of nicht matters because moving it changes the meaning or emphasis.',
  'If you are negating a noun introduced by an indefinite idea, use kein; otherwise, use nicht.',
  'kein behaves like ein-words, so it changes by gender, number, and case.',
  'nicht usually comes before the exact element being negated, but for whole-sentence negation it often appears late.',
  'If there is a final infinitive or participle block, nicht often goes right before that block.',
  'Do not translate English not mechanically; German splits noun-negation and general negation into different forms.',
  'A strong learner habit is to ask: am I negating a noun, or something else?',
];

const TABS = [
  { id: "core", label: "Core System", icon: "⚡" },
  { id: "nichtkein", label: "Nicht vs Kein", icon: "⚖️" },
  { id: "position", label: "Nicht Position", icon: "📍" },
  { id: "declension", label: "Kein Declension", icon: "🧩" },
  { id: "tenses", label: "Tenses & Use", icon: "🕐" },
  { id: "negatives", label: "Other Negatives", icon: "🌙" },
  { id: "mistakes", label: "Mistakes", icon: "🚫" },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const COLOR = {
  nom: { badge: "case-badge-nom", border: "case-nom", tag: "case-tag-nom", label: "NOM" },
  acc: { badge: "case-badge-acc", border: "case-acc", tag: "case-tag-acc", label: "ACC" },
  dat: { badge: "case-badge-dat", border: "case-dat", tag: "case-tag-dat", label: "DAT" },
  gen: { badge: "case-badge-gen", border: "case-gen", tag: "case-tag-gen", label: "GEN" },
};

function CaseBadge({ color, label }) {
  return <span className={`case-badge ${COLOR[color].badge}`}>{label || COLOR[color].label}</span>;
}

function SectionCard({ color = "nom", children }) {
  return <div className={`case-section ${COLOR[color].border}`}>{children}</div>;
}

function Tag({ text, color }) {
  const colors = {
    nom: { bg: "var(--color-primary-highlight)", color: "var(--color-primary)" },
    acc: { bg: "var(--color-gold-highlight)", color: "var(--color-gold)" },
    dat: { bg: "var(--color-success-highlight)", color: "var(--color-success)" },
    gen: { bg: "var(--color-error-highlight)", color: "var(--color-error)" },
    info: { bg: "var(--color-surface-2)", color: "var(--color-text-muted)" },
  };
  const c = colors[color] || colors.info;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "var(--radius-full)",
      background: c.bg,
      color: c.color,
      fontWeight: 700,
      fontSize: "var(--text-xs)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    }}>{text}</span>
  );
}

function GrammarTable({ headers, rows }) {
  return (
    <div className="boss-table-wrap" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
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
            <tr key={ri} style={{ borderBottom: "1px solid var(--color-divider)", background: ri % 2 === 0 ? "transparent" : "var(--color-surface-2)" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "var(--space-2) var(--space-3)", verticalAlign: "top", color: "var(--color-text)" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <button className="examples-toggle" onClick={() => setOpen(!open)}>
        <span style={{ display: "inline-block", transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 180ms ease" }}>▾</span>
        {label}
      </button>
      {open && <div style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}>{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB CONTENT
───────────────────────────────────────────── */

function CoreTab() {
  return (
    <div className="pronouns-sections">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
        {CORE_SYSTEM.map((item, i) => (
          <SectionCard key={i} color={item.color}>
            <div className="case-header">
              <div className="case-header-left">
                <CaseBadge color={item.color} label={item.word.toUpperCase()} />
                <div>
                  <div className="case-title">{item.word}</div>
                  <div className="case-sublabel">{item.meaning}</div>
                </div>
              </div>
            </div>
            <div className="case-question">{item.use}</div>
            <div style={{ padding: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-divider)" }}>
              <div className="example-de">{item.example}</div>
              <div className="example-en">{item.english}</div>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", fontStyle: "italic" }}>{item.shortcut}</div>
          </SectionCard>
        ))}
      </div>

      <SectionCard color="nom">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="nom" label="MAP" />
          <div>
            <div className="case-title">Core Idea</div>
            <div className="case-sublabel">Simple decision shortcut</div>
          </div>
        </div>
        <div className="mental-model">
          <div className="mental-model-title">Quick logic</div>
          <ul className="mental-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><span className="case-tag-gen">nein</span> = no</li>
            <li><span className="case-tag-acc">nicht</span> = not</li>
            <li><span className="case-tag-dat">kein</span> = no / not a / not any</li>
            <li>If you are negating a noun introduced by an indefinite idea, use <strong>kein</strong>; otherwise, use <strong>nicht</strong>.</li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}

function NichtKeinTab() {
  return (
    <div className="pronouns-sections">
      <GrammarTable
        headers={["Form", "Use", "Rule", "Examples"]}
        rows={NICHT_VS_KEIN.map(item => [
          <Tag text={item.type} color={item.color} />,
          <span style={{ fontSize: "var(--text-xs)" }}>{item.use}</span>,
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontStyle: "italic" }}>{item.rule}</span>,
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            {item.examples.map((ex, i) => (
              <div key={i}>
                <div className="example-de">{ex[0]}</div>
                <div className="example-en">{ex[1]}</div>
              </div>
            ))}
          </div>,
        ])}
      />

      <SectionCard color="gen">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="gen" label="KEY" />
          <div>
            <div className="case-title">Important Distinction</div>
            <div className="case-sublabel">Definite noun phrase vs noun negation</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-3)" }}>
          {IMPORTANT_DISTINCTION.map((item, i) => (
            <div key={i} style={{ padding: "var(--space-4)", borderRadius: "var(--radius-lg)", background: item.color === "dat" ? "var(--color-success-highlight)" : "var(--color-gold-highlight)", border: `1px solid ${item.color === "dat" ? "var(--color-success)" : "var(--color-gold)"}` }}>
              <div className="example-de">{item.de}</div>
              <div className="example-en">{item.en}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>{item.note}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function PositionTab() {
  return (
    <div className="pronouns-sections">
      <div style={{ padding: "var(--space-4)", background: "var(--color-primary-highlight)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-primary)", color: "var(--color-primary)", fontWeight: 600, fontSize: "var(--text-sm)" }}>
        💡 Main rule: <strong>nicht</strong> usually comes before the exact element being negated, but when it negates the whole clause or main action, it often appears late in the sentence.
      </div>

      {NICHT_POSITION_RULES.map((rule, i) => (
        <SectionCard key={i} color={rule.color}>
          <div className="case-header">
            <div className="case-header-left">
              <CaseBadge color={rule.color} label={`${i + 1}`} />
              <div>
                <div className="case-title">{rule.title}</div>
                <div className="case-sublabel">{rule.pattern}</div>
              </div>
            </div>
          </div>
          <div className="case-question">{rule.rule}</div>
          <div className="examples-list">
            {rule.examples.map((ex, idx) => (
              <div key={idx} className="example-row">
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

function DeclensionTab() {
  return (
    <div className="pronouns-sections">
      <SectionCard color="dat">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="dat" label="KEIN" />
          <div>
            <div className="case-title">Kein Declension by Case</div>
            <div className="case-sublabel">kein behaves like ein-words</div>
          </div>
        </div>
        <GrammarTable
          headers={["Case", "Masculine", "Feminine", "Neuter", "Plural"]}
          rows={KEIN_DECLENSION.map(row => row.map((cell, i) => i === 0 ? <Tag text={cell} color="dat" /> : <strong>{cell}</strong>))}
        />
      </SectionCard>

      <Collapsible label="Examples by case" defaultOpen={true}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {CASE_EXAMPLES.map((item, i) => (
            <SectionCard key={i} color={item[3]}>
              <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                <CaseBadge color={item[3]} label={item[0].slice(0,3).toUpperCase()} />
                <div>
                  <div className="case-title" style={{ fontSize: "var(--text-base)" }}>{item[0]}</div>
                </div>
              </div>
              <div style={{ padding: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-divider)" }}>
                <div className="example-de">{item[1]}</div>
                <div className="example-en">{item[2]}</div>
              </div>
            </SectionCard>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}

function TensesTab() {
  return (
    <div className="pronouns-sections">
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-2)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", fontSize: "var(--text-sm)", color: "var(--color-text)" }}>
        Negation works in all tenses; what changes is the verb form, while <strong>nicht</strong> and <strong>kein</strong> still negate the same kind of element.
        In compound tenses, <strong>nicht</strong> often stands before the infinitive or participle block at the end if that is what is being negated.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-3)" }}>
        {TENSE_USAGE.map((item, i) => (
          <SectionCard key={i} color={item.color}>
            <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <CaseBadge color={item.color} label={item.tense.slice(0,3).toUpperCase()} />
              <div>
                <div className="case-title" style={{ fontSize: "var(--text-base)" }}>{item.tense}</div>
              </div>
            </div>
            <div className="examples-list">
              {item.examples.map((ex, idx) => (
                <div key={idx} className="example-row">
                  <div className="example-de">{ex[0]}</div>
                  <div className="example-en">{ex[1]}</div>
                </div>
              ))}
            </div>
            {item.note && <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", fontStyle: "italic" }}>{item.note}</div>}
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

function OtherNegativesTab() {
  return (
    <div className="pronouns-sections">
      <GrammarTable
        headers={["Word", "Meaning", "Type", "Example", "English"]}
        rows={OTHER_NEGATIVES.map(item => [
          <Tag text={item.word} color={item.color} />,
          item.meaning,
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{item.type}</span>,
          <strong>{item.example}</strong>,
          <span className="td-english">{item.english}</span>,
        ])}
      />

      <SectionCard color="nom">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="nom" label="ANS" />
          <div>
            <div className="case-title">Ja · Nein · Doch</div>
            <div className="case-sublabel">Useful contrast in replies</div>
          </div>
        </div>
        <GrammarTable
          headers={["Particle", "Use", "Example", "English"]}
          rows={ANSWER_PARTICLES.map(item => [
            <Tag text={item.particle} color={item.color} />,
            item.use,
            <strong>{item.example}</strong>,
            <span className="td-english">{item.english}</span>,
          ])}
        />
      </SectionCard>

      <Collapsible label="Complete pattern guide" defaultOpen={true}>
        <GrammarTable
          headers={["Meaning", "Pattern"]}
          rows={PATTERN_GUIDE.map(row => [row[0], <strong>{row[1]}</strong>])}
        />
      </Collapsible>

      <Collapsible label="Mini examples">
        <div className="examples-list">
          {MINI_EXAMPLES.map((ex, i) => (
            <div key={i} className="example-row">
              <div className="example-de">{ex[0]}</div>
              <div className="example-en">{ex[1]}</div>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}

function MistakesTab() {
  return (
    <div className="pronouns-sections">
      <SectionCard color="gen">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="gen" label="FIX" />
          <div>
            <div className="case-title">Common Learner Mistakes</div>
            <div className="case-sublabel">Overusing nicht, wrong nicht position, translating English mechanically</div>
          </div>
        </div>
        <GrammarTable
          headers={["Wrong", "Correct"]}
          rows={COMMON_MISTAKES.map(row => [
            <span style={{ color: "var(--color-error)", fontWeight: 700 }}>{row[0]}</span>,
            <span style={{ color: "var(--color-success)", fontWeight: 700 }}>{row[1]}</span>,
          ])}
        />
      </SectionCard>

      <SectionCard color="nom">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="nom" label="ASK" />
          <div>
            <div className="case-title">Useful Learning Strategy</div>
            <div className="case-sublabel">Ask the right question first</div>
          </div>
        </div>
        <div className="mental-model">
          <div className="mental-model-title">Decision habit</div>
          <ul className="mental-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>Am I negating a <span className="case-tag-dat">noun</span>, or something else?</li>
            <li>If it is a noun, try <strong>kein</strong> first.</li>
            <li>If it is another element, use <strong>nicht</strong>.</li>
            <li>Then place <strong>nicht</strong> before the element you want to deny, or near the end for full-sentence negation.</li>
          </ul>
        </div>
      </SectionCard>

      <SectionCard color="acc">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="acc" label="SET" />
          <div>
            <div className="case-title">Example Set</div>
            <div className="case-sublabel">How the focus of negation changes meaning</div>
          </div>
        </div>
        <div className="examples-list">
          {EXAMPLE_SET.map((item, i) => (
            <div key={i} className="example-row" style={{ borderLeftColor: item.color === "dat" ? "var(--color-success)" : item.color === "acc" ? "var(--color-gold)" : "var(--color-error)" }}>
              <div className="example-de">{item.de}</div>
              <div className="example-en">{item.en}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", fontStyle: "italic" }}>{item.note}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Collapsible label="Pro Notes">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {PRO_NOTES.map((note, i) => (
            <div key={i} style={{ display: "flex", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
              <span style={{ fontSize: "var(--text-lg)", width: 24, textAlign: "center" }}>•</span>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.6 }}>{note}</p>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}

export default function Negations() {
  const [activeTab, setActiveTab] = useState("core");

  const renderTab = () => {
    switch (activeTab) {
      case "core": return <CoreTab />;
      case "nichtkein": return <NichtKeinTab />;
      case "position": return <PositionTab />;
      case "declension": return <DeclensionTab />;
      case "tenses": return <TensesTab />;
      case "negatives": return <OtherNegativesTab />;
      case "mistakes": return <MistakesTab />;
      default: return null;
    }
  };

  return (
    <div className="pronouns-page">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span style={{ fontSize: "2rem" }}>🚫</span>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "var(--color-text)", margin: 0, lineHeight: 1.1 }}>German Negation</h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
              nein · nicht · kein · position · declension · meaning shifts
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", padding: "var(--space-1)", background: "var(--color-surface-2)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", marginBottom: "var(--space-6)" }}>
        {TABS.map(tab => (
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
              background: activeTab === tab.id ? "var(--color-primary)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--color-text-muted)",
              boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
            }}
          >
            <span>{tab.icon}</span>
            <span style={{ whiteSpace: "nowrap" }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="pronouns-sections" style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}>
        {renderTab()}
      </div>
    </div>
  );
}
