import React, { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ADVERB_TYPES = [
  {
    type: "temporal",
    label: "Temporaladverb",
    icon: "🕐",
    color: "var(--color-primary)",
    bg: "var(--color-primary-highlight)",
    question: "When? How long? How often?",
    meaning: "Time",
    words: [
      "heute",
      "gestern",
      "morgen",
      "bald",
      "immer",
      "nie",
      "oft",
      "damals",
      "jetzt",
      "schon",
    ],
    examples: [
      { de: "Ich komme heute.", en: "I am coming today." },
      { de: "Er kommt immer zu spät.", en: "He always comes too late." },
      { de: "Wir haben das nie gemacht.", en: "We never did that." },
    ],
  },
  {
    type: "lokal",
    label: "Lokaladverb",
    icon: "📍",
    color: "var(--color-success)",
    bg: "var(--color-success-highlight)",
    question: "Where? Where to? Where from?",
    meaning: "Place / Direction",
    words: [
      "hier",
      "dort",
      "draußen",
      "drinnen",
      "hinein",
      "heraus",
      "überall",
      "oben",
      "unten",
      "nirgends",
    ],
    examples: [
      { de: "Er wohnt dort.", en: "He lives there." },
      { de: "Das Kind spielt draußen.", en: "The child is playing outside." },
      { de: "Sie geht hinein.", en: "She goes inside." },
    ],
  },
  {
    type: "modal",
    label: "Modaladverb",
    icon: "⚙️",
    color: "var(--color-gold)",
    bg: "var(--color-gold-highlight)",
    question: "How? How much? How strongly?",
    meaning: "Manner / Degree",
    words: [
      "gern",
      "sehr",
      "so",
      "wirklich",
      "vielleicht",
      "kaum",
      "fast",
      "ziemlich",
      "besonders",
      "genau",
    ],
    examples: [
      { de: "Sie arbeitet sehr schnell.", en: "She works very quickly." },
      { de: "Er fährt sehr schnell.", en: "He drives very fast." },
      { de: "Das ist wirklich wichtig.", en: "That is really important." },
    ],
  },
  {
    type: "kausal",
    label: "Kausaladverb",
    icon: "🔗",
    color: "var(--color-error)",
    bg: "var(--color-error-highlight)",
    question: "Why? Therefore? In spite of that?",
    meaning: "Reason / Result / Concession",
    words: [
      "deshalb",
      "darum",
      "dadurch",
      "trotzdem",
      "dennoch",
      "folglich",
      "deswegen",
      "nämlich",
    ],
    examples: [
      {
        de: "Deshalb bleibt er zu Hause.",
        en: "That is why he stays at home.",
      },
      {
        de: "Es regnet, trotzdem geht sie spazieren.",
        en: "It is raining; nevertheless she goes for a walk.",
      },
      {
        de: "Darum verstehe ich es nicht.",
        en: "That is why I don't understand it.",
      },
    ],
  },
];

const POSITION_ROWS = [
  {
    structure: "Modifying a verb",
    position: "Often in the middle field",
    example: "Ich lese oft abends.",
    note: "Describes the action",
  },
  {
    structure: "Modifying an adjective",
    position: "Before the adjective",
    example: "Das ist sehr wichtig.",
    note: "Degree / intensity",
  },
  {
    structure: "Modifying another adverb",
    position: "Before the adverb",
    example: "Er fährt sehr schnell.",
    note: "Degree / intensity",
  },
  {
    structure: "Sentence adverb",
    position: "Often at the start or early in clause",
    example: "Vielleicht kommt sie später.",
    note: "Affects the whole statement",
  },
];

const TMP_EXAMPLES = [
  {
    de: "Ich lerne heute intensiv zu Hause.",
    en: "I am studying today intensively at home.",
    breakdown: ["heute → Time", "intensiv → Manner", "zu Hause → Place"],
  },
  {
    de: "Heute lerne ich zu Hause.",
    en: "Today I am learning at home.",
    note: "Fronting heute adds emphasis on time — verb stays in 2nd position.",
  },
  {
    de: "Der Zug kommt heute pünktlich hier an.",
    en: "The train arrives here today on time.",
    breakdown: ["heute → Time", "pünktlich → Manner", "hier → Place"],
  },
];

const ADJ_VS_ADV = [
  {
    sentence: "ein schnelles Auto",
    function: "Adjective",
    why: "Describes the noun Auto — takes an ending (-es).",
    color: "var(--color-error)",
  },
  {
    sentence: "Das Auto fährt schnell.",
    function: "Adverb",
    why: "Describes how the car drives — no ending, no declension.",
    color: "var(--color-success)",
  },
  {
    sentence: "ein lauter Hund",
    function: "Adjective",
    why: "Before a noun — declension is needed (-er).",
    color: "var(--color-error)",
  },
  {
    sentence: "Der Hund bellt laut.",
    function: "Adverb",
    why: "Describes the verb bellen — no declension.",
    color: "var(--color-success)",
  },
  {
    sentence: "Der schnelle Zug kommt pünktlich.",
    function: "Adjective + Adverb",
    why: "schnelle = adjective before Zug; pünktlich = adverb modifying kommt.",
    color: "var(--color-primary)",
  },
];

const TENSE_EXAMPLES = [
  { tense: "Präsens", de: "Ich bin heute müde.", en: "I am tired today." },
  {
    tense: "Perfekt",
    de: "Ich bin heute müde gewesen.",
    en: "I have been tired today.",
  },
  { tense: "Präteritum", de: "Ich war heute müde.", en: "I was tired today." },
  {
    tense: "Futur I",
    de: "Ich werde heute müde sein.",
    en: "I will be tired today.",
  },
];

const SPECIAL_NOTES = [
  {
    icon: "📌",
    text: "Most adverbs are not inflected — they never change form for case, gender, or number.",
  },
  {
    icon: "📈",
    text: "Some adverbs can be compared, especially degree or manner words (e.g. schnell → schneller → am schnellsten), though not all adverbs allow this.",
  },
  {
    icon: "🔗",
    text: "Words like deshalb, trotzdem, and außerdem can also behave as conjunctional adverbs linking clauses — often called Konjunktionaladverbien in school grammar.",
  },
];

const PRO_TIPS = [
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Learn in families",
    body: "Group adverbs by theme: heute / gestern / morgen / bald / nie / oft for time; hier / dort / draußen / hinein for place. Families stick better than isolated words.",
  },
  {
    icon: "⏱️",
    title: "Default to TMP",
    body: "When in doubt, use Time → Manner → Place order. It sounds neutral and natural in most sentences without needing to think about emphasis.",
  },
  {
    icon: "🔍",
    title: "Degree shortcut",
    body: "If a word appears before an adjective, it is almost always an adverb of degree: sehr gut, wirklich wichtig, ziemlich schwer.",
  },
  {
    icon: "💬",
    title: "Sentence adverbs",
    body: "If a word stands at the beginning and comments on the whole sentence, it is likely a sentence adverb: vielleicht, hoffentlich, leider.",
  },
  {
    icon: "❓",
    title: "Quick recognition test",
    body: 'Ask what the word modifies. If it is NOT directly modifying a noun, it is probably an adverb. Ask: "When? Where? How? Why?" — those four questions cover most real-life adverb use.',
  },
];

const COMMON_MISTAKES = [
  {
    wrong: "Er fährt schnelles.",
    right: "Er fährt schnell.",
    reason:
      "Adverbs modifying verbs never take adjective endings. schnell describes fährt, not a noun.",
  },
  {
    wrong: "Heute ich komme.",
    right: "Heute komme ich.",
    reason:
      "After fronting a time adverb, the finite verb must stay in second position (V2 rule).",
  },
  {
    wrong: "I come today. → Ich komme today.",
    right: "Ich komme heute.",
    reason:
      "Don't translate English word order directly — use natural German adverb placement.",
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
      }}
    >
      ▶ Watch
    </a>
  );
}

function SectionCard({ children, style = {}, accentColor }) {
  return (
    <div
      className="case-section"
      style={{
        borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ExamplesBlock({ examples, open: controlledOpen, onToggle }) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
  const toggle = onToggle || (() => setLocalOpen((o) => !o));
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
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span>{isOpen ? "▲" : "▼"}</span>
        {isOpen ? "Hide examples" : "Show examples"}
      </button>
      {isOpen && (
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

// ─── ADVERB TYPES SECTION ─────────────────────────────────────────────────────

function AdverbTypesSection() {
  const [activeType, setActiveType] = useState("temporal");
  const [showExamples, setShowExamples] = useState(false);
  const active = ADVERB_TYPES.find((t) => t.type === activeType);

  const handleSwitch = (type) => {
    setActiveType(type);
    setShowExamples(false);
  };

  return (
    <SectionCard accentColor="var(--color-primary)">
      <div className="case-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          <span className="case-title">🗂️ Types of Adverbs</span>
          <span className="case-sublabel">
            Four core categories — each answers a different question
          </span>
        </div>
        <YoutubeChip videoId="erukMR-85ag" />
      </div>

      {/* Overview table */}
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
              {["Type", "Main question", "Common meaning", "Examples"].map(
                (h) => (
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
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {ADVERB_TYPES.map((t) => (
              <tr
                key={t.type}
                style={{
                  borderBottom: "1px solid var(--color-divider)",
                  cursor: "pointer",
                  background: activeType === t.type ? t.bg : "transparent",
                  transition: "background var(--transition-interactive)",
                }}
                onClick={() => handleSwitch(t.type)}
              >
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    fontWeight: 700,
                    color: t.color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.icon} {t.label}
                </td>
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {t.question}
                </td>
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    color: "var(--color-text)",
                  }}
                >
                  {t.meaning}
                </td>
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {t.words.slice(0, 4).join(", ")}…
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active type detail */}
      <div
        key={activeType}
        style={{
          padding: "var(--space-4)",
          background: active.bg,
          border: `1px solid ${active.color}`,
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "1.4em" }}>{active.icon}</span>
          <span
            style={{
              fontWeight: 800,
              color: active.color,
              fontSize: "var(--text-base)",
            }}
          >
            {active.label}
          </span>
          <span
            className="case-question"
            style={{
              color: active.color,
              borderColor: active.color,
              background: "transparent",
            }}
          >
            {active.question}
          </span>
        </div>
        {/* Word chips */}
        <div className="prep-chips">
          {active.words.map((w) => (
            <span
              key={w}
              className="prep-chip"
              style={{
                background: "var(--color-surface)",
                borderColor: active.color,
                color: active.color,
                fontWeight: 700,
              }}
            >
              {w}
            </span>
          ))}
        </div>
        <ExamplesBlock
          examples={active.examples}
          open={showExamples}
          onToggle={() => setShowExamples((o) => !o)}
        />
      </div>
    </SectionCard>
  );
}

// ─── POSITION + TMP SECTION ───────────────────────────────────────────────────

function PositionSection() {
  const [showTmp, setShowTmp] = useState(false);

  return (
    <SectionCard accentColor="var(--color-gold)">
      <div className="case-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          <span className="case-title">📐 Structure & Position</span>
          <span className="case-sublabel">
            Where adverbs sit in a sentence — and why it matters
          </span>
        </div>
        <YoutubeChip videoId="erukMR-85ag" />
      </div>

      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        Adverbs are flexible in sentence position, but their placement affects
        emphasis and rhythm. Adverbs that modify adjectives or other adverbs
        usually come directly before them.
      </p>

      {/* Position table */}
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
              {["Structure", "Typical position", "Example", "Note"].map((h) => (
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
            {POSITION_ROWS.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid var(--color-divider)" }}
              >
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.structure}
                </td>
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {row.position}
                </td>
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: "var(--color-gold)",
                  }}
                >
                  {row.example}
                </td>
                <td
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    color: "var(--color-text-faint)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TMP block */}
      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--color-gold-highlight)",
          border: "1px solid var(--color-gold)",
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
          <span
            style={{
              fontWeight: 800,
              color: "var(--color-gold)",
              fontSize: "var(--text-base)",
            }}
          >
            ⏱️ TMP Rule
          </span>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            {["Time", "Manner", "Place"].map((label, i) => (
              <span
                key={label}
                style={{
                  padding: "2px var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 800,
                  fontSize: "var(--text-xs)",
                  background: [
                    "var(--color-primary-highlight)",
                    "var(--color-gold-highlight)",
                    "var(--color-success-highlight)",
                  ][i],
                  color: [
                    "var(--color-primary)",
                    "var(--color-gold)",
                    "var(--color-success)",
                  ][i],
                  border: `1px solid ${["var(--color-primary)", "var(--color-gold)", "var(--color-success)"][i]}`,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          In neutral sentences, the natural order is{" "}
          <strong>Time → Manner → Place</strong>. This is the TMP sequence and
          sounds natural without extra emphasis.
        </p>
        <button
          className="examples-toggle"
          onClick={() => setShowTmp((o) => !o)}
          style={{ alignSelf: "flex-start" }}
        >
          <span>{showTmp ? "▲" : "▼"}</span>
          {showTmp ? "Hide TMP examples" : "Show TMP examples"}
        </button>
        {showTmp && (
          <div className="examples-list">
            {TMP_EXAMPLES.map((ex, i) => (
              <div
                className="example-row"
                key={i}
                style={{
                  animationDelay: `${i * 60}ms`,
                  borderLeftColor: "var(--color-gold)",
                }}
              >
                <span className="example-de">{ex.de}</span>
                <span className="example-en">{ex.en}</span>
                {ex.breakdown && (
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      flexWrap: "wrap",
                      marginTop: "var(--space-1)",
                    }}
                  >
                    {ex.breakdown.map((b, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          padding: "1px var(--space-2)",
                          borderRadius: "var(--radius-full)",
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          color: [
                            "var(--color-primary)",
                            "var(--color-gold)",
                            "var(--color-success)",
                          ][j],
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
                {ex.note && (
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-faint)",
                      fontStyle: "italic",
                    }}
                  >
                    💡 {ex.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── ADJ VS ADV SECTION ──────────────────────────────────────────────────────

function AdjVsAdvSection() {
  const [revealed, setRevealed] = useState({});
  const toggle = (i) => setRevealed((s) => ({ ...s, [i]: !s[i] }));

  return (
    <SectionCard accentColor="var(--color-error)">
      <div className="case-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          <span className="case-title">⚖️ Adverbs vs Adjectives</span>
          <span className="case-sublabel">
            Same word, different role — tap each row to reveal the reason
          </span>
        </div>
      </div>

      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        The same word can be an adjective in one sentence and function as an
        adverb in another. If it describes a noun before the noun, it is an
        adjective and may decline. If it describes a verb, adjective, or another
        adverb, it is an adverb — no ending needed.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {ADJ_VS_ADV.map((row, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: revealed[i]
                ? row.color === "var(--color-error)"
                  ? "var(--color-error-highlight)"
                  : row.color === "var(--color-success)"
                    ? "var(--color-success-highlight)"
                    : "var(--color-primary-highlight)"
                : "var(--color-surface-2)",
              border: `1px solid ${revealed[i] ? row.color : "var(--color-border)"}`,
              borderRadius: "var(--radius-lg)",
              cursor: "pointer",
              transition: "all var(--transition-interactive)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: "var(--text-base)",
                  color: "var(--color-text)",
                }}
              >
                {row.sentence}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "var(--text-xs)",
                  padding: "2px var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-surface)",
                  border: `1px solid ${row.color}`,
                  color: row.color,
                  whiteSpace: "nowrap",
                }}
              >
                {row.function}
              </span>
            </div>
            {revealed[i] && (
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  animation: "fade-up 240ms cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                💡 {row.why}
              </p>
            )}
            {!revealed[i] && (
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-faint)",
                  fontStyle: "italic",
                }}
              >
                Tap to see why →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Key rule box */}
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-surface-2)",
          border: "1px dashed var(--color-border)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
          }}
        >
          🔑 Key Rule
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          <span
            style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}
          >
            <span style={{ fontWeight: 700, color: "var(--color-error)" }}>
              Before a noun
            </span>{" "}
            → usually an <strong>adjective</strong> (needs ending)
          </span>
          <span
            style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}
          >
            <span style={{ fontWeight: 700, color: "var(--color-success)" }}>
              Not before a noun
            </span>
            , describing action/degree/context → usually an{" "}
            <strong>adverb</strong> (no ending)
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── CASES & TENSES SECTION ───────────────────────────────────────────────────

function CasesTensesSection() {
  const [showTenses, setShowTenses] = useState(false);

  return (
    <SectionCard accentColor="var(--color-success)">
      <div className="case-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          <span className="case-title">🔒 Cases, Tenses & Special Notes</span>
          <span className="case-sublabel">
            Adverbs don't decline — they stay the same across all tenses
          </span>
        </div>
        <YoutubeChip videoId="erukMR-85ag" />
      </div>

      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        Adverbs do not take cases and are generally not declined. Cases belong
        to nouns, pronouns, and articles. Tense belongs to the verb phrase —
        while the adverb remains unchanged.
      </p>

      {/* Tense table */}
      <div>
        <button
          className="examples-toggle"
          onClick={() => setShowTenses((o) => !o)}
          style={{ alignSelf: "flex-start" }}
        >
          <span>{showTenses ? "▲" : "▼"}</span>
          {showTenses
            ? "Hide tense examples"
            : "Show across all tenses (heute)"}
        </button>
        {showTenses && (
          <div
            className="boss-table-wrap"
            style={{ marginTop: "var(--space-3)" }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "var(--text-sm)",
              }}
            >
              <thead>
                <tr>
                  {["Tense", "German", "English"].map((h) => (
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
                {TENSE_EXAMPLES.map((row) => (
                  <tr
                    key={row.tense}
                    style={{ borderBottom: "1px solid var(--color-divider)" }}
                  >
                    <td
                      style={{
                        padding: "var(--space-2) var(--space-3)",
                        fontWeight: 700,
                        color: "var(--color-success)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.tense}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-2) var(--space-3)",
                        fontWeight: 600,
                      }}
                    >
                      {row.de.split("heute").map((part, i, arr) =>
                        i < arr.length - 1 ? (
                          <span key={i}>
                            {part}
                            <span
                              style={{
                                background: "var(--color-success-highlight)",
                                color: "var(--color-success)",
                                borderRadius: "var(--radius-sm)",
                                padding: "0 3px",
                                fontWeight: 800,
                              }}
                            >
                              heute
                            </span>
                          </span>
                        ) : (
                          <span key={i}>{part}</span>
                        ),
                      )}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-2) var(--space-3)",
                        color: "var(--color-text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      {row.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Special notes */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
          }}
        >
          Important Notes
        </span>
        {SPECIAL_NOTES.map((note, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "var(--space-3)",
              padding: "var(--space-3)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span style={{ fontSize: "1.1em", flexShrink: 0 }}>
              {note.icon}
            </span>
            <span
              style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}
            >
              {note.text}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── PRO TIPS SECTION ─────────────────────────────────────────────────────────

function ProTipsSection() {
  const [activeTip, setActiveTip] = useState(0);

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
        <div className="case-boss-title">⚡ Pro Tips</div>
        <YoutubeChip videoId="erukMR-85ag" />
      </div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        The fastest way to recognize an adverb is to ask what it modifies — if
        it is not directly modifying a noun, it is often an adverb.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {PRO_TIPS.map((tip, i) => (
          <button
            key={i}
            onClick={() => setActiveTip(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-full)",
              border: `1.5px solid ${activeTip === i ? "var(--color-primary)" : "var(--color-border)"}`,
              background:
                activeTip === i
                  ? "var(--color-primary-highlight)"
                  : "transparent",
              color:
                activeTip === i
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 600,
              fontSize: "var(--text-xs)",
              cursor: "pointer",
              transition: "all var(--transition-interactive)",
            }}
          >
            <span>{tip.icon}</span> {tip.title}
          </button>
        ))}
      </div>

      <div
        key={activeTip}
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
          <span style={{ fontSize: "1.2em" }}>{PRO_TIPS[activeTip].icon}</span>
          {PRO_TIPS[activeTip].title}
        </div>
        {PRO_TIPS[activeTip].body}
      </div>
    </div>
  );
}

// ─── COMMON MISTAKES SECTION ──────────────────────────────────────────────────

function MistakesSection() {
  const [revealed, setRevealed] = useState({});
  const toggle = (i) => setRevealed((s) => ({ ...s, [i]: !s[i] }));

  return (
    <div className="case-boss-card">
      <div className="case-boss-title">🚫 Common Learner Mistakes</div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        These are the most frequent errors learners make with German adverbs.
        Tap each card to reveal the fix.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {COMMON_MISTAKES.map((m, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              padding: "var(--space-4)",
              background: revealed[i]
                ? "var(--color-success-highlight)"
                : "var(--color-error-highlight)",
              border: `1px solid ${revealed[i] ? "var(--color-success)" : "var(--color-error)"}`,
              borderRadius: "var(--radius-lg)",
              cursor: "pointer",
              transition: "all var(--transition-interactive)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
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
              <span
                style={{
                  fontWeight: 800,
                  color: "var(--color-error)",
                  textDecoration: revealed[i] ? "line-through" : "none",
                  fontStyle: "italic",
                }}
              >
                ✗ {m.wrong}
              </span>
              {revealed[i] && (
                <span
                  style={{
                    fontWeight: 800,
                    color: "var(--color-success)",
                    fontStyle: "italic",
                    animation: "fade-up 240ms cubic-bezier(0.16,1,0.3,1) both",
                  }}
                >
                  ✓ {m.right}
                </span>
              )}
            </div>
            {revealed[i] ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  animation: "fade-up 240ms cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                💡 {m.reason}
              </p>
            ) : (
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-faint)",
                  fontStyle: "italic",
                }}
              >
                Tap to see the correct form →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Adverbs() {
  return (
    <div className="pronouns-page">
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
          Adverbs
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Indeclinable words that tell you <em>when</em>, <em>where</em>,{" "}
          <em>how</em>, and <em>why</em> — they never change form, no matter the
          case or tense.
        </p>
      </div>

      <div className="pronouns-sections">
        <AdverbTypesSection />
        <PositionSection />
        <AdjVsAdvSection />
        <CasesTensesSection />
        <ProTipsSection />
        <MistakesSection />
      </div>
    </div>
  );
}
