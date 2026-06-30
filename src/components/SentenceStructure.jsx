import React, { useState, useMemo } from "react";

const sentenceStructureData = {
  meta: {
    title: "German Sentence Structure",
    scope: "A1 to B2",
    purpose:
      "Complete reference for German sentence structure: verb position, middle field, tenses, modals, passive, negation, questions, relative clauses, and infinitive constructions.",
  },

  coreRule: {
    summary:
      "German sentence structure is built around the position of the finite verb. In main clauses the finite verb is in position 2. In yes/no questions and imperatives it comes first. In subordinate clauses it goes to the end.",
    memoryFormula: [
      "Main clause = one item before the finite verb",
      "Question/imperative = finite verb first",
      "Subordinate clause = finite verb last",
    ],
    frames: [
      {
        type: "Main clause (V2)",
        variants: [
          { label: "Subject first", example: "Ich lerne heute Deutsch." },
          { label: "Time first", example: "Heute lerne ich Deutsch." },
          { label: "Object first", example: "Deutsch lerne ich heute." },
        ],
      },
      {
        type: "Yes/no question or command (V1)",
        variants: [
          { label: "Question", example: "Lernst du heute Deutsch?" },
          { label: "Command", example: "Komm bitte herein." },
        ],
      },
      {
        type: "Subordinate clause (verb-final)",
        variants: [
          { label: "With weil", example: "..., weil ich heute Deutsch lerne." },
          { label: "With dass", example: "..., dass er keine Zeit hat." },
        ],
      },
    ],
  },

  mainClause: {
    description:
      "A standard German main clause follows: Position 1 + finite verb + middle field + verbal end.",
    breakdown: {
      example: "Ich habe gestern im Büro lange gearbeitet.",
      parts: [
        { label: "Position 1", value: "Ich" },
        { label: "Finite verb", value: "habe" },
        { label: "Middle field", value: "gestern im Büro lange" },
        { label: "Verbal end", value: "gearbeitet" },
      ],
    },
    byTensePattern: [
      { tense: "Simple tense", example: "Ich arbeite heute zu Hause." },
      {
        tense: "Compound tense",
        example: "Ich habe heute zu Hause gearbeitet.",
      },
      { tense: "Modal", example: "Ich muss heute zu Hause arbeiten." },
      { tense: "Future", example: "Ich werde heute zu Hause arbeiten." },
    ],
  },

  positionOne: {
    description:
      "Only one unit stands before the finite verb in a normal main clause. That unit can be a whole phrase, not just one word.",
    possibleUnits: [
      { type: "Subject", example: "Ich arbeite heute." },
      { type: "Time phrase", example: "Heute arbeite ich." },
      { type: "Place phrase", example: "Im Büro arbeite ich konzentrierter." },
      { type: "Object", example: "Das Buch lese ich morgen." },
      {
        type: "Subordinate clause",
        example: "Wenn ich Zeit habe, lese ich das Buch.",
      },
      { type: "Infinitive phrase", example: "Deutsch zu lernen macht Spaß." },
    ],
    phraseExamples: [
      "Am Montag arbeite ich nicht.",
      "Mit meiner Schwester spreche ich oft Deutsch.",
      "Nach dem Kurs gehe ich nach Hause.",
    ],
    note: "Morgen nach Berlin fahre ich is wrong in normal neutral structure because that puts too much before the finite verb.",
  },

  subjectAndVerb: {
    description:
      "German does not require the subject to come first. The finite verb must remain in position 2. When something other than the subject takes position 1, the subject comes right after the finite verb.",
    examples: [
      "Ich fahre morgen nach Berlin.",
      "Morgen fahre ich nach Berlin.",
      "Nach Berlin fahre ich morgen.",
    ],
    inversionExamples: [
      "Heute arbeite ich länger.",
      "Im Sommer fahre ich nach Italien.",
      "Wegen des Wetters bleiben wir zu Hause.",
    ],
    note: "From an English-speaking learner's perspective this looks like inversion, but in German it is just normal V2 structure.",
  },

  middleField: {
    description:
      "The section between the finite verb and the final verb part is the middle field. It holds the subject (if not in position 1), objects, adverbs, prepositional phrases, negation, and particles.",
    breakdown: {
      example:
        "Heute hat der Lehrer den Schülern die Regel sehr genau erklärt.",
      parts: [
        { label: "Position 1", value: "Heute" },
        { label: "Finite verb", value: "hat" },
        {
          label: "Middle field",
          value: "der Lehrer den Schülern die Regel sehr genau",
        },
        { label: "Final verb part", value: "erklärt" },
      ],
    },
    tekamolo: {
      label: "TeKaMoLo order (strong tendency, not absolute law)",
      fields: [
        { abbr: "Te", label: "Temporal", example: "heute" },
        { abbr: "Ka", label: "Kausal (cause)", example: "wegen des Projekts" },
        { abbr: "Mo", label: "Modal (manner)", example: "konzentriert" },
        { abbr: "Lo", label: "Lokal (place)", example: "im Büro" },
      ],
      fullExample: "Ich arbeite heute wegen des Projekts konzentriert im Büro.",
    },
    pronounTendencies: [
      "Pronouns come before full nouns",
      "Personal pronouns cluster very early",
      "Nominative before dative before accusative in neutral order",
      "Pronouns can shift this pattern",
    ],
    pronounExamples: [
      "Ich habe es ihm gestern gegeben.",
      "Heute erkläre ich es dir.",
      "Weil ich es dir gestern erklärt habe, verstehst du es jetzt.",
    ],
  },

  verbBracket: {
    description:
      "German often creates a verb bracket: the finite verb appears early and the non-finite part appears at the end.",
    triggers: [
      "Separable verbs",
      "Perfect tenses",
      "Future",
      "Modal verbs",
      "Passive forms",
    ],
    examples: [
      "Ich stehe jeden Tag um sechs Uhr auf.",
      "Er hat das Buch gestern gelesen.",
      "Wir werden morgen früher abfahren.",
      "Sie muss heute lange arbeiten.",
    ],
    separableVerbs: {
      note: "In subordinate clauses, the separable prefix rejoins the verb.",
      mainClause: ["Ich rufe dich morgen an.", "Er steht früh auf."],
      subordinate: [
        "..., weil ich dich morgen anrufe.",
        "..., weil er früh aufsteht.",
      ],
    },
  },

  tenseStructures: [
    {
      tense: "Präsens",
      mainClause: ["Ich lerne Deutsch.", "Heute lerne ich Deutsch."],
      subordinate: ["..., weil ich Deutsch lerne."],
    },
    {
      tense: "Präteritum",
      mainClause: ["Ich lernte Deutsch.", "Gestern lernte ich lange."],
      subordinate: ["..., weil ich Deutsch lernte."],
    },
    {
      tense: "Perfekt",
      mainClause: [
        "Ich habe Deutsch gelernt.",
        "Heute habe ich viel gearbeitet.",
      ],
      subordinate: [
        "..., weil ich Deutsch gelernt habe.",
        "..., nachdem ich viel gearbeitet habe.",
      ],
    },
    {
      tense: "Plusquamperfekt",
      mainClause: ["Ich hatte Deutsch gelernt."],
      subordinate: ["..., weil ich Deutsch gelernt hatte."],
    },
    {
      tense: "Futur I",
      mainClause: ["Ich werde Deutsch lernen."],
      subordinate: ["..., weil ich Deutsch lernen werde."],
    },
    {
      tense: "Futur II",
      mainClause: ["Ich werde Deutsch gelernt haben."],
      subordinate: ["..., weil ich Deutsch gelernt haben werde."],
    },
  ],

  modalVerbs: {
    description:
      "Modal verbs create very common structural patterns. In main clauses the modal is the finite verb; the infinitive goes to the end.",
    present: ["Ich muss arbeiten.", "Du kannst kommen.", "Er will schlafen."],
    mainClausePattern:
      "subject + modal finite verb + middle field + infinitive",
    mainClauseExample: "Ich muss heute im Büro arbeiten.",
    subordinate: ["..., weil ich heute im Büro arbeiten muss."],
    perfectWithModals: {
      note: "Grammatical but heavy. In many real contexts German prefers Präteritum.",
      examples: ["Ich habe arbeiten müssen.", "Er hat früh aufstehen müssen."],
      subordinate: [
        "..., weil ich habe arbeiten müssen.",
        "..., weil er früh hat aufstehen müssen.",
      ],
      preteritumAlternatives: [
        "Ich musste arbeiten.",
        "Er musste früh aufstehen.",
      ],
    },
    multipleInfinitives: [
      "Ich werde arbeiten müssen.",
      "Er hat kommen können.",
      "Sie wird abgeholt werden müssen.",
    ],
    b2Note:
      "At B2, the important skill is not always producing the heaviest forms spontaneously, but being able to read and understand them.",
  },

  passive: {
    description:
      "Process passive is formed with werden + past participle. State passive uses sein + past participle.",
    processPassive: {
      mainClause: [
        "Das Auto wird repariert.",
        "Der Bericht wurde gestern geschrieben.",
        "Das Haus ist gebaut worden.",
        "Die Datei wird gespeichert werden.",
      ],
      subordinate: [
        "..., weil das Auto repariert wird.",
        "..., weil der Bericht gestern geschrieben wurde.",
        "..., weil das Haus gebaut worden ist.",
      ],
    },
    passiveWithModal: {
      mainClause: ["Das Formular muss ausgefüllt werden."],
      subordinate: ["..., weil das Formular ausgefüllt werden muss."],
    },
    statePassive: {
      note: "Die Tür wird geschlossen = action. Die Tür ist geschlossen = state.",
      examples: [
        "Die Tür ist geschlossen.",
        "..., weil die Tür schon geschlossen ist.",
      ],
    },
  },

  objects: {
    description:
      "German sentences can contain a subject, accusative object, dative object, genitive object in limited cases, and a prepositional object.",
    examples: [
      "Ich gebe dem Kind das Buch.",
      "Er erklärt dem Kunden den Prozess.",
      "Wir warten auf den Bus.",
      "Sie denkt an ihre Mutter.",
    ],
    dativeAccusativeOrder: {
      neutral: "Ich gebe dem Mann das Buch.",
      withPronouns: ["Ich gebe es ihm.", "Ich gebe ihm das Buch."],
      wrong: "Ich gebe das ihm is wrong in normal structure.",
      tendencies: [
        "Pronouns usually come earlier",
        "Personal pronouns are especially early",
        "Nominative pronoun before accusative/dative pronouns often clusters early",
      ],
    },
  },

  adverbs: {
    description:
      "German adverbs are organized with a default TeKaMoLo tendency, but context and emphasis can shift the order.",
    tekamoloPriority:
      "Ich arbeite heute wegen der Prüfung sehr konzentriert zu Hause.",
    altOrders: [
      "Zu Hause arbeite ich heute sehr konzentriert.",
      "Sehr konzentriert arbeite ich heute zu Hause.",
    ],
    types: [
      {
        type: "Frequency",
        examples: [
          "Ich gehe oft ins Fitnessstudio.",
          "Er liest normalerweise abends.",
        ],
      },
      {
        type: "Manner",
        examples: ["Sie spricht langsam.", "Er arbeitet sorgfältig."],
      },
      {
        type: "Sentence/opinion",
        examples: [
          "Vielleicht kommt er morgen.",
          "Wahrscheinlich hat sie recht.",
          "Leider kann ich nicht kommen.",
        ],
      },
    ],
    positionOneAdverbs: [
      "Vielleicht kommt er morgen.",
      "Leider habe ich keine Zeit.",
    ],
  },

  adjectives: {
    roles: [
      {
        role: "Predicative",
        rule: "After sein, werden, bleiben. No adjective ending.",
        examples: [
          "Das Auto ist teuer.",
          "Der Stoff wird weicher.",
          "Das Wetter bleibt schön.",
        ],
      },
      {
        role: "Attributive",
        rule: "Before a noun with adjective ending.",
        examples: [
          "ein schönes Haus",
          "der neue Vertrag",
          "Ich kaufe ein schönes Haus.",
        ],
      },
      {
        role: "Adverbial",
        rule: "Used like an adverb, same form as base adjective.",
        examples: [
          "Er spricht laut.",
          "Sie arbeitet schnell.",
          "Das Kind schläft ruhig.",
        ],
      },
    ],
    comparativeStructures: [
      "Das Auto ist schneller als das andere.",
      "Er arbeitet besser als ich.",
      "Je mehr ich lerne, desto sicherer spreche ich.",
    ],
  },

  prepositionalPhrases: {
    description:
      "Prepositional phrases can occupy position 1, sit in the middle field, or follow objects depending on emphasis and weight.",
    examples: [
      "Im Büro arbeite ich besser.",
      "Ich arbeite im Büro besser.",
      "Wegen des Wetters bleiben wir zu Hause.",
      "Mit meinem Bruder spreche ich oft Deutsch.",
    ],
    distinction: {
      note: "Do not confuse free adverbial prepositional phrases with fixed prepositional objects.",
      free: "Ich arbeite im Büro. (free adverbial)",
      fixed: "Ich denke an dich. (fixed prepositional object)",
    },
    fixedObjects: [
      "Ich warte auf den Bus.",
      "Sie interessiert sich für Kunst.",
      "Wir sprechen über das Problem.",
    ],
  },

  negation: {
    kein: {
      rule: "Used with nouns without a definite article.",
      examples: ["Ich habe kein Auto.", "Sie trinkt keinen Kaffee."],
    },
    nicht: {
      rule: "Used to negate verbs, adjectives, adverbs, prepositional phrases, definite nouns, and whole clauses.",
      examples: [
        "Ich arbeite heute nicht.",
        "Das ist nicht teuer.",
        "Er kommt nicht aus Berlin.",
        "Ich kenne den Mann nicht.",
      ],
    },
    position: {
      description:
        "Nicht usually comes before the element being negated, or near the end of the clause if the whole predicate is negated.",
      examples: [
        "Ich komme heute nicht.",
        "Ich komme nicht heute, sondern morgen.",
        "Er arbeitet nicht im Büro.",
        "Sie spricht nicht schnell.",
        "Ich kann heute nicht kommen.",
        "Ich habe ihn nicht gesehen.",
        "..., weil ich heute nicht komme.",
        "..., weil ich ihn nicht gesehen habe.",
      ],
      meaningShift: [
        { ex: "Ich komme heute nicht.", note: "Not coming today" },
        {
          ex: "Ich komme nicht heute.",
          note: "Not today specifically, but another day",
        },
        { ex: "Ich komme nicht aus Berlin.", note: "Origin negated" },
      ],
    },
  },

  questions: {
    yesNo: {
      rule: "Finite verb comes first.",
      examples: [
        "Kommst du morgen?",
        "Hast du das Buch gelesen?",
        "Kann er heute arbeiten?",
      ],
    },
    wQuestion: {
      rule: "Question word first, finite verb second.",
      examples: [
        "Wann kommst du?",
        "Warum hast du das gemacht?",
        "Wo wohnt er?",
        "Mit wem sprichst du?",
      ],
    },
    indirect: {
      rule: "Verb-final, like subordinate clauses.",
      examples: [
        "Ich weiß nicht, wann er kommt.",
        "Kannst du mir sagen, ob er heute arbeitet?",
      ],
    },
  },

  imperatives: {
    rule: "Verb comes first.",
    examples: ["Komm!", "Kommt bitte herein!", "Kommen Sie bitte herein!"],
    separable: ["Ruf mich an!", "Steh bitte auf!"],
    negated: ["Komm nicht zu spät!", "Ruf ihn nicht an!"],
  },

  subordinateClauses: {
    description: "Subordinate clauses send the finite verb to the end.",
    withConjunctions: {
      examples: [
        "..., weil ich müde bin",
        "..., dass er heute keine Zeit hat",
        "..., wenn wir früher gehen",
        "..., obwohl sie krank ist",
        "..., nachdem er angekommen war",
      ],
      sentenceExamples: [
        "Ich gehe nach Hause, weil ich müde bin.",
        "Weil ich müde bin, gehe ich nach Hause.",
      ],
    },
    verbClusters: {
      note: "The verbal end cluster is one of the hardest parts of German sentence structure.",
      examples: [
        "..., weil ich habe arbeiten müssen.",
        "..., weil das Auto repariert werden muss.",
        "..., weil ich ihn habe kommen sehen.",
      ],
    },
  },

  relativeClauses: {
    description:
      "Relative clauses are subordinate clauses and therefore verb-final. The relative pronoun matches the antecedent in gender and number, but its case depends on its function inside the relative clause.",
    examples: [
      "Das ist der Mann, der hier arbeitet.",
      "Das ist die Frau, die ich gestern gesehen habe.",
      "Das ist das Haus, in dem ich wohne.",
      "Das ist der Freund, mit dem ich gesprochen habe.",
    ],
    caseNote: {
      example: "Der Mann, den ich sehe ...",
      explanation:
        "Masculine singular antecedent, but accusative case inside the clause.",
    },
    casePair: [
      {
        example: "der Mann, den ich sehe",
        note: "accusative — he is the object",
      },
      {
        example: "der Mann, der mich sieht",
        note: "nominative — he is the subject",
      },
    ],
  },

  infinitiveConstructions: {
    description: "Infinitive constructions are essential for compact German.",
    types: [
      {
        construction: "um ... zu",
        note: "in order to",
        example: "Ich lerne viel, um die Prüfung zu bestehen.",
      },
      {
        construction: "ohne ... zu",
        note: "without doing",
        example: "Er ging, ohne etwas zu sagen.",
      },
      {
        construction: "anstatt ... zu",
        note: "instead of doing",
        example: "Sie spielte, anstatt zu arbeiten.",
      },
      {
        construction: "verb + zu + infinitive",
        note: "many verbs require zu",
        example: "Ich hoffe, bald zu kommen.",
      },
    ],
    modalNote: "Modal verbs do not take zu: Ich kann kommen.",
    verbsWithZu: [
      "Ich plane, morgen zu kommen.",
      "Er versucht, Deutsch zu lernen.",
    ],
  },

  es: {
    description: "German es has several different structural roles.",
    roles: [
      { role: "Real subject", examples: ["Es regnet.", "Es ist kalt."] },
      {
        role: "Placeholder in position 1 (formal/literary)",
        examples: ["Es kamen viele Leute.", "(vs. Viele Leute kamen.)"],
      },
      {
        role: "Fixed expression",
        examples: [
          "Es gibt viele Möglichkeiten.",
          "Es gibt ein Problem.",
          "Es gibt viele Probleme.",
        ],
      },
    ],
    esGibtNote:
      "Es gibt always stays singular in form regardless of what follows.",
  },

  impersonalStructures: {
    esGibt: [
      "Es gibt hier ein gutes Restaurant.",
      "In der Stadt gibt es viele Museen.",
    ],
    impersonalPassive: [
      "Hier wird gearbeitet.",
      "Es wird viel gelacht.",
      "Heute wird nicht gearbeitet.",
    ],
    weatherConditions: ["Es schneit.", "Es ist spät.", "Es geht mir gut."],
  },

  comparisonAndEmphasis: {
    standard: ["Er ist größer als ich.", "Das ist besser als vorher."],
    correlative: {
      pattern: "Je [comparative], desto [comparative]",
      examples: [
        "Je mehr ich lese, desto besser schreibe ich.",
        "Je länger wir warten, desto teurer wird es.",
      ],
    },
    emphasis:
      "Emphasis is often done by fronting in position 1, not by cleft structures as in English.",
    emphasisExamples: [
      "Dieses Buch habe ich nicht gelesen.",
      "Heute kann ich nicht kommen.",
    ],
  },

  verbTypes: [
    {
      type: "Intransitive",
      rule: "No direct object",
      examples: ["Er schläft.", "Das Kind lacht."],
    },
    {
      type: "Transitive",
      rule: "Take accusative object",
      examples: ["Ich lese das Buch.", "Sie kauft einen Mantel."],
    },
    {
      type: "Dative verbs",
      rule: "Dative object only",
      examples: ["Ich helfe dem Mann.", "Das gefällt mir."],
    },
    {
      type: "Dative + accusative",
      rule: "Both objects",
      examples: ["Ich gebe dem Kind das Buch.", "Er zeigt mir den Weg."],
    },
    {
      type: "Reflexive",
      rule: "Reflexive pronoun required",
      examples: ["Ich erinnere mich an ihn.", "Wir treffen uns morgen."],
    },
    {
      type: "Fixed preposition",
      rule: "Verb governs a fixed preposition",
      examples: ["Ich warte auf den Bus.", "Sie besteht auf einer Erklärung."],
    },
    {
      type: "Copular",
      rule: "Followed by predicative complement, not direct object",
      examples: [
        "Er ist müde.",
        "Sie wird Ärztin.",
        "Das Wetter bleibt schön.",
      ],
    },
  ],

  heavyNounSentences: {
    description:
      "German becomes harder when many elements are present. Both word orders below are grammatical; choice depends on emphasis.",
    example: {
      sentence:
        "Der neue Mitarbeiter hat dem Kunden gestern im Büro das Angebot ausführlich erklärt.",
      parts: [
        { label: "Subject", value: "der neue Mitarbeiter" },
        { label: "Finite verb", value: "hat" },
        { label: "Dative object", value: "dem Kunden" },
        { label: "Time", value: "gestern" },
        { label: "Place", value: "im Büro" },
        { label: "Accusative object", value: "das Angebot" },
        { label: "Manner", value: "ausführlich" },
        { label: "Final verb", value: "erklärt" },
      ],
    },
    alternative:
      "Gestern hat der neue Mitarbeiter dem Kunden im Büro das Angebot ausführlich erklärt.",
  },

  commonPatterns: [
    { label: "Statement", example: "Ich lerne Deutsch." },
    { label: "Time first", example: "Heute lerne ich Deutsch." },
    { label: "Object first", example: "Deutsch lerne ich heute." },
    { label: "Perfect", example: "Ich habe heute Deutsch gelernt." },
    { label: "Modal", example: "Ich muss heute Deutsch lernen." },
    { label: "Passive", example: "Deutsch wird heute gelernt." },
    {
      label: "With subordinate clause",
      example: "Ich lerne Deutsch, weil ich in Deutschland arbeiten will.",
    },
    {
      label: "Subordinate clause first",
      example: "Weil ich in Deutschland arbeiten will, lerne ich Deutsch.",
    },
    {
      label: "Relative clause",
      example: "Das ist das Buch, das ich heute gelesen habe.",
    },
    {
      label: "Infinitive clause",
      example: "Ich lerne Deutsch, um in Deutschland zu arbeiten.",
    },
    { label: "Yes/no question", example: "Lernst du heute Deutsch?" },
    { label: "W-question", example: "Warum lernst du Deutsch?" },
    { label: "Negation (full)", example: "Ich lerne heute nicht." },
    {
      label: "Negation (contrastive)",
      example: "Ich lerne nicht heute, sondern morgen.",
    },
  ],

  exceptionsAndWatches: [
    {
      title: "V2 is non-negotiable in main clauses",
      wrong: "Heute ich lerne Deutsch.",
      correct: "Heute lerne ich Deutsch.",
    },
    {
      title: "Verb-final in subordinate clauses",
      wrong: "..., weil ich lerne Deutsch",
      correct: "..., weil ich Deutsch lerne.",
    },
    {
      title: "One element before the finite verb",
      note: "Usually only one constituent can stand before the finite verb in a standard main clause.",
    },
    {
      title: "Separable verbs split only in main clauses",
      mainClause: "Ich rufe dich an.",
      subordinate: "..., weil ich dich anrufe.",
    },
    {
      title: "Modals and auxiliaries create verb clusters",
      example:
        "Ich habe arbeiten müssen. / ..., weil ich habe arbeiten müssen.",
    },
    {
      title: "Nominative is not always first",
      examples: ["Morgen komme ich.", "Den Film habe ich schon gesehen."],
    },
    {
      title: "Nicht placement changes meaning",
      examples: [
        "Ich komme heute nicht.",
        "Ich komme nicht heute.",
        "Ich komme nicht aus Berlin.",
      ],
    },
    {
      title: "Two-way prepositions affect case, not the V2 rule",
      examples: ["Ich bin im Büro.", "Ich gehe ins Büro."],
    },
    {
      title: "Relative pronoun case depends on clause role",
      examples: ["der Mann, den ich sehe", "der Mann, der mich sieht"],
    },
    {
      title: "Heavy end clusters are normal in advanced German",
      example:
        "..., weil der Bericht gestern hat fertiggestellt werden müssen.",
      note: "Grammatical but stylistically heavy; many speakers prefer simpler alternatives.",
    },
  ],

  masterFormula: {
    lines: [
      "Main clause: [Position 1] + finite verb + middle field + verb end",
      "Question/command: finite verb + ...",
      "Subordinate clause: connector/relative/question word + ... + finite verb",
      "Compound tense/modal/passive: extra verbs gather at the end",
      "Meaning changes word order only by focus; clause type controls verb position",
    ],
    modelSentences: [
      "Ich lese das Buch.",
      "Heute lese ich das Buch.",
      "Ich habe das Buch gelesen.",
      "Ich muss das Buch lesen.",
      "Das Buch wird gelesen.",
      "Ich lese das Buch, weil ich morgen eine Prüfung habe.",
      "Das ist das Buch, das ich gestern gekauft habe.",
      "Um die Prüfung zu bestehen, lese ich das Buch heute noch.",
      "Wenn ich Zeit habe, lese ich zu Hause in Ruhe weiter.",
    ],
  },

  bestLearningOrder: [
    "Main clause V2",
    "Yes/no questions and imperatives",
    "Subordinate clause verb-final",
    "Perfect tense verb bracket",
    "Modal verb structures",
    "Separable verbs",
    "Negation with nicht and kein",
    "Dative/accusative object order",
    "Relative clauses",
    "Passive and advanced verb clusters",
  ],
};

const CASE_COLORS = {
  main: "#4f98a3",
  sub: "#e8af34",
  v1: "#6daa45",
  neutral: "#8dc2ff",
};

function Island({
  title,
  tag,
  color = CASE_COLORS.main,
  children,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...S.island, borderColor: open ? color + "44" : "#263241" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={S.islandBtn}
        aria-expanded={open}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...S.dot, background: color }} />
          <span style={S.islandTitle}>{title}</span>
          {tag && (
            <span style={{ ...S.tag, color, background: color + "18" }}>
              {tag}
            </span>
          )}
        </div>
        <span
          style={{
            color,
            transition: "transform .2s",
            transform: open ? "rotate(90deg)" : "none",
            display: "inline-block",
          }}
        >
          ›
        </span>
      </button>
      {open && <div style={S.islandBody}>{children}</div>}
    </div>
  );
}

function Node({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...S.node, ...(open ? S.nodeOpen : {}) }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={S.nodeBtn}
        aria-expanded={open}
      >
        <div>
          <div style={S.nodeTitle}>{title}</div>
          {subtitle && <div style={S.nodeSub}>{subtitle}</div>}
        </div>
        <span
          style={{
            color: "#4f98a3",
            fontSize: 18,
            transform: open ? "rotate(45deg)" : "none",
            display: "inline-block",
            transition: "transform .2s",
          }}
        >
          ✚
        </span>
      </button>
      {open && <div style={S.nodeBody}>{children}</div>}
    </div>
  );
}

function ExampleBox({ example, label }) {
  return (
    <div style={S.exampleBox}>
      {label && <div style={S.exLabel}>{label}</div>}
      <div style={S.exSentence}>{example}</div>
    </div>
  );
}

function BreakdownTable({ parts }) {
  return (
    <div style={S.breakTable}>
      {parts.map((p, i) => (
        <div key={i} style={S.breakRow}>
          <span style={S.breakLabel}>{p.label}</span>
          <span style={S.breakValue}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleTable({ columns, rows }) {
  return (
    <div style={S.tableWrap}>
      <table style={S.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={S.th}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((c) => (
                <td key={c.key} style={S.td}>
                  {Array.isArray(row[c.key])
                    ? row[c.key].join(", ")
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

function Chips({ items = [], color }) {
  return (
    <div style={S.chips}>
      {items.map((it, i) => (
        <span
          key={i}
          style={{
            ...S.chip,
            ...(color
              ? { color, borderColor: color + "44", background: color + "12" }
              : {}),
          }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items = [] }) {
  return (
    <ul style={S.ul}>
      {items.map((it, i) => (
        <li key={i} style={S.li}>
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function SentenceStructure() {
  const [search, setSearch] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const q = search.trim().toLowerCase();

  const filteredPatterns = useMemo(() => {
    if (!q) return sentenceStructureData.commonPatterns;
    return sentenceStructureData.commonPatterns.filter((p) =>
      (p.label + p.example).toLowerCase().includes(q),
    );
  }, [q]);

  const data = sentenceStructureData;

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Hero */}
        <header style={S.hero}>
          <div>
            <div style={S.eyebrow}>{data.meta.scope}</div>
            <h1 style={S.h1}>{data.meta.title}</h1>
            <p style={S.lead}>{data.meta.purpose}</p>
          </div>
          <div style={S.statsRow}>
            {[
              ["3", "Clause types"],
              ["6", "Tense patterns"],
              ["10", "Learning stages"],
              ["10", "Exceptions to watch"],
            ].map(([n, l]) => (
              <div key={l} style={S.stat}>
                <strong
                  style={{ fontSize: 28, fontWeight: 700, color: "#e8ecf1" }}
                >
                  {n}
                </strong>
                <span style={{ color: "#9fb0c2", fontSize: 13 }}>{l}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Search + controls */}
        <div style={S.controlRow}>
          <div style={S.searchBox}>
            <span style={{ color: "#4f98a3" }}>⌕</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sentences, tenses, rules, structures..."
              style={S.searchInput}
              aria-label="Search sentence structure content"
            />
          </div>
          <button onClick={() => setExpandAll((v) => !v)} style={S.ctrlBtn}>
            {expandAll ? "Collapse all" : "Expand all"}
          </button>
        </div>

        {/* Master formula pinned */}
        <div style={S.formulaBar}>
          <span
            style={{
              color: "#e8af34",
              fontWeight: 700,
              fontSize: 13,
              marginRight: 12,
            }}
          >
            MASTER FORMULA
          </span>
          {data.masterFormula.lines.map((l, i) => (
            <span key={i} style={S.formulaChip}>
              {l}
            </span>
          ))}
        </div>

        {/* Learning order */}
        <Island
          title="Recommended learning order"
          tag="Strategy"
          color={CASE_COLORS.neutral}
          defaultOpen={!expandAll}
        >
          <div style={S.orderGrid}>
            {data.bestLearningOrder.map((step, i) => (
              <div key={i} style={S.orderCard}>
                <span style={S.orderNum}>{i + 1}</span>
                <span style={{ color: "#dce6f2" }}>{step}</span>
              </div>
            ))}
          </div>
        </Island>

        {/* Core rule */}
        <Island
          title="Core rule & three main frames"
          tag="Foundation"
          color={CASE_COLORS.main}
        >
          <p style={S.copy}>{data.coreRule.summary}</p>
          <p style={{ ...S.label, marginBottom: 8 }}>Memory formula</p>
          <Chips items={data.coreRule.memoryFormula} color={CASE_COLORS.main} />
          <div style={{ ...S.grid2, marginTop: 16 }}>
            {data.coreRule.frames.map((frame) => (
              <Node key={frame.type} title={frame.type}>
                {frame.variants.map((v) => (
                  <ExampleBox
                    key={v.label}
                    label={v.label}
                    example={v.example}
                  />
                ))}
              </Node>
            ))}
          </div>
        </Island>

        {/* Main clause */}
        <Island
          title="Main clause structure (V2)"
          tag="Core"
          color={CASE_COLORS.main}
        >
          <Node
            title="Clause breakdown"
            subtitle="Position 1 + finite verb + middle field + verbal end"
          >
            <ExampleBox
              example={data.mainClause.breakdown.example}
              label="Full example"
            />
            <BreakdownTable parts={data.mainClause.breakdown.parts} />
          </Node>
          <Node
            title="By tense pattern"
            subtitle="How the verb frame shifts with tense"
          >
            <SimpleTable
              columns={[
                { key: "tense", label: "Tense" },
                { key: "example", label: "Example" },
              ]}
              rows={data.mainClause.byTensePattern}
            />
          </Node>
        </Island>

        {/* Position 1 */}
        <Island title="Position 1" tag="V2" color={CASE_COLORS.main}>
          <p style={S.copy}>{data.positionOne.description}</p>
          <Node
            title="What can occupy position 1"
            subtitle="One unit — can be a whole phrase"
          >
            <SimpleTable
              columns={[
                { key: "type", label: "Unit type" },
                { key: "example", label: "Example" },
              ]}
              rows={data.positionOne.possibleUnits}
            />
          </Node>
          <Node title="Phrase examples">
            {data.positionOne.phraseExamples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <div style={{ ...S.note, marginTop: 10 }}>
              {data.positionOne.note}
            </div>
          </Node>
        </Island>

        {/* Middle field */}
        <Island title="The middle field" tag="Core" color={CASE_COLORS.main}>
          <p style={S.copy}>{data.middleField.description}</p>
          <Node title="Breakdown example">
            <ExampleBox example={data.middleField.breakdown.example} />
            <BreakdownTable parts={data.middleField.breakdown.parts} />
          </Node>
          <Node
            title="TeKaMoLo order"
            subtitle={data.middleField.tekamolo.label}
          >
            <ExampleBox
              example={data.middleField.tekamolo.fullExample}
              label="Full TeKaMoLo sentence"
            />
            <SimpleTable
              columns={[
                { key: "abbr", label: "Abbr" },
                { key: "label", label: "Function" },
                { key: "example", label: "Example" },
              ]}
              rows={data.middleField.tekamolo.fields}
            />
          </Node>
          <Node title="Pronoun placement tendencies">
            <BulletList items={data.middleField.pronounTendencies} />
            {data.middleField.pronounExamples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Verb bracket */}
        <Island title="Verb brackets" tag="Structure" color={CASE_COLORS.main}>
          <Node
            title="When a bracket forms"
            subtitle="finite verb early, non-finite part at end"
          >
            <Chips items={data.verbBracket.triggers} />
            {data.verbBracket.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node
            title="Separable verbs"
            subtitle={data.verbBracket.separableVerbs.note}
          >
            <p style={S.label}>Main clause</p>
            {data.verbBracket.separableVerbs.mainClause.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Subordinate clause</p>
            {data.verbBracket.separableVerbs.subordinate.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Tense structures */}
        <Island
          title="Sentence structure by tense"
          tag="Tenses"
          color={CASE_COLORS.sub}
        >
          <p style={S.copy}>
            Tense changes verb forms, but clause type controls position.
          </p>
          <div style={S.grid2}>
            {data.tenseStructures.map((t) => (
              <Node key={t.tense} title={t.tense}>
                <p style={S.label}>Main clause</p>
                {t.mainClause.map((ex, i) => (
                  <ExampleBox key={i} example={ex} />
                ))}
                <p style={S.label}>Subordinate clause</p>
                {t.subordinate.map((ex, i) => (
                  <ExampleBox key={i} example={ex} />
                ))}
              </Node>
            ))}
          </div>
        </Island>

        {/* Modals */}
        <Island
          title="Modal verb structures"
          tag="Modals"
          color={CASE_COLORS.sub}
        >
          <p style={S.copy}>{data.modalVerbs.description}</p>
          <Node
            title="Present pattern"
            subtitle={data.modalVerbs.mainClausePattern}
          >
            <Chips items={data.modalVerbs.present} />
            <ExampleBox
              example={data.modalVerbs.mainClauseExample}
              label="Main clause"
            />
            {data.modalVerbs.subordinate.map((ex, i) => (
              <ExampleBox key={i} example={ex} label="Subordinate clause" />
            ))}
          </Node>
          <Node
            title="Perfect with modals"
            subtitle={data.modalVerbs.perfectWithModals.note}
          >
            <p style={S.label}>Grammatical heavy forms</p>
            {data.modalVerbs.perfectWithModals.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Subordinate</p>
            {data.modalVerbs.perfectWithModals.subordinate.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Preferred Präteritum alternatives</p>
            {data.modalVerbs.perfectWithModals.preteritumAlternatives.map(
              (ex, i) => (
                <ExampleBox key={i} example={ex} />
              ),
            )}
          </Node>
          <Node title="Multiple infinitives">
            {data.modalVerbs.multipleInfinitives.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <div style={S.note}>{data.modalVerbs.b2Note}</div>
          </Node>
        </Island>

        {/* Passive */}
        <Island
          title="Passive voice structures"
          tag="Passive"
          color={CASE_COLORS.sub}
        >
          <Node title="Process passive" subtitle="werden + past participle">
            <p style={S.label}>Main clause</p>
            {data.passive.processPassive.mainClause.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Subordinate clause</p>
            {data.passive.processPassive.subordinate.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node title="Passive with modal">
            {data.passive.passiveWithModal.mainClause.map((ex, i) => (
              <ExampleBox key={i} example={ex} label="Main clause" />
            ))}
            {data.passive.passiveWithModal.subordinate.map((ex, i) => (
              <ExampleBox key={i} example={ex} label="Subordinate" />
            ))}
          </Node>
          <Node title="State passive" subtitle={data.passive.statePassive.note}>
            {data.passive.statePassive.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Objects */}
        <Island
          title="Objects and object order"
          tag="Cases"
          color={CASE_COLORS.v1}
        >
          <p style={S.copy}>{data.objects.description}</p>
          <Node title="Basic examples">
            {data.objects.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node title="Dative/accusative ordering rules">
            <ExampleBox
              example={data.objects.dativeAccusativeOrder.neutral}
              label="Neutral (full nouns)"
            />
            <p style={S.label}>With pronouns</p>
            {data.objects.dativeAccusativeOrder.withPronouns.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <div style={S.note}>{data.objects.dativeAccusativeOrder.wrong}</div>
            <p style={S.label}>Tendencies</p>
            <BulletList items={data.objects.dativeAccusativeOrder.tendencies} />
          </Node>
        </Island>

        {/* Negation */}
        <Island
          title="Negation structure"
          tag="Negation"
          color={CASE_COLORS.v1}
        >
          <Node title="kein" subtitle={data.negation.kein.rule}>
            {data.negation.kein.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node title="nicht" subtitle={data.negation.nicht.rule}>
            {data.negation.nicht.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node title="Position of nicht — how placement shifts meaning">
            <p style={S.copy}>{data.negation.position.description}</p>
            <SimpleTable
              columns={[
                { key: "ex", label: "Sentence" },
                { key: "note", label: "Meaning" },
              ]}
              rows={data.negation.position.meaningShift}
            />
            <p style={S.label}>All position examples</p>
            {data.negation.position.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Questions */}
        <Island
          title="Questions and imperatives"
          tag="V1"
          color={CASE_COLORS.v1}
        >
          <Node title="Yes/no questions" subtitle={data.questions.yesNo.rule}>
            {data.questions.yesNo.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node title="W-questions" subtitle={data.questions.wQuestion.rule}>
            {data.questions.wQuestion.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node
            title="Indirect questions"
            subtitle={data.questions.indirect.rule}
          >
            {data.questions.indirect.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node title="Imperatives" subtitle={data.imperatives.rule}>
            {data.imperatives.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Separable</p>
            {data.imperatives.separable.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Negated</p>
            {data.imperatives.negated.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Subordinate clauses */}
        <Island
          title="Subordinate clauses"
          tag="Verb-final"
          color={CASE_COLORS.sub}
        >
          <p style={S.copy}>{data.subordinateClauses.description}</p>
          <Node title="With conjunctions">
            <p style={S.label}>Clause endings</p>
            {data.subordinateClauses.withConjunctions.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Full sentences</p>
            {data.subordinateClauses.withConjunctions.sentenceExamples.map(
              (ex, i) => (
                <ExampleBox key={i} example={ex} />
              ),
            )}
          </Node>
          <Node
            title="Verb clusters at the end"
            subtitle={data.subordinateClauses.verbClusters.note}
          >
            {data.subordinateClauses.verbClusters.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Relative clauses */}
        <Island
          title="Relative clauses"
          tag="Verb-final"
          color={CASE_COLORS.sub}
        >
          <p style={S.copy}>{data.relativeClauses.description}</p>
          <Node title="Examples">
            {data.relativeClauses.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node
            title="Case inside the relative clause"
            subtitle={data.relativeClauses.caseNote.explanation}
          >
            <ExampleBox example={data.relativeClauses.caseNote.example} />
            <SimpleTable
              columns={[
                { key: "example", label: "Relative clause" },
                { key: "note", label: "Why" },
              ]}
              rows={data.relativeClauses.casePair}
            />
          </Node>
        </Island>

        {/* Infinitive constructions */}
        <Island
          title="Infinitive constructions"
          tag="Compact German"
          color={CASE_COLORS.v1}
        >
          <p style={S.copy}>{data.infinitiveConstructions.description}</p>
          <SimpleTable
            columns={[
              { key: "construction", label: "Construction" },
              { key: "note", label: "Meaning" },
              { key: "example", label: "Example" },
            ]}
            rows={data.infinitiveConstructions.types}
          />
          <div style={S.note}>{data.infinitiveConstructions.modalNote}</div>
          <p style={S.label}>Verbs that need zu</p>
          {data.infinitiveConstructions.verbsWithZu.map((ex, i) => (
            <ExampleBox key={i} example={ex} />
          ))}
        </Island>

        {/* es + impersonal */}
        <Island
          title="Structural es and impersonal structures"
          tag="Advanced"
          color={CASE_COLORS.neutral}
        >
          <Node title="Roles of es" subtitle={data.es.description}>
            {data.es.roles.map((r) => (
              <div key={r.role} style={{ marginBottom: 10 }}>
                <p style={S.label}>{r.role}</p>
                {r.examples.map((ex, i) => (
                  <ExampleBox key={i} example={ex} />
                ))}
              </div>
            ))}
            <div style={S.note}>{data.es.esGibtNote}</div>
          </Node>
          <Node title="Impersonal structures">
            <p style={S.label}>es gibt</p>
            {data.impersonalStructures.esGibt.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Impersonal passive</p>
            {data.impersonalStructures.impersonalPassive.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
            <p style={S.label}>Weather/condition</p>
            {data.impersonalStructures.weatherConditions.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Verb types */}
        <Island
          title="Verb types and their sentence roles"
          tag="Verb types"
          color={CASE_COLORS.neutral}
        >
          <SimpleTable
            columns={[
              { key: "type", label: "Verb type" },
              { key: "rule", label: "Rule" },
              { key: "examples", label: "Examples" },
            ]}
            rows={data.verbTypes}
          />
        </Island>

        {/* Adjectives */}
        <Island
          title="Adjectives in sentence structure"
          tag="Adjectives"
          color={CASE_COLORS.neutral}
        >
          {data.adjectives.roles.map((r) => (
            <Node key={r.role} title={r.role} subtitle={r.rule}>
              {r.examples.map((ex, i) => (
                <ExampleBox key={i} example={ex} />
              ))}
            </Node>
          ))}
          <Node title="Comparative structures">
            {data.adjectives.comparativeStructures.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Comparison and emphasis */}
        <Island
          title="Comparison and emphasis"
          tag="B1-B2"
          color={CASE_COLORS.neutral}
        >
          <Node title="Standard comparison">
            {data.comparisonAndEmphasis.standard.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node
            title={`Correlative: ${data.comparisonAndEmphasis.correlative.pattern}`}
          >
            {data.comparisonAndEmphasis.correlative.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
          <Node
            title="Emphasis through fronting"
            subtitle={data.comparisonAndEmphasis.emphasis}
          >
            {data.comparisonAndEmphasis.emphasisExamples.map((ex, i) => (
              <ExampleBox key={i} example={ex} />
            ))}
          </Node>
        </Island>

        {/* Common patterns */}
        <Island
          title="Common use-case patterns"
          tag="Quick ref"
          color={CASE_COLORS.v1}
        >
          {filteredPatterns.length === 0 ? (
            <p style={S.copy}>No patterns match your search.</p>
          ) : (
            <SimpleTable
              columns={[
                { key: "label", label: "Pattern" },
                { key: "example", label: "Example" },
              ]}
              rows={filteredPatterns}
            />
          )}
        </Island>

        {/* Exceptions */}
        <Island
          title="Exceptions and points to watch"
          tag="Critical"
          color="#d9534f"
        >
          <div style={S.grid2}>
            {data.exceptionsAndWatches.map((ex, i) => (
              <div key={i} style={S.exceptionCard}>
                <div
                  style={{ color: "#d9534f", fontWeight: 700, marginBottom: 6 }}
                >
                  {i + 1}. {ex.title}
                </div>
                {ex.wrong && <ExampleBox label="✗ Wrong" example={ex.wrong} />}
                {ex.correct && (
                  <ExampleBox label="✓ Correct" example={ex.correct} />
                )}
                {ex.note && <div style={S.note}>{ex.note}</div>}
                {ex.example && <ExampleBox example={ex.example} />}
                {ex.mainClause && (
                  <ExampleBox label="Main clause" example={ex.mainClause} />
                )}
                {ex.subordinate && (
                  <ExampleBox label="Subordinate" example={ex.subordinate} />
                )}
                {ex.examples &&
                  ex.examples.map((e, j) => <ExampleBox key={j} example={e} />)}
              </div>
            ))}
          </div>
        </Island>

        {/* Model sentences */}
        <Island
          title="Model sentences across all structures"
          tag="Summary"
          color={CASE_COLORS.main}
        >
          <div style={S.modelGrid}>
            {data.masterFormula.modelSentences.map((s, i) => (
              <div key={i} style={S.modelCard}>
                {s}
              </div>
            ))}
          </div>
        </Island>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100dvh",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    fontFamily: "var(--font-body)",
    padding: "var(--space-8) var(--space-4) var(--space-12)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gap: "var(--space-4)",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "var(--space-5)",
    marginBottom: "var(--space-2)",
    alignItems: "start",
  },
  eyebrow: {
    display: "inline-block",
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
    fontSize: "var(--text-xs)",
    marginBottom: "var(--space-3)",
    letterSpacing: "0.06em",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  h1: {
    margin: "0 0 var(--space-3)",
    fontSize: "var(--text-xl)",
    lineHeight: 1.05,
    fontFamily: "var(--font-display)",
    color: "var(--color-text)",
  },
  lead: {
    margin: 0,
    color: "var(--color-text-muted)",
    fontSize: "var(--text-sm)",
    maxWidth: "68ch",
    lineHeight: 1.7,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "var(--space-3)",
  },
  stat: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-1)",
  },
  controlRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "var(--space-3)",
    marginBottom: "var(--space-1)",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-3) var(--space-4)",
  },
  searchInput: {
    border: 0,
    background: "transparent",
    color: "var(--color-text)",
    fontSize: "var(--text-sm)",
    width: "100%",
    outline: "none",
    fontFamily: "var(--font-body)",
  },
  ctrlBtn: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    color: "var(--color-text-muted)",
    padding: "var(--space-3) var(--space-4)",
    cursor: "pointer",
    fontSize: "var(--text-sm)",
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    transition:
      "color var(--transition-interactive), border-color var(--transition-interactive), background var(--transition-interactive)",
  },
  formulaBar: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
    padding: "var(--space-4) var(--space-5)",
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-2)",
    alignItems: "center",
    marginBottom: "var(--space-1)",
  },
  formulaChip: {
    background: "var(--color-surface-offset)",
    border: "1px solid var(--color-divider)",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-xs)",
    color: "var(--color-text-muted)",
  },
  island: {
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--color-border)",
    background: "var(--color-surface)",
    overflow: "hidden",
    transition: "border-color var(--transition-interactive)",
  },
  islandBtn: {
    width: "100%",
    border: 0,
    background: "var(--color-surface-2)",
    color: "var(--color-text)",
    padding: "var(--space-4) var(--space-5)",
    textAlign: "left",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "var(--text-base)",
    fontWeight: 700,
    fontFamily: "var(--font-body)",
  },
  islandTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    color: "var(--color-text)",
  },
  islandBody: {
    padding: "var(--space-5)",
    display: "grid",
    gap: "var(--space-3)",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "var(--radius-full)",
    display: "inline-block",
    flexShrink: 0,
  },
  tag: {
    fontSize: "var(--text-xs)",
    padding: "2px var(--space-2)",
    borderRadius: "var(--radius-full)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontWeight: 700,
  },
  node: {
    borderRadius: "var(--radius-lg)",
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-divider)",
    overflow: "hidden",
  },
  nodeOpen: {
    borderColor: "var(--color-primary)",
  },
  nodeBtn: {
    width: "100%",
    border: 0,
    background: "transparent",
    color: "var(--color-text)",
    padding: "var(--space-3) var(--space-4)",
    textAlign: "left",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    cursor: "pointer",
    gap: "var(--space-3)",
    fontFamily: "var(--font-body)",
  },
  nodeTitle: {
    fontWeight: 600,
    fontSize: "var(--text-sm)",
    color: "var(--color-text)",
  },
  nodeSub: {
    color: "var(--color-text-muted)",
    fontSize: "var(--text-xs)",
    marginTop: "var(--space-1)",
  },
  nodeBody: {
    padding: "0 var(--space-4) var(--space-4)",
    display: "grid",
    gap: "var(--space-2)",
  },
  exampleBox: {
    background: "var(--color-surface-offset)",
    border: "1px solid var(--color-divider)",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-2) var(--space-3)",
  },
  exLabel: {
    fontSize: "var(--text-xs)",
    color: "var(--color-primary)",
    marginBottom: "var(--space-1)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  exSentence: {
    color: "var(--color-text)",
    fontSize: "var(--text-sm)",
  },
  breakTable: {
    display: "grid",
    gap: "var(--space-2)",
    marginTop: "var(--space-3)",
  },
  breakRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: "var(--space-3)",
    alignItems: "start",
  },
  breakLabel: {
    color: "var(--color-primary)",
    fontSize: "var(--text-xs)",
    fontWeight: 600,
    textTransform: "uppercase",
    paddingTop: 2,
  },
  breakValue: {
    color: "var(--color-text)",
    fontSize: "var(--text-sm)",
    background: "var(--color-surface-offset)",
    borderRadius: "var(--radius-sm)",
    padding: "var(--space-1) var(--space-2)",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 420,
    background: "var(--color-surface)",
  },
  th: {
    textAlign: "left",
    padding: "var(--space-3) var(--space-5)",
    background: "var(--color-surface-offset)",
    color: "var(--color-text-muted)",
    borderBottom: "1px solid var(--color-divider)",
    fontSize: "var(--text-xs)",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  td: {
    padding: "var(--space-3) var(--space-5)",
    borderBottom: "1px solid var(--color-divider)",
    color: "var(--color-text)",
    fontSize: "var(--text-sm)",
    verticalAlign: "top",
    lineHeight: 1.55,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-2)",
  },
  chip: {
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "var(--color-surface-offset)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text-muted)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
  },
  ul: {
    margin: 0,
    paddingLeft: "var(--space-5)",
    display: "grid",
    gap: "var(--space-2)",
  },
  li: {
    color: "var(--color-text-muted)",
    lineHeight: 1.65,
    fontSize: "var(--text-sm)",
  },
  copy: {
    margin: "0 0 var(--space-3)",
    color: "var(--color-text-muted)",
    lineHeight: 1.7,
    fontSize: "var(--text-sm)",
  },
  label: {
    fontSize: "var(--text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-text-muted)",
    fontWeight: 600,
    margin: "var(--space-3) 0 var(--space-2)",
  },
  note: {
    background: "var(--color-primary-highlight)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-3) var(--space-4)",
    color: "var(--color-text-muted)",
    fontSize: "var(--text-xs)",
    lineHeight: 1.65,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "var(--space-3)",
  },
  orderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "var(--space-3)",
  },
  orderCard: {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-divider)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-3)",
    display: "flex",
    gap: "var(--space-3)",
    alignItems: "center",
  },
  orderNum: {
    width: 26,
    height: 26,
    borderRadius: "var(--radius-full)",
    background: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "var(--text-xs)",
    flexShrink: 0,
  },
  exceptionCard: {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-error)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
  },
  modelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "var(--space-3)",
  },
  modelCard: {
    background: "var(--color-surface-offset)",
    border: "1px solid var(--color-divider)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-3) var(--space-4)",
    color: "var(--color-text)",
    fontSize: "var(--text-sm)",
  },
};
