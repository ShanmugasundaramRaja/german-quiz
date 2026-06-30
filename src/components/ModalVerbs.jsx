import React, { useMemo, useState } from "react";

const coreModals = [
  {
    modal: "können",
    meaning: "can / to be able to",
    nuance: "ability, possibility",
    colorClass: "case-nom",
    badgeClass: "case-badge-nom",
  },
  {
    modal: "müssen",
    meaning: "must / have to",
    nuance: "necessity, obligation",
    colorClass: "case-acc",
    badgeClass: "case-badge-acc",
  },
  {
    modal: "dürfen",
    meaning: "may / to be allowed to",
    nuance: "permission, prohibition (in negation)",
    colorClass: "case-dat",
    badgeClass: "case-badge-dat",
  },
  {
    modal: "sollen",
    meaning: "should / ought to / to be supposed to",
    nuance: "obligation, recommendation, reported speech",
    colorClass: "case-gen",
    badgeClass: "case-badge-gen",
  },
  {
    modal: "wollen",
    meaning: "want (to)",
    nuance: "desire, intention",
    colorClass: "case-nom",
    badgeClass: "case-badge-nom",
  },
  {
    modal: "mögen",
    meaning: "to like / to be fond of",
    nuance: "preference; as modal: like to",
    colorClass: "case-acc",
    badgeClass: "case-badge-acc",
  },
];

const presentRows = [
  ["ich", "kann", "muss", "darf", "soll", "will", "mag"],
  ["du", "kannst", "musst", "darfst", "sollst", "willst", "magst"],
  ["er/sie/es", "kann", "muss", "darf", "soll", "will", "mag"],
  ["wir", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"],
  ["ihr", "könnt", "müsst", "dürft", "sollt", "wollt", "mögt"],
  ["sie/Sie", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"],
];

const prateritumRows = [
  ["dürfen", "durfte", "durften", "was/were allowed to"],
  ["können", "konnte", "konnten", "was/were able to"],
  ["müssen", "musste", "mussten", "had to"],
  ["mögen", "mochte", "mochten", "liked (to)"],
  ["sollen", "sollte", "sollten", "was/were supposed to / should"],
  ["wollen", "wollte", "wollten", "wanted to"],
];

const levels = [
  {
    level: "A1",
    items: [
      "Present forms of können, müssen, wollen with everyday verbs (gehen, arbeiten, essen).",
      "Basic word order: modal 2nd, infinitive last.",
    ],
  },
  {
    level: "A2",
    items: [
      "All six modals in the present; simple past (konnte, musste, wollte).",
      "Negation and questions: Kannst du…? Musst du…?, Ich kann nicht kommen.",
    ],
  },
  {
    level: "B1",
    items: [
      "Double infinitive in Perfekt; modals with separable verbs and in subordinate clauses.",
      "More semantic nuance (recommendation vs obligation, polite vs direct).",
    ],
  },
  {
    level: "B2–C1",
    items: [
      "Epistemic vs deontic readings; reported speech with sollen, style differences (Präteritum vs Perfekt).",
      "Complex clusters (Futur, Konjunktiv II + modal + full verb), e.g. Ich hätte das früher machen müssen.",
    ],
  },
];

const sentenceBlocks = {
  intro: [
    { de: "Ich kann schwimmen.", en: "I can swim." },
    { de: "Wir müssen arbeiten.", en: "We have to work." },
    { de: "Ich muss jetzt.", en: "I have to (go/do it) now." },
  ],
  present: [
    { de: "Ich kann Deutsch sprechen.", en: "I can speak German." },
    { de: "Du musst heute arbeiten.", en: "You must work today." },
    {
      de: "Wir dürfen hier nicht rauchen.",
      en: "We are not allowed to smoke here.",
    },
    {
      de: "Heute muss ich lange arbeiten.",
      en: "Today I must work for a long time.",
    },
    {
      de: "…, weil ich heute lange arbeiten muss.",
      en: "...because I must work for a long time today.",
    },
  ],
  past: [
    {
      de: "Der Ingenieur musste die Maschine reparieren.",
      en: "The engineer had to repair the machine.",
    },
    { de: "Wir wollten nach Hause gehen.", en: "We wanted to go home." },
    {
      de: "For learners B1+, all persons follow the regular -te pattern (ich musste, du musstest, etc.).",
      en: "Regular -te pattern for all persons.",
    },
  ],
  perfect: [
    { de: "Ich habe gehen können.", en: "I have been able to go." },
    { de: "Er hat arbeiten müssen.", en: "He has had to work." },
    {
      de: "Die Studentin hat diese Woche fleißig lernen müssen.",
      en: "The student has had to study hard this week.",
    },
    {
      de: "Ich hatte damals arbeiten müssen.",
      en: "I had had to work back then.",
    },
    {
      de: "Ich habe nichts gewollt.",
      en: "I wanted nothing / I didn't want anything.",
    },
    { de: "Er hat Eis gemocht.", en: "He liked ice cream." },
    {
      de: "Ich hatte sofort nach Hause gemusst.",
      en: "I had had to go home immediately.",
    },
  ],
  future: [
    { de: "Ich werde kommen können.", en: "I will be able to come." },
    { de: "Sie wird gehen müssen.", en: "She will have to go." },
    {
      de: "Ich werde heute Abend arbeiten müssen.",
      en: "I will have to work this evening.",
    },
    {
      de: "Future II with modals exists but is rare and mostly C1–C2.",
      en: "Future II with modals exists but is rare and mostly C1–C2.",
    },
  ],
  semantics: [
    { de: "Er kann sehr schnell laufen.", en: "He can run very fast." },
    {
      de: "Du musst den Bericht heute abgeben.",
      en: "You must submit the report today.",
    },
    {
      de: "Du darfst hier nicht parken.",
      en: "You are not allowed to park here.",
    },
    {
      de: "Er muss jetzt im Büro sein.",
      en: "He must be in the office now (very likely).",
    },
    {
      de: "Sie dürfte schon angekommen sein.",
      en: "She is probably already there.",
    },
  ],
  gotchas: [
    {
      de: "Ich muss arbeite.",
      en: "Wrong: the second verb must remain infinitive.",
    },
    {
      de: "…, weil ich muss arbeiten.",
      en: "Wrong subordinate clause word order.",
    },
    { de: "Du musst nicht rauchen.", en: "No obligation, not prohibition." },
    { de: "Du darfst nicht rauchen.", en: "Prohibition." },
    {
      de: "Ich habe das möchten.",
      en: "Wrong: möchten is present polite form, not used that way in past.",
    },
    { de: "Das kann stimmen.", en: "Preferred for possibility, not mögen." },
  ],
};

const wordOrder = [
  ["Main clause", "position 2 = finite modal verb, clause-final = infinitive"],
  ["Subordinate clause", "all verbs go to the end, infinitive last"],
  [
    "Practical rule",
    "if there is a modal, the other verb is an infinitive at the end; the modal carries tense/person",
  ],
];

const practicalUses = [
  [
    "können",
    "ability / possibility",
    "Wir können den Server neu starten.",
    "Standard modal + main verb pattern.",
  ],
  [
    "müssen",
    "obligation / necessity",
    "Ich muss den Bericht heute abschicken.",
    "Negation: Du musst nicht kommen = no obligation.",
  ],
  [
    "dürfen",
    "permission / prohibition",
    "Man darf hier parken.",
    "Du darfst nicht kommen = not allowed; not the same as müssen not.",
  ],
  [
    "sollen",
    "obligation / recommendation / reported speech",
    "Ich soll mehr Sport machen.",
    "Can mean soft obligation or reported speech: Er soll krank sein.",
  ],
  [
    "wollen",
    "intention / desire",
    "Ich will nach Berlin fahren.",
    "Stronger wish or plan than möchten.",
  ],
  [
    "mögen / möchten",
    "liking / polite desire",
    "Ich mag Kaffee. / Ich möchte einen Kaffee.",
    "mögen can be lexical; möchten is polite present desire.",
  ],
];

const specialCases = [
  [
    "Perfekt",
    "Ich habe nichts gewollt.",
    "I wanted nothing / I didn't want anything.",
  ],
  ["Perfekt", "Er hat Eis gemocht.", "He liked ice cream."],
  [
    "Plusquamperfekt",
    "Ich hatte sofort nach Hause gemusst.",
    "I had had to go home immediately.",
  ],
];

const inlineTags = {
  nom: "case-tag-nom",
  acc: "case-tag-acc",
  dat: "case-tag-dat",
  gen: "case-tag-gen",
};

export default function ModalVerb() {
  const [selectedModal, setSelectedModal] = useState("können");
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [activeView, setActiveView] = useState("present");
  const [showExamples, setShowExamples] = useState(true);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const selected = useMemo(
    () => coreModals.find((m) => m.modal === selectedModal),
    [selectedModal],
  );
  const level = useMemo(
    () => levels.find((l) => l.level === selectedLevel),
    [selectedLevel],
  );
  const activeExamples = sentenceBlocks[activeView];

  const validate = () => {
    const normalized = input.trim().toLowerCase();
    const valid = [
      "ich muss arbeiten",
      "weil ich arbeiten muss",
      "du darfst nicht rauchen",
      "du musst nicht rauchen",
    ];
    if (!normalized) return;
    setFeedback(valid.includes(normalized) ? "correct" : "wrong");
    window.clearTimeout(window.__mvTimer);
    window.__mvTimer = window.setTimeout(() => setFeedback(""), 900);
  };

  return (
    <div className="pronouns-page modal-verbs-page">
      <div className="pronouns-sections">
        {/* ── HERO ── */}
        <section className="case-section case-nom">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-nom">MV</div>
              <div>
                <div className="case-title">German Modal Verbs</div>
                <div className="case-sublabel">
                  Full reference, structured for study and interaction.
                </div>
              </div>
            </div>
            <div className="case-header-right">
              <div className="select-wrap">
                <select
                  value={selectedModal}
                  onChange={(e) => setSelectedModal(e.target.value)}
                >
                  {coreModals.map((m) => (
                    <option key={m.modal} value={m.modal}>
                      {m.modal}
                    </option>
                  ))}
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              <div className="select-wrap">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  {levels.map((l) => (
                    <option key={l.level} value={l.level}>
                      {l.level}
                    </option>
                  ))}
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              <button
                className="examples-toggle"
                onClick={() => setShowExamples((v) => !v)}
              >
                {showExamples ? "Hide" : "Show"} examples
              </button>
            </div>
          </div>
          <div className="mental-model">
            <div className="mental-model-title">Core idea</div>
            <ul className="mental-steps">
              <li>
                <span className={inlineTags.nom}>Finite modal</span> =
                controller of tense/person.
              </li>
              <li>
                <span className={inlineTags.acc}>Main action</span> = infinitive
                at the end of the clause.
              </li>
              <li>
                <span className={inlineTags.dat}>Perfect / future layers</span>{" "}
                = auxiliary + modal + infinitive chain.
              </li>
              <li>
                <span className={inlineTags.gen}>If modal stands alone</span>,
                it can take a participle in perfect tenses.
              </li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 1: SIX CORE MODALS ── */}
        <section className={`case-section ${selected.colorClass}`}>
          <div className="case-header">
            <div className="case-header-left">
              <div className={`case-badge ${selected.badgeClass}`}>1</div>
              <div>
                <div className="case-title">
                  The six core German modal verbs
                </div>
                <div className="case-sublabel">
                  Medium of instruction: English; German only in examples.
                </div>
              </div>
            </div>
            <div className="case-question">What does {selected.modal} do?</div>
          </div>
          <div className="boss-grid">
            <div className="boss-block">
              <div className="boss-block-label">Selected modal</div>
              <div className="mental-model">
                <div className="boss-example">{selected.modal}</div>
                <div className="boss-en">{selected.meaning}</div>
                <div className="boss-en">Typical nuance: {selected.nuance}</div>
              </div>
            </div>
            <div className="boss-block">
              <div className="boss-block-label">Important note</div>
              <div className="mental-model">
                <div className="boss-example">
                  Additionally, möchten behaves like a separate polite modal.
                </div>
                <div className="boss-en">
                  It means "would like to" but is formally the Konjunktiv II of
                  mögen.
                </div>
              </div>
            </div>
          </div>
          {showExamples && (
            <div className="examples-list">
              <div className="example-row">
                <div className="example-de">Ich kann schwimmen.</div>
                <div className="example-en">I can swim.</div>
              </div>
              <div className="example-row">
                <div className="example-de">Wir müssen arbeiten.</div>
                <div className="example-en">We have to work.</div>
              </div>
              <div className="example-row">
                <div className="example-de">Ich muss jetzt.</div>
                <div className="example-en">I have to (go/do it) now.</div>
              </div>
            </div>
          )}
        </section>

        {/* ── SECTION 2: PRESENT TENSE ── */}
        <section className="case-section case-acc">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-acc">2</div>
              <div>
                <div className="case-title">Present tense forms (A1–A2)</div>
                <div className="case-sublabel">
                  Irregular in singular, regular in plural. 1st and 3rd singular
                  have no ending.
                </div>
              </div>
            </div>
            <div className="case-question">Präsens conjugation</div>
          </div>
          <div className="boss-grid">
            <div className="boss-block">
              <div className="boss-block-label">Level: {level.level}</div>
              <div className="mental-model">
                <div className="boss-example">{level.level}</div>
                <div className="boss-en">{level.items[0]}</div>
                <div className="boss-en">{level.items[1]}</div>
              </div>
            </div>
            <div className="boss-block">
              <div className="boss-block-label">Examples</div>
              <div className="examples-list">
                {sentenceBlocks.present.slice(0, 3).map((s) => (
                  <div className="example-row" key={s.de}>
                    <div className="example-de">{s.de}</div>
                    <div className="example-en">{s.en}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="boss-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>können</th>
                  <th>müssen</th>
                  <th>dürfen</th>
                  <th>sollen</th>
                  <th>wollen</th>
                  <th>mögen</th>
                </tr>
              </thead>
              <tbody>
                {presentRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showExamples && (
            <div className="examples-list">
              {sentenceBlocks.present.map((s) => (
                <div className="example-row" key={s.de}>
                  <div className="example-de">{s.de}</div>
                  <div className="example-en">{s.en}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 3: PRATERITUM ── */}
        <section className="case-section case-dat">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-dat">3</div>
              <div>
                <div className="case-title">Simple past — Präteritum</div>
                <div className="case-sublabel">
                  Very common for modals in everyday German, unlike many other
                  verbs.
                </div>
              </div>
            </div>
            <div className="case-question">Remove umlaut, add -te</div>
          </div>
          <div className="boss-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Infinitive</th>
                  <th>3rd singular</th>
                  <th>3rd plural</th>
                  <th>English</th>
                </tr>
              </thead>
              <tbody>
                {prateritumRows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td className="td-english">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showExamples && (
            <div className="examples-list">
              {sentenceBlocks.past.map((s) => (
                <div className="example-row" key={s.de}>
                  <div className="example-de">{s.de}</div>
                  <div className="example-en">{s.en}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 4: PERFECT + DOUBLE INFINITIVE ── */}
        <section className="case-section case-gen">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-gen">4</div>
              <div>
                <div className="case-title">
                  Perfect tenses and the double infinitive
                </div>
                <div className="case-sublabel">
                  The key structural exception — no participle when a second
                  verb is present.
                </div>
              </div>
            </div>
            <div className="case-question">Perfekt / Plusquamperfekt</div>
          </div>
          <div className="boss-grid">
            <div className="boss-block">
              <div className="boss-block-label">Present perfect (Perfekt)</div>
              <div className="mental-model">
                <div className="boss-example">
                  haben + full verb infinitive + modal infinitive
                </div>
                <div className="boss-en">Ich habe gehen können.</div>
                <div className="boss-en">Er hat arbeiten müssen.</div>
                <div className="boss-en">
                  Die Studentin hat diese Woche fleißig lernen müssen.
                </div>
              </div>
            </div>
            <div className="boss-block">
              <div className="boss-block-label">
                Past perfect (Plusquamperfekt)
              </div>
              <div className="mental-model">
                <div className="boss-example">
                  hatte + full verb infinitive + modal infinitive
                </div>
                <div className="boss-en">Ich hatte damals arbeiten müssen.</div>
                <div className="boss-en">
                  Der Ingenieur hatte die Maschine reparieren können.
                </div>
              </div>
            </div>
          </div>
          <div className="boss-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Situation</th>
                  <th>Form at the end</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>modal + full verb</td>
                  <td>double infinitive</td>
                  <td>… arbeiten müssen</td>
                </tr>
                <tr>
                  <td>modal alone</td>
                  <td>participle</td>
                  <td>… habe nichts gewollt</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="boss-block-label"
            style={{ marginTop: "var(--space-4)" }}
          >
            Special case — without a dependent verb
          </div>
          <div className="boss-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tense</th>
                  <th>Example</th>
                  <th>English</th>
                </tr>
              </thead>
              <tbody>
                {specialCases.map((row) => (
                  <tr key={row[1]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td className="td-english">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 5: FUTURE + SEMANTICS ── */}
        <section className="case-section case-nom">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-nom">5</div>
              <div>
                <div className="case-title">
                  Future tense and semantic meaning types
                </div>
                <div className="case-sublabel">
                  Future I and dynamic / deontic / epistemic readings.
                </div>
              </div>
            </div>
            <div className="case-question">Futur + semantics</div>
          </div>
          <div className="controls">
            {[
              ["future", "Future I"],
              ["semantics", "Semantic types"],
              ["past", "Präteritum examples"],
              ["perfect", "Perfect examples"],
            ].map(([k, label]) => (
              <button
                key={k}
                className={`examples-toggle ${activeView === k ? "active" : ""}`}
                onClick={() => setActiveView(k)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="examples-list">
            {activeExamples.map((s) => (
              <div className="example-row" key={s.de}>
                <div className="example-de">{s.de}</div>
                <div className="example-en">{s.en}</div>
              </div>
            ))}
          </div>
          <div className="mental-model">
            <div className="mental-model-title">Semantic types</div>
            <ul className="mental-steps">
              <li>
                <span className={inlineTags.nom}>Dynamic</span> — ability or
                internal possibility. Er kann sehr schnell laufen.
              </li>
              <li>
                <span className={inlineTags.acc}>Deontic</span> — duty, rules,
                permission. Du musst den Bericht abgeben. Du darfst hier nicht
                parken.
              </li>
              <li>
                <span className={inlineTags.dat}>Epistemic</span> — speaker's
                inference. Er muss jetzt im Büro sein.
              </li>
              <li>
                <span className={inlineTags.gen}>Same modal</span> can shift
                meaning depending on whether it refers to rules or inference.
              </li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 6: LEVEL PROGRESSION ── */}
        <section className="case-section case-acc">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-acc">6</div>
              <div>
                <div className="case-title">
                  Level-by-level progression A1 → C1
                </div>
                <div className="case-sublabel">
                  Based on typical teaching materials.
                </div>
              </div>
            </div>
            <div className="case-question">Progression map</div>
          </div>
          <div className="boss-grid">
            <div className="boss-block">
              <div className="boss-block-label">Selected: {level.level}</div>
              <div className="mental-model">
                <div className="boss-example">{level.level}</div>
                <div className="boss-en">{level.items[0]}</div>
                <div className="boss-en">{level.items[1]}</div>
              </div>
            </div>
            <div className="boss-block">
              <div className="boss-block-label">All levels</div>
              <div className="prep-groups">
                {levels.map((l, i) => (
                  <div
                    className={`prep-group ${["prep-wechsel", "prep-acc", "prep-dat", "prep-gen"][i]}`}
                    key={l.level}
                  >
                    <div className="prep-case-tag">{l.level}</div>
                    <div className="prep-chips">
                      {l.items.map((item) => (
                        <span className="prep-chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: WORD ORDER ── */}
        <section className="case-section case-dat">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-dat">7</div>
              <div>
                <div className="case-title">Core sentence structure rules</div>
                <div className="case-sublabel">
                  Main clause, subordinate clause, and the one pattern that
                  almost never fails.
                </div>
              </div>
            </div>
            <div className="case-question">Word order</div>
          </div>
          <div className="boss-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Clause type</th>
                  <th>Rule</th>
                </tr>
              </thead>
              <tbody>
                {wordOrder.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showExamples && (
            <div className="examples-list">
              <div className="example-row">
                <div className="example-de">Heute muss ich lange arbeiten.</div>
                <div className="example-en">
                  Today I must work for a long time.
                </div>
              </div>
              <div className="example-row">
                <div className="example-de">Ich kann jetzt nicht kommen.</div>
                <div className="example-en">I cannot come now.</div>
              </div>
              <div className="example-row">
                <div className="example-de">
                  …, weil ich heute lange arbeiten muss.
                </div>
                <div className="example-en">
                  ...because I must work for a long time today.
                </div>
              </div>
              <div className="example-row">
                <div className="example-de">…, dass er morgen kommen kann.</div>
                <div className="example-en">...that he can come tomorrow.</div>
              </div>
            </div>
          )}
        </section>

        {/* ── SECTION 8: PRACTICAL USE CASES ── */}
        <section className="case-section case-gen">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-gen">8</div>
              <div>
                <div className="case-title">Practical use cases by modal</div>
                <div className="case-sublabel">
                  Typical use and structural impact per modal.
                </div>
              </div>
            </div>
            <div className="case-question">Use cases</div>
          </div>
          <div className="boss-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Modal</th>
                  <th>Use case</th>
                  <th>Example</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {practicalUses.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td className="td-english">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 9: GOTCHAS ── */}
        <section className="case-section case-nom">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-nom">9</div>
              <div>
                <div className="case-title">
                  Common mistakes and practical points
                </div>
                <div className="case-sublabel">
                  The things learners trip over most often.
                </div>
              </div>
            </div>
            <div className="case-question">Gotchas</div>
          </div>
          <div className="prep-groups">
            <div className="prep-group prep-wechsel">
              <div className="prep-case-tag">Pattern</div>
              <div className="prep-note">
                Modals are finite; the main action verb stays an infinitive at
                the clause end.
              </div>
            </div>
            <div className="prep-group prep-dat">
              <div className="prep-case-tag">Pattern</div>
              <div className="prep-note">
                Simple past of modals is widely used in spoken German, unlike
                many other verbs.
              </div>
            </div>
            <div className="prep-group prep-acc">
              <div className="prep-case-tag">Pattern</div>
              <div className="prep-note">
                With another verb → double infinitive in perfect tenses; without
                another verb → normal participle.
              </div>
            </div>
            <div className="prep-group prep-gen">
              <div className="prep-case-tag">Pattern</div>
              <div className="prep-note">
                möchten behaves like its own polite present modal; for past use
                wollte or hätte … wollen, not möchte.
              </div>
            </div>
          </div>
          {showExamples && (
            <div className="examples-list">
              {sentenceBlocks.gotchas.map((s) => (
                <div className="example-row" key={s.de}>
                  <div className="example-de">{s.de}</div>
                  <div className="example-en">{s.en}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 10: MENTAL MODEL (DEV) ── */}
        <section className="case-section case-acc">
          <div className="case-header">
            <div className="case-header-left">
              <div className="case-badge case-badge-acc">10</div>
              <div>
                <div className="case-title">Developer mental model</div>
                <div className="case-sublabel">
                  Think of the modal as the controller and the verb as the
                  payload.
                </div>
              </div>
            </div>
            <div className="case-question">Cluster logic</div>
          </div>
          <div className="mental-model">
            <div className="mental-model-title">Verb cluster algorithm</div>
            <ul className="mental-steps">
              <li>
                <span className={inlineTags.nom}>Finite verb slot</span> — tense
                and person are handled by the modal.
              </li>
              <li>
                <span className={inlineTags.acc}>Final infinitive</span> — main
                semantic action always at clause end.
              </li>
              <li>
                <span className={inlineTags.dat}>
                  Ich werde arbeiten müssen.
                </span>{" "}
                — I will have to work.
              </li>
              <li>
                <span className={inlineTags.dat}>
                  Ich hätte arbeiten müssen.
                </span>{" "}
                — I would have had to work.
              </li>
              <li>
                <span className={inlineTags.gen}>
                  …, weil ich hätte arbeiten müssen.
                </span>{" "}
                — ...because I would have had to work.
              </li>
              <li>
                <span className={inlineTags.gen}>
                  Subordinate perfect variant:
                </span>{" "}
                …, weil er hatte arbeiten müssen. (vs …, weil er arbeiten müssen
                hatte.)
              </li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 11: INTERACTIVE TRAINER ── */}
        <section className="case-boss-card">
          <div className="case-boss-title">Interactive trainer</div>
          <div className="boss-grid">
            <div className="boss-block">
              <div className="boss-block-label">Sentence input</div>
              <div className="input-wrap">
                <input
                  className={`answer-input ${feedback === "correct" ? "correct" : feedback === "wrong" ? "wrong" : ""}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && validate()}
                  placeholder="Try: Ich muss arbeiten"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-2)",
                }}
              >
                <button className="btn-reset" onClick={validate}>
                  Check
                </button>
                <button
                  className="btn-reset"
                  onClick={() => {
                    setInput("");
                    setFeedback("");
                  }}
                >
                  Reset
                </button>
              </div>
              <div
                className="prep-note"
                style={{ marginTop: "var(--space-2)" }}
              >
                Also try: <em>weil ich arbeiten muss</em> ·{" "}
                <em>Du darfst nicht rauchen</em> ·{" "}
                <em>Du musst nicht rauchen</em>
              </div>
            </div>
            <div className="boss-block">
              <div className="boss-block-label">What the trainer checks</div>
              <div className="mental-model">
                <div className="boss-example">
                  Correct if verb remains infinitive at clause end.
                </div>
                <div className="boss-en">Wrong: Ich muss arbeite.</div>
                <div className="boss-en">Wrong: weil ich muss arbeiten.</div>
                <div className="boss-en">
                  No obligation: Du musst nicht rauchen.
                </div>
                <div className="boss-en">
                  Prohibition: Du darfst nicht rauchen.
                </div>
                <div className="boss-en">
                  Overusing möchten in past: Ich hätte das machen wollen. (not
                  möchten)
                </div>
                <div className="boss-en">
                  Possibility: Das kann stimmen. (preferred over mögen)
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
