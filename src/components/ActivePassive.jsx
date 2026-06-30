import { useMemo, useState } from "react";

const C = {
  violet: {
    bg: "var(--color-primary-highlight)",
    border: "var(--color-primary)",
    text: "var(--color-primary)",
    soft: "var(--color-primary-highlight)",
  },
  green: {
    bg: "var(--color-success-highlight)",
    border: "var(--color-success)",
    text: "var(--color-success)",
    soft: "var(--color-success-highlight)",
  },
  amber: {
    bg: "var(--color-gold-highlight)",
    border: "var(--color-gold)",
    text: "var(--color-gold)",
    soft: "var(--color-gold-highlight)",
  },
  rose: {
    bg: "var(--color-error-highlight)",
    border: "var(--color-error)",
    text: "var(--color-error)",
    soft: "var(--color-error-highlight)",
  },
  blue: {
    bg: "var(--color-primary-highlight)",
    border: "var(--color-primary)",
    text: "var(--color-primary)",
    soft: "var(--color-primary-highlight)",
  },
};

const PROCESS_TENSES = [
  ["Präsens", "wird + Partizip II", "Der Brief wird geschrieben."],
  ["Präteritum", "wurde + Partizip II", "Der Brief wurde geschrieben."],
  [
    "Perfekt",
    "ist + Partizip II + worden",
    "Der Brief ist geschrieben worden.",
  ],
  [
    "Plusquamperfekt",
    "war + Partizip II + worden",
    "Der Brief war geschrieben worden.",
  ],
  [
    "Futur I",
    "wird + Partizip II + werden",
    "Der Brief wird geschrieben werden.",
  ],
  [
    "Futur II",
    "wird + Partizip II + worden + sein",
    "Der Brief wird geschrieben worden sein.",
  ],
];

const ACTIVE_PASSIVE_PAIRS = [
  ["Der Lehrer erklärt die Regel.", "Die Regel wird erklärt."],
  ["Die Firma baut das Haus.", "Das Haus wird gebaut."],
  [
    "Jemand hat den Vertrag unterschrieben.",
    "Der Vertrag ist unterschrieben worden.",
  ],
  [
    "Der Chef unterschreibt den Vertrag.",
    "Der Vertrag wird vom Chef unterschrieben.",
  ],
  [
    "Die Mechaniker reparieren das Auto.",
    "Das Auto wird von den Mechanikern repariert.",
  ],
  ["Jemand kontrolliert die Daten.", "Die Daten werden kontrolliert."],
];

const PROCESS_STATE_PAIRS = [
  [
    "Die Tür wird geschlossen.",
    "Someone is closing it now / the action is happening.",
    "Die Tür ist geschlossen.",
    "The door is in the closed state.",
  ],
  [
    "Das Fenster wird geöffnet.",
    "The opening process is happening.",
    "Das Fenster ist geöffnet.",
    "The window is open.",
  ],
  [
    "Der Bericht wird fertig geschrieben.",
    "The writing is still being carried out.",
    "Der Bericht ist fertig geschrieben.",
    "The report is already finished.",
  ],
];

const MODAL_PASSIVE = [
  ["Present", "Der Antrag muss geprüft werden."],
  ["Preterite", "Der Antrag musste geprüft werden."],
  ["Perfect", "Der Antrag hat geprüft werden müssen."],
  ["Subordinate clause", "..., weil der Antrag geprüft werden muss."],
  ["Perfect subordinate", "..., weil der Antrag hat geprüft werden müssen."],
];

const SUBORDINATE_EXAMPLES = [
  "..., weil das Auto repariert wird.",
  "..., weil das Auto repariert wurde.",
  "..., weil das Auto repariert worden ist.",
  "..., weil das Auto repariert werden muss.",
  "..., weil das Auto hat repariert werden müssen.",
];

const IMPERSONAL_PASSIVE = [
  "Hier wird gearbeitet.",
  "Es wird viel gelacht.",
  "Im Büro wird nicht geraucht.",
  "Es wird heute nicht gearbeitet.",
  "Heute wird nicht gearbeitet.",
];

const VON_DURCH = [
  ["Das Buch wurde von der Autorin geschrieben.", "person / agent"],
  ["Das Haus wurde durch ein Erdbeben zerstört.", "cause / force"],
  ["Die Daten wurden durch einen Fehler gelöscht.", "means / cause"],
];

const ALTERNATIVES = [
  ["Man-construction", "Man repariert das Auto.", "Das Auto wird repariert."],
  [
    "Reflexive/passive-like",
    "Das Buch liest sich gut.",
    "More idiomatic than heavy passive in some contexts.",
  ],
  [
    "Reflexive/passive-like",
    "Die Tür öffnet sich leicht.",
    "Natural alternative.",
  ],
  ["Adjectival/result", "Das Fenster ist offen.", "Result/state focus."],
  [
    "Adjectival/result",
    "Der Bericht ist fertig.",
    "Shorter than a full passive sentence.",
  ],
  [
    "Lassen-construction",
    "Das Problem lässt sich lösen.",
    "Very high-value B2 alternative.",
  ],
];

const GOOD_VERBS = [
  "bauen",
  "reparieren",
  "schreiben",
  "lesen",
  "unterschreiben",
  "produzieren",
  "öffnen",
  "schließen",
  "kontrollieren",
  "speichern",
  "liefern",
  "erklären",
];

const LIMITS = [
  "Passive works most naturally with transitive verbs that take an Akkusativ object.",
  "Not every active sentence turns into a natural passive sentence.",
  "Some intransitive verbs allow only impersonal passive.",
  "Reflexive constructions often resist straightforward passive.",
  "Some passive sentences are grammatical but stylistically unnatural.",
];

const COMMON_MISTAKES = [
  "Confusing state passive with process passive: Die Tür ist geschlossen ≠ Die Tür wird geschlossen.",
  "Using geworden instead of worden in passive perfect forms.",
  "Building process passive with sein instead of werden.",
  "Forgetting that the promoted object becomes nominative in passive.",
  "Overusing von where durch is more natural for means or cause.",
  "Producing overly heavy perfect passive with modals where Präteritum is more natural.",
  "Trying to passivize verbs that do not form a natural personal passive.",
  "Misplacing the verb cluster in subordinate clauses.",
  "Assuming every English passive maps directly to German passive.",
];

const B2_PATTERNS = [
  "Das Formular muss unterschrieben werden.",
  "Der Vertrag wurde bereits geprüft.",
  "Die Daten sind automatisch gespeichert worden.",
  "Hier wird nicht geparkt.",
  "Das Problem lässt sich lösen.",
  "Die Tür ist schon geschlossen.",
  "Nachdem der Bericht fertiggestellt worden war, wurde er versendet.",
];

const TABS = [
  ["core", "Core", "blue"],
  ["tenses", "Tenses", "violet"],
  ["contrast", "Process vs State", "green"],
  ["extras", "Advanced", "amber"],
  ["mistakes", "Mistakes", "rose"],
];

function Pill({ text, color = "blue" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "var(--radius-full)",
        background: C[color].soft,
        color: C[color].text,
        fontWeight: 800,
        fontSize: "var(--text-xs)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
}

function Card({ color = "blue", children, style = {} }) {
  return (
    <div
      style={{
        background: C[color].bg,
        border: `1.5px solid ${C[color].border}`,
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-4)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <div
      style={{
        fontWeight: 900,
        fontSize: "var(--text-lg)",
        color: "var(--color-text)",
        marginBottom: "var(--space-3)",
      }}
    >
      {children}
    </div>
  );
}

function MiniTable({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "var(--space-2) var(--space-3)",
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-muted)",
                  background: "var(--color-surface-2)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid var(--color-divider)",
                background:
                  i % 2 === 0 ? "transparent" : "var(--color-surface-2)",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    fontSize: "var(--text-sm)",
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

function ToggleCompare() {
  const [mode, setMode] = useState("active");

  const data = {
    active: {
      color: "blue",
      title: "Active",
      formula: "subject + verb + object",
      question: "Who does what?",
      example: "Der Techniker repariert das Gerät.",
    },
    process: {
      color: "violet",
      title: "Process Passive",
      formula: "werden + Partizip II",
      question: "What is being done?",
      example: "Das Gerät wird repariert.",
    },
    state: {
      color: "green",
      title: "State Passive",
      formula: "sein + Partizip II",
      question: "What state is it in now?",
      example: "Das Gerät ist repariert.",
    },
  };

  const current = data[mode];

  return (
    <Card color={current.color}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          flexWrap: "wrap",
          marginBottom: "var(--space-3)",
        }}
      >
        <div>
          <CardTitle>Voice Switch</CardTitle>
          <div
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
            }}
          >
            Switch between active, process passive, and state passive.
          </div>
        </div>
        <Pill text="Interactive" color={current.color} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          flexWrap: "wrap",
          marginBottom: "var(--space-4)",
        }}
      >
        <button
          onClick={() => setMode("active")}
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-full)",
            border:
              mode === "active"
                ? `2px solid ${C.blue.border}`
                : "1px solid var(--color-border)",
            background:
              mode === "active" ? C.blue.soft : "var(--color-surface-2)",
            color: mode === "active" ? C.blue.text : "var(--color-text-muted)",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Active
        </button>
        <button
          onClick={() => setMode("process")}
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-full)",
            border:
              mode === "process"
                ? `2px solid ${C.violet.border}`
                : "1px solid var(--color-border)",
            background:
              mode === "process" ? C.violet.soft : "var(--color-surface-2)",
            color:
              mode === "process" ? C.violet.text : "var(--color-text-muted)",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Process
        </button>
        <button
          onClick={() => setMode("state")}
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-full)",
            border:
              mode === "state"
                ? `2px solid ${C.green.border}`
                : "1px solid var(--color-border)",
            background:
              mode === "state" ? C.green.soft : "var(--color-surface-2)",
            color: mode === "state" ? C.green.text : "var(--color-text-muted)",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          State
        </button>
      </div>

      <div
        style={{
          background: "var(--color-surface-2)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "var(--space-2)",
          }}
        >
          Core idea
        </div>
        <div
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 900,
            color: current.text,
            marginBottom: "var(--space-2)",
          }}
        >
          {current.title}
        </div>
        <div
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-2)",
          }}
        >
          <strong>Formula:</strong> {current.formula}
        </div>
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-2)",
          }}
        >
          <strong>Question:</strong> {current.question}
        </div>
        <div style={{ color: "var(--color-text)", fontWeight: 700 }}>
          {current.example}
        </div>
      </div>
    </Card>
  );
}

function TransformLab() {
  const [index, setIndex] = useState(0);
  const pair = ACTIVE_PASSIVE_PAIRS[index];

  return (
    <Card color="amber">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          flexWrap: "wrap",
          marginBottom: "var(--space-3)",
        }}
      >
        <div>
          <CardTitle>Transformation Lab</CardTitle>
          <div
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
            }}
          >
            Step through active to passive transformations.
          </div>
        </div>
        <Pill
          text={`${index + 1} / ${ACTIVE_PASSIVE_PAIRS.length}`}
          color="amber"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginBottom: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            setIndex(
              (prev) =>
                (prev - 1 + ACTIVE_PASSIVE_PAIRS.length) %
                ACTIVE_PASSIVE_PAIRS.length,
            )
          }
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Prev
        </button>
        <button
          onClick={() =>
            setIndex((prev) => (prev + 1) % ACTIVE_PASSIVE_PAIRS.length)
          }
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Next
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-3)",
        }}
      >
        <div
          style={{
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-4)",
            border: `1px solid ${C.blue.border}`,
          }}
        >
          <div style={{ marginBottom: "var(--space-2)" }}>
            <Pill text="Active" color="blue" />
          </div>
          <div style={{ color: "var(--color-text)", fontWeight: 700 }}>
            {pair[0]}
          </div>
        </div>
        <div
          style={{
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-4)",
            border: `1px solid ${C.violet.border}`,
          }}
        >
          <div style={{ marginBottom: "var(--space-2)" }}>
            <Pill text="Passive" color="violet" />
          </div>
          <div style={{ color: "var(--color-text)", fontWeight: 700 }}>
            {pair[1]}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CoreTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "var(--space-4)",
        }}
      >
        <ToggleCompare />
        <Card color="blue">
          <CardTitle>Golden rules</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {[
              "Active asks: who does what?",
              "Process passive asks: what is being done?",
              "State passive asks: what state is the thing in now?",
              "Passive is easiest with transitive verbs.",
              "Not every active sentence should or can be turned into passive naturally.",
            ].map((rule, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3)",
                  border: "1px solid var(--color-divider)",
                  color: "var(--color-text)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {rule}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <TransformLab />

      <Card color="green">
        <CardTitle>When passive is used</CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
          }}
        >
          <div>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.2rem",
                color: "var(--color-text)",
                lineHeight: 1.7,
              }}
            >
              <li>The doer is unknown.</li>
              <li>The doer is unimportant.</li>
              <li>The action matters more than the doer.</li>
              <li>The style is formal, objective, or procedural.</li>
              <li>You want to sound less personal.</li>
            </ul>
          </div>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {[
              "Die Daten werden gespeichert.",
              "Das Formular muss ausgefüllt werden.",
              "Hier wird Deutsch gesprochen.",
            ].map((ex, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3)",
                  border: "1px solid var(--color-divider)",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {ex}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TensesTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="violet">
        <CardTitle>Process passive tense table</CardTitle>
        <MiniTable
          headers={["Tense", "Formula", "Example"]}
          rows={PROCESS_TENSES}
        />
      </Card>

      <Card color="rose">
        <CardTitle>Important point</CardTitle>
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          <div
            style={{
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-3)",
              border: `1px solid ${C.green.border}`,
            }}
          >
            <strong style={{ color: C.green.text }}>
              Correct passive perfect:
            </strong>{" "}
            <span style={{ color: "var(--color-text)" }}>
              Der Brief ist geschrieben worden.
            </span>
          </div>
          <div
            style={{
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-3)",
              border: `1px solid ${C.rose.border}`,
            }}
          >
            <strong style={{ color: C.rose.text }}>Not:</strong>{" "}
            <span style={{ color: "var(--color-text)" }}>
              Der Brief ist geschrieben geworden.
            </span>
          </div>
          <div
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.6,
            }}
          >
            In perfect-family passive forms, German uses <strong>worden</strong>
            , not <strong>geworden</strong>.
          </div>
        </div>
      </Card>

      <Card color="amber">
        <CardTitle>Passive with modal verbs</CardTitle>
        <div
          style={{
            marginBottom: "var(--space-3)",
            color: "var(--color-text)",
            fontSize: "var(--text-sm)",
          }}
        >
          <strong>Formula:</strong> modal + Partizip II + werden
        </div>
        <MiniTable headers={["Form", "Example"]} rows={MODAL_PASSIVE} />
        <div
          style={{
            marginTop: "var(--space-3)",
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.6,
          }}
        >
          Perfect modal passive can become very heavy, so German often prefers
          Präteritum in real use.
        </div>
      </Card>
    </div>
  );
}

function ContrastTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="green">
        <CardTitle>Process passive vs state passive</CardTitle>
        <MiniTable
          headers={["Process passive", "Meaning", "State passive", "Meaning"]}
          rows={PROCESS_STATE_PAIRS}
        />
      </Card>

      <Card color="blue">
        <CardTitle>Agent phrases: von vs durch</CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
            marginBottom: "var(--space-3)",
          }}
        >
          <div
            style={{
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-3)",
              border: `1px solid ${C.blue.border}`,
            }}
          >
            <div
              style={{
                color: C.blue.text,
                fontWeight: 900,
                marginBottom: "var(--space-2)",
              }}
            >
              von + Dativ
            </div>
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              Usually the agent, especially a person or institution.
            </div>
          </div>
          <div
            style={{
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-3)",
              border: `1px solid ${C.amber.border}`,
            }}
          >
            <div
              style={{
                color: C.amber.text,
                fontWeight: 900,
                marginBottom: "var(--space-2)",
              }}
            >
              durch + Akkusativ
            </div>
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              Often means cause, means, mechanism, or intermediary force.
            </div>
          </div>
        </div>
        <MiniTable headers={["Example", "Use"]} rows={VON_DURCH} />
      </Card>

      <Card color="violet">
        <CardTitle>Subordinate clauses</CardTitle>
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-3)",
          }}
        >
          In subordinate clauses, the finite verb goes to the end, and the
          verbal complex gathers there too.
        </div>
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          {SUBORDINATE_EXAMPLES.map((ex, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-3)",
                border: "1px solid var(--color-divider)",
                color: "var(--color-text)",
                fontWeight: 700,
              }}
            >
              {ex}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdvancedTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="amber">
        <CardTitle>Impersonal passive</CardTitle>
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-3)",
          }}
        >
          Common in notices, rules, descriptions, and generalized statements.
        </div>
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          {IMPERSONAL_PASSIVE.map((ex, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-3)",
                border: "1px solid var(--color-divider)",
                color: "var(--color-text)",
                fontWeight: 700,
              }}
            >
              {ex}
            </div>
          ))}
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <Card color="green">
          <CardTitle>Verbs that work well</CardTitle>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}
          >
            {GOOD_VERBS.map((v, i) => (
              <span
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-divider)",
                  borderRadius: "var(--radius-full)",
                  padding: "4px 10px",
                  color: "var(--color-text)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </Card>

        <Card color="rose">
          <CardTitle>Limits of passive</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {LIMITS.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3)",
                  border: "1px solid var(--color-divider)",
                  color: "var(--color-text)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card color="blue">
        <CardTitle>Alternatives to passive</CardTitle>
        <MiniTable
          headers={["Type", "Example", "Why it matters"]}
          rows={ALTERNATIVES}
        />
      </Card>

      <Card color="violet">
        <CardTitle>High-value B2 patterns</CardTitle>
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          {B2_PATTERNS.map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-3)",
                border: "1px solid var(--color-divider)",
                color: "var(--color-text)",
                fontWeight: 700,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MistakesTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="rose">
        <CardTitle>Common mistakes</CardTitle>
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          {COMMON_MISTAKES.map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-3)",
                border: "1px solid var(--color-divider)",
                color: "var(--color-text)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </Card>

      <Card color="green">
        <CardTitle>Ultra-short memory formula</CardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "var(--space-3)",
          }}
        >
          {[
            "Active = subject does action.",
            "Passive process = werden + Partizip II.",
            "Passive state = sein + Partizip II.",
            "Perfect passive = ist + Partizip II + worden.",
            "Modal passive = modal + Partizip II + werden.",
            "If the sentence gets too heavy, prefer man, Präteritum, or another simpler structure.",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                border: `1px solid ${[C.blue.border, C.violet.border, C.green.border, C.amber.border, C.rose.border, C.blue.border][i]}`,
                color: "var(--color-text)",
                fontWeight: 700,
                lineHeight: 1.55,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ActivePassive() {
  const [tab, setTab] = useState("core");

  const renderTab = useMemo(() => {
    switch (tab) {
      case "core":
        return <CoreTab />;
      case "tenses":
        return <TensesTab />;
      case "contrast":
        return <ContrastTab />;
      case "extras":
        return <AdvancedTab />;
      case "mistakes":
        return <MistakesTab />;
      default:
        return null;
    }
  }, [tab]);

  return (
    <div className="pronouns-page">
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <span style={{ fontSize: "2rem" }}>⚙️</span>
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
                Active and Passive
              </h1>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  margin: 0,
                }}
              >
                Active · Process passive · State passive · Tenses · Alternatives
              </p>
            </div>
          </div>
          <div
            style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
          >
            <Pill text="Interactive" color="violet" />
            <Pill text="B1–B2" color="green" />
            <Pill text="Dark-mode ready" color="amber" />
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
        {TABS.map(([id, label, color]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
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
              background: tab === id ? C[color].border : "transparent",
              color:
                tab === id
                  ? "var(--color-surface-2)"
                  : "var(--color-text-muted)",
              boxShadow: tab === id ? "var(--shadow-sm)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {renderTab}
      </div>
    </div>
  );
}
