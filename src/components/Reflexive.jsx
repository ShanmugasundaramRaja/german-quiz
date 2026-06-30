import { useMemo, useState } from "react";

/* ─── COLOR PALETTE using CSS vars ─────────────────────────────────────────
   Each named color maps to existing theme tokens so dark mode works.
   "accent" variants use the app's four semantic colors:
     primary (blue/violet), gold (amber), success (green), error (rose/red)
   We also expose a 5th neutral via text-muted / surface-2.
─────────────────────────────────────────────────────────────────────────── */
const C = {
  violet: {
    bg:     "var(--color-primary-highlight)",
    border: "var(--color-primary)",
    text:   "var(--color-primary)",
    soft:   "var(--color-primary-highlight)",
  },
  green: {
    bg:     "var(--color-success-highlight)",
    border: "var(--color-success)",
    text:   "var(--color-success)",
    soft:   "var(--color-success-highlight)",
  },
  amber: {
    bg:     "var(--color-gold-highlight)",
    border: "var(--color-gold)",
    text:   "var(--color-gold)",
    soft:   "var(--color-gold-highlight)",
  },
  rose: {
    bg:     "var(--color-error-highlight)",
    border: "var(--color-error)",
    text:   "var(--color-error)",
    soft:   "var(--color-error-highlight)",
  },
  blue: {
    bg:     "var(--color-primary-highlight)",
    border: "var(--color-primary)",
    text:   "var(--color-primary)",
    soft:   "var(--color-primary-highlight)",
  },
};

/* ─── DATA ────────────────────────────────────────────────────────────────── */

const PRONOUNS = [
  { person: "ich",       akk: "mich", dat: "mir",  color: "rose"   },
  { person: "du",        akk: "dich", dat: "dir",  color: "violet" },
  { person: "er/sie/es", akk: "sich", dat: "sich", color: "blue"   },
  { person: "wir",       akk: "uns",  dat: "uns",  color: "green"  },
  { person: "ihr",       akk: "euch", dat: "euch", color: "amber"  },
  { person: "sie/Sie",   akk: "sich", dat: "sich", color: "rose"   },
];

const ALWAYS_REFLEXIVE = [
  "sich beeilen","sich bedanken","sich befinden","sich erholen",
  "sich erkälten","sich irren","sich schämen","sich verspäten","sich weigern",
];

const SOMETIMES_REFLEXIVE = [
  ["sich waschen",      "Er wäscht sich.",       "waschen",      "Er wäscht das Auto."],
  ["sich duschen",      "Ich dusche mich.",       "duschen",      "Ich dusche."],
  ["sich kämmen",       "Du kämmst dich.",        "kämmen",       "Du kämmst den Hund."],
  ["sich anziehen",     "Sie zieht sich an.",     "anziehen",     "Sie zieht die Jacke an."],
  ["sich vorbereiten",  "Wir bereiten uns vor.",  "vorbereiten",  "Wir bereiten das Essen vor."],
];

const AKK_DAT_RULES = [
  {
    id: "akk", color: "violet",
    title: "Akkusativ — default",
    trigger: "No extra Akkusativ object in the sentence",
    formula: "Subjekt + Verb + Reflexivpronomen (Akk) + Rest",
    examples: ["Ich freue mich.", "Du beeilst dich.", "Wir treffen uns morgen."],
  },
  {
    id: "dat", color: "green",
    title: "Dativ — triggered by another object",
    trigger: "A separate Akkusativ object is already present",
    formula: "Subjekt + Verb + Reflexivpronomen (Dat) + Akkusativobjekt",
    examples: ["Ich wasche mir die Haare.", "Du putzt dir die Zähne.", "Wir schneiden uns die Nägel."],
  },
];

const WORD_ORDER = [
  { title: "Main clause",       pattern: "Finite verb → pronoun",       example: "Ich freue mich auf den Urlaub.",    note: "Reflexive pronoun right after the finite verb.", color: "blue"   },
  { title: "Subordinate clause",pattern: "Subject → pronoun",           example: "…, weil du dich beeilt hast.",     note: "After a conjunction, pronoun follows the subject.", color: "violet" },
  { title: "Imperative",        pattern: "Verb → pronoun",              example: "Setz dich! / Setzen Sie sich!",    note: "In commands, pronoun follows the verb.", color: "amber"  },
  { title: "Question",          pattern: "Verb-first",                  example: "Kämmst du dich? / Hat sich jemand gewaschen?", note: "Position depends on subject type.", color: "rose"   },
];

const TENSES = [
  ["Präsens",       "Ich setze mich."],
  ["Perfekt",       "Ich habe mich gesetzt."],
  ["Präteritum",    "Ich setzte mich."],
  ["Plusquamperfekt","Ich hatte mich gesetzt."],
  ["Futur I",       "Ich werde mich setzen."],
  ["Futur II",      "Ich werde mich gesetzt haben."],
];

const PREP_CHUNKS = [
  ["sich freuen auf",        "+ Akk", "future / upcoming",     "Ich freue mich auf den Urlaub."],
  ["sich freuen über",       "+ Akk", "reaction to sth past",  "Sie freut sich über das Geschenk."],
  ["sich interessieren für", "+ Akk", "interest",              "Er interessiert sich für Sprachen."],
  ["sich erinnern an",       "+ Akk", "memory",                "Ich erinnere mich an den Film."],
  ["sich kümmern um",        "+ Akk", "care / responsibility", "Wir kümmern uns um das Problem."],
  ["sich konzentrieren auf", "+ Akk", "focus",                 "Konzentrier dich auf die Aufgabe."],
  ["sich bewerben um",       "+ Akk", "apply for",             "Sie bewirbt sich um die Stelle."],
  ["sich beschweren über",   "+ Akk", "complain about",        "Er beschwert sich über den Lärm."],
  ["sich sehnen nach",       "+ Dat", "long for",              "Sie sehnt sich nach Ruhe."],
  ["sich fürchten vor",      "+ Dat", "fear",                  "Das Kind fürchtet sich vor dem Hund."],
  ["sich verlassen auf",     "+ Akk", "rely on",               "Ich verlasse mich auf dich."],
];

const MEANING_SHIFT = [
  ["sich verlaufen",    "to get lost",         "verlaufen",          "to proceed / go"],
  ["sich aufhalten",    "to stay / be located","aufhalten",          "to delay / stop"],
  ["sich verlassen auf","to rely on",           "jemanden verlassen", "to leave someone"],
];

const SPECIAL_NOTES = [
  "duschen and baden often work with or without the reflexive pronoun for personal washing.",
  "baden is not reflexive when it means swimming in a lake: Die Kinder baden im See.",
  "Reflexive pronouns are not used in the Genitiv in this grammar pattern.",
  "In 1st and 2nd person singular, Akkusativ vs. Dativ is visibly different: mich/mir, dich/dir.",
  "In 3rd person and plural, many forms look identical — check whether another object is present.",
];

const LEARNING_ORDER = [
  "Memorize the full pronoun table.",
  "Learn the Akkusativ vs. Dativ trigger.",
  "Learn 30+ verb chunks with their fixed prepositions.",
  "Practice in Präsens, Perfekt, and subordinate clauses first.",
];

const TABS = [
  ["core",      "Core",       "rose"],
  ["case",      "Akk vs Dat", "violet"],
  ["wordorder", "Word Order", "green"],
  ["chunks",    "Verb Chunks","amber"],
  ["tricky",    "Tricky",     "blue"],
];

/* ─── SHARED COMPONENTS ──────────────────────────────────────────────────── */

function Pill({ text, color = "violet" }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: "var(--radius-full)",
      background: C[color].soft, color: C[color].text,
      fontWeight: 800, fontSize: "var(--text-xs)", letterSpacing: "0.05em", textTransform: "uppercase",
    }}>{text}</span>
  );
}

function Card({ color = "blue", children, style = {} }) {
  return (
    <div style={{
      background: C[color].bg,
      border: `1.5px solid ${C[color].border}`,
      borderRadius: "var(--radius-xl)",
      padding: "var(--space-4)",
      ...style,
    }}>{children}</div>
  );
}

function CardTitle({ children }) {
  return <div style={{ fontWeight: 900, fontSize: "var(--text-lg)", color: "var(--color-text)", marginBottom: "var(--space-3)" }}>{children}</div>;
}

function MiniTable({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: "left", padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-divider)", background: i % 2 === 0 ? "transparent" : "var(--color-surface-2)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-text)", verticalAlign: "top" }}>
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

function FlipTile({ front, back, color = "violet" }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button onClick={() => setFlipped(!flipped)} style={{
      border: `1.5px solid ${C[color].border}`,
      background: flipped ? C[color].soft : "var(--color-surface-2)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--space-4)",
      minHeight: 110,
      textAlign: "left",
      cursor: "pointer",
      transition: "all 180ms ease",
      width: "100%",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
        <Pill text={flipped ? "revealed" : "tap to reveal"} color={color} />
        <span>{flipped ? "🔓" : "🔒"}</span>
      </div>
      <div style={{ fontWeight: 800, fontSize: "var(--text-base)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>{front}</div>
      <div style={{ color: flipped ? C[color].text : "var(--color-text-muted)", lineHeight: 1.55, fontSize: "var(--text-sm)", whiteSpace: "pre-line" }}>
        {flipped ? back : "Think first, then tap to check."}
      </div>
    </button>
  );
}

/* ─── INTERACTIVE WIDGETS ───────────────────────────────────────────────── */

function PronounLab() {
  const [person, setPerson] = useState("ich");
  const [mode, setMode] = useState("akk");
  const current = useMemo(() => PRONOUNS.find((p) => p.person === person), [person]);
  const result = mode === "akk" ? current.akk : current.dat;
  const color = current.color;

  return (
    <Card color={color}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
        <div>
          <CardTitle>Pronoun Lab</CardTitle>
          <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>Choose a subject and case — see the reflexive pronoun instantly.</div>
        </div>
        <Pill text="Interactive" color={color} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div>
          <label style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</label>
          <select value={person} onChange={(e) => setPerson(e.target.value)} style={{ width: "100%", marginTop: "var(--space-2)", padding: "var(--space-3)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", fontSize: "var(--text-sm)", background: "var(--color-surface-2)", color: "var(--color-text)" }}>
            {PRONOUNS.map((p) => <option key={p.person} value={p.person}>{p.person}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Case</label>
          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
            {["akk", "dat"].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "var(--space-2)", borderRadius: "var(--radius-lg)", border: mode === m ? `2px solid ${C[m === "akk" ? "violet" : "green"].border}` : "1px solid var(--color-border)", background: mode === m ? C[m === "akk" ? "violet" : "green"].soft : "var(--color-surface-2)", fontWeight: 800, cursor: "pointer", fontSize: "var(--text-xs)", color: mode === m ? C[m === "akk" ? "violet" : "green"].text : "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {m === "akk" ? "Akk" : "Dat"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-4)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", border: "1px dashed var(--color-border)" }}>
        <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>Result</div>
        <div style={{ fontSize: "var(--text-2xl)", fontWeight: 900, color: C[color].text }}>{person} → <span>{result}</span></div>
        <div style={{ marginTop: "var(--space-2)", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
          {mode === "akk" ? "Default — no extra Akkusativ object in the sentence." : "Triggered — another Akkusativ object is already present."}
        </div>
      </div>
    </Card>
  );
}

function CaseSwitch() {
  const [hasObject, setHasObject] = useState(false);
  const color = hasObject ? "green" : "violet";
  return (
    <Card color={color}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
        <div>
          <CardTitle>Case Switch</CardTitle>
          <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>Toggle the extra object and watch the case change.</div>
        </div>
        <Pill text={hasObject ? "Dativ trigger" : "Akkusativ trigger"} color={color} />
      </div>

      <button onClick={() => setHasObject(!hasObject)} style={{
        width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-lg)",
        border: "none", background: C[color].border, color: "var(--color-surface-2)",
        fontWeight: 900, cursor: "pointer", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)",
      }}>
        {hasObject ? "✓  Sentence has another Akkusativ object" : "✗  No extra Akkusativ object"}
      </button>

      <div style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", border: "1px solid var(--color-border)" }}>
        <div style={{ fontSize: "var(--text-lg)", fontWeight: 900, color: C[color].text, marginBottom: "var(--space-2)" }}>
          Use {hasObject ? "Dativ" : "Akkusativ"}
        </div>
        <div style={{ color: "var(--color-text-muted)", lineHeight: 1.65, fontSize: "var(--text-sm)" }}>
          {hasObject ? (
            <>
              <div>Ich putze mir die Zähne.</div>
              <div>Ich wasche mir die Hände.</div>
            </>
          ) : (
            <>
              <div>Ich freue mich.</div>
              <div>Du beeilst dich.</div>
              <div>Wir treffen uns.</div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function ChunkDeck() {
  const [filter, setFilter] = useState("all");
  const filtered = PREP_CHUNKS.filter((r) => filter === "all" || r[1] === filter);
  const filterColor = { all: "blue", "+ Akk": "violet", "+ Dat": "green" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {["all", "+ Akk", "+ Dat"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-full)",
            border: filter === f ? `2px solid ${C[filterColor[f]].border}` : "1px solid var(--color-border)",
            background: filter === f ? C[filterColor[f]].soft : "var(--color-surface-2)",
            color: filter === f ? C[filterColor[f]].text : "var(--color-text-muted)",
            fontWeight: 800, cursor: "pointer", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.04em",
          }}>
            {f === "all" ? "All chunks" : f}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "var(--space-3)" }}>
        {filtered.map((item, i) => (
          <FlipTile
            key={i}
            color={item[1] === "+ Dat" ? "green" : "violet"}
            front={item[0]}
            back={`${item[1]}  ·  ${item[2]}

${item[3]}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── TAB CONTENT ────────────────────────────────────────────────────────── */

function CoreTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "var(--space-4)" }}>
        <PronounLab />
        <Card color="blue">
          <CardTitle>What they are</CardTitle>
          <p style={{ margin: 0, color: "var(--color-text)", lineHeight: 1.65, fontSize: "var(--text-sm)" }}>
            Reflexive verbs are used when the action refers back to the subject — <strong>Ich wasche mich</strong>, <strong>Er freut sich</strong>. German distinguishes verbs that are <em>always</em> reflexive (echte) from those that <em>can</em> be reflexive (unechte), depending on meaning.
          </p>
          <div style={{ marginTop: "var(--space-4)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: "1px solid var(--color-border)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>Always reflexive</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
              {ALWAYS_REFLEXIVE.map((v, i) => (
                <span key={i} style={{ background: C.rose.soft, color: C.rose.text, borderRadius: "var(--radius-full)", padding: "4px 10px", fontSize: "var(--text-xs)", fontWeight: 700 }}>{v}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <Card color="amber">
        <CardTitle>Always reflexive vs sometimes reflexive</CardTitle>
        <MiniTable
          headers={["Reflexive use", "Example", "Non-reflexive use", "Example"]}
          rows={SOMETIMES_REFLEXIVE.map((r) => [r[0], <span style={{ color: C.violet.text, fontWeight: 700 }}>{r[1]}</span>, r[2], <span style={{ color: "var(--color-text-muted)" }}>{r[3]}</span>])}
        />
      </Card>
    </div>
  );
}

function CaseTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <CaseSwitch />
        <Card color="violet">
          <CardTitle>Pronoun table</CardTitle>
          <MiniTable
            headers={["Person", "Akkusativ", "Dativ"]}
            rows={PRONOUNS.map((p) => [
              <strong style={{ color: "var(--color-text)" }}>{p.person}</strong>,
              <span style={{ color: C.violet.text, fontWeight: 900 }}>{p.akk}</span>,
              <span style={{ color: C.green.text, fontWeight: 900 }}>{p.dat}</span>,
            ])}
          />
          <div style={{ marginTop: "var(--space-3)", color: "var(--color-text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
            Only 1st and 2nd person singular visibly differ: <strong style={{ color: C.violet.text }}>mich / mir</strong>, <strong style={{ color: C.violet.text }}>dich / dir</strong>.
          </div>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        {AKK_DAT_RULES.map((rule) => (
          <Card key={rule.id} color={rule.color}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <CardTitle>{rule.title}</CardTitle>
              <Pill text={rule.id === "akk" ? "Default" : "Triggered"} color={rule.color} />
            </div>
            <p style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text)" }}><strong>Trigger:</strong> {rule.trigger}</p>
            <p style={{ margin: "0 0 var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontFamily: "var(--font-display)" }}>{rule.formula}</p>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              {rule.examples.map((ex, i) => (
                <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-2) var(--space-3)", fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--color-text)", border: "1px solid var(--color-divider)" }}>{ex}</div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WordOrderTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="blue">
        <CardTitle>Sentence position</CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "var(--space-3)" }}>
          {WORD_ORDER.map((item, i) => (
            <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", border: `1px solid ${C[item.color].border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                <div style={{ fontWeight: 900, fontSize: "var(--text-sm)", color: "var(--color-text)" }}>{item.title}</div>
                <Pill text={`${i + 1}`} color={item.color} />
              </div>
              <div style={{ fontSize: "var(--text-base)", fontWeight: 800, color: C[item.color].text, marginBottom: "var(--space-2)" }}>{item.example}</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)", lineHeight: 1.6 }}>{item.note}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card color="green">
        <CardTitle>Tenses</CardTitle>
        <MiniTable headers={["Tense", "Example"]} rows={TENSES} />
        <div style={{ marginTop: "var(--space-3)", color: "var(--color-text)", lineHeight: 1.65, fontSize: "var(--text-sm)" }}>
          Reflexive verbs appear in all standard tenses. In Perfekt they are always built with <strong>haben</strong>, not sein — e.g. <em>Ich habe mich verspätet.</em>
        </div>
      </Card>
    </div>
  );
}

function ChunksTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="amber">
        <CardTitle>Chunk Deck</CardTitle>
        <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", lineHeight: 1.6 }}>
          Learn reflexive verbs as complete chunks, not isolated infinitives. Tap any card to reveal the case, meaning cue, and sample sentence.
        </div>
        <ChunkDeck />
      </Card>
    </div>
  );
}

function TrickyTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <Card color="amber">
          <CardTitle>Meaning shifts</CardTitle>
          <MiniTable
            headers={["Reflexive", "Meaning", "Non-reflexive", "Meaning"]}
            rows={MEANING_SHIFT.map((r) => [
              <span style={{ color: C.violet.text, fontWeight: 700 }}>{r[0]}</span>,
              r[1],
              <span style={{ color: "var(--color-text-muted)" }}>{r[2]}</span>,
              r[3],
            ])}
          />
        </Card>
        <Card color="rose">
          <CardTitle>Special notes</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {SPECIAL_NOTES.map((note, i) => (
              <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: "1px solid var(--color-divider)", color: "var(--color-text)", lineHeight: 1.65, fontSize: "var(--text-sm)" }}>{note}</div>
            ))}
          </div>
        </Card>
      </div>
      <Card color="green">
        <CardTitle>Recommended learning order</CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--space-3)" }}>
          {LEARNING_ORDER.map((step, i) => {
            const cols = ["rose", "violet", "green", "amber"];
            return (
              <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", border: `1px solid ${C[cols[i]].border}` }}>
                <div style={{ width: 30, height: 30, borderRadius: "var(--radius-full)", background: C[cols[i]].border, color: "var(--color-surface-2)", display: "grid", placeItems: "center", fontWeight: 900, marginBottom: "var(--space-2)", fontSize: "var(--text-sm)" }}>{i + 1}</div>
                <div style={{ color: "var(--color-text)", fontWeight: 700, lineHeight: 1.55, fontSize: "var(--text-sm)" }}>{step}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────────────────── */

export default function Reflexive() {
  const [tab, setTab] = useState("core");

  const renderTab = () => {
    switch (tab) {
      case "core":      return <CoreTab />;
      case "case":      return <CaseTab />;
      case "wordorder": return <WordOrderTab />;
      case "chunks":    return <ChunksTab />;
      case "tricky":    return <TrickyTab />;
      default:          return null;
    }
  };

  return (
    <div className="pronouns-page">
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={{ fontSize: "2rem" }}>🔁</span>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "var(--color-text)", margin: 0, lineHeight: 1.1 }}>Reflexive Verben</h1>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                Pronoun table · Akk vs Dat · Word order · Verb chunks · Tricky cases
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Pill text="Interactive" color="violet" />
            <Pill text="Chunk-based" color="green" />
            <Pill text="Dark-mode ready" color="amber" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", padding: "var(--space-1)", background: "var(--color-surface-2)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", marginBottom: "var(--space-6)" }}>
        {TABS.map(([id, label, color]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: "flex", alignItems: "center", gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)", borderRadius: "var(--radius-lg)",
            border: "none", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 700,
            letterSpacing: "0.04em", transition: "all 150ms ease",
            background: tab === id ? C[color].border : "transparent",
            color: tab === id ? "var(--color-surface-2)" : "var(--color-text-muted)",
            boxShadow: tab === id ? "var(--shadow-sm)" : "none",
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ animation: "fade-up 280ms cubic-bezier(0.16,1,0.3,1) both" }}>
        {renderTab()}
      </div>
    </div>
  );
}
