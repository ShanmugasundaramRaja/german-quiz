import { useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const CORE_FORMS = [
  {
    degree: "Positiv",
    role: "Basic form",
    structure: "Base adjective / adverb",
    example: "schnell",
    english: "fast",
    color: "nom",
  },
  {
    degree: "Komparativ",
    role: "Comparison between two things",
    structure: "adjective / adverb + -er",
    example: "schneller",
    english: "faster",
    color: "acc",
  },
  {
    degree: "Superlativ",
    role: "Highest degree in a group or total set",
    structure: "am schnellsten / der, die, das schnellste",
    example: "am schnellsten / das schnellste",
    english: "fastest",
    color: "dat",
  },
];

const CORE_CONCEPTS = [
  {
    type: "Difference",
    structure: "Komparativ + als",
    example: "Peter ist größer als Hubert.",
    english: "Peter is taller than Hubert.",
    note: "Used to compare two things directly.",
    color: "acc",
  },
  {
    type: "Highest degree",
    structure: "am ... -sten / article + ... -ste",
    example: "Martina ist die kleinste. / Ein Porsche ist am teuersten.",
    english: "Martina is the smallest. / A Porsche is the most expensive.",
    note: "Used to mark the top level inside a group.",
    color: "dat",
  },
  {
    type: "Equality",
    structure: "so + adjective + wie",
    example: "Florenz ist so schön wie Rom.",
    english: "Florence is as beautiful as Rome.",
    note: "Used when both things are equal in degree.",
    color: "nom",
  },
];

const FORM_USE = [
  {
    label: "Comparative formation",
    rule: "Usually add -er to the adjective or adverb.",
    example: "schnell → schneller",
    english: "fast → faster",
    color: "acc",
  },
  {
    label: "Superlative formation",
    rule: "Use either am + adjective + -(e)sten or article + adjective + -(e)ste.",
    example: "am schönsten / die schönste Stadt",
    english: "most beautifully / the most beautiful city",
    color: "dat",
  },
  {
    label: "Predicative / adverbial superlative",
    rule: "Use am ... -sten especially after linking verbs or adverbially.",
    example: "Lisa singt am schönsten.",
    english: "Lisa sings most beautifully.",
    color: "gen",
  },
  {
    label: "Attributive superlative",
    rule: "Use article + adjective + -(e)ste before nouns; then decline it.",
    example: "die schönste Stadt",
    english: "the most beautiful city",
    color: "nom",
  },
];

const FORM_EXAMPLES = [
  ["Predicate / adverbial comparison", "Das Auto ist schneller als der Zug.", "The car is faster than the train."],
  ["Attributive comparative", "das schnellere Auto", "the faster car"],
  ["Adverbial superlative", "Lisa singt am schönsten.", "Lisa sings most beautifully."],
  ["Attributive superlative", "die schönste Stadt", "the most beautiful city"],
];

const DECLENSION_PATTERNS = [
  {
    type: "Comparative before noun",
    structure: "adjective + -er + adjective ending",
    examples: [
      ["ein besserer Wein", "a better wine"],
      ["mit einem besseren Wein", "with a better wine"],
    ],
    color: "acc",
  },
  {
    type: "Superlative before noun",
    structure: "adjective + -(e)st + adjective ending",
    examples: [
      ["der beste Wein", "the best wine"],
      ["mit dem besten Wein", "with the best wine"],
    ],
    color: "dat",
  },
];

const CASE_EXAMPLES = [
  ["Nominative", "Der ältere Mann kommt später.", "The older man comes later.", "nom"],
  ["Accusative", "Ich kaufe das günstigste Hemd.", "I am buying the cheapest shirt.", "acc"],
  ["Dative", "Mit dem neueren Stoff arbeite ich lieber.", "I prefer working with the newer fabric.", "dat"],
  ["Genitive", "Die Qualität des feinsten Materials ist hoch.", "The quality of the finest material is high.", "gen"],
];

const SAME_CASE_NOTE = [
  ["Equality", "Dein Bruder ist ebenso fleißig wie du.", "Your brother is just as hardworking as you."],
  ["Difference", "Du hast mehr Geld als ich.", "You have more money than I do."],
];

const UMLAUT_GROUP = [
  ["alt", "älter", "am ältesten"],
  ["groß", "größer", "am größten"],
  ["jung", "jünger", "am jüngsten"],
  ["kurz", "kürzer", "am kürzesten"],
  ["warm", "wärmer", "am wärmsten"],
  ["kalt", "kälter", "am kältesten"],
];

const IRREGULARS = [
  ["gut", "besser", "am besten"],
  ["viel / sehr", "mehr", "am meisten"],
  ["gern", "lieber", "am liebsten"],
  ["hoch", "höher", "am höchsten"],
  ["nah", "näher", "am nächsten"],
  ["teuer", "teurer", "am teuersten"],
  ["dunkel", "dunkler", "am dunkelsten"],
  ["edel", "edler", "am edelsten"],
];

const E_HELPERS = ["-d", "-ß", "-sch", "-t", "-tz", "-x", "-z"];

const E_HELPER_EXAMPLES = [
  ["breit", "am breitesten"],
  ["süß", "am süßesten"],
  ["hübsch", "am hübschesten"],
];

const PITFALLS = [
  ["mehr intelligent", "intelligenter", "German does not build standard comparison like English more + adjective."],
  ["mehr schön", "schöner", "Use the comparative ending instead of mehr + adjective."],
];

const TENSE_USAGE = [
  {
    tense: "Präsens",
    example: "Dieses Produkt ist günstiger als das andere.",
    english: "This product is cheaper than the other one.",
    note: "The comparative form stays the same; only the verb tense carries time.",
    color: "nom",
  },
  {
    tense: "Präteritum",
    example: "Früher war die Lieferung langsamer als heute.",
    english: "In the past, delivery was slower than today.",
    note: "Comparison works independently of tense.",
    color: "acc",
  },
  {
    tense: "Perfekt",
    example: "Dieses Modell ist am beliebtesten gewesen.",
    english: "This model has been the most popular.",
    note: "The superlative remains the same while the verb phrase changes.",
    color: "dat",
  },
  {
    tense: "Futur / future meaning",
    example: "Nächste Woche wird der Markt noch härter umkämpft sein als heute.",
    english: "Next week the market will be even more fiercely contested than today.",
    note: "The comparison structure stays unchanged.",
    color: "gen",
  },
];

const ADVANCED_CONTEXTS = [
  {
    title: "Softened superlative claim",
    rule: "Use einer / eine / eines der + superlative plural noun to avoid claiming an absolute single best.",
    example: "Das ist eines der besten Bücher.",
    english: "That is one of the best books.",
    color: "dat",
  },
  {
    title: "Softer comparison",
    rule: "Use nicht so ... wie for a more neutral comparison than direct -er als.",
    example: "Das neue Design ist nicht so klar wie das alte.",
    english: "The new design is not as clear as the old one.",
    color: "acc",
  },
  {
    title: "Quantity and frequency comparison",
    rule: "Comparative also modifies quantity and frequency, not only classic adjectives.",
    example: "öfter als / mehr als",
    english: "more often than / more than",
    color: "nom",
  },
];

const PRO_HACKS = [
  'Think in three slots: equality = so + adjective + wie; difference = comparative + als; maximum = am ... -sten or article + ... -ste.',
  'After a linking verb and no noun, use am schönsten, am schnellsten, am teuersten.',
  'Before a noun, use forms like der schönste Tag or das schnellste Auto.',
  'Memorize the high-frequency irregulars as one packet: gut, viel, gern, hoch, nah, teuer.',
  'If a one-syllable adjective feels short and common, check whether umlaut is likely, especially with a, o, u roots.',
  'When speaking, prefer einer der besten ... if you want to avoid an overly absolute claim.',
];

const CHEAT_SHEET = [
  ["Basic description", "Positiv", "Der Stoff ist weich."],
  ["Equality", "so + Adjektiv + wie", "Der Stoff ist so weich wie Baumwolle."],
  ["Difference", "Komparativ + als", "Leinen ist robuster als Viskose."],
  ["Highest degree, no noun", "am + Adjektiv + -(e)sten", "Dieses Material ist am robustesten."],
  ["Highest degree, before noun", "der/die/das + Adjektiv + -(e)ste + ending", "das robusteste Material"],
];

const MINI_DRILLS = [
  ["groß", "größer", "am größten"],
  ["teuer", "teurer", "am teuersten"],
  ["gut", "besser", "am besten"],
  ["gern", "lieber", "am liebsten"],
];

const TABS = [
  { id: "core", label: "Core Concept", icon: "⚡" },
  { id: "forms", label: "Forms & Use", icon: "🧱" },
  { id: "cases", label: "Cases & Declension", icon: "🏷️" },
  { id: "exceptions", label: "Exceptions", icon: "🌀" },
  { id: "tenses", label: "Tenses", icon: "🕐" },
  { id: "advanced", label: "Advanced Use", icon: "🎯" },
  { id: "drills", label: "Drills", icon: "🏋️" },
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
              <th key={i} style={{ padding: "var(--space-2) var(--space-3)", textAlign: "left", fontWeight: 700, fontSize: "var(--text-xs)", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)", background: "var(--color-surface-2)", whiteSpace: "nowrap" }}>
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
   TABS
───────────────────────────────────────────── */

function CoreTab() {
  return (
    <div className="pronouns-sections">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
        {CORE_FORMS.map((item, i) => (
          <SectionCard key={i} color={item.color}>
            <div className="case-header">
              <div className="case-header-left">
                <CaseBadge color={item.color} label={item.degree.slice(0,3).toUpperCase()} />
                <div>
                  <div className="case-title">{item.degree}</div>
                  <div className="case-sublabel">{item.role}</div>
                </div>
              </div>
            </div>
            <div className="case-question">{item.structure}</div>
            <div style={{ padding: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-divider)" }}>
              <div className="example-de">{item.example}</div>
              <div className="example-en">{item.english}</div>
            </div>
          </SectionCard>
        ))}
      </div>

      <GrammarTable
        headers={["Function", "Structure", "Example", "English", "Note"]}
        rows={CORE_CONCEPTS.map(item => [
          <Tag text={item.type} color={item.color} />,
          <strong>{item.structure}</strong>,
          item.example,
          <span className="td-english">{item.english}</span>,
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{item.note}</span>,
        ])}
      />
    </div>
  );
}

function FormsTab() {
  return (
    <div className="pronouns-sections">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
        {FORM_USE.map((item, i) => (
          <SectionCard key={i} color={item.color}>
            <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <CaseBadge color={item.color} label={`${i + 1}`} />
              <div>
                <div className="case-title" style={{ fontSize: "var(--text-base)" }}>{item.label}</div>
                <div className="case-sublabel">{item.rule}</div>
              </div>
            </div>
            <div style={{ padding: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-divider)" }}>
              <div className="example-de">{item.example}</div>
              <div className="example-en">{item.english}</div>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard color="nom">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="nom" label="USE" />
          <div>
            <div className="case-title">Forms in Real Sentences</div>
            <div className="case-sublabel">Predicate, adverbial, and attributive use</div>
          </div>
        </div>
        <GrammarTable
          headers={["Type", "German", "English"]}
          rows={FORM_EXAMPLES.map(row => [row[0], <strong>{row[1]}</strong>, <span className="td-english">{row[2]}</span>])}
        />
      </SectionCard>
    </div>
  );
}

function CasesTab() {
  return (
    <div className="pronouns-sections">
      <SectionCard color="dat">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="dat" label="DECL" />
          <div>
            <div className="case-title">Cases and Declension</div>
            <div className="case-sublabel">When forms stand before nouns, they behave like normal adjectives</div>
          </div>
        </div>
        <div className="mental-model">
          <div className="mental-model-title">Main rule</div>
          <ul className="mental-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>Comparative and superlative before a noun must be declined by <strong>gender</strong>, <strong>number</strong>, <strong>case</strong>, and <strong>article type</strong>.</li>
            <li>Add the comparison ending first, then add the normal adjective ending after it.</li>
          </ul>
        </div>
      </SectionCard>

      <GrammarTable
        headers={["Type", "Structure", "Examples"]}
        rows={DECLENSION_PATTERNS.map(item => [
          <Tag text={item.type} color={item.color} />,
          <strong>{item.structure}</strong>,
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            {item.examples.map((ex, i) => (
              <div key={i}>
                <div className="example-de">{ex[0]}</div>
                <div className="example-en">{ex[1]}</div>
              </div>
            ))}
          </div>
        ])}
      />

      <Collapsible label="Examples across cases" defaultOpen={true}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {CASE_EXAMPLES.map((row, i) => (
            <SectionCard key={i} color={row[3]}>
              <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                <CaseBadge color={row[3]} label={row[0].slice(0,3).toUpperCase()} />
                <div>
                  <div className="case-title" style={{ fontSize: "var(--text-base)" }}>{row[0]}</div>
                </div>
              </div>
              <div style={{ padding: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-divider)" }}>
                <div className="example-de">{row[1]}</div>
                <div className="example-en">{row[2]}</div>
              </div>
            </SectionCard>
          ))}
        </div>
      </Collapsible>

      <SectionCard color="acc">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="acc" label="CASE" />
          <div>
            <div className="case-title">Same-Case Comparison Rule</div>
            <div className="case-sublabel">The compared elements keep the same case</div>
          </div>
        </div>
        <GrammarTable
          headers={["Type", "German", "English"]}
          rows={SAME_CASE_NOTE.map(row => [row[0], <strong>{row[1]}</strong>, <span className="td-english">{row[2]}</span>])}
        />
      </SectionCard>
    </div>
  );
}

function ExceptionsTab() {
  return (
    <div className="pronouns-sections">
      <SectionCard color="nom">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="nom" label="UML" />
          <div>
            <div className="case-title">Umlaut Patterns</div>
            <div className="case-sublabel">Common with short one-syllable adjectives</div>
          </div>
        </div>
        <GrammarTable
          headers={["Positiv", "Komparativ", "Superlativ"]}
          rows={UMLAUT_GROUP.map(row => row.map(cell => <strong>{cell}</strong>))}
        />
      </SectionCard>

      <SectionCard color="dat">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="dat" label="IRR" />
          <div>
            <div className="case-title">Important Irregular Forms</div>
            <div className="case-sublabel">High-frequency packet to memorize</div>
          </div>
        </div>
        <GrammarTable
          headers={["Base", "Comparative", "Superlative"]}
          rows={IRREGULARS.map(row => row.map(cell => <strong>{cell}</strong>))}
        />
      </SectionCard>

      <SectionCard color="gen">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="gen" label="-E-" />
          <div>
            <div className="case-title">Pronunciation Helper -e-</div>
            <div className="case-sublabel">Often appears in the superlative for easier pronunciation</div>
          </div>
        </div>
        <div className="prep-chips">
          {E_HELPERS.map((item, i) => <span key={i} className="prep-chip">{item}</span>)}
        </div>
        <div className="examples-list">
          {E_HELPER_EXAMPLES.map((row, i) => (
            <div key={i} className="example-row">
              <div className="example-de">{row[0]} → {row[1]}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard color="acc">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="acc" label="FIX" />
          <div>
            <div className="case-title">Classic Mistake</div>
            <div className="case-sublabel">Do not copy English “more + adjective”</div>
          </div>
        </div>
        <GrammarTable
          headers={["Wrong", "Correct", "Why"]}
          rows={PITFALLS.map(row => [
            <span style={{ color: "var(--color-error)", fontWeight: 700 }}>{row[0]}</span>,
            <span style={{ color: "var(--color-success)", fontWeight: 700 }}>{row[1]}</span>,
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{row[2]}</span>,
          ])}
        />
      </SectionCard>
    </div>
  );
}

function TensesTab() {
  return (
    <div className="pronouns-sections">
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-2)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", fontSize: "var(--text-sm)", color: "var(--color-text)" }}>
        Comparative and superlative themselves do not change by tense. The <strong>verb tense</strong> changes, not the comparison form.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
        {TENSE_USAGE.map((item, i) => (
          <SectionCard key={i} color={item.color}>
            <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <CaseBadge color={item.color} label={item.tense.slice(0,3).toUpperCase()} />
              <div>
                <div className="case-title" style={{ fontSize: "var(--text-base)" }}>{item.tense}</div>
              </div>
            </div>
            <div style={{ padding: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-divider)" }}>
              <div className="example-de">{item.example}</div>
              <div className="example-en">{item.english}</div>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", fontStyle: "italic" }}>{item.note}</div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

function AdvancedTab() {
  return (
    <div className="pronouns-sections">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-3)" }}>
        {ADVANCED_CONTEXTS.map((item, i) => (
          <SectionCard key={i} color={item.color}>
            <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <CaseBadge color={item.color} label={`${i + 1}`} />
              <div>
                <div className="case-title" style={{ fontSize: "var(--text-base)" }}>{item.title}</div>
                <div className="case-sublabel">{item.rule}</div>
              </div>
            </div>
            <div style={{ padding: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-divider)" }}>
              <div className="example-de">{item.example}</div>
              <div className="example-en">{item.english}</div>
            </div>
          </SectionCard>
        ))}
      </div>

      <Collapsible label="Pro Hacks" defaultOpen={true}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {PRO_HACKS.map((note, i) => (
            <div key={i} style={{ display: "flex", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
              <span style={{ fontSize: "var(--text-lg)", width: 24, textAlign: "center" }}>•</span>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.6 }}>{note}</p>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible label="Compact Cheat Sheet">
        <GrammarTable
          headers={["Function", "Structure", "Example"]}
          rows={CHEAT_SHEET.map(row => [row[0], <strong>{row[1]}</strong>, row[2]])}
        />
      </Collapsible>
    </div>
  );
}

function DrillsTab() {
  return (
    <div className="pronouns-sections">
      <SectionCard color="nom">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="nom" label="DRILL" />
          <div>
            <div className="case-title">Mini Drills</div>
            <div className="case-sublabel">Memorize these high-frequency patterns</div>
          </div>
        </div>
        <GrammarTable
          headers={["Positiv", "Komparativ", "Superlativ"]}
          rows={MINI_DRILLS.map(row => row.map(cell => <strong>{cell}</strong>))}
        />
      </SectionCard>

      <SectionCard color="acc">
        <div className="case-header-left" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <CaseBadge color="acc" label="SLOTS" />
          <div>
            <div className="case-title">Three-Slot Memory Model</div>
            <div className="case-sublabel">Think by function, not by isolated forms</div>
          </div>
        </div>
        <div className="mental-model">
          <div className="mental-model-title">Quick memory map</div>
          <ul className="mental-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><span className="case-tag-nom">Equality</span> = so + adjective + wie</li>
            <li><span className="case-tag-acc">Difference</span> = comparative + als</li>
            <li><span className="case-tag-dat">Maximum</span> = am ... -sten or article + ... -ste</li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}

export default function ComparitiveAndSuperlative() {
  const [activeTab, setActiveTab] = useState("core");

  const renderTab = () => {
    switch (activeTab) {
      case "core": return <CoreTab />;
      case "forms": return <FormsTab />;
      case "cases": return <CasesTab />;
      case "exceptions": return <ExceptionsTab />;
      case "tenses": return <TensesTab />;
      case "advanced": return <AdvancedTab />;
      case "drills": return <DrillsTab />;
      default: return null;
    }
  };

  return (
    <div className="pronouns-page">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span style={{ fontSize: "2rem" }}>📈</span>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "var(--color-text)", margin: 0, lineHeight: 1.1 }}>German Comparative & Superlative</h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
              Positiv · Komparativ · Superlativ · declension · irregulars · usage
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
