import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./pronouns.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CASES = [
  {
    id: "nominative",
    label: "Nominative",
    sublabel: "Subject — wer? / was?",
    color: "nom",
    question: "Who/what does the action?",
    rows: [
      { person: "1st singular", english: "I", german: "ich" },
      {
        person: "2nd singular informal",
        english: "you (informal, singular)",
        german: "du",
      },
      { person: "3rd singular masculine", english: "he", german: "er" },
      { person: "3rd singular feminine", english: "she", german: "sie" },
      { person: "3rd singular neuter", english: "it", german: "es" },
      { person: "1st plural", english: "we", german: "wir" },
      {
        person: "2nd plural informal",
        english: "you (informal, plural)",
        german: "ihr",
      },
      { person: "3rd plural", english: "they", german: "sie" },
      {
        person: "2nd person formal (sg. & pl.)",
        english: "you (formal, singular & plural)",
        german: "Sie",
      },
    ],
    examples: [
      { de: "Ich arbeite heute.", en: "I am working today." },
      { de: "Du kommst spät.", en: "You are coming late." },
      { de: "Er liest ein Buch.", en: "He is reading a book." },
      { de: "Sie trinkt Kaffee.", en: "She is drinking coffee." },
      { de: "Es regnet heute.", en: "It is raining today." },
      { de: "Wir wohnen in Berlin.", en: "We live in Berlin." },
      { de: "Ihr lernt Deutsch.", en: "You (all) are learning German." },
      { de: "Sie spielen Fußball.", en: "They are playing football." },
      { de: "Sie kommen aus Spanien.", en: "You (formal) come from Spain." },
    ],
  },
  {
    id: "accusative",
    label: "Accusative",
    sublabel: "Direct object — wen? / was?",
    color: "acc",
    question: "Whom/what is directly acted upon?",
    rows: [
      { person: "1st singular", english: "me", german: "mich" },
      {
        person: "2nd singular informal",
        english: "you (informal, singular)",
        german: "dich",
      },
      { person: "3rd singular masculine", english: "him", german: "ihn" },
      { person: "3rd singular feminine", english: "her", german: "sie" },
      { person: "3rd singular neuter", english: "it", german: "es" },
      { person: "1st plural", english: "us", german: "uns" },
      {
        person: "2nd plural informal",
        english: "you (informal, plural)",
        german: "euch",
      },
      { person: "3rd plural", english: "them", german: "sie" },
      {
        person: "2nd person formal (sg. & pl.)",
        english: "you (formal, singular & plural)",
        german: "Sie",
      },
    ],
    examples: [
      { de: "Er sieht mich.", en: "He sees me." },
      { de: "Ich höre dich.", en: "I hear you." },
      { de: "Ich kenne ihn.", en: "I know him." },
      { de: "Wir besuchen sie.", en: "We are visiting her." },
      { de: "Ich habe es.", en: "I have it." },
      { de: "Sie ruft uns an.", en: "She calls us." },
      { de: "Ich lade euch ein.", en: "I invite you (all)." },
      { de: "Ich treffe sie morgen.", en: "I am meeting them tomorrow." },
      { de: "Ich suche Sie.", en: "I am looking for you (formal)." },
    ],
  },
  {
    id: "dative",
    label: "Dative",
    sublabel: "Indirect object — wem?",
    color: "dat",
    question: "To/for whom?",
    rows: [
      { person: "1st singular", english: "to/for me", german: "mir" },
      {
        person: "2nd singular informal",
        english: "to/for you (informal, singular)",
        german: "dir",
      },
      {
        person: "3rd singular masculine",
        english: "to/for him",
        german: "ihm",
      },
      { person: "3rd singular feminine", english: "to/for her", german: "ihr" },
      { person: "3rd singular neuter", english: "to/for it", german: "ihm" },
      { person: "1st plural", english: "to/for us", german: "uns" },
      {
        person: "2nd plural informal",
        english: "to/for you (informal, plural)",
        german: "euch",
      },
      { person: "3rd plural", english: "to/for them", german: "ihnen" },
      {
        person: "2nd person formal (sg. & pl.)",
        english: "to/for you (formal, singular & plural)",
        german: "Ihnen",
      },
    ],
    examples: [
      { de: "Das gehört mir.", en: "That belongs to me." },
      { de: "Ich helfe dir.", en: "I help you." },
      { de: "Ich gebe ihm das Buch.", en: "I give him the book." },
      { de: "Ich schreibe ihr eine E‑Mail.", en: "I write her an email." },
      { de: "Ich antworte ihm sofort.", en: "I answer it immediately." },
      { de: "Er schenkt uns Blumen.", en: "He gives us flowers." },
      {
        de: "Ich erkläre euch die Aufgabe.",
        en: "I explain the exercise to you (all).",
      },
      { de: "Ich erzähle ihnen eine Geschichte.", en: "I tell them a story." },
      { de: "Ich zeige Ihnen die Stadt.", en: "I show you (formal) the city." },
    ],
  },
  {
    id: "genitive",
    label: "Genitive",
    sublabel: "Possession — wessen?",
    color: "gen",
    question: "Of whom / whose?",
    rows: [
      { person: "1st singular", english: "of me / mine", german: "meiner" },
      {
        person: "2nd singular informal",
        english: "of you (informal, sg.) / yours",
        german: "deiner",
      },
      {
        person: "3rd singular masculine",
        english: "of him / his / of it / its",
        german: "seiner",
      },
      {
        person: "3rd singular feminine",
        english: "of her / hers / of it / its",
        german: "ihrer",
      },
      {
        person: "3rd singular neuter",
        english: "of it / its",
        german: "seiner",
      },
      { person: "1st plural", english: "of us / ours", german: "unser" },
      {
        person: "2nd plural informal",
        english: "of you all / yours (plural, informal)",
        german: "euer",
      },
      { person: "3rd plural", english: "of them / theirs", german: "ihrer" },
      {
        person: "2nd person formal (sg. & pl.)",
        english: "of you (formal) / yours (formal)",
        german: "Ihrer",
      },
    ],
    examples: [
      {
        de: "Statt meiner kommt heute meine Kollegin.",
        en: "Instead of me, my colleague is coming today.",
      },
      { de: "Wir gedachten deiner.", en: "We commemorated you." },
      {
        de: "Wir waren uns seiner sicher.",
        en: "We were sure of him / of it.",
      },
      { de: "Wir erinnerten uns ihrer.", en: "We remembered her." },
      {
        de: "Das Problem war groß; wir waren uns seiner bewusst.",
        en: "The problem was big; we were aware of it.",
      },
      { de: "Er nahm sich unserer an.", en: "He took care of us." },
      { de: "Sie bedurfte euer nicht.", en: "She did not need you (all)." },
      { de: "Wir waren ihrer sicher.", en: "We were sure of them." },
      { de: "Wir gedachten Ihrer.", en: "We commemorated you (formal)." },
    ],
  },
];

const CASE_BOSSES = {
  verbs: [
    {
      verb: "helfen",
      case: "Dativ",
      example: "Ich helfe dir.",
      en: "I help you.",
    },
    {
      verb: "danken",
      case: "Dativ",
      example: "Ich danke dir.",
      en: "I thank you.",
    },
    {
      verb: "gehören",
      case: "Dativ",
      example: "Das gehört mir.",
      en: "That belongs to me.",
    },
    {
      verb: "gefallen",
      case: "Dativ",
      example: "Das Buch gefällt ihm.",
      en: "He likes the book.",
    },
    {
      verb: "glauben",
      case: "Dativ",
      example: "Ich glaube dir.",
      en: "I believe you.",
    },
    {
      verb: "passen",
      case: "Dativ",
      example: "Der Mantel passt ihr.",
      en: "The coat fits her.",
    },
  ],
  prepsAcc: ["durch", "für", "gegen", "ohne", "um"],
  prepsDat: ["aus", "bei", "mit", "nach", "seit", "von", "zu"],
  prepsGen: ["anstatt / statt", "trotz", "während", "wegen"],
  wechsel: [
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
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function RevealCell({ german, revealed, index, onReveal }) {
  return (
    <td className="td-answer">
      {revealed ? (
        <span
          className="answer-revealed"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {german}
        </span>
      ) : (
        <button
          className="reveal-btn"
          onClick={() => onReveal(index)}
          aria-label={`Reveal German pronoun`}
        >
          <span className="reveal-btn-line" />
          <span className="reveal-btn-text">tap</span>
        </button>
      )}
    </td>
  );
}

function CaseSection({ caseData }) {
  const [revealed, setRevealed] = useState(
    Array(caseData.rows.length).fill(false),
  );
  const [showExamples, setShowExamples] = useState(false);
  const allRevealed = revealed.every(Boolean);

  const handleReveal = (i) => {
    const next = [...revealed];
    next[i] = true;
    setRevealed(next);
  };

  const toggleAll = () => {
    if (allRevealed) {
      setRevealed(Array(caseData.rows.length).fill(false));
    } else {
      setRevealed(Array(caseData.rows.length).fill(true));
    }
  };

  const revealedCount = revealed.filter(Boolean).length;

  return (
    <section className={`case-section case-${caseData.color}`}>
      {/* Section header */}
      <div className="case-header">
        <div className="case-header-left">
          <div>
            <h2 className="case-title">{caseData.label} Case</h2>
            <p className="case-sublabel">{caseData.sublabel}</p>
          </div>
        </div>
        <div className="case-header-right">
          <span className="progress-badge">
            {revealedCount}/{caseData.rows.length}
          </span>
          <button className="btn-reset" onClick={toggleAll}>
            {allRevealed ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                Conceal all
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Reveal all
              </>
            )}
          </button>
        </div>
      </div>

      {/* Question hint */}
      <div className="case-question">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        {caseData.question}
      </div>

      {/* Pronoun table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="td-index">#</th>
              <th>Person</th>
              <th>English</th>
              <th>🇩🇪 German</th>
            </tr>
          </thead>
          <tbody>
            {caseData.rows.map((row, i) => (
              <tr key={i} className={revealed[i] ? "revealed" : ""}>
                <td className="td-index">{i + 1}</td>
                <td className="td-prompt">{row.person}</td>
                <td className="td-english">{row.english}</td>
                <RevealCell
                  german={row.german}
                  revealed={revealed[i]}
                  index={i}
                  onReveal={handleReveal}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Examples toggle */}
      <button
        className="examples-toggle"
        onClick={() => setShowExamples((s) => !s)}
        aria-expanded={showExamples}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: showExamples ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {showExamples ? "Hide" : "Show"} example sentences
      </button>

      {showExamples && (
        <div className="examples-list">
          {caseData.examples.map((ex, i) => (
            <div
              key={i}
              className="example-row"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="example-de">{ex.de}</span>
              <span className="example-en">{ex.en}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Pronouns() {
  const [activeTab, setActiveTab] = useState("all");

  const visibleCases =
    activeTab === "all" ? CASES : CASES.filter((c) => c.id === activeTab);

  return (
    <div className="container pronouns-page">
      {/* Back link */}
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      {/* Page hero */}
      <header>
        <div className="logo-wrap">
          <svg
            className="logo-svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-label="Pronouns icon"
          >
            <circle
              cx="14"
              cy="14"
              r="13"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <text
              x="14"
              y="19"
              textAnchor="middle"
              fontSize="13"
              fontFamily="Georgia, serif"
              fill="currentColor"
              fontWeight="bold"
            >
              案
            </text>
          </svg>
          <div>
            <div className="logo-title">Personal Pronouns</div>
            <div className="logo-sub">
              Nominative · Accusative · Dative · Genitive
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="tabs-row">
          {[
            { id: "all", label: "All Cases" },
            ...CASES.map((c) => ({ id: c.id, label: c.label })),
          ].map((t) => (
            <button
              key={t.id}
              className={`tab-button${activeTab === t.id ? " tab-active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Case sections */}
      <div className="pronouns-sections">
        {visibleCases.map((c) => (
          <CaseSection key={c.id} caseData={c} />
        ))}
      </div>

      {/* Case Boss reference card */}
      <section className="case-boss-card">
        <h2 className="case-boss-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Case‑Boss Cheat Sheet
        </h2>

        <div className="boss-grid">
          {/* Dative verbs */}
          <div className="boss-block">
            <div className="boss-block-label">Dative Verbs</div>
            <div className="boss-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Verb</th>
                    <th>Example</th>
                    <th>English</th>
                  </tr>
                </thead>
                <tbody>
                  {CASE_BOSSES.verbs.map((v, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{v.verb}</strong>
                      </td>
                      <td className="boss-example">{v.example}</td>
                      <td className="boss-en">{v.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prepositions */}
          <div className="boss-block">
            <div className="boss-block-label">Prepositions by Case</div>
            <div className="prep-groups">
              <div className="prep-group prep-acc">
                <span className="prep-case-tag">Accusative</span>
                <div className="prep-chips">
                  {CASE_BOSSES.prepsAcc.map((p) => (
                    <span key={p} className="prep-chip">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="prep-note">durch, für, gegen, ohne, um</div>
              </div>
              <div className="prep-group prep-dat">
                <span className="prep-case-tag">Dative</span>
                <div className="prep-chips">
                  {CASE_BOSSES.prepsDat.map((p) => (
                    <span key={p} className="prep-chip">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="prep-note">
                  aus, bei, mit, nach, seit, von, zu
                </div>
              </div>
              <div className="prep-group prep-gen">
                <span className="prep-case-tag">Genitive</span>
                <div className="prep-chips">
                  {CASE_BOSSES.prepsGen.map((p) => (
                    <span key={p} className="prep-chip">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="prep-note">statt, trotz, während, wegen</div>
              </div>
              <div className="prep-group prep-wechsel">
                <span className="prep-case-tag">
                  Two‑way (Wo→Dat / Wohin→Akk)
                </span>
                <div className="prep-chips">
                  {CASE_BOSSES.wechsel.map((p) => (
                    <span key={p} className="prep-chip">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mental model steps */}
        <div className="mental-model">
          <div className="mental-model-title">Practical Mental Model</div>
          <ol className="mental-steps">
            <li>
              <strong>Step 1</strong> — Find the subject →{" "}
              <span className="case-tag-nom">Nominative</span>
            </li>
            <li>
              <strong>Step 2</strong> — Is there a case‑boss (verb / preposition
              / adjective)? Use its demanded case.
            </li>
            <li>
              <strong>Step 3</strong> — No case‑boss? Direct object →{" "}
              <span className="case-tag-acc">Accusative</span> · Indirect
              "to/for" → <span className="case-tag-dat">Dative</span> ·
              Possession → <span className="case-tag-gen">Genitive</span>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
