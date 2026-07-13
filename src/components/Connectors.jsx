// Connectors.jsx
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const STRUCTURE_RULES = [
  {
    type: "Coordinating conjunction",
    does: "Links two equal clauses; normal order stays",
    pattern: "clause 1, connector + subject + finite verb ...",
    example: "Ich lerne Deutsch, und ich übe jeden Tag.",
  },
  {
    type: "Subordinating conjunction",
    does: "Creates subordinate clause; finite verb goes to the end",
    pattern: "connector + ... + finite verb",
    example: "Ich lerne Deutsch, weil ich in Deutschland arbeiten will.",
  },
  {
    type: "Conjunctive adverb",
    does: "Starts a main clause; takes slot 1, finite verb follows",
    pattern: "connector + finite verb + subject ...",
    example: "Es regnet. Deshalb bleibe ich zu Hause.",
  },
  {
    type: "Paired/correlative connector",
    does: "Fixed two-part pattern",
    pattern: "part 1 ... part 2",
    example: "Entweder kommst du heute, oder du kommst morgen.",
  },
  {
    type: "Infinitive linker",
    does: "Links idea with infinitive, not a full clause",
    pattern: "um/ohne/anstatt ... zu + infinitive",
    example: "Ich lerne viel, um die Prüfung zu bestehen.",
  },
];

const GOLDEN_RULES = [
  "In a main clause, the finite verb stays in position 2.",
  "In a subordinate clause, the finite verb goes to the end.",
  "If the subordinate clause comes first, it occupies position 1, so the main clause starts with the finite verb: Weil ich müde bin, gehe ich schlafen.",
  "Conjunctive adverbs like deshalb, trotzdem, jedoch, daher, folglich are NOT subordinating conjunctions — they require inversion in a main clause.",
];

const MASTER_TABLE = [
  {
    connector: "und",
    meaning: "and",
    type: "Coordinating",
    level: "A1",
    order: "Normal main clause",
    notes: "Simple addition",
  },
  {
    connector: "aber",
    meaning: "but",
    type: "Coordinating",
    level: "A1",
    order: "Normal main clause",
    notes: "General contrast",
  },
  {
    connector: "oder",
    meaning: "or",
    type: "Coordinating",
    level: "A1",
    order: "Normal main clause",
    notes: "Choice",
  },
  {
    connector: "denn",
    meaning: "because, for",
    type: "Coordinating",
    level: "A2",
    order: "Normal main clause",
    notes: "Same broad meaning as weil, different structure",
  },
  {
    connector: "sondern",
    meaning: "but rather",
    type: "Coordinating",
    level: "A2",
    order: "Normal main clause",
    notes: "Usually after negation",
  },
  {
    connector: "doch",
    meaning: "but, however, after all",
    type: "Coordinating/discourse",
    level: "B1–B2",
    order: "Usually main clause",
    notes: "Meaning depends on context",
  },
  {
    connector: "weil",
    meaning: "because",
    type: "Subordinating",
    level: "A2",
    order: "Verb final",
    notes: "Most common reason clause",
  },
  {
    connector: "da",
    meaning: "since, because",
    type: "Subordinating",
    level: "B1",
    order: "Verb final",
    notes: "Often sounds more formal or backgrounded",
  },
  {
    connector: "dass",
    meaning: "that",
    type: "Subordinating",
    level: "A2",
    order: "Verb final",
    notes: "Content clause",
  },
  {
    connector: "ob",
    meaning: "whether, if",
    type: "Subordinating",
    level: "B1",
    order: "Verb final",
    notes: "Indirect yes/no question",
  },
  {
    connector: "wenn",
    meaning: "if, when",
    type: "Subordinating",
    level: "A2",
    order: "Verb final",
    notes: "Condition; repeated/present/future time",
  },
  {
    connector: "falls",
    meaning: "if, in case",
    type: "Subordinating",
    level: "B1",
    order: "Verb final",
    notes: "More tentative than wenn",
  },
  {
    connector: "sofern",
    meaning: "provided that",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "More formal condition",
  },
  {
    connector: "obwohl",
    meaning: "although",
    type: "Subordinating",
    level: "B1",
    order: "Verb final",
    notes: "Concession",
  },
  {
    connector: "obgleich",
    meaning: "although",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "More formal than obwohl",
  },
  {
    connector: "wenngleich",
    meaning: "although",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Formal written German",
  },
  {
    connector: "während",
    meaning: "while, whereas",
    type: "Subordinating/preposition",
    level: "B1",
    order: "Verb final if clause",
    notes: "Time or contrast",
  },
  {
    connector: "wohingegen",
    meaning: "whereas",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Formal contrast",
  },
  {
    connector: "indem",
    meaning: "by doing, by means of",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Method/means",
  },
  {
    connector: "dadurch dass",
    meaning: "through the fact that",
    type: "Subordinating phrase",
    level: "B2",
    order: "Verb final",
    notes: "Means/cause with full clause",
  },
  {
    connector: "damit",
    meaning: "so that",
    type: "Subordinating",
    level: "B1",
    order: "Verb final",
    notes: "Purpose with full clause",
  },
  {
    connector: "sodass / so dass",
    meaning: "so that, with the result that",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Result",
  },
  {
    connector: "bevor",
    meaning: "before",
    type: "Subordinating",
    level: "A2–B1",
    order: "Verb final",
    notes: "Time",
  },
  {
    connector: "ehe",
    meaning: "before",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "More formal/literary than bevor",
  },
  {
    connector: "nachdem",
    meaning: "after",
    type: "Subordinating",
    level: "B1",
    order: "Verb final",
    notes: "Often tense-sensitive",
  },
  {
    connector: "bis",
    meaning: "until",
    type: "Subordinating",
    level: "B1",
    order: "Verb final",
    notes: "Endpoint",
  },
  {
    connector: "seitdem",
    meaning: "since",
    type: "Subordinating/adverb",
    level: "B1–B2",
    order: "Verb final if clause",
    notes: "Starting point continuing into present",
  },
  {
    connector: "sobald",
    meaning: "as soon as",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Immediate sequence",
  },
  {
    connector: "solange",
    meaning: "as long as",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Duration/condition",
  },
  {
    connector: "sooft",
    meaning: "whenever, as often as",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Repeated events",
  },
  {
    connector: "als",
    meaning: "when",
    type: "Subordinating",
    level: "A2–B1",
    order: "Verb final",
    notes: "Single completed past event",
  },
  {
    connector: "deshalb",
    meaning: "therefore",
    type: "Conjunctive adverb",
    level: "A2–B1",
    order: "Inversion",
    notes: "Result",
  },
  {
    connector: "deswegen",
    meaning: "therefore",
    type: "Conjunctive adverb",
    level: "B1",
    order: "Inversion",
    notes: "Result",
  },
  {
    connector: "daher",
    meaning: "therefore",
    type: "Conjunctive adverb",
    level: "B1–B2",
    order: "Inversion",
    notes: "Formal/neutral result",
  },
  {
    connector: "darum",
    meaning: "that is why",
    type: "Conjunctive adverb",
    level: "B1",
    order: "Inversion",
    notes: "Common spoken result",
  },
  {
    connector: "also",
    meaning: "so, therefore",
    type: "Conjunctive adverb/discourse",
    level: "B1",
    order: "Inversion if connective",
    notes: "Common in speech",
  },
  {
    connector: "trotzdem",
    meaning: "nevertheless",
    type: "Conjunctive adverb",
    level: "B1",
    order: "Inversion",
    notes: "Contrast despite reason",
  },
  {
    connector: "dennoch",
    meaning: "nevertheless",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion",
    notes: "More formal than trotzdem",
  },
  {
    connector: "jedoch",
    meaning: "however",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion",
    notes: "Formal contrast",
  },
  {
    connector: "hingegen",
    meaning: "by contrast",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion/medial use",
    notes: "Often written style",
  },
  {
    connector: "dagegen",
    meaning: "on the other hand, against it",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion",
    notes: "Contrast/opposition",
  },
  {
    connector: "folglich",
    meaning: "consequently",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion",
    notes: "Formal result",
  },
  {
    connector: "infolgedessen",
    meaning: "consequently",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion",
    notes: "Formal written result",
  },
  {
    connector: "somit",
    meaning: "thus",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion",
    notes: "Formal result",
  },
  {
    connector: "außerdem",
    meaning: "moreover",
    type: "Conjunctive adverb",
    level: "A2–B1",
    order: "Inversion",
    notes: "Addition",
  },
  {
    connector: "zusätzlich",
    meaning: "additionally",
    type: "Conjunctive adverb",
    level: "B2",
    order: "Inversion",
    notes: "Formal addition",
  },
  {
    connector: "darüber hinaus",
    meaning: "beyond that, moreover",
    type: "Conjunctive phrase",
    level: "B2",
    order: "Inversion if clause-initial",
    notes: "Formal addition",
  },
  {
    connector: "dann",
    meaning: "then",
    type: "Adverbial connector",
    level: "A2",
    order: "Inversion if clause-initial",
    notes: "Sequence",
  },
  {
    connector: "danach",
    meaning: "afterwards",
    type: "Adverbial connector",
    level: "B1",
    order: "Inversion if clause-initial",
    notes: "Sequence",
  },
  {
    connector: "anschließend",
    meaning: "afterwards",
    type: "Adverbial connector",
    level: "B2",
    order: "Inversion if clause-initial",
    notes: "Formal sequence",
  },
  {
    connector: "währenddessen",
    meaning: "meanwhile",
    type: "Adverbial connector",
    level: "B2",
    order: "Inversion if clause-initial",
    notes: "Parallel sequence",
  },
  {
    connector: "zuerst",
    meaning: "first",
    type: "Adverbial connector",
    level: "A2",
    order: "Inversion if clause-initial",
    notes: "Sequence",
  },
  {
    connector: "schließlich",
    meaning: "finally",
    type: "Adverbial connector",
    level: "B1–B2",
    order: "Inversion if clause-initial",
    notes: "Sequence/result nuance",
  },
  {
    connector: "entweder ... oder",
    meaning: "either ... or",
    type: "Paired",
    level: "A2–B1",
    order: "Parallel structure",
    notes: "Alternative",
  },
  {
    connector: "weder ... noch",
    meaning: "neither ... nor",
    type: "Paired",
    level: "B1",
    order: "Parallel structure",
    notes: "Negative alternative",
  },
  {
    connector: "sowohl ... als auch",
    meaning: "both ... and",
    type: "Paired",
    level: "B1",
    order: "Parallel structure",
    notes: "Addition",
  },
  {
    connector: "nicht nur ... sondern auch",
    meaning: "not only ... but also",
    type: "Paired",
    level: "B1–B2",
    order: "Parallel structure",
    notes: "Emphatic addition",
  },
  {
    connector: "zwar ... aber",
    meaning: "admittedly ... but",
    type: "Paired",
    level: "B2",
    order: "Often clause split",
    notes: "Concession/contrast",
  },
  {
    connector: "einerseits ... andererseits",
    meaning: "on the one hand ... on the other hand",
    type: "Paired",
    level: "B2",
    order: "Usually main clauses",
    notes: "Balanced contrast",
  },
  {
    connector: "je ... desto / umso",
    meaning: "the ... the ...",
    type: "Mixed paired",
    level: "B2",
    order: "je-clause verb final; desto/umso clause V2",
    notes: "Proportional comparison",
  },
  {
    connector: "um ... zu",
    meaning: "in order to",
    type: "Infinitive linker",
    level: "A2–B1",
    order: "zu + infinitive at end",
    notes: "Same subject in both clauses",
  },
  {
    connector: "ohne ... zu",
    meaning: "without doing",
    type: "Infinitive linker",
    level: "B2",
    order: "zu + infinitive at end",
    notes: "Same subject",
  },
  {
    connector: "anstatt ... zu",
    meaning: "instead of doing",
    type: "Infinitive linker",
    level: "B2",
    order: "zu + infinitive at end",
    notes: "Same subject",
  },
  {
    connector: "ohne dass",
    meaning: "without the fact that",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Different subject or full clause",
  },
  {
    connector: "anstatt dass",
    meaning: "instead of the fact that",
    type: "Subordinating",
    level: "B2",
    order: "Verb final",
    notes: "Full clause alternative",
  },
  {
    connector: "es sei denn",
    meaning: "unless",
    type: "Fixed connector phrase",
    level: "B2",
    order: "Usually main-clause-like continuation",
    notes: "Exception clause",
  },
];

const BY_FUNCTION = [
  {
    fn: "Addition",
    color: "primary",
    connectors: [
      "und",
      "außerdem",
      "zusätzlich",
      "darüber hinaus",
      "sowohl ... als auch",
      "nicht nur ... sondern auch",
    ],
    examples: [
      {
        de: "Ich lerne Deutsch, und ich lese deutsche Nachrichten.",
        en: "I learn German and I read German news.",
      },
      {
        de: "Der Kurs ist günstig. Außerdem ist er sehr effektiv.",
        en: "The course is affordable. Moreover, it is very effective.",
      },
      {
        de: "Sie spricht nicht nur Deutsch, sondern auch Englisch.",
        en: "She speaks not only German but also English.",
      },
    ],
  },
  {
    fn: "Contrast & Concession",
    color: "gold",
    connectors: [
      "aber",
      "sondern",
      "obwohl",
      "obgleich",
      "wenngleich",
      "trotzdem",
      "dennoch",
      "jedoch",
      "hingegen",
      "wohingegen",
      "zwar ... aber",
      "einerseits ... andererseits",
    ],
    examples: [
      {
        de: "Ich wollte kommen, aber ich hatte keine Zeit.",
        en: "I wanted to come, but I had no time.",
      },
      {
        de: "Er ist nicht faul, sondern sehr vorsichtig.",
        en: "He is not lazy, but rather very cautious.",
      },
      {
        de: "Obwohl es spät ist, arbeitet sie weiter.",
        en: "Although it is late, she keeps working.",
      },
      {
        de: "Es ist spät. Trotzdem arbeitet sie weiter.",
        en: "It is late. Nevertheless, she keeps working.",
      },
    ],
  },
  {
    fn: "Cause & Reason",
    color: "error",
    connectors: ["weil", "da", "denn", "zumal (upper B2 / formal edge)"],
    examples: [
      {
        de: "Ich bleibe zu Hause, weil ich krank bin.",
        en: "I stay at home because I am sick.",
      },
      {
        de: "Da es regnet, bleiben wir zu Hause.",
        en: "Since it is raining, we stay at home.",
      },
      {
        de: "Ich bleibe zu Hause, denn ich bin krank.",
        en: "I stay at home, for I am sick.",
      },
    ],
    note: "aufgrund von, wegen are prepositions — not clause connectors.",
  },
  {
    fn: "Result & Consequence",
    color: "success",
    connectors: [
      "deshalb",
      "deswegen",
      "darum",
      "daher",
      "also",
      "somit",
      "folglich",
      "infolgedessen",
      "sodass",
    ],
    examples: [
      {
        de: "Er war krank. Deshalb blieb er zu Hause.",
        en: "He was sick. Therefore he stayed home.",
      },
      {
        de: "Die Preise stiegen stark. Infolgedessen sank die Nachfrage.",
        en: "Prices rose sharply. Consequently, demand fell.",
      },
      {
        de: "Er sprach undeutlich, sodass ihn niemand verstand.",
        en: "He spoke unclearly, so that nobody understood him.",
      },
    ],
  },
  {
    fn: "Condition",
    color: "primary",
    connectors: ["wenn", "falls", "sofern", "es sei denn", "ansonsten"],
    examples: [
      {
        de: "Wenn ich Zeit habe, komme ich.",
        en: "When/if I have time, I will come.",
      },
      {
        de: "Falls du Hilfe brauchst, ruf mich an.",
        en: "If you need help, call me.",
      },
      {
        de: "Ich komme, es sei denn, ich werde krank.",
        en: "I will come, unless I get sick.",
      },
    ],
  },
  {
    fn: "Time & Sequence",
    color: "gold",
    connectors: [
      "als",
      "wenn",
      "bevor",
      "ehe",
      "nachdem",
      "bis",
      "sobald",
      "solange",
      "seitdem",
      "sooft",
      "während",
      "zuerst",
      "dann",
      "danach",
      "anschließend",
      "schließlich",
      "währenddessen",
    ],
    examples: [
      {
        de: "Als ich klein war, spielte ich viel Schach.",
        en: "When I was little, I played a lot of chess.",
      },
      {
        de: "Wenn ich nach Hause komme, koche ich zuerst.",
        en: "When I get home, I cook first.",
      },
      {
        de: "Nachdem er angekommen war, begann das Meeting.",
        en: "After he had arrived, the meeting began.",
      },
      {
        de: "Sobald du fertig bist, schicken wir die Datei.",
        en: "As soon as you are done, we will send the file.",
      },
    ],
  },
  {
    fn: "Purpose & Method",
    color: "success",
    connectors: [
      "damit",
      "um ... zu",
      "indem",
      "dadurch dass",
      "ohne ... zu / ohne dass",
      "anstatt ... zu / anstatt dass",
    ],
    examples: [
      {
        de: "Ich spare Geld, damit ich ein Auto kaufen kann.",
        en: "I save money so that I can buy a car.",
      },
      {
        de: "Ich spare Geld, um ein Auto zu kaufen.",
        en: "I save money in order to buy a car.",
      },
      {
        de: "Er verbessert sein Deutsch, indem er jeden Tag liest.",
        en: "He improves his German by reading every day.",
      },
    ],
  },
  {
    fn: "Content & Indirect Questions",
    color: "error",
    connectors: [
      "dass",
      "ob",
      "wann",
      "warum",
      "wie",
      "wo",
      "wer",
      "was (as subordinators)",
    ],
    examples: [
      { de: "Ich weiß, dass er kommt.", en: "I know that he is coming." },
      {
        de: "Ich weiß nicht, ob er kommt.",
        en: "I don't know whether he is coming.",
      },
      {
        de: "Weißt du, wann der Zug abfährt?",
        en: "Do you know when the train leaves?",
      },
    ],
  },
];

const TENSE_TABLE = [
  {
    tense: "Präsens",
    main: "Ich komme heute.",
    sub: "..., weil ich heute komme.",
  },
  {
    tense: "Präteritum",
    main: "Ich kam gestern.",
    sub: "..., weil ich gestern kam.",
  },
  {
    tense: "Perfekt",
    main: "Ich bin gekommen.",
    sub: "..., weil ich gekommen bin.",
  },
  {
    tense: "Plusquamperfekt",
    main: "Ich war gekommen.",
    sub: "..., weil ich gekommen war.",
  },
  {
    tense: "Futur I",
    main: "Ich werde kommen.",
    sub: "..., weil ich kommen werde.",
  },
  {
    tense: "Passive Präsens",
    main: "Es wird gemacht.",
    sub: "..., weil es gemacht wird.",
  },
  {
    tense: "Passive Perfekt",
    main: "Es ist gemacht worden.",
    sub: "..., weil es gemacht worden ist.",
  },
];

const TENSE_SENSITIVE = [
  {
    connector: "als",
    rule: "Single completed past event/state",
    example: "Als ich Student war, wohnte ich in Mannheim.",
  },
  {
    connector: "wenn",
    rule: "Repeated past, present/future 'when,' or condition",
    example: "Wenn ich Zeit habe, lese ich.",
  },
  {
    connector: "wann",
    rule: "Direct/indirect question, not normal time clause",
    example: "Ich weiß nicht, wann er kommt.",
  },
  {
    connector: "nachdem",
    rule: "Often shows earlier action before later one",
    example: "Nachdem ich gegessen hatte, ging ich spazieren.",
  },
  {
    connector: "seitdem",
    rule: "Past starting point with continuing relevance",
    example: "Seitdem ich hier wohne, fahre ich mit dem Rad.",
  },
  {
    connector: "sobald",
    rule: "Immediate next event",
    example: "Sobald er ankommt, beginnen wir.",
  },
  {
    connector: "solange",
    rule: "Duration up to a limit",
    example: "Solange du lernst, machst du Fortschritte.",
  },
];

const MODAL_TABLE = [
  { pattern: "Present with modal", example: "..., weil ich arbeiten muss." },
  {
    pattern: "Preterite with modal",
    example: "..., weil ich arbeiten musste.",
  },
  {
    pattern: "Future with modal",
    example: "..., weil ich arbeiten müssen werde.",
  },
  {
    pattern: "Perfect with modal meaning",
    example: "..., weil ich habe arbeiten müssen.",
  },
];

const MODAL_EXAMPLES = [
  {
    de: "Ich bleibe zu Hause, weil ich noch arbeiten muss.",
    en: "I stay home because I still have to work.",
  },
  {
    de: "Ich blieb zu Hause, weil ich noch arbeiten musste.",
    en: "I stayed home because I still had to work.",
  },
  {
    de: "Ich bin müde, weil ich lange habe arbeiten müssen.",
    en: "I am tired because I had to work for a long time.",
  },
  {
    de: "Er ging früh, weil er den Zug hat erreichen müssen.",
    en: "He left early because he had to catch the train.",
  },
];

const KEY_CONTRASTS = [
  {
    pair: "weil vs denn",
    diff: "Same broad meaning, different syntax",
    example: "..., weil ich krank bin / ..., denn ich bin krank.",
  },
  {
    pair: "obwohl vs trotzdem",
    diff: "obwohl = subordinate clause; trotzdem = conjunctive adverb",
    example:
      "Obwohl ich krank bin, komme ich. / Ich bin krank. Trotzdem komme ich.",
  },
  {
    pair: "aber vs sondern",
    diff: "sondern after negation only",
    example: "Nicht heute, sondern morgen.",
  },
  {
    pair: "als vs wenn",
    diff: "als = one-time past; wenn = repeated/present/future/if",
    example: "Als ich klein war ... / Wenn ich Zeit habe ...",
  },
  {
    pair: "dass vs ob",
    diff: "that vs whether",
    example: "Ich weiß, dass er kommt. / Ich weiß nicht, ob er kommt.",
  },
  {
    pair: "damit vs um ... zu",
    diff: "damit = full clause; um ... zu = same subject, infinitive clause",
    example:
      "Ich lerne viel, damit ich bestehe. / Ich lerne viel, um zu bestehen.",
  },
  {
    pair: "bevor/nachdem vs vor/nach",
    diff: "conjunction with clause vs preposition with noun",
    example: "bevor ich gehe / vor dem Essen",
  },
  {
    pair: "während (conjunction vs preposition)",
    diff: "clause vs noun phrase",
    example: "während ich lese / während des Urlaubs",
  },
];

const COMMON_MISTAKES = [
  {
    mistake: "Verb in position 2 after a subordinating connector",
    example: "❌ weil ich bin müde → ✅ weil ich müde bin",
  },
  {
    mistake:
      "Treating deshalb, trotzdem, jedoch, folglich as subordinating conjunctions",
    example:
      "They are conjunctive adverbs — they require inversion, not verb-final.",
  },
  {
    mistake: "Using sondern without a prior negation",
    example: "✅ Nicht heute, sondern morgen.",
  },
  {
    mistake: "Using als for future or repeated events",
    example: "❌ Als ich Zeit habe → ✅ Wenn ich Zeit habe",
  },
  {
    mistake: "Using wann instead of wenn in temporal clauses",
    example: "❌ Wann ich komme, ... → ✅ Wenn ich komme, ...",
  },
  {
    mistake: "Confusing ob with wenn when meaning is 'whether'",
    example:
      "❌ Ich weiß nicht, wenn er kommt → ✅ Ich weiß nicht, ob er kommt",
  },
  {
    mistake: "Using um ... zu when subjects differ",
    example: "❌ Ich rufe an, um du kommst → ✅ Ich rufe an, damit du kommst",
  },
  {
    mistake: "Splitting separable verbs inside subordinate clauses",
    example: "❌ weil ich früh auf stehe → ✅ weil ich früh aufstehe",
  },
  {
    mistake: "Mishandling perfect + modal order in subordinate clauses",
    example:
      "✅ weil ich habe arbeiten müssen (auxiliary before double infinitive)",
  },
];

const MEMORY_FORMULA = [
  {
    rule: "Coordinating",
    detail: "Normal order — subject and verb stay in place.",
  },
  {
    rule: "Subordinating",
    detail: "Verb to the end — everything finite moves last.",
  },
  {
    rule: "Conjunctive adverb",
    detail: "Position 1 + inversion — verb jumps before subject.",
  },
  {
    rule: "Infinitive connector",
    detail: "um / ohne / anstatt … zu + infinitive at the end.",
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const TYPE_COLORS = {
  Coordinating: "primary",
  "Coordinating/discourse": "primary",
  Subordinating: "gold",
  "Subordinating/preposition": "gold",
  "Subordinating/adverb": "gold",
  "Subordinating phrase": "gold",
  "Conjunctive adverb": "success",
  "Conjunctive adverb/discourse": "success",
  "Conjunctive phrase": "success",
  "Adverbial connector": "success",
  Paired: "error",
  "Mixed paired": "error",
  "Infinitive linker": "primary",
  "Fixed connector phrase": "error",
};

const LEVEL_COLORS = {
  A1: "primary",
  A2: "primary",
  "A2–B1": "gold",
  B1: "gold",
  "B1–B2": "success",
  B2: "error",
};

const COLOR_MAP = {
  primary: {
    badge: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
    border: "var(--color-primary)",
  },
  gold: {
    badge: "var(--color-gold-highlight)",
    color: "var(--color-gold)",
    border: "var(--color-gold)",
  },
  success: {
    badge: "var(--color-success-highlight)",
    color: "var(--color-success)",
    border: "var(--color-success)",
  },
  error: {
    badge: "var(--color-error-highlight)",
    color: "var(--color-error)",
    border: "var(--color-error)",
  },
};

function Badge({ label, colorKey, style = {} }) {
  const c = COLOR_MAP[colorKey] || COLOR_MAP.primary;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 10px",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--text-xs)",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: c.badge,
        color: c.color,
        border: `1px solid ${c.border}22`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </span>
  );
}

function SectionCard({ children, accentColor, delay = 0, style = {} }) {
  const c = COLOR_MAP[accentColor] || COLOR_MAP.primary;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        padding: "var(--space-6)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: `3px solid ${c.color}`,
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-sm)",
        animation: `fade-up 400ms cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, children, colorKey = "primary" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-lg)",
        color: COLOR_MAP[colorKey]?.color || "var(--color-primary)",
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
}

function ExamplesToggle({ examples }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <button className="examples-toggle" onClick={() => setOpen((o) => !o)}>
        <span>{open ? "▲" : "▼"}</span>
        {open ? "Hide examples" : "Show examples"}
      </button>
      {open && (
        <div className="examples-list">
          {examples.map((ex, i) => (
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
    </div>
  );
}

function Table({ headers, rows, colStyles = [] }) {
  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "var(--text-sm)",
        }}
      >
        <thead>
          <tr style={{ background: "var(--color-surface-2)" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                  ...(colStyles[i] || {}),
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderBottom: "1px solid var(--color-divider)",
                background:
                  ri % 2 === 0 ? "transparent" : "var(--color-surface-2)",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    verticalAlign: "top",
                    color: "var(--color-text)",
                    ...(colStyles[ci] || {}),
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

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "structure", label: "Structure Rules" },
  { id: "master", label: "Master Table" },
  { id: "function", label: "By Function" },
  { id: "tenses", label: "Tenses" },
  { id: "modals", label: "Modals" },
  { id: "contrasts", label: "Key Contrasts" },
  { id: "mistakes", label: "Common Mistakes" },
  { id: "formula", label: "Memory Formula" },
];

// ─── SECTION COMPONENTS ──────────────────────────────────────────────────────

function StructureSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Structure types table */}
      <SectionCard accentColor="primary" delay={0}>
        <SectionTitle icon="⚙️" colorKey="primary">
          Connector Types & Patterns
        </SectionTitle>
        <Table
          headers={["Type", "What it does", "Core pattern", "Example"]}
          rows={STRUCTURE_RULES.map((r) => [
            <Badge
              label={r.type}
              colorKey={TYPE_COLORS[r.type] || "primary"}
            />,
            <span
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-xs)",
              }}
            >
              {r.does}
            </span>,
            <code
              style={{
                fontSize: "var(--text-xs)",
                background: "var(--color-surface-2)",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-text)",
              }}
            >
              {r.pattern}
            </code>,
            <span style={{ fontStyle: "italic", color: "var(--color-text)" }}>
              {r.example}
            </span>,
          ])}
        />
      </SectionCard>

      {/* Golden rules */}
      <SectionCard accentColor="gold" delay={80}>
        <SectionTitle icon="⭐" colorKey="gold">
          Golden Rules
        </SectionTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {GOLDEN_RULES.map((rule, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                alignItems: "flex-start",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-divider)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <span
                style={{
                  minWidth: 24,
                  height: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-gold-highlight)",
                  color: "var(--color-gold)",
                  fontWeight: 800,
                  fontSize: "var(--text-xs)",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                  lineHeight: 1.6,
                }}
              >
                {rule}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function MasterTableSection() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");

  const types = [
    "All",
    ...Array.from(new Set(MASTER_TABLE.map((r) => r.type))),
  ];
  const levels = ["All", "A1", "A2", "A2–B1", "B1", "B1–B2", "B2"];

  const filtered = MASTER_TABLE.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.connector.toLowerCase().includes(q) ||
      r.meaning.toLowerCase().includes(q) ||
      r.notes.toLowerCase().includes(q);
    const matchType = filterType === "All" || r.type === filterType;
    const matchLevel = filterLevel === "All" || r.level === filterLevel;
    return matchSearch && matchType && matchLevel;
  });

  return (
    <SectionCard accentColor="primary" delay={0}>
      <SectionTitle icon="📋" colorKey="primary">
        Master Connector Table (A1–B2)
      </SectionTitle>
      <p
        style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}
      >
        All connectors you need through B2 — including formal and exam-critical
        ones.
      </p>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search connectors..."
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            fontSize: "var(--text-sm)",
            outline: "none",
            minWidth: 160,
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            fontSize: "var(--text-xs)",
            cursor: "pointer",
          }}
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          style={{
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            fontSize: "var(--text-xs)",
            cursor: "pointer",
          }}
        >
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-faint)",
          }}
        >
          {filtered.length} / {MASTER_TABLE.length}
        </span>
      </div>

      <Table
        headers={[
          "Connector",
          "Meaning",
          "Type",
          "Level",
          "Word Order",
          "Notes",
        ]}
        rows={filtered.map((r) => [
          <strong
            style={{
              color: "var(--color-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            {r.connector}
          </strong>,
          <span className="td-english">{r.meaning}</span>,
          <Badge label={r.type} colorKey={TYPE_COLORS[r.type] || "primary"} />,
          <Badge
            label={r.level}
            colorKey={LEVEL_COLORS[r.level] || "primary"}
          />,
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            {r.order}
          </span>,
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-faint)",
              fontStyle: "italic",
            }}
          >
            {r.notes}
          </span>,
        ])}
      />
    </SectionCard>
  );
}

function FunctionSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <div
        style={{
          padding: "var(--space-4) var(--space-5)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
        }}
      >
        💡 B2 expects you to express relationships precisely. Memorize by
        communicative function: addition, contrast, reason, result, condition,
        time, purpose, method, content.
      </div>
      {BY_FUNCTION.map((group, i) => {
        const colorKey = group.color;
        const c = COLOR_MAP[colorKey];
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderLeft: `3px solid ${c.color}`,
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              animation: `fade-up 400ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
            }}
          >
            {/* Header */}
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-4) var(--space-6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-base)",
                    color: "var(--color-text)",
                    fontWeight: 700,
                  }}
                >
                  {group.fn}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-faint)",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-full)",
                    padding: "1px 8px",
                  }}
                >
                  {group.connectors.length} connectors
                </span>
              </div>
              <span
                style={{
                  color: c.color,
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                }}
              >
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: "0 var(--space-6) var(--space-5)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                }}
              >
                {/* Chips */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-1)",
                  }}
                >
                  {group.connectors.map((conn, ci) => (
                    <span
                      key={ci}
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        background: c.badge,
                        color: c.color,
                        border: `1px solid ${c.color}33`,
                      }}
                    >
                      {conn}
                    </span>
                  ))}
                </div>
                {group.note && (
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-faint)",
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    ⚠️ {group.note}
                  </p>
                )}
                <ExamplesToggle examples={group.examples} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TensesSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Verb cluster table */}
      <SectionCard accentColor="primary" delay={0}>
        <SectionTitle icon="⏱️" colorKey="primary">
          Verb Position Across Tenses
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Connectors don't create tense — but tense changes the shape of the
          verb cluster. In subordinate clauses, all verbal elements move to the
          end zone.
        </p>
        <Table
          headers={[
            "Tense / Form",
            "Main Clause",
            "With Subordinating Connector",
          ]}
          rows={TENSE_TABLE.map((r) => [
            <Badge label={r.tense} colorKey="primary" />,
            <span style={{ fontStyle: "italic" }}>{r.main}</span>,
            <span
              style={{ fontStyle: "italic", color: "var(--color-success)" }}
            >
              {r.sub}
            </span>,
          ])}
        />
      </SectionCard>

      {/* Tense-sensitive connectors */}
      <SectionCard accentColor="gold" delay={80}>
        <SectionTitle icon="🕰️" colorKey="gold">
          Tense-Sensitive Connectors
        </SectionTitle>
        <Table
          headers={["Connector", "Tense / Use Rule", "Example"]}
          rows={TENSE_SENSITIVE.map((r) => [
            <strong style={{ color: "var(--color-gold)" }}>
              {r.connector}
            </strong>,
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
              }}
            >
              {r.rule}
            </span>,
            <span style={{ fontStyle: "italic", fontSize: "var(--text-xs)" }}>
              {r.example}
            </span>,
          ])}
        />
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-gold-highlight)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-gold)33",
            fontSize: "var(--text-xs)",
            color: "var(--color-text)",
          }}
        >
          <strong style={{ color: "var(--color-gold)" }}>
            📌 nachdem note:
          </strong>{" "}
          nachdem often pairs an earlier action in{" "}
          <strong>Plusquamperfekt</strong> with a later one in{" "}
          <strong>Präteritum</strong>. In present-oriented contexts: Nachdem ich
          gegessen habe, gehe ich spazieren.
        </div>
      </SectionCard>
    </div>
  );
}

function ModalsSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SectionCard accentColor="error" delay={0}>
        <SectionTitle icon="🔧" colorKey="error">
          Modal Verbs in Subordinate Clauses
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          Modal verbs are one of the most important complication points up to
          B2. In ordinary subordinate clauses the modal goes to the end — but in
          perfect constructions with a second infinitive, German uses a{" "}
          <strong style={{ color: "var(--color-error)" }}>
            double-infinitive pattern
          </strong>
          .
        </p>

        <Table
          headers={["Pattern", "Example"]}
          rows={MODAL_TABLE.map((r) => [
            <Badge
              label={r.pattern}
              colorKey={
                r.pattern.includes("Perfect")
                  ? "error"
                  : r.pattern.includes("Future")
                    ? "gold"
                    : r.pattern.includes("Preterite")
                      ? "success"
                      : "primary"
              }
            />,
            <span style={{ fontStyle: "italic" }}>{r.example}</span>,
          ])}
        />

        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-error-highlight)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-error)33",
            fontSize: "var(--text-xs)",
            color: "var(--color-text)",
          }}
        >
          <strong style={{ color: "var(--color-error)" }}>⚠️ Exception:</strong>{" "}
          In perfect and pluperfect with modal verbs, and also with{" "}
          <strong>lassen, sehen, hören</strong>, the auxiliary often appears{" "}
          <em>before</em> the infinitives: <br />
          <span style={{ fontStyle: "italic" }}>
            weil ich habe arbeiten müssen · weil ich ihn habe kommen sehen
          </span>
        </div>

        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            fontStyle: "italic",
          }}
        >
          📝 <strong>Exam tip:</strong> German often prefers Präteritum with
          modals in narration — it's shorter and stylistically smoother than
          perfect forms with double infinitives.
        </div>

        <ExamplesToggle examples={MODAL_EXAMPLES} />
      </SectionCard>
    </div>
  );
}

function ContrastsSection() {
  return (
    <SectionCard accentColor="gold" delay={0}>
      <SectionTitle icon="⚖️" colorKey="gold">
        Key Contrasts
      </SectionTitle>
      <p
        style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}
      >
        These contrasts cause the most mistakes — mastering them gives the
        biggest payoff.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {KEY_CONTRASTS.map((item, i) => (
          <div
            key={i}
            style={{
              padding: "var(--space-4)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
              animation: `fade-up 350ms cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`,
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
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "var(--text-base)",
                  color: "var(--color-gold)",
                }}
              >
                {item.pair}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
              }}
            >
              {item.diff}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
                borderLeft: "2px solid var(--color-gold)",
                paddingLeft: "var(--space-2)",
              }}
            >
              {item.example}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function MistakesSection() {
  return (
    <SectionCard accentColor="error" delay={0}>
      <SectionTitle icon="🚫" colorKey="error">
        Common Mistakes
      </SectionTitle>
      <p
        style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}
      >
        Watch out for these points carefully up to B2.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {COMMON_MISTAKES.map((item, i) => (
          <div
            key={i}
            style={{
              padding: "var(--space-4)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderLeft: "3px solid var(--color-error)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
              animation: `fade-up 350ms cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  minWidth: 22,
                  height: 22,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-error-highlight)",
                  color: "var(--color-error)",
                  fontWeight: 800,
                  fontSize: "var(--text-xs)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                {item.mistake}
              </span>
            </div>
            <p
              style={{
                margin: "0 0 0 30px",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {item.example}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function FormulaSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SectionCard accentColor="success" delay={0}>
        <SectionTitle icon="🧠" colorKey="success">
          Ultra-Short Memory Formula
        </SectionTitle>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          Four rules to internalize the entire system instantly.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {MEMORY_FORMULA.map((item, i) => {
            const colorKeys = ["primary", "gold", "success", "error"];
            const ck = colorKeys[i];
            const c = COLOR_MAP[ck];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-3)",
                  padding: "var(--space-4) var(--space-5)",
                  background: c.badge,
                  border: `1px solid ${c.color}33`,
                  borderRadius: "var(--radius-xl)",
                  animation: `fade-up 400ms cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                }}
              >
                <span
                  style={{
                    minWidth: 32,
                    height: 32,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-surface)",
                    border: `1.5px solid ${c.color}`,
                    color: c.color,
                    fontWeight: 900,
                    fontSize: "var(--text-sm)",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      color: c.color,
                      fontSize: "var(--text-base)",
                    }}
                  >
                    {item.rule}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                      marginTop: "var(--space-1)",
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Quick reference chips by type */}
      <SectionCard accentColor="primary" delay={160}>
        <SectionTitle icon="🗂️" colorKey="primary">
          Quick Reference by Type
        </SectionTitle>
        {[
          {
            label: "Coordinating",
            items: ["und", "aber", "oder", "denn", "sondern", "doch"],
            color: "primary",
          },
          {
            label: "Subordinating",
            items: [
              "weil",
              "da",
              "dass",
              "ob",
              "wenn",
              "falls",
              "obwohl",
              "nachdem",
              "bevor",
              "damit",
              "indem",
              "sodass",
              "sofern",
              "während",
              "als",
              "bis",
              "sobald",
              "solange",
              "seitdem",
              "ehe",
              "wohingegen",
              "obgleich",
              "wenngleich",
              "ohne dass",
              "anstatt dass",
              "dadurch dass",
              "sooft",
            ],
            color: "gold",
          },
          {
            label: "Conjunctive adverbs",
            items: [
              "deshalb",
              "deswegen",
              "daher",
              "darum",
              "also",
              "trotzdem",
              "dennoch",
              "jedoch",
              "hingegen",
              "dagegen",
              "folglich",
              "infolgedessen",
              "somit",
              "außerdem",
              "zusätzlich",
              "darüber hinaus",
            ],
            color: "success",
          },
          {
            label: "Paired / Correlative",
            items: [
              "entweder...oder",
              "weder...noch",
              "sowohl...als auch",
              "nicht nur...sondern auch",
              "zwar...aber",
              "einerseits...andererseits",
              "je...desto/umso",
            ],
            color: "error",
          },
          {
            label: "Infinitive linkers",
            items: ["um...zu", "ohne...zu", "anstatt...zu"],
            color: "primary",
          },
        ].map((group, gi) => {
          const c = COLOR_MAP[group.color];
          return (
            <div key={gi} style={{ marginBottom: "var(--space-3)" }}>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: c.color,
                  marginBottom: "var(--space-2)",
                }}
              >
                {group.label}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-1)",
                }}
              >
                {group.items.map((item, ii) => (
                  <span
                    key={ii}
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      background: c.badge,
                      color: c.color,
                      border: `1px solid ${c.color}33`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Connectors() {
  const [activeTab, setActiveTab] = useState("structure");

  const renderSection = () => {
    switch (activeTab) {
      case "structure":
        return <StructureSection />;
      case "master":
        return <MasterTableSection />;
      case "function":
        return <FunctionSection />;
      case "tenses":
        return <TensesSection />;
      case "modals":
        return <ModalsSection />;
      case "contrasts":
        return <ContrastsSection />;
      case "mistakes":
        return <MistakesSection />;
      case "formula":
        return <FormulaSection />;
      default:
        return null;
    }
  };

  return (
    <div className="pronouns-page">
      {/* Page header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          marginBottom: "var(--space-8)",
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
          German Connectors
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Complete reference A1 → B2 · Structure · Function · Tenses · Modals ·
          Contrasts
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-1)",
          marginBottom: "var(--space-8)",
          padding: "var(--space-1)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: "1 1 auto",
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                border: "none",
                cursor: "pointer",
                fontSize: "var(--text-xs)",
                fontWeight: active ? 700 : 500,
                letterSpacing: "0.03em",
                transition: "all var(--transition-interactive)",
                background: active ? "var(--color-primary)" : "transparent",
                color: active ? "#fff" : "var(--color-text-muted)",
                boxShadow: active ? "var(--shadow-sm)" : "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active section */}
      <div className="pronouns-sections">{renderSection()}</div>
    </div>
  );
}
