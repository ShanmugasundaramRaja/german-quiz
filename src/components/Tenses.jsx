import React, { useState, useMemo } from "react";

const tensesData = {
  meta: {
    title: "German Tenses",
    scope: "A1 to B2",
    purpose:
      "Complete reference for all six German tenses: forms, uses, contrast patterns, spoken vs written register, modal and passive interaction, and common mistakes.",
  },

  goldenRules: [
    "German often uses Präsens for the future when the time is already clear.",
    "Spoken German usually prefers Perfekt for past events.",
    "Written narration often prefers Präteritum.",
    "Modal verbs, sein, haben, and some very common verbs often appear in Präteritum even in speech.",
    "Tense choice and word order are separate issues: tense changes the verb form, while clause type changes where the finite verb goes.",
  ],

  masterTable: [
    {
      tense: "Präsens",
      formula: "finite verb",
      mainUse: "Present, general truth, scheduled future",
      example: "Ich lerne Deutsch.",
      level: "A1+",
    },
    {
      tense: "Präteritum",
      formula: "past stem + ending",
      mainUse:
        "Narrative past, formal written past, common past of modals/sein/haben",
      example: "Ich lernte Deutsch.",
      level: "A2+",
    },
    {
      tense: "Perfekt",
      formula: "haben/sein + Partizip II",
      mainUse: "Spoken past, completed event",
      example: "Ich habe Deutsch gelernt.",
      level: "A2+",
    },
    {
      tense: "Plusquamperfekt",
      formula: "hatte/war + Partizip II",
      mainUse: "Earlier past before another past",
      example: "Ich hatte Deutsch gelernt.",
      level: "B1",
    },
    {
      tense: "Futur I",
      formula: "werden + infinitive",
      mainUse: "Future, intention, prediction, assumption about present",
      example: "Ich werde Deutsch lernen.",
      level: "A2-B1",
    },
    {
      tense: "Futur II",
      formula: "werden + Partizip II + haben/sein",
      mainUse: "Future completion, assumption about completed past",
      example: "Ich werde Deutsch gelernt haben.",
      level: "B2",
    },
  ],

  tenses: [
    {
      id: "prasens",
      name: "Präsens",
      tag: "A1+",
      color: "var(--color-success)",
      highlight: "var(--color-success-highlight)",
      summary:
        "Präsens is much broader in German than 'present tense' suggests. It covers present actions, habits, general truths, instructions, and very often future meaning when a time marker already makes the future clear.",
      coreUses: [
        { label: "Present action", example: "Ich arbeite gerade." },
        { label: "Habit", example: "Ich arbeite jeden Tag." },
        { label: "General truth", example: "Wasser kocht bei 100 Grad." },
        { label: "Scheduled future", example: "Morgen fahre ich nach Berlin." },
        { label: "Instruction style", example: "Zuerst öffnest du die Datei." },
      ],
      structure: [
        { label: "Main clause", example: "Ich lerne heute." },
        { label: "Yes/no question", example: "Lernst du heute?" },
        { label: "Subordinate clause", example: "..., weil ich heute lerne." },
      ],
      pointsToWatch: [
        "Do not overuse Futur I where plain Präsens sounds more natural.",
        "Präsens plus time expression is often the most idiomatic future form in everyday German.",
      ],
    },
    {
      id: "prateritum",
      name: "Präteritum",
      tag: "A2+",
      color: "var(--color-primary)",
      highlight: "var(--color-primary-highlight)",
      summary:
        "Präteritum is the simple past. It is very common in written German, storytelling, reports, literature, and formal narration. In spoken German it is especially common with sein, haben, and modal verbs.",
      coreUses: [
        {
          label: "Written narration",
          example: "Er ging nach Hause und öffnete die Tür.",
        },
        {
          label: "Formal report style",
          example: "Der Vertrag trat gestern in Kraft.",
        },
        {
          label: "Spoken with common verbs",
          example: "Ich war müde. Ich hatte keine Zeit. Ich musste arbeiten.",
        },
      ],
      structure: [
        { label: "Main clause", example: "Ich lernte." },
        { label: "Subordinate clause", example: "..., weil ich lernte." },
      ],
      pointsToWatch: [
        "In everyday conversation, many full lexical verbs prefer Perfekt instead.",
        "Modal verbs often sound more natural in Präteritum than in Perfekt in spoken German: Ich konnte nicht kommen. / Ich musste lange arbeiten.",
      ],
    },
    {
      id: "perfekt",
      name: "Perfekt",
      tag: "A2+",
      color: "var(--color-success)",
      highlight: "var(--color-success-highlight)",
      summary:
        "Perfekt is the most important past tense in spoken German. It expresses completed actions in the past and is formed with haben or sein plus Partizip II.",
      formula: "haben / sein + Partizip II",
      coreUses: [
        { label: "Spoken past", example: "Ich habe den Bericht geschrieben." },
        {
          label: "Recent or relevant past",
          example: "Wir sind spät angekommen.",
        },
        {
          label: "Informal narration and conversation",
          example: "Was hast du gestern gemacht?",
        },
      ],
      habenSein: {
        habenRule: "Use haben with most verbs.",
        seinRule:
          "Use sein with verbs of movement from one place to another, verbs of change of state, and sein/werden/bleiben.",
        seinGroups: [
          "Movement: gehen, fahren, kommen",
          "Change of state: einschlafen, aufstehen, sterben",
          "sein, werden, bleiben",
        ],
        table: [
          { verb: "machen", perfekt: "ich habe gemacht", auxiliary: "haben" },
          { verb: "lesen", perfekt: "ich habe gelesen", auxiliary: "haben" },
          { verb: "fahren", perfekt: "ich bin gefahren", auxiliary: "sein" },
          { verb: "kommen", perfekt: "ich bin gekommen", auxiliary: "sein" },
          {
            verb: "einschlafen",
            perfekt: "ich bin eingeschlafen",
            auxiliary: "sein",
          },
        ],
      },
      structure: [
        { label: "Main clause", example: "Ich habe das Buch gelesen." },
        {
          label: "Subordinate clause",
          example: "..., weil ich das Buch gelesen habe.",
        },
      ],
      pointsToWatch: [
        "The participle usually goes near the end in main clauses.",
        "In subordinate clauses the auxiliary goes to the end: weil ich das Buch gelesen habe.",
        "Do not choose sein just because a verb involves activity; change of place or state matters more than mere action.",
      ],
    },
    {
      id: "plusquamperfekt",
      name: "Plusquamperfekt",
      tag: "B1",
      color: "var(--color-primary)",
      highlight: "var(--color-primary-highlight)",
      summary:
        "Plusquamperfekt expresses an action that happened before another past action. It is the 'past of the past.'",
      formula: "hatte / war + Partizip II",
      coreUses: [
        {
          label: "Earlier past before later past",
          example: "Nachdem er angekommen war, begann das Meeting.",
        },
        {
          label: "Earlier past with bevor",
          example: "Ich hatte schon gegessen, bevor sie kam.",
        },
      ],
      structure: [
        { label: "Main clause", example: "Ich hatte gegessen." },
        {
          label: "Subordinate clause",
          example: "..., weil ich schon gegessen hatte.",
        },
      ],
      pointsToWatch: [
        "It usually appears together with another past reference.",
        "Especially common with temporal structures like nachdem and bevor.",
        "If there is no second past reference, Perfekt or Präteritum is often enough.",
      ],
    },
    {
      id: "futur1",
      name: "Futur I",
      tag: "A2-B1",
      color: "var(--color-primary)",
      highlight: "var(--color-primary-highlight)",
      summary:
        "Futur I is formed with werden + infinitive. It can express future meaning, but also prediction, intention, or assumption about the present.",
      formula: "werden + infinitive",
      coreUses: [
        { label: "Future", example: "Ich werde morgen arbeiten." },
        { label: "Promise/intention", example: "Ich werde dir helfen." },
        { label: "Prediction", example: "Es wird bald regnen." },
        {
          label: "Assumption about present",
          example: "Er wird jetzt zu Hause sein.",
        },
      ],
      structure: [
        { label: "Main clause", example: "Ich werde morgen kommen." },
        {
          label: "Subordinate clause",
          example: "..., weil ich morgen kommen werde.",
        },
      ],
      pointsToWatch: [
        "German often uses Präsens instead: Morgen komme ich.",
        "Futur I is used when you want emphasis on prediction, distance, or certainty.",
        "The assumption use is very important: Wo ist Anna? — Sie wird im Büro sein.",
      ],
    },
    {
      id: "futur2",
      name: "Futur II",
      tag: "B2",
      color: "var(--color-error)",
      highlight: "rgba(201,96,96,0.12)",
      summary:
        "Futur II is formed with werden + Partizip II + haben/sein. It is less frequent but important at B2.",
      formula: "werden + Partizip II + haben/sein",
      coreUses: [
        {
          label: "Completed future",
          example: "Bis morgen werde ich den Bericht geschrieben haben.",
        },
        {
          label: "Assumption about completed past",
          example: "Er wird schon angekommen sein.",
        },
      ],
      structure: [
        {
          label: "Main clause",
          example: "Ich werde es bis Freitag erledigt haben.",
        },
        {
          label: "Subordinate clause",
          example: "..., weil ich es bis Freitag erledigt haben werde.",
        },
      ],
      pointsToWatch: [
        "Futur II is often replaced in everyday speech by simpler constructions.",
        "At B2, mainly needed for deadlines, formal precision, and completed assumptions.",
      ],
    },
  ],

  contrastMap: [
    {
      contrast: "Präsens vs Futur I",
      difference: "Future already clear vs explicitly predicted/intended",
      examples: ["Morgen komme ich.", "Ich werde morgen kommen."],
    },
    {
      contrast: "Perfekt vs Präteritum",
      difference: "Spoken/informal past vs written/narrative past",
      examples: ["Ich habe das gesehen.", "Ich sah das."],
    },
    {
      contrast: "Perfekt vs Plusquamperfekt",
      difference: "Completed past vs earlier-than-past",
      examples: ["Ich habe gegessen.", "Ich hatte gegessen, bevor er kam."],
    },
    {
      contrast: "Futur I vs Futur II",
      difference: "Future action vs future completed action",
      examples: ["Ich werde arbeiten.", "Ich werde gearbeitet haben."],
    },
    {
      contrast: "Präteritum vs Plusquamperfekt",
      difference: "Past event vs earlier past",
      examples: ["Er kam, nachdem ich gegangen war."],
    },
  ],

  spokenVsWritten: {
    speech: {
      preferred: [
        "Präsens",
        "Perfekt",
        "Präteritum of sein, haben, modal verbs",
      ],
      examples: [
        "Ich bin gestern nach Hause gegangen.",
        "Ich war müde.",
        "Ich musste arbeiten.",
      ],
    },
    writing: {
      preferred: [
        "Präteritum for narration",
        "Plusquamperfekt for earlier background",
        "Präsens in commentary or factual explanation",
        "Futur forms for projection and formal tone",
      ],
      narrativeFlow:
        "Er öffnete die Tür. Er hatte den Schlüssel schon vorbereitet. Dann ging er hinein.",
    },
  },

  modalVerbsAcrossTenses: [
    { tense: "Präsens", examples: ["Ich muss arbeiten.", "Ich kann kommen."] },
    {
      tense: "Präteritum (preferred in speech)",
      examples: ["Ich musste arbeiten.", "Ich konnte kommen."],
    },
    {
      tense: "Perfekt (modal governing verb)",
      examples: ["Ich habe arbeiten müssen.", "Ich habe kommen können."],
      note: "In subordinate clauses: ..., weil ich habe arbeiten müssen.",
    },
    {
      tense: "Plusquamperfekt",
      examples: [
        "Ich hatte arbeiten müssen.",
        "..., weil ich hatte arbeiten müssen.",
      ],
    },
    { tense: "Futur I", examples: ["Ich werde arbeiten müssen."] },
  ],

  passiveAcrossTenses: [
    { tense: "Präsens", example: "Das Auto wird repariert." },
    { tense: "Präteritum", example: "Das Auto wurde repariert." },
    { tense: "Perfekt", example: "Das Auto ist repariert worden." },
    { tense: "Plusquamperfekt", example: "Das Auto war repariert worden." },
    { tense: "Futur I", example: "Das Auto wird repariert werden." },
    { tense: "Futur II", example: "Das Auto wird repariert worden sein." },
  ],

  subordinateClauses: [
    { tense: "Präsens", example: "weil ich komme" },
    { tense: "Präteritum", example: "weil ich kam" },
    { tense: "Perfekt", example: "weil ich gekommen bin" },
    { tense: "Plusquamperfekt", example: "weil ich gekommen war" },
    { tense: "Futur I", example: "weil ich kommen werde" },
    { tense: "Futur II", example: "weil ich gekommen sein werde" },
  ],

  timeMarkers: [
    {
      marker: "jetzt, gerade, heute",
      tendency: "Präsens",
      example: "Ich arbeite gerade.",
    },
    {
      marker: "gestern, letztes Jahr",
      tendency: "Perfekt or Präteritum",
      example: "Gestern habe ich lange gearbeitet.",
    },
    {
      marker: "schon, noch nicht",
      tendency: "Often Perfekt/Präsens depending on context",
      example: "Hast du schon gegessen?",
    },
    {
      marker: "vorher, zuvor",
      tendency: "Often Plusquamperfekt in past narratives",
      example: "Er hatte vorher gegessen.",
    },
    {
      marker: "morgen, bald, nächste Woche",
      tendency: "Präsens or Futur I",
      example: "Morgen fahre ich nach Berlin.",
    },
    {
      marker: "bis morgen, bis dahin",
      tendency: "Often Futur II or future-oriented Präsens",
      example: "Bis Freitag werde ich alles erledigt haben.",
    },
  ],

  highValueDistinctions: [
    {
      title: "Präsens for future",
      explanation:
        "German says Morgen komme ich more often than Morgen werde ich kommen.",
    },
    {
      title: "Perfekt vs Präteritum",
      explanation:
        "For most verbs in everyday speech use Ich habe ihn gesehen, not Ich sah ihn. But with sein/haben/modals use Präteritum: Ich war müde. Ich hatte keine Zeit. Ich konnte nicht kommen.",
    },
    {
      title: "Plusquamperfekt with sequence",
      explanation: "Nachdem ich gegessen hatte, ging ich spazieren.",
    },
    {
      title: "Futur I for assumptions",
      explanation:
        "Er wird jetzt im Büro sein. (He is probably in the office now.)",
    },
    {
      title: "Futur II for completed assumption",
      explanation:
        "Sie wird schon angekommen sein. (She has probably already arrived.)",
    },
  ],

  commonMistakes: [
    "Overusing Futur I when Präsens is more natural.",
    "Using Präteritum everywhere in speech for all verbs.",
    "Using Perfekt with the wrong auxiliary, especially confusing haben and sein.",
    "Forgetting the participle form.",
    "Misplacing auxiliaries in subordinate clauses.",
    "Avoiding Plusquamperfekt where a clear earlier-past relation is needed.",
    "Not recognizing Futur I and Futur II as assumption forms.",
    "Mishandling modal verbs in Perfekt and subordinate clauses.",
    "Confusing passive with state descriptions.",
  ],

  b2Points: [
    "Choosing between Perfekt and Präteritum based on register",
    "Using Plusquamperfekt to show sequence clearly",
    "Recognizing and producing Futur I and Futur II",
    "Using tense consistently across a paragraph",
    "Handling modal verbs in past forms",
    "Distinguishing process passive and state passive",
    "Keeping correct word order in subordinate clauses with compound tenses",
  ],

  memoryFormula: [
    { tense: "Präsens", formula: "present + often future" },
    { tense: "Perfekt", formula: "spoken past" },
    {
      tense: "Präteritum",
      formula: "written past + common past of sein/haben/modals",
    },
    { tense: "Plusquamperfekt", formula: "past before past" },
    { tense: "Futur I", formula: "future / assumption now" },
    {
      tense: "Futur II",
      formula: "completed future / assumption about completed past",
    },
  ],
};

/* ─── sub-components ─────────────────────────────── */

function Section({
  title,
  tag,
  color,
  highlight,
  children,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        borderRadius: "var(--radius-xl)",
        border: `1px solid ${open ? color || "var(--color-border)" : "var(--color-border)"}`,
        background: "var(--color-surface)",
        overflow: "hidden",
        transition: "border-color var(--transition-interactive)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          border: 0,
          background: open && highlight ? highlight : "var(--color-surface-2)",
          color: "var(--color-text)",
          padding: "var(--space-4) var(--space-5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
          transition: "background var(--transition-interactive)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          {color && (
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "var(--radius-full)",
                background: color,
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              color: "var(--color-text)",
            }}
          >
            {title}
          </span>
          {tag && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                background: highlight || "var(--color-surface-offset)",
                color: color || "var(--color-text-muted)",
                border: `1px solid ${color || "var(--color-border)"}`,
              }}
            >
              {tag}
            </span>
          )}
        </div>
        <span
          style={{
            color: color || "var(--color-text-muted)",
            fontSize: 18,
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "none",
            transition: "transform var(--transition-interactive)",
          }}
        >
          ›
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "var(--space-5)",
            display: "grid",
            gap: "var(--space-4)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Node({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${open ? "var(--color-primary)" : "var(--color-divider)"}`,
        background: "var(--color-surface-2)",
        overflow: "hidden",
        transition: "border-color var(--transition-interactive)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          border: 0,
          background: "transparent",
          color: "var(--color-text)",
          padding: "var(--space-3) var(--space-4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          cursor: "pointer",
          gap: "var(--space-3)",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              color: "var(--color-text)",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <span
          style={{
            color: "var(--color-primary)",
            fontSize: 16,
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform var(--transition-interactive)",
            display: "inline-block",
          }}
        >
          ✚
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "var(--space-1) var(--space-4) var(--space-4)",
            display: "grid",
            gap: "var(--space-2)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Ex({ label, example }) {
  return (
    <div
      style={{
        background: "var(--color-surface-offset)",
        border: "1px solid var(--color-divider)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-2) var(--space-3)",
      }}
    >
      {label && (
        <div
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-primary)",
            marginBottom: 2,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}>
        {example}
      </div>
    </div>
  );
}

function Tbl({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    padding: "var(--space-3) var(--space-5)",
                    borderBottom: "1px solid var(--color-divider)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    verticalAlign: "top",
                    lineHeight: 1.6,
                  }}
                >
                  {Array.isArray(row[c.key])
                    ? row[c.key].join(" / ")
                    : (row[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bullets({ items }) {
  return (
    <ul
      style={{
        paddingLeft: "var(--space-5)",
        display: "grid",
        gap: "var(--space-2)",
      }}
    >
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            lineHeight: 1.65,
          }}
        >
          {it}
        </li>
      ))}
    </ul>
  );
}

function Chips({ items, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
      {items.map((it, i) => (
        <span
          key={i}
          style={{
            padding: "var(--space-1) var(--space-3)",
            borderRadius: "var(--radius-full)",
            background: color ? `${color}18` : "var(--color-surface-offset)",
            border: `1px solid ${color || "var(--color-border)"}`,
            color: color || "var(--color-text-muted)",
            fontSize: "var(--text-xs)",
            fontWeight: 600,
          }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function Note({ children }) {
  return (
    <div
      style={{
        background: "var(--color-primary-highlight)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-3) var(--space-4)",
        fontSize: "var(--text-xs)",
        color: "var(--color-text-muted)",
        lineHeight: 1.65,
      }}
    >
      {children}
    </div>
  );
}

/* ─── main component ─────────────────────────────── */

export default function Tenses() {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();

  const filteredMaster = useMemo(() => {
    if (!q) return tensesData.masterTable;
    return tensesData.masterTable.filter((r) =>
      JSON.stringify(r).toLowerCase().includes(q),
    );
  }, [q]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="container">
        {/* Hero */}
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-full)",
                background: "var(--color-primary-highlight)",
                color: "var(--color-primary)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                marginBottom: "var(--space-3)",
              }}
            >
              {tensesData.meta.scope}
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                color: "var(--color-text)",
                lineHeight: 1.05,
                marginBottom: "var(--space-3)",
              }}
            >
              {tensesData.meta.title}
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                maxWidth: "60ch",
                lineHeight: 1.7,
              }}
            >
              {tensesData.meta.purpose}
            </p>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {[
              ["6", "Tense forms"],
              ["3", "Register levels"],
              ["9", "Common mistakes"],
              ["7", "B2 exam points"],
            ].map(([n, l]) => (
              <div
                key={l}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <strong
                  style={{
                    fontSize: "var(--text-xl)",
                    fontFamily: "var(--font-display)",
                    color: "var(--color-text)",
                  }}
                >
                  {n}
                </strong>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Golden rules */}
        <Section
          title="Golden rules"
          tag="Always apply"
          color="var(--color-primary)"
          highlight="var(--color-primary-highlight)"
        >
          <Bullets items={tensesData.goldenRules} />
        </Section>

        {/* Memory formula pinned */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-4) var(--space-5)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-primary)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "var(--space-3)",
            }}
          >
            Ultra-short memory formula
          </div>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {tensesData.memoryFormula.map((m) => (
              <div
                key={m.tense}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "var(--space-3)",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                  }}
                >
                  {m.tense}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {m.formula}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Search + master table */}
        <Section
          title="Master table"
          tag="Overview"
          color="var(--color-success)"
          highlight="var(--color-success-highlight)"
          defaultOpen={true}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-2) var(--space-4)",
            }}
          >
            <span style={{ color: "var(--color-primary)", fontSize: 16 }}>
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tenses, uses, formulas, examples..."
              style={{
                border: 0,
                background: "transparent",
                color: "var(--color-text)",
                fontSize: "var(--text-sm)",
                width: "100%",
                outline: "none",
                fontFamily: "var(--font-body)",
              }}
              aria-label="Search tenses"
            />
          </div>
          <Tbl
            columns={[
              { key: "tense", label: "Tense" },
              { key: "formula", label: "Formula" },
              { key: "mainUse", label: "Main use" },
              { key: "example", label: "Example" },
              { key: "level", label: "Level" },
            ]}
            rows={filteredMaster}
          />
        </Section>

        {/* Individual tenses */}
        {tensesData.tenses.map((t) => (
          <Section
            key={t.id}
            title={t.name}
            tag={t.tag}
            color={t.color}
            highlight={t.highlight}
            defaultOpen={false}
          >
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                lineHeight: 1.75,
              }}
            >
              {t.summary}
            </p>

            {t.formula && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  background: t.highlight,
                  border: `1px solid ${t.color}`,
                  borderRadius: "var(--radius-full)",
                  padding: "var(--space-2) var(--space-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  color: t.color,
                  alignSelf: "start",
                }}
              >
                <span>Formula:</span>
                <span style={{ fontFamily: "var(--font-display)" }}>
                  {t.formula}
                </span>
              </div>
            )}

            <Node title="Core uses">
              <div style={{ display: "grid", gap: "var(--space-2)" }}>
                {t.coreUses.map((u, i) => (
                  <Ex key={i} label={u.label} example={u.example} />
                ))}
              </div>
            </Node>

            {t.habenSein && (
              <Node
                title="Haben or sein?"
                subtitle="Choosing the right auxiliary for Perfekt"
              >
                <Note>{t.habenSein.habenRule}</Note>
                <Note>{t.habenSein.seinRule}</Note>
                <Chips
                  items={t.habenSein.seinGroups}
                  color="var(--color-success)"
                />
                <Tbl
                  columns={[
                    { key: "verb", label: "Verb" },
                    { key: "perfekt", label: "Perfekt form" },
                    { key: "auxiliary", label: "Auxiliary" },
                  ]}
                  rows={t.habenSein.table}
                />
              </Node>
            )}

            <Node title="Sentence structure">
              <div style={{ display: "grid", gap: "var(--space-2)" }}>
                {t.structure.map((s, i) => (
                  <Ex key={i} label={s.label} example={s.example} />
                ))}
              </div>
            </Node>

            <Node title="Points to watch">
              <Bullets items={t.pointsToWatch} />
            </Node>
          </Section>
        ))}

        {/* Contrast map */}
        <Section
          title="Tense contrast map"
          tag="Key comparisons"
          color="var(--color-primary)"
          highlight="var(--color-primary-highlight)"
          defaultOpen={false}
        >
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {tensesData.contrastMap.map((c, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-divider)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {c.contrast}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    marginBottom: "var(--space-3)",
                    lineHeight: 1.6,
                  }}
                >
                  {c.difference}
                </div>
                {c.examples.map((ex, j) => (
                  <Ex key={j} example={ex} />
                ))}
              </div>
            ))}
          </div>
        </Section>

        {/* Spoken vs written */}
        <Section
          title="Spoken vs written German"
          tag="Register"
          color="var(--color-success)"
          highlight="var(--color-success-highlight)"
          defaultOpen={false}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "var(--color-success)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "var(--space-3)",
                }}
              >
                In speech
              </div>
              <Chips
                items={tensesData.spokenVsWritten.speech.preferred}
                color="var(--color-success)"
              />
              <div
                style={{
                  marginTop: "var(--space-3)",
                  display: "grid",
                  gap: "var(--space-2)",
                }}
              >
                {tensesData.spokenVsWritten.speech.examples.map((ex, i) => (
                  <Ex key={i} example={ex} />
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "var(--space-3)",
                }}
              >
                In writing
              </div>
              <Bullets items={tensesData.spokenVsWritten.writing.preferred} />
              <div style={{ marginTop: "var(--space-3)" }}>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    marginBottom: "var(--space-2)",
                    fontWeight: 600,
                  }}
                >
                  Narrative flow example
                </div>
                <Ex
                  example={tensesData.spokenVsWritten.writing.narrativeFlow}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Modal verbs across tenses */}
        <Section
          title="Modal verbs across tenses"
          tag="Critical"
          color="var(--color-primary)"
          highlight="var(--color-primary-highlight)"
          defaultOpen={false}
        >
          <Note>
            With modals plus another infinitive, perfect-family structures
            become heavier, so Präteritum is often preferred: Ich musste
            arbeiten vs Ich habe arbeiten müssen.
          </Note>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {tensesData.modalVerbsAcrossTenses.map((row, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-divider)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {row.tense}
                </div>
                {row.note && <Note>{row.note}</Note>}
                <div
                  style={{
                    display: "grid",
                    gap: "var(--space-2)",
                    marginTop: "var(--space-2)",
                  }}
                >
                  {row.examples.map((ex, j) => (
                    <Ex key={j} example={ex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Passive across tenses */}
        <Section
          title="Passive across all tenses"
          tag="Passive"
          color="var(--color-success)"
          highlight="var(--color-success-highlight)"
          defaultOpen={false}
        >
          <Note>
            State passive uses sein + Partizip II. Die Tür wird geschlossen =
            action. Die Tür ist geschlossen = state.
          </Note>
          <Tbl
            columns={[
              { key: "tense", label: "Tense" },
              { key: "example", label: "Example" },
            ]}
            rows={tensesData.passiveAcrossTenses}
          />
        </Section>

        {/* Subordinate clauses */}
        <Section
          title="Tenses in subordinate clauses"
          tag="Word order"
          color="var(--color-primary)"
          highlight="var(--color-primary-highlight)"
          defaultOpen={false}
        >
          <Note>
            Tense itself does not change because of a connector, but word order
            does. The finite verb goes to the end. With compound tenses the
            verbal cluster sits at the end.
          </Note>
          <Tbl
            columns={[
              { key: "tense", label: "Tense" },
              { key: "example", label: "Subordinate form" },
            ]}
            rows={tensesData.subordinateClauses}
          />
        </Section>

        {/* Time markers */}
        <Section
          title="Time markers and tense choice"
          tag="Quick reference"
          color="var(--color-success)"
          highlight="var(--color-success-highlight)"
          defaultOpen={false}
        >
          <Tbl
            columns={[
              { key: "marker", label: "Time marker" },
              { key: "tendency", label: "Typical tense" },
              { key: "example", label: "Example" },
            ]}
            rows={tensesData.timeMarkers}
          />
        </Section>

        {/* High value distinctions */}
        <Section
          title="High-value distinctions"
          tag="B1-B2"
          color="var(--color-primary)"
          highlight="var(--color-primary-highlight)"
          defaultOpen={false}
        >
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {tensesData.highValueDistinctions.map((d, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-divider)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    marginBottom: "var(--space-2)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {d.title}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {d.explanation}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Common mistakes */}
        <Section
          title="Common mistakes"
          tag="Watch out"
          color="var(--color-error)"
          highlight="rgba(201,96,96,0.12)"
          defaultOpen={false}
        >
          <ul
            style={{
              paddingLeft: "var(--space-5)",
              display: "grid",
              gap: "var(--space-3)",
            }}
          >
            {tensesData.commonMistakes.map((m, i) => (
              <li
                key={i}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.65,
                }}
              >
                <span style={{ color: "var(--color-error)", fontWeight: 700 }}>
                  ✕{" "}
                </span>
                {m}
              </li>
            ))}
          </ul>
        </Section>

        {/* B2 exam points */}
        <Section
          title="B2 exam-relevant points"
          tag="B2"
          color="var(--color-success)"
          highlight="var(--color-success-highlight)"
          defaultOpen={false}
        >
          <ul
            style={{
              paddingLeft: "var(--space-5)",
              display: "grid",
              gap: "var(--space-3)",
            }}
          >
            {tensesData.b2Points.map((p, i) => (
              <li
                key={i}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.65,
                }}
              >
                <span
                  style={{ color: "var(--color-success)", fontWeight: 700 }}
                >
                  ✓{" "}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
