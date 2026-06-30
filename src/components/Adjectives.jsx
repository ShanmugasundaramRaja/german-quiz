import React, { useMemo, useState } from "react";

const placementData = [
  {
    key: "attributive",
    title: "Attributive",
    position: "Before a noun",
    changes: "Yes",
    colorClass: "case-nom",
    badgeClass: "case-badge case-badge-nom",
    exampleDe: "der große Hund",
    exampleEn: "the big dog",
    note: "Adjective comes before the noun and must decline.",
  },
  {
    key: "predicative",
    title: "Predicative",
    position: "After sein / werden / bleiben",
    changes: "No",
    colorClass: "case-dat",
    badgeClass: "case-badge case-badge-dat",
    exampleDe: "Der Hund ist groß.",
    exampleEn: "The dog is big.",
    note: "Adjective stays in the base form after linking verbs.",
  },
  {
    key: "adverbial",
    title: "Adverbial",
    position: "With a verb, describing how",
    changes: "No",
    colorClass: "case-acc",
    badgeClass: "case-badge case-badge-acc",
    exampleDe: "Er läuft schnell.",
    exampleEn: "He runs quickly.",
    note: "Adjective describes the action and does not decline.",
  },
];

const declensionMeta = {
  strong: {
    title: "Strong declension",
    badge: "STR",
    className: "case-section case-nom",
    badgeClass: "case-badge case-badge-nom",
    article: "No article",
    description:
      "Use strong endings when there is no article carrying the grammar signal, so the adjective shows case, gender, and number more clearly.",
    memory: "The adjective does the heavy lifting.",
  },
  weak: {
    title: "Weak declension",
    badge: "WK",
    className: "case-section case-acc",
    badgeClass: "case-badge case-badge-acc",
    article: "After definite article",
    description:
      "Use weak endings after der / die / das because the article already carries most of the grammatical information.",
    memory: "Mostly -e or -en.",
  },
  mixed: {
    title: "Mixed declension",
    badge: "MX",
    className: "case-section case-dat",
    badgeClass: "case-badge case-badge-dat",
    article: "After ein-words",
    description:
      "Use mixed endings after ein, kein, and possessive-type words because the determiner shows some information, but not all of it.",
    memory: "The adjective fills in the missing signal.",
  },
};

const declensionTables = {
  strong: [
    {
      case: "Nominative",
      masculine: "guter Wein",
      feminine: "gute Milch",
      neuter: "gutes Brot",
      plural: "gute Freunde",
    },
    {
      case: "Accusative",
      masculine: "guten Wein",
      feminine: "gute Milch",
      neuter: "gutes Brot",
      plural: "gute Freunde",
    },
    {
      case: "Dative",
      masculine: "gutem Wein",
      feminine: "guter Milch",
      neuter: "gutem Brot",
      plural: "guten Freunden",
    },
    {
      case: "Genitive",
      masculine: "guten Weins",
      feminine: "guter Milch",
      neuter: "guten Brots",
      plural: "guter Freunde",
    },
  ],
  weak: [
    {
      case: "Nominative",
      masculine: "der gute Mann",
      feminine: "die gute Frau",
      neuter: "das gute Kind",
      plural: "die guten Kinder",
    },
    {
      case: "Accusative",
      masculine: "den guten Mann",
      feminine: "die gute Frau",
      neuter: "das gute Kind",
      plural: "die guten Kinder",
    },
    {
      case: "Dative",
      masculine: "dem guten Mann",
      feminine: "der guten Frau",
      neuter: "dem guten Kind",
      plural: "den guten Kindern",
    },
    {
      case: "Genitive",
      masculine: "des guten Mannes",
      feminine: "der guten Frau",
      neuter: "des guten Kindes",
      plural: "der guten Kinder",
    },
  ],
  mixed: [
    {
      case: "Nominative",
      masculine: "ein guter Mann",
      feminine: "eine gute Frau",
      neuter: "ein gutes Kind",
      plural: "keine guten Kinder",
    },
    {
      case: "Accusative",
      masculine: "einen guten Mann",
      feminine: "eine gute Frau",
      neuter: "ein gutes Kind",
      plural: "keine guten Kinder",
    },
    {
      case: "Dative",
      masculine: "einem guten Mann",
      feminine: "einer guten Frau",
      neuter: "einem guten Kind",
      plural: "keinen guten Kindern",
    },
    {
      case: "Genitive",
      masculine: "eines guten Mannes",
      feminine: "einer guten Frau",
      neuter: "eines guten Kindes",
      plural: "keiner guten Kinder",
    },
  ],
};

const declensionExamples = {
  strong: [
    { de: "Guter Wein ist teuer.", en: "Good wine is expensive." },
    { de: "Ich trinke guten Wein.", en: "I drink good wine." },
  ],
  weak: [
    { de: "Der gute Wein ist teuer.", en: "The good wine is expensive." },
    {
      de: "Das Buch des guten Mannes ist alt.",
      en: "The book of the good man is old.",
    },
  ],
  mixed: [
    {
      de: "Ein kluger Student lernt schnell.",
      en: "A clever student learns quickly.",
    },
    { de: "Ich sehe einen klugen Studenten.", en: "I see a clever student." },
    { de: "Mein altes Auto ist teuer.", en: "My old car is expensive." },
  ],
};

const caseJobs = [
  {
    key: "nom",
    title: "Nominative",
    sublabel: "Subject",
    question: "Who / what is doing it?",
    accentClass: "case-section case-nom",
    badgeClass: "case-badge case-badge-nom",
    badge: "Nom",
    exampleDe: "Der nette Lehrer erklärt alles.",
    exampleEn: "The nice teacher explains everything.",
    why: "Lehrer is doing the action.",
  },
  {
    key: "acc",
    title: "Accusative",
    sublabel: "Direct object",
    question: "Who / what is directly affected?",
    accentClass: "case-section case-acc",
    badgeClass: "case-badge case-badge-acc",
    badge: "Acc",
    exampleDe: "Ich sehe den netten Lehrer.",
    exampleEn: "I see the nice teacher.",
    why: "Lehrer is directly affected.",
  },
  {
    key: "dat",
    title: "Dative",
    sublabel: "Indirect object / dative prep",
    question: "To whom? For whom?",
    accentClass: "case-section case-dat",
    badgeClass: "case-badge case-badge-dat",
    badge: "Dat",
    exampleDe: "Ich helfe dem netten Lehrer.",
    exampleEn: "I help the nice teacher.",
    why: "Lehrer receives the action.",
  },
  {
    key: "gen",
    title: "Genitive",
    sublabel: "Possession / certain preps",
    question: "Whose?",
    accentClass: "case-section case-gen",
    badgeClass: "case-badge case-badge-gen",
    badge: "Gen",
    exampleDe: "Das Buch des netten Lehrers ist alt.",
    exampleEn: "The book of the nice teacher is old.",
    why: "Shows a possession relationship.",
  },
];

const tenseExamples = {
  predicative: [
    {
      tense: "Present",
      de: "Der alte Mann ist müde.",
      en: "The old man is tired.",
      note: "Attributive alte, predicative müde.",
    },
    {
      tense: "Perfekt",
      de: "Der alte Mann ist müde gewesen.",
      en: "The old man has been tired.",
      note: "Predicative adjective still does not decline.",
    },
    {
      tense: "Präteritum",
      de: "Der alte Mann war müde.",
      en: "The old man was tired.",
      note: "Same predicative pattern.",
    },
    {
      tense: "Futur I",
      de: "Der alte Mann wird müde sein.",
      en: "The old man will be tired.",
      note: "Still no adjective ending after the verb.",
    },
  ],
  attributive: [
    {
      tense: "Present",
      de: "Ich kaufe ein neues Auto.",
      en: "I buy a new car.",
    },
    {
      tense: "Perfekt",
      de: "Ich habe ein neues Auto gekauft.",
      en: "I have bought a new car.",
    },
    {
      tense: "Futur I",
      de: "Ich werde ein neues Auto kaufen.",
      en: "I will buy a new car.",
    },
  ],
};

const comparativeRows = [
  {
    degree: "Positive",
    form: "groß",
    example: "Das Haus ist groß.",
    english: "The house is big.",
  },
  {
    degree: "Comparative",
    form: "größer",
    example: "Das Haus ist größer als das andere.",
    english: "The house is bigger than the other one.",
  },
  {
    degree: "Superlative predicative",
    form: "am größten",
    example: "Das Haus ist am größten.",
    english: "The house is the biggest.",
  },
  {
    degree: "Superlative attributive",
    form: "der größte",
    example: "Das ist das größte Haus.",
    english: "That is the biggest house.",
  },
];

const specialPoints = [
  {
    label: "-el / -er change",
    examples: [
      "ein dunkler Raum / einen dunklen Raum",
      "ein teures Auto / der teure Wagen",
    ],
  },
  {
    label: "Sometimes unusual / undeclined in usage",
    examples: ["ein super Film", "ein extra Teller"],
  },
  {
    label: "Important note",
    examples: [
      "Adjectives after sein, werden, bleiben do not decline.",
      "Adjectives before nouns must agree with article, case, gender, and number.",
      "Dative plural usually also adds -n to the noun: mit guten Freunden.",
      "Formal genitive remains standard grammar, even if spoken German often prefers von + dative.",
    ],
  },
];

const hacks = [
  "After der / die / das, think: mostly -e or -en.",
  "After ein / kein / mein, nominative masculine and nominative/accusative neuter often show strong-looking endings: ein guter Mann, ein gutes Kind.",
  "With no article, memorize the strong chart first.",
  "If the adjective is after the verb, stop worrying about endings: Das Auto ist schnell.",
];

const mistakes = [
  { wrong: "der groß Hund", correct: "der große Hund" },
  { wrong: "ein schöne Haus", correct: "ein schönes Haus" },
  { wrong: "das Haus ist großes", correct: "das Haus ist groß" },
];

function Table({ rows, showEnglish = false }) {
  return (
    <div className="boss-table-wrap">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Case</th>
            <th>Masculine</th>
            <th>Feminine</th>
            <th>Neuter</th>
            <th>Plural</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.case}>
              <td>{row.case}</td>
              <td>{row.masculine}</td>
              <td>{row.feminine}</td>
              <td>{row.neuter}</td>
              <td>{row.plural}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="boss-table-wrap">
      <table className="modern-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key} className={col.className || ""}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
  tone = "default",
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`case-section ${tone}`}>
      <div className="case-header">
        <div className="case-header-left">
          <div
            className={`case-badge ${tone === "case-nom" ? "case-badge-nom" : tone === "case-acc" ? "case-badge-acc" : tone === "case-dat" ? "case-badge-dat" : tone === "case-gen" ? "case-badge-gen" : "case-badge-nom"}`}
          >
            {open ? "ON" : "OFF"}
          </div>
          <div>
            <h2 className="case-title">{title}</h2>
            {subtitle ? <div className="case-sublabel">{subtitle}</div> : null}
          </div>
        </div>

        <button
          type="button"
          className="examples-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span>{open ? "Hide" : "Show"}</span>
          <span>{open ? "−" : "+"}</span>
        </button>
      </div>

      {open ? <div>{children}</div> : null}
    </section>
  );
}

export default function GermanAdjectivesMasterPage() {
  const [activeDeclension, setActiveDeclension] = useState("strong");
  const [revealedCases, setRevealedCases] = useState({});
  const [openExamples, setOpenExamples] = useState({});
  const [openDeclensionExamples, setOpenDeclensionExamples] = useState(false);
  const [openPlacementExamples, setOpenPlacementExamples] = useState(true);
  const [openTensePred, setOpenTensePred] = useState(true);
  const [openTenseAttr, setOpenTenseAttr] = useState(true);

  const activeMeta = declensionMeta[activeDeclension];
  const activeRows = declensionTables[activeDeclension];
  const activeExamples = declensionExamples[activeDeclension];

  const summaryCards = useMemo(
    () => [
      {
        label: "5 things that decide the ending",
        value: "Position, gender, number, case, article type",
      },
      {
        label: "3 declension patterns",
        value: "Strong, Weak, Mixed",
      },
      {
        label: "Core shortcut",
        value: "Who carries the grammar signal?",
      },
    ],
    [],
  );

  const toggleReveal = (key) => {
    setRevealedCases((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExamples = (key) => {
    setOpenExamples((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="pronouns-page adjective-page">
      <div className="pronouns-sections">
        <section
          className="case-boss-card"
          style={{ borderLeft: "4px solid var(--color-primary)" }}
        >
          <div className="case-boss-title">German Adjectives Master Page</div>

          <div className="mental-model">
            <div className="mental-model-title">Core rule</div>
            <div className="boss-example">
              Adjectives before a noun are declined, but adjectives after verbs
              like <strong>sein</strong>, werden, and bleiben usually stay
              unchanged.
            </div>
          </div>

          <div
            className="prep-chips"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="prep-group"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-surface-2), var(--color-surface-offset))",
                }}
              >
                <div className="prep-case-tag">{card.label}</div>
                <div className="boss-example">{card.value}</div>
              </div>
            ))}
          </div>
        </section>

        <Collapsible
          title="Placement"
          subtitle="Where the adjective sits changes whether it declines"
          defaultOpen={true}
          tone="case-nom"
        >
          <DataTable
            columns={[
              { key: "title", label: "Type" },
              { key: "position", label: "Position" },
              { key: "changes", label: "Ending changes?" },
              { key: "exampleDe", label: "Example" },
            ]}
            rows={placementData}
          />

          <button
            type="button"
            className="examples-toggle"
            onClick={() => setOpenPlacementExamples((v) => !v)}
            style={{ marginTop: "var(--space-4)" }}
          >
            <span>
              {openPlacementExamples ? "Hide examples" : "Show examples"}
            </span>
            <span>{openPlacementExamples ? "−" : "+"}</span>
          </button>

          {openPlacementExamples && (
            <div
              className="examples-list"
              style={{ marginTop: "var(--space-4)" }}
            >
              {placementData.map((item, index) => (
                <div
                  key={item.key}
                  className="example-row"
                  style={{
                    animationDelay: `${index * 70}ms`,
                    borderLeftColor:
                      item.key === "attributive"
                        ? "var(--color-primary)"
                        : item.key === "predicative"
                          ? "var(--color-success)"
                          : "var(--color-gold)",
                  }}
                >
                  <div className="example-de">
                    {item.exampleDe} — {item.note}
                  </div>
                  <div className="example-en">{item.exampleEn}</div>
                </div>
              ))}
              <div
                className="example-row"
                style={{ borderLeftColor: "var(--color-primary)" }}
              >
                <div className="example-de">Die interessante Idee ist neu.</div>
                <div className="example-en">
                  Attributive adjective, so it declines.
                </div>
              </div>
              <div
                className="example-row"
                style={{ borderLeftColor: "var(--color-success)" }}
              >
                <div className="example-de">Die Idee ist interessant.</div>
                <div className="example-en">
                  Predicative adjective, so no ending.
                </div>
              </div>
              <div
                className="example-row"
                style={{ borderLeftColor: "var(--color-gold)" }}
              >
                <div className="example-de">Sie spricht langsam.</div>
                <div className="example-en">Adverbial use, so no ending.</div>
              </div>
            </div>
          )}
        </Collapsible>

        <section
          className="case-boss-card"
          style={{ borderLeft: "4px solid var(--color-gold)" }}
        >
          <div
            className="case-boss-title"
            style={{ color: "var(--color-gold)" }}
          >
            Declension system
          </div>

          <div className="mental-model">
            <div className="mental-model-title">What decides the ending?</div>
            <ul className="mental-steps">
              <li>1. Is the adjective before a noun?</li>
              <li>2. What is the noun’s gender?</li>
              <li>3. Is it singular or plural?</li>
              <li>4. What case is the noun phrase in?</li>
              <li>
                5. What kind of article comes before it: definite,
                ein-word/possessive, or none?
              </li>
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              flexWrap: "wrap",
            }}
          >
            {Object.entries(declensionMeta).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                className="examples-toggle"
                onClick={() => setActiveDeclension(key)}
                style={{
                  color:
                    activeDeclension === key ? "var(--color-text)" : undefined,
                  borderColor:
                    activeDeclension === key
                      ? key === "strong"
                        ? "var(--color-primary)"
                        : key === "weak"
                          ? "var(--color-gold)"
                          : "var(--color-success)"
                      : undefined,
                  background:
                    activeDeclension === key
                      ? key === "strong"
                        ? "var(--color-primary-highlight)"
                        : key === "weak"
                          ? "var(--color-gold-highlight)"
                          : "var(--color-success-highlight)"
                      : undefined,
                }}
              >
                <span>{meta.badge}</span>
                <span>{meta.title}</span>
              </button>
            ))}
          </div>

          <div className={activeMeta.className}>
            <div className="case-header">
              <div className="case-header-left">
                <div className={activeMeta.badgeClass}>{activeMeta.badge}</div>
                <div>
                  <div className="case-title">{activeMeta.title}</div>
                  <div className="case-sublabel">{activeMeta.article}</div>
                </div>
              </div>
              <div className="case-question">{activeMeta.memory}</div>
            </div>

            <p style={{ margin: 0 }}>{activeMeta.description}</p>

            <Table rows={activeRows} />

            <button
              type="button"
              className="examples-toggle"
              onClick={() => setOpenDeclensionExamples((v) => !v)}
            >
              <span>
                {openDeclensionExamples ? "Hide examples" : "Show examples"}
              </span>
              <span>{openDeclensionExamples ? "−" : "+"}</span>
            </button>

            {openDeclensionExamples && (
              <div className="examples-list">
                {activeExamples.map((item, index) => (
                  <div
                    key={`${item.de}-${index}`}
                    className="example-row"
                    style={{
                      borderLeftColor:
                        activeDeclension === "strong"
                          ? "var(--color-primary)"
                          : activeDeclension === "weak"
                            ? "var(--color-gold)"
                            : "var(--color-success)",
                    }}
                  >
                    <div className="example-de">{item.de}</div>
                    <div className="example-en">{item.en}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mental-model">
            <div className="mental-model-title">Weak pattern to remember</div>
            <ul className="mental-steps">
              <li>Nominative singular: mostly -e, except plural -en.</li>
              <li>Accusative masculine: -en.</li>
              <li>Dative and genitive: basically all -en.</li>
            </ul>
          </div>
        </section>

        <Collapsible
          title="Cases and use"
          subtitle="Find the case first, then pick the article pattern, then add the ending"
          defaultOpen={true}
          tone="case-dat"
        >
          <div className="pronouns-sections">
            {caseJobs.map((item) => {
              const revealed = !!revealedCases[item.key];
              const examplesOpen = !!openExamples[item.key];

              return (
                <section key={item.key} className={item.accentClass}>
                  <div className="case-header">
                    <div className="case-header-left">
                      <div className={item.badgeClass}>{item.badge}</div>
                      <div>
                        <div className="case-title">{item.title}</div>
                        <div className="case-sublabel">{item.sublabel}</div>
                      </div>
                    </div>
                    <div className="case-header-right">
                      <div className="case-question">{item.question}</div>
                    </div>
                  </div>

                  {!revealed ? (
                    <button
                      type="button"
                      className="reveal-btn"
                      onClick={() => toggleReveal(item.key)}
                    >
                      <span className="reveal-btn-line" />
                      <span className="reveal-btn-text">Reveal job</span>
                    </button>
                  ) : (
                    <div className="answer-revealed">✓ {item.why}</div>
                  )}

                  <button
                    type="button"
                    className="examples-toggle"
                    onClick={() => toggleExamples(item.key)}
                  >
                    <span>
                      {examplesOpen ? "Hide example" : "Show example"}
                    </span>
                    <span>{examplesOpen ? "−" : "+"}</span>
                  </button>

                  {examplesOpen && (
                    <div className="examples-list">
                      <div className="example-row">
                        <div className="example-de">{item.exampleDe}</div>
                        <div className="example-en">{item.exampleEn}</div>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <div className="mental-model" style={{ marginTop: "var(--space-4)" }}>
            <div className="mental-model-title">Reliable workflow</div>
            <ul className="mental-steps">
              <li>Identify the noun.</li>
              <li>Identify the case.</li>
              <li>
                Check the determiner: definite, indefinite/possessive/negative,
                or none.
              </li>
              <li>
                Apply weak, mixed, or strong adjective endings accordingly.
              </li>
            </ul>
          </div>
        </Collapsible>

        <section
          className="case-boss-card"
          style={{ borderLeft: "4px solid var(--color-success)" }}
        >
          <div
            className="case-boss-title"
            style={{ color: "var(--color-success)" }}
          >
            Tenses and sentence structure
          </div>

          <div className="mental-model">
            <div className="mental-model-title">Big idea</div>
            <div className="boss-example">
              Adjectives do not have tenses in German. Verbs change tense, while
              adjective behavior still depends on position in the sentence.
            </div>
          </div>

          <div className="boss-grid">
            <div className="boss-block">
              <div className="boss-block-label">Predicative across tenses</div>
              <button
                type="button"
                className="examples-toggle"
                onClick={() => setOpenTensePred((v) => !v)}
              >
                <span>{openTensePred ? "Hide set" : "Show set"}</span>
                <span>{openTensePred ? "−" : "+"}</span>
              </button>
              {openTensePred && (
                <div className="examples-list">
                  {tenseExamples.predicative.map((item, i) => (
                    <div
                      key={item.tense}
                      className="example-row"
                      style={{
                        animationDelay: `${i * 60}ms`,
                        borderLeftColor: "var(--color-success)",
                      }}
                    >
                      <div className="example-de">
                        {item.tense}: {item.de}
                      </div>
                      <div className="example-en">
                        {item.en} — {item.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="boss-block">
              <div className="boss-block-label">Attributive across tenses</div>
              <button
                type="button"
                className="examples-toggle"
                onClick={() => setOpenTenseAttr((v) => !v)}
              >
                <span>{openTenseAttr ? "Hide set" : "Show set"}</span>
                <span>{openTenseAttr ? "−" : "+"}</span>
              </button>
              {openTenseAttr && (
                <div className="examples-list">
                  {tenseExamples.attributive.map((item, i) => (
                    <div
                      key={item.tense}
                      className="example-row"
                      style={{
                        animationDelay: `${i * 60}ms`,
                        borderLeftColor: "var(--color-primary)",
                      }}
                    >
                      <div className="example-de">
                        {item.tense}: {item.de}
                      </div>
                      <div className="example-en">{item.en}</div>
                    </div>
                  ))}
                  <div
                    className="example-row"
                    style={{ borderLeftColor: "var(--color-primary)" }}
                  >
                    <div className="example-de">
                      Notice: neues stays the same.
                    </div>
                    <div className="example-en">
                      The noun phrase remains accusative neuter with an ein-word
                      article even when the verb tense changes.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Collapsible
          title="Comparative forms"
          subtitle="Comparatives and superlatives follow the same placement logic"
          defaultOpen={true}
          tone="case-acc"
        >
          <DataTable
            columns={[
              { key: "degree", label: "Degree" },
              { key: "form", label: "Form" },
              { key: "example", label: "Example" },
              { key: "english", label: "Meaning", className: "td-english" },
            ]}
            rows={comparativeRows}
          />

          <div
            className="examples-list"
            style={{ marginTop: "var(--space-4)" }}
          >
            <div
              className="example-row"
              style={{ borderLeftColor: "var(--color-gold)" }}
            >
              <div className="example-de">Ein größerer Tisch wäre besser.</div>
              <div className="example-en">
                A bigger table would be better. Attributive comparative, so it
                declines.
              </div>
            </div>
            <div
              className="example-row"
              style={{ borderLeftColor: "var(--color-success)" }}
            >
              <div className="example-de">Dieser Tisch ist größer.</div>
              <div className="example-en">
                This table is bigger. Predicative, so no ending.
              </div>
            </div>
          </div>
        </Collapsible>

        <Collapsible
          title="Exceptions and special points"
          subtitle="Useful edge cases and real-world notes"
          defaultOpen={true}
          tone="case-gen"
        >
          <div className="prep-groups">
            {specialPoints.map((group, idx) => (
              <div
                key={group.label}
                className={`prep-group ${idx === 0 ? "prep-dat" : idx === 1 ? "prep-acc" : "prep-gen"}`}
                style={{
                  background:
                    idx === 0
                      ? "linear-gradient(135deg, var(--color-success-highlight), var(--color-surface-2))"
                      : idx === 1
                        ? "linear-gradient(135deg, var(--color-gold-highlight), var(--color-surface-2))"
                        : "linear-gradient(135deg, var(--color-error-highlight), var(--color-surface-2))",
                }}
              >
                <div className="prep-case-tag">{group.label}</div>
                <div className="prep-chips">
                  {group.examples.map((ex) => (
                    <span key={ex} className="prep-chip">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Collapsible>

        <section
          className="case-boss-card"
          style={{ borderLeft: "4px solid var(--color-error)" }}
        >
          <div
            className="case-boss-title"
            style={{ color: "var(--color-error)" }}
          >
            Things to remember
          </div>

          <div className="boss-grid">
            <div className="boss-block">
              <div className="boss-block-label">Useful hacks</div>
              <div className="mental-model">
                <ul className="mental-steps">
                  {hacks.map((hack) => (
                    <li key={hack}>{hack}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="boss-block">
              <div className="boss-block-label">Common mistakes</div>
              <div className="examples-list">
                {mistakes.map((row, i) => (
                  <div
                    key={row.wrong}
                    className="example-row"
                    style={{
                      animationDelay: `${i * 70}ms`,
                      borderLeftColor: "var(--color-error)",
                    }}
                  >
                    <div className="example-de">Wrong: {row.wrong}</div>
                    <div className="example-en">Correct: {row.correct}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mental-model">
            <div className="mental-model-title">Compact master example</div>
            <ul className="mental-steps">
              <li>
                <span className="case-tag-nom">Strong:</span> Guter Wein ist
                teuer.
              </li>
              <li>
                <span className="case-tag-acc">Weak:</span> Der gute Wein ist
                teuer.
              </li>
              <li>
                <span className="case-tag-dat">Mixed:</span> Ein guter Wein ist
                teuer.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
