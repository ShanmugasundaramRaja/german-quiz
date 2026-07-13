import React, { useState, useMemo, useCallback } from "react";

/* ─── DATA ──────────────────────────────────────────────────────────────────── */

const LEVELS = [
  {
    level: "A1",
    color: "var(--color-success)",
    bg: "var(--color-success-highlight)",
    icon: "🌱",
    intro:
      "At A1, students need safety, clarity, repetition, and highly visible patterns. The goal is to help them write short correct sentences and begin answering simple personal questions.",
    goals: [
      "Answer when, where, and how questions.",
      "Use simple adverbs in everyday contexts.",
      "Build basic sentence patterns.",
      "Write short personal texts.",
    ],
    targetLanguage: {
      Temporal: ["heute", "morgen", "jetzt", "später"],
      Local: ["hier", "dort", "zu Hause"],
      Modal: ["gern", "gut", "langsam", "schnell", "sehr"],
      Frequency: ["oft", "manchmal", "nie"],
    },
    tasks: [
      {
        title: "Sentence completion",
        goal: "Build confidence with basic sentence frames.",
        instructions: "Ergänze die Sätze mit einem passenden Wort.",
        items: [
          "Ich lerne ___ Deutsch.",
          "Wir wohnen ___ Heidelberg.",
          "Er kommt ___ nach Hause.",
          "Ich trinke ___ Kaffee.",
          "Meine Mutter arbeitet ___.",
        ],
        modelAnswers: [
          "Ich lerne heute Deutsch.",
          "Wir wohnen hier in Heidelberg.",
          "Er kommt später nach Hause.",
          "Ich trinke gern Kaffee.",
          "Meine Mutter arbeitet dort.",
        ],
        extension:
          "Ask students to write 2 more sentences with the same adverbs.",
      },
      {
        title: "Choose the correct adverb",
        goal: "Understand meaning in context.",
        instructions: "Wähle das passende Wort.",
        items: [
          "Ich bin (heute / dort / sehr) müde.",
          "Wir spielen (gern / morgen / hier) im Park.",
          "Er fährt (schnell / heute / dort) Fahrrad.",
          "Sie ist (sehr / morgen / nie) freundlich.",
          "Ich komme (morgen / gut / dort).",
        ],
        modelAnswers: [
          "Ich bin heute müde.",
          "Wir spielen hier im Park.",
          "Er fährt schnell Fahrrad.",
          "Sie ist sehr freundlich.",
          "Ich komme morgen.",
        ],
        teachingPoint:
          "Show that some adverbs describe time, some place, and some manner.",
      },
      {
        title: "Short answer writing",
        goal: "Move from one-word answers to full sentences.",
        instructions: "Antworte in ganzen Sätzen.",
        items: [
          "Wann lernst du Deutsch?",
          "Wo wohnst du?",
          "Wie lernst du?",
          "Trinkst du gern Tee?",
          "Kommst du morgen?",
        ],
        modelAnswers: [
          "Ich lerne heute Deutsch.",
          "Ich wohne in Heidelberg.",
          "Ich lerne langsam und ruhig.",
          "Ja, ich trinke gern Tee.",
          "Ja, ich komme morgen.",
        ],
        extension:
          "Students ask a partner the same questions and write the partner's answers.",
      },
      {
        title: "Mini diary",
        goal: "Write connected personal sentences.",
        instructions:
          "Schreibe 4 Sätze über deinen Tag. Benutze: heute, zu Hause, gern, später.",
        modelText:
          "Heute bin ich zu Hause. Ich lerne gern Deutsch. Ich lese jetzt ein Buch. Später telefoniere ich mit meiner Freundin.",
        extension: "Add one feeling word: müde, glücklich, nervös, ruhig.",
      },
      {
        title: "Picture writing",
        goal: "Connect vocabulary to place and action.",
        instructions:
          "Schau das Bild an und schreibe 3 Sätze. Benutze: hier, dort, draußen.",
        modelText:
          "Hier ist ein Tisch. Dort sitzt ein Mann. Draußen spielt ein Kind.",
        extension: "Students add one sentence with heute.",
      },
      {
        title: "Personal card",
        goal: "Build practical writing for introductions.",
        instructions: "Schreibe 5 Sätze über dich.",
        items: [
          "Wie heißt du?",
          "Wo wohnst du?",
          "Was machst du heute?",
          "Was trinkst du gern?",
          "Wie lernst du Deutsch?",
        ],
        modelText:
          "Ich heiße Sara. Ich wohne in Heidelberg. Heute lerne ich Deutsch. Ich trinke gern Kaffee. Ich lerne langsam und konzentriert.",
      },
    ],
  },
  {
    level: "A2",
    color: "var(--color-primary)",
    bg: "var(--color-primary-highlight)",
    icon: "📝",
    intro:
      "At A2, students can connect ideas, describe routines, and write short practical texts. The goal is to make them more independent and more natural.",
    goals: [
      "Write short daily-life messages.",
      "Use adverbs in more flexible positions.",
      "Describe routines and plans.",
      "Expand answers into short paragraphs.",
    ],
    targetLanguage: {
      Temporal: ["zuerst", "dann", "später", "morgens", "abends"],
      Local: ["hier", "dort", "draußen", "nach Hause"],
      Modal: ["gern", "lieber", "schnell", "ruhig"],
      "Causal / Linking": ["deshalb", "trotzdem"],
    },
    tasks: [
      {
        title: "Sentence ordering",
        goal: "Practice natural German word order.",
        instructions: "Ordne die Wörter.",
        items: [
          "ich / heute / zu Hause / arbeite",
          "geht / morgen / sie / einkaufen",
          "wir / ruhig / abends / lernen",
          "kommt / später / er / nach Hause",
          "ich / gern / im Café / schreibe",
        ],
        modelAnswers: [
          "Ich arbeite heute zu Hause.",
          "Sie geht morgen einkaufen.",
          "Wir lernen abends ruhig.",
          "Er kommt später nach Hause.",
          "Ich schreibe gern im Café.",
        ],
        extension:
          "Move one adverb to position 1 (e.g. Heute arbeite ich zu Hause.).",
      },
      {
        title: "Daily routine paragraph",
        goal: "Build connected text.",
        instructions:
          "Schreibe 5–6 Sätze über deinen Tag. Benutze: morgens, dann, oft, abends, zu Hause.",
        modelText:
          "Morgens stehe ich um sieben Uhr auf. Dann trinke ich Kaffee und lese kurz die Nachrichten. Ich arbeite oft am Computer. Abends koche ich zu Hause. Manchmal lerne ich danach noch Deutsch.",
        teachingPoint:
          "Students should not only list actions; they should create rhythm and sequence.",
      },
      {
        title: "Short message",
        goal: "Real-world communication.",
        instructions:
          "Du kannst heute nicht kommen. Schreibe eine Nachricht an einen Freund. Benutze: heute, leider, später.",
        modelText:
          "Hallo Amir, ich kann heute leider nicht kommen. Ich habe noch viel Arbeit. Vielleicht sehen wir uns später am Abend. Viele Grüße, Lina",
        extension: "Rewrite the message more politely.",
      },
      {
        title: "Invitation response",
        goal: "Combine plan, place, and opinion.",
        instructions:
          "Dein Freund lädt dich ins Kino ein. Antworte in 4–5 Sätzen.",
        items: [
          "Kommst du?",
          "Wann?",
          "Wo trefft ihr euch?",
          "Bist du pünktlich?",
          "Freust du dich?",
        ],
        modelText:
          "Ja, ich komme gern. Wir treffen uns morgen um 19 Uhr vor dem Kino. Ich bin pünktlich dort. Ich freue mich sehr auf den Film.",
      },
      {
        title: "Compare two habits",
        goal: "Learn contrast.",
        instructions:
          "Vergleiche deinen Morgen und deinen Abend in 5 Sätzen. Benutze: morgens, abends, oft, manchmal, lieber.",
        modelText:
          "Morgens bin ich oft müde. Ich trinke dann Kaffee. Abends bin ich ruhiger. Manchmal lese ich ein Buch. Abends lerne ich lieber Deutsch als morgens.",
      },
      {
        title: "Guided email",
        goal: "Introduce simple written structure.",
        instructions:
          "Schreibe eine E-Mail an deine Lehrerin. Du fragst nach dem Kurs morgen.",
        items: ["morgen", "wo", "wann", "vielleicht"],
        modelText:
          "Liebe Frau Keller, ich habe eine kurze Frage zum Kurs morgen. Wo findet der Unterricht statt und wann beginnt er genau? Vielleicht komme ich ein paar Minuten früher. Vielen Dank und viele Grüße, Anna",
      },
    ],
  },
  {
    level: "B1",
    color: "var(--color-gold, var(--color-primary))",
    bg: "var(--color-gold-highlight, var(--color-primary-highlight))",
    icon: "💬",
    intro:
      "At B1, students should write connected, meaningful texts with reasons, reactions, and small arguments. The goal is to help them express themselves more fully and sound more intentional.",
    goals: [
      "Explain decisions.",
      "Organize a paragraph.",
      "Use linking adverbs.",
      "Write short opinions, narratives, and practical texts.",
    ],
    targetLanguage: {
      "Sentence adverbs": ["vielleicht", "leider", "hoffentlich"],
      "Linking adverbs": ["deshalb", "trotzdem", "außerdem", "dann"],
      "Time markers": ["früher", "heute", "inzwischen", "später"],
      "Degree / Style": ["wirklich", "ziemlich", "besonders"],
    },
    tasks: [
      {
        title: "Opinion paragraph",
        goal: "Write and support an opinion.",
        instructions:
          'Schreibe 80–100 Wörter zum Thema: „Lernen zu Hause oder in der Bibliothek?" Use at least 4: oft, ruhig, lieber, deshalb, manchmal, trotzdem.',
        modelText:
          "Ich lerne lieber zu Hause, weil es dort ruhiger ist. Ich kann meinen Tag besser planen und oft konzentrierter arbeiten. Manchmal gehe ich trotzdem in die Bibliothek, besonders wenn ich lange lesen oder schreiben muss. Dort ist die Atmosphäre sehr produktiv. Zu Hause bin ich flexibler, deshalb ist es für mich im Alltag praktischer. Für wichtige Prüfungen finde ich aber beide Orte nützlich.",
        teachingPoint:
          "Students must go beyond preference and give a reason plus nuance.",
      },
      {
        title: "Story continuation",
        goal: "Practice flow and sequencing.",
        instructions:
          "Lies den Anfang und schreibe 6–8 Sätze weiter. Use: zuerst, dann, plötzlich, trotzdem, später.",
        modelText:
          "Heute wollte ich eigentlich früh anfangen zu arbeiten. Leider war alles anders als geplant. Zuerst habe ich meinen Schlüssel nicht gefunden. Dann kam auch noch ein wichtiger Anruf. Plötzlich war es schon halb zehn. Trotzdem habe ich versucht, ruhig zu bleiben. Später bin ich doch noch ins Büro gefahren. Dort konnte ich endlich konzentriert arbeiten. Am Ende war der Tag stressig, aber erfolgreich.",
      },
      {
        title: "Problem-solving message",
        goal: "Real communication with explanation.",
        instructions:
          "Du kommst zu spät zu einem Termin. Schreibe eine Nachricht.",
        items: ["apology", "reason", "new arrival time", "polite tone"],
        modelText:
          "Guten Tag Frau Neumann, es tut mir leid, aber ich komme heute etwas später. Mein Zug hat leider Verspätung. Ich bin wahrscheinlich erst um 15:20 Uhr da. Trotzdem möchte ich den Termin gern wahrnehmen. Vielen Dank für Ihr Verständnis.",
      },
      {
        title: "Error correction and rewrite",
        goal: "Develop awareness of natural German.",
        instructions: "Verbessere den Text.",
        wrong:
          "Heute ich arbeite zu Hause. Ich schreibe sehr schnell oft E-Mails. Dort ich bin ruhig. Trotzdem ich habe viel zu tun.",
        right:
          "Heute arbeite ich zu Hause. Ich schreibe oft sehr schnell E-Mails. Dort bin ich ruhig. Trotzdem habe ich viel zu tun.",
        extension:
          "Ask students why each sentence sounds better after correction.",
      },
      {
        title: "Before and now",
        goal: "Express development over time.",
        instructions:
          'Schreibe 6 Sätze zum Thema: „Früher und heute". Use: früher, heute, oft, inzwischen, gern, besser.',
        modelText:
          "Früher habe ich nicht oft Deutsch gesprochen. Heute benutze ich die Sprache viel regelmäßiger. Inzwischen schreibe ich auch kurze Texte auf Deutsch. Ich lerne gern mit echten Beispielen. Mein Wortschatz ist jetzt besser. Deshalb fühle ich mich sicherer.",
      },
      {
        title: "Forum response",
        goal: "Write a short public-style opinion.",
        instructions:
          'Antworte in einem Forum auf die Frage: „Soll man jeden Tag einen Lernplan haben?"',
        modelText:
          "Ich finde einen Lernplan im Allgemeinen sinnvoll. Er hilft, regelmäßig zu arbeiten und Ziele klar zu sehen. Trotzdem sollte man nicht zu streng mit sich sein, weil jeder Tag anders ist. Manchmal ist ein kurzer, realistischer Plan besser als ein perfekter Plan, den man nicht einhalten kann. Deshalb ist Flexibilität für mich genauso wichtig wie Disziplin.",
      },
    ],
  },
  {
    level: "B2",
    color: "var(--color-error)",
    bg: "var(--color-error-highlight, rgba(201, 96, 96, 0.14))",
    icon: "🎯",
    intro:
      "At B2, learners should control tone, structure, nuance, and argumentation. The goal is to help them write with purpose, not only correctness.",
    goals: [
      "Build balanced arguments.",
      "Manage formal and informal register.",
      "Use adverbs for precision and stance.",
      "Write more persuasive and structured texts.",
    ],
    targetLanguage: {
      "Argumentative / Linking": [
        "einerseits",
        "andererseits",
        "dennoch",
        "hingegen",
        "außerdem",
        "folglich",
      ],
      Stance: ["offenbar", "vermutlich", "möglicherweise", "tatsächlich"],
      "Degree / Tone": ["ziemlich", "äußerst", "besonders", "eher"],
      "Text structuring": ["zunächst", "anschließend", "abschließend"],
    },
    tasks: [
      {
        title: "Formal opinion text",
        goal: "Write a structured argument.",
        instructions:
          'Schreibe 140–180 Wörter zum Thema: „Soll digitales Lernen klassische Kurse teilweise ersetzen?"',
        modelText:
          "Digitale Lernformen haben in den letzten Jahren tatsächlich stark an Bedeutung gewonnen. Einerseits bieten sie große Vorteile: Man kann flexibel lernen, Inhalte wiederholen und oft Zeit sparen. Außerdem sind viele Materialien schnell verfügbar. Andererseits fehlt in rein digitalen Formaten häufig der direkte soziale Kontakt, der für Motivation und spontane Fragen wichtig ist. Dennoch sollte man digitales Lernen nicht als Gegensatz zum klassischen Unterricht sehen. Vielmehr können beide Formen sinnvoll kombiniert werden. Folglich erscheint ein hybrides Modell besonders sinnvoll.",
      },
      {
        title: "Register shift",
        goal: "Learn stylistic control.",
        instructions:
          "Schreibe den Inhalt zuerst informell, dann formell (scheduling conflict).",
        informal:
          "Hallo Jonas, ich kann morgen leider nicht zum Treffen kommen, weil ich kurzfristig einen anderen Termin habe. Vielleicht klappt es nächste Woche. Sag mir einfach, wann du Zeit hast.",
        formal:
          "Sehr geehrte Frau Becker, leider kann ich morgen an dem geplanten Termin nicht teilnehmen, da kurzfristig eine andere Verpflichtung entstanden ist. Gerne würde ich einen Ersatztermin vereinbaren. Bitte teilen Sie mir mit, wann es Ihnen in der kommenden Woche passt.",
        teachingPoint: "Same meaning, different tone, rhythm, and vocabulary.",
      },
      {
        title: "Balanced argument",
        goal: "Present both sides clearly.",
        instructions:
          'Schreibe einen Text zum Thema: „Arbeiten im Homeoffice".',
        items: ["Introduction", "Advantages", "Disadvantages", "Your position"],
        modelText:
          "Homeoffice ist heute für viele Menschen ein fester Teil des Berufslebens. Einerseits ermöglicht es ein flexibleres Arbeiten und spart oft Zeit. Außerdem können sich viele Beschäftigte zu Hause besser konzentrieren. Andererseits verschwimmen die Grenzen zwischen Beruf und Privatleben leichter. Ich halte Homeoffice insgesamt für eine gute Lösung, allerdings nur mit klaren Regeln.",
      },
      {
        title: "Precision writing",
        goal: "Feel how adverbs change tone.",
        instructions:
          "Schreibe fünf Versionen desselben Satzes mit unterschiedlicher Wirkung. Base: Das Buch ist interessant.",
        modelAnswers: [
          "Das Buch ist sehr interessant.",
          "Das Buch ist wirklich interessant.",
          "Das Buch ist ziemlich interessant.",
          "Das Buch ist eher interessant als spannend.",
          "Das Buch ist besonders interessant für Anfänger.",
        ],
        teachingPoint:
          "Adverbs don't only add grammar; they shape attitude and precision.",
      },
      {
        title: "Complaint email",
        goal: "Use practical formal writing.",
        instructions:
          "Schreibe eine formelle Beschwerde über einen Sprachkurs.",
        items: [
          "what the problem is",
          "when it happened",
          "why you are dissatisfied",
          "what solution you expect",
        ],
        modelText:
          "Sehr geehrte Damen und Herren, ich besuche seit Anfang Mai Ihren Abendkurs und möchte mich über mehrere Punkte beschweren. In den letzten Wochen begann der Unterricht wiederholt verspätet, außerdem fielen zwei Stunden kurzfristig aus. Ich bitte Sie daher um eine klare Information zum weiteren Plan sowie um eine angemessene Lösung. Mit freundlichen Grüßen, Daniel Weber",
      },
      {
        title: "Reflective learning text",
        goal: "Encourage real language growth.",
        instructions:
          'Schreibe 150 Wörter zum Thema: „Wie lerne ich am effektivsten?" Use: normalerweise, besonders, manchmal, deshalb, trotzdem, inzwischen.',
        modelText:
          "Normalerweise lerne ich am effektivsten, wenn ich regelmäßig in kurzen Einheiten arbeite. Besonders hilfreich ist es für mich, wenn ich neue Wörter sofort in eigenen Sätzen benutze. Manchmal möchte ich alles auf einmal lernen, aber das funktioniert langfristig nicht gut. Deshalb plane ich heute klarer und arbeite mit kleineren Zielen. Trotzdem versuche ich, genug Raum für spontane Wiederholung zu lassen.",
      },
    ],
  },
];

const CROSS_LEVEL_EXERCISES = [
  {
    title: "Question to answer",
    rows: [
      {
        level: "A1",
        prompt: "Wann lernst du Deutsch?",
        model: "Ich lerne heute Deutsch.",
      },
      {
        level: "A2",
        prompt: "Wann und wo lernst du normalerweise Deutsch?",
        model: "Ich lerne normalerweise abends zu Hause Deutsch.",
      },
      {
        level: "B1",
        prompt: "Wann lernst du am besten, und warum?",
        model:
          "Ich lerne am besten abends, weil es dann ruhiger ist und ich mich besser konzentrieren kann.",
      },
      {
        level: "B2",
        prompt: "Unter welchen Bedingungen lernst du besonders effektiv?",
        model:
          "Besonders effektiv lerne ich, wenn ich feste Ziele habe und ungestört arbeiten kann, weil ich dann konzentrierter und strukturierter bleibe.",
      },
    ],
  },
  {
    title: "Short to long writing (prompt word: heute)",
    rows: [
      { level: "A1", model: "Ich arbeite heute." },
      {
        level: "A2",
        model: "Heute arbeite ich zu Hause und lerne später Deutsch.",
      },
      {
        level: "B1",
        model:
          "Heute arbeite ich zu Hause, weil ich dort ruhiger bin und mich besser konzentrieren kann.",
      },
      {
        level: "B2",
        model:
          "Heute arbeite ich bewusst zu Hause, da ich dort nicht nur ruhiger, sondern insgesamt produktiver bin.",
      },
    ],
  },
];

const REAL_LIFE_SITUATIONS = [
  "Write a WhatsApp message.",
  "Write a postcard.",
  "Write an email to a teacher.",
  "Write a short complaint.",
  "Write a reaction in an online forum.",
  "Write a workplace update.",
  "Write a personal reflection.",
];

const CREATIVE_TASKS = [
  {
    icon: "📖",
    title: "Adverb storytelling",
    body: "Write a story where each sentence must start with a different adverb.",
  },
  {
    icon: "🎭",
    title: "Mood rewrites",
    body: "Rewrite the same message with leider, hoffentlich, and glücklicherweise style effects.",
  },
  {
    icon: "📍",
    title: "Location challenge",
    body: "Describe a place using only adverbs and short clauses.",
  },
  {
    icon: "👤",
    title: "Role-based writing",
    body: "Student writes as a tourist, employee, buyer, manager, or neighbor.",
  },
  {
    icon: "🪜",
    title: "Adverb ladder",
    body: "Rewrite one sentence from A1 simple to B2 polished.",
  },
];

const TEACHING_STAGES = [
  {
    stage: "Stage 1: Notice",
    icon: "🔍",
    body: "Students identify the adverbs and say what they express: time, place, manner, reason, attitude.",
  },
  {
    stage: "Stage 2: Build",
    icon: "🧱",
    body: "Students complete or reorder sentences.",
  },
  {
    stage: "Stage 3: Personalize",
    icon: "🙋",
    body: "Students rewrite the sentence with their own information.",
  },
  {
    stage: "Stage 4: Expand",
    icon: "🌿",
    body: "Students turn one sentence into a paragraph.",
  },
];

const STAGE_EXAMPLE = {
  base: "Ich lerne heute.",
  personalize: "Ich lerne heute zu Hause.",
  expand:
    "Ich lerne heute zu Hause, weil ich dort mehr Ruhe habe. Später wiederhole ich noch neue Wörter.",
};

const RUBRIC_CRITERIA = [
  "Is the sentence understandable?",
  "Is the adverb used with the right meaning?",
  "Is the word order natural?",
  "Is the writing complete?",
  "Does the text fit the situation?",
  "Is the tone appropriate for the level?",
];

const SCORING_MODEL = [
  { point: "1 point", criterion: "Vocabulary choice" },
  { point: "1 point", criterion: "Grammar" },
  { point: "1 point", criterion: "Word order" },
  { point: "1 point", criterion: "Task completion" },
  { point: "1 point", criterion: "Natural expression" },
];

const MODEL_SYLLABUS = [
  { level: "A1", focus: "Daily routine, places, simple preferences." },
  { level: "A2", focus: "Short messages, appointments, shopping, travel." },
  { level: "B1", focus: "Opinions, explanations, short narratives." },
  { level: "B2", focus: "Formal writing, argumentation, stylistic control." },
];

/* Rotating accent palette for fun, colorful task cards (all tokens, no hardcoded hex) */
const ACCENTS = [
  { c: "var(--color-primary)", b: "var(--color-primary-highlight)" },
  { c: "var(--color-success)", b: "var(--color-success-highlight)" },
  {
    c: "var(--color-error)",
    b: "var(--color-error-highlight, rgba(201, 96, 96, 0.14))",
  },
  {
    c: "var(--color-gold, var(--color-primary))",
    b: "var(--color-gold-highlight, var(--color-primary-highlight))",
  },
];

/* ─── SUB-COMPONENTS ────────────────────────────────────────────────────────── */

function SectionCard({ children, style = {}, accentColor }) {
  return (
    <div
      className="case-section"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        boxShadow: "var(--shadow-sm)",
        borderTop: accentColor ? `3px solid ${accentColor}` : undefined,
        transition:
          "transform var(--transition-interactive), box-shadow var(--transition-interactive)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function LevelBadge({
  level,
  color,
  bg,
  icon,
  active,
  onClick,
  doneCount,
  totalCount,
}) {
  return (
    <button
      onClick={onClick}
      className="examples-toggle"
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        background: active ? bg : "var(--color-surface)",
        border: `1.5px solid ${active ? color : "var(--color-border)"}`,
        color: active ? color : "var(--color-text-muted)",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        padding: "var(--space-2) var(--space-4)",
        borderRadius: "var(--radius-full)",
        cursor: "pointer",
        transform: active ? "scale(1.06)" : "scale(1)",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        transition: "all var(--transition-interactive)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = active ? "scale(1.06)" : "scale(1)")
      }
    >
      <span style={{ fontSize: "1.1em" }}>{icon}</span>
      <span>{level}</span>
      {totalCount > 0 && (
        <span
          style={{
            fontSize: "var(--text-xs)",
            background: active ? "rgba(0,0,0,0.15)" : "var(--color-surface-2)",
            color: active ? color : "var(--color-text-faint)",
            borderRadius: "var(--radius-full)",
            padding: "0 var(--space-2)",
            fontWeight: 700,
          }}
        >
          {doneCount}/{totalCount}
        </span>
      )}
    </button>
  );
}

function TargetLanguageTable({ targetLanguage, color }) {
  return (
    <div className="table-wrap">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Words</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(targetLanguage).map(([cat, words]) => (
            <tr key={cat}>
              <td style={{ fontWeight: 600, color }}>{cat}</td>
              <td>
                {words.map((w, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      margin: "2px 4px 2px 0",
                      padding: "2px 10px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--color-surface-2)",
                      color: "var(--color-text)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {w}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TaskCard({ task, index, color, bg, onToggle, revealed }) {
  const [hovered, setHovered] = useState(false);

  return (
    <SectionCard
      accentColor={color}
      style={{
        marginBottom: "var(--space-4)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "var(--space-3)",
          }}
        >
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              color: "var(--color-text)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.6em",
                height: "1.6em",
                borderRadius: "50%",
                background: bg,
                color,
                fontSize: "var(--text-sm)",
                fontWeight: 700,
              }}
            >
              {index + 1}
            </span>
            {task.title}
            {revealed && <span style={{ fontSize: "var(--text-sm)" }}>✅</span>}
          </h4>
          <span
            style={{
              fontSize: "var(--text-xs)",
              color,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              background: bg,
              padding: "2px 10px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Goal
          </span>
        </div>

        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
            marginTop: "var(--space-1)",
          }}
        >
          {task.goal}
        </p>

        <p
          style={{
            marginTop: "var(--space-3)",
            fontSize: "var(--text-base)",
            color: "var(--color-text)",
          }}
        >
          {task.instructions}
        </p>

        {task.items && (
          <ul
            style={{
              marginTop: "var(--space-2)",
              paddingLeft: "var(--space-5)",
              color: "var(--color-text)",
            }}
          >
            {task.items.map((item, i) => (
              <li key={i} style={{ marginBottom: "var(--space-1)" }}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {task.wrong && task.right ? (
          <>
            <button
              onClick={onToggle}
              className="btn-reset"
              style={{ marginTop: "var(--space-3)", borderColor: color, color }}
            >
              {revealed
                ? "Hide correction 🙈"
                : "Tap to see the correct form →"}
            </button>
            <p
              style={{
                marginTop: "var(--space-2)",
                color: "var(--color-error)",
              }}
            >
              ❌ {task.wrong}
            </p>
            {revealed && (
              <p style={{ color: "var(--color-success)" }}>✅ {task.right}</p>
            )}
          </>
        ) : task.informal && task.formal ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              marginTop: "var(--space-3)",
            }}
          >
            <div>
              <span className="input-label">🗨️ Informal</span>
              <p style={{ color: "var(--color-text)" }}>{task.informal}</p>
            </div>
            <div>
              <span className="input-label">🎩 Formal</span>
              <p style={{ color: "var(--color-text)" }}>{task.formal}</p>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onToggle}
              className="btn-reset"
              style={{ marginTop: "var(--space-3)", borderColor: color, color }}
            >
              {revealed ? "Hide model answer 🙈" : "Tap to see model answer →"}
            </button>
            {revealed && (
              <div
                style={{
                  marginTop: "var(--space-2)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  background: bg,
                }}
              >
                {task.modelText && (
                  <p style={{ color: "var(--color-text)" }}>
                    💡 {task.modelText}
                  </p>
                )}
                {task.modelAnswers && (
                  <ul
                    style={{
                      paddingLeft: "var(--space-5)",
                      color: "var(--color-text)",
                    }}
                  >
                    {task.modelAnswers.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}

        {task.teachingPoint && (
          <p
            style={{
              marginTop: "var(--space-3)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-faint)",
            }}
          >
            📌 {task.teachingPoint}
          </p>
        )}
        {task.extension && (
          <p
            style={{
              marginTop: "var(--space-1)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-faint)",
            }}
          >
            <span style={{ color, fontWeight: 600 }}>Extension: </span>
            {task.extension}
          </p>
        )}
      </div>
    </SectionCard>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────────── */

export default function Writing() {
  const [activeLevel, setActiveLevel] = useState(LEVELS[0].level);
  const [revealedMap, setRevealedMap] = useState({});

  const current = LEVELS.find((l) => l.level === activeLevel);

  const toggleTask = (levelKey, idx) => {
    const key = `${levelKey}-${idx}`;
    setRevealedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const progressFor = useCallback(
    (levelKey, total) => {
      let done = 0;
      for (let i = 0; i < total; i++)
        if (revealedMap[`${levelKey}-${i}`]) done++;
      return done;
    },
    [revealedMap],
  );

  const currentDone = useMemo(
    () => progressFor(current.level, current.tasks.length),
    [current, progressFor],
  );

  return (
    <div className="writing-page container">
      <header>
        <div className="logo-wrap">
          <div className="logo-svg">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <div className="logo-title">German Writing</div>
            <div className="logo-sub">A1 → B2 syllabus, gamified ✨</div>
          </div>
        </div>
        <div className="progress-badge">
          {currentDone}/{current.tasks.length} revealed in {current.level}
        </div>
      </header>

      <div className="controls" style={{ flexWrap: "wrap" }}>
        {LEVELS.map((l) => (
          <LevelBadge
            key={l.level}
            level={l.level}
            color={l.color}
            bg={l.bg}
            icon={l.icon}
            active={activeLevel === l.level}
            onClick={() => setActiveLevel(l.level)}
            doneCount={progressFor(l.level, l.tasks.length)}
            totalCount={l.tasks.length}
          />
        ))}
      </div>

      <SectionCard
        accentColor={current.color}
        style={{ background: current.bg }}
      >
        <p style={{ color: "var(--color-text)", fontSize: "var(--text-base)" }}>
          <span style={{ fontSize: "1.4em", marginRight: "var(--space-2)" }}>
            {current.icon}
          </span>
          {current.intro}
        </p>
      </SectionCard>

      <SectionCard accentColor={current.color}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
            color: current.color,
          }}
        >
          🎯 {current.level} goals
        </h3>
        <ul
          style={{ paddingLeft: "var(--space-5)", color: "var(--color-text)" }}
        >
          {current.goals.map((g, i) => (
            <li key={i} style={{ marginBottom: "var(--space-1)" }}>
              {g}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard accentColor={current.color}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
            color: current.color,
          }}
        >
          🗂️ {current.level} target language
        </h3>
        <TargetLanguageTable
          targetLanguage={current.targetLanguage}
          color={current.color}
        />
      </SectionCard>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
          }}
        >
          ✍️ {current.level} writing tasks
        </h3>
        {current.tasks.map((task, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <TaskCard
              key={i}
              task={task}
              index={i}
              color={accent.c}
              bg={accent.b}
              onToggle={() => toggleTask(current.level, i)}
              revealed={!!revealedMap[`${current.level}-${i}`]}
            />
          );
        })}
      </div>

      <SectionCard accentColor="var(--color-primary)">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
          }}
        >
          🔁 Cross-level exercise bank
        </h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-4)",
          }}
        >
          These tasks can be reused from A1 to B2 by changing the difficulty.
        </p>
        {CROSS_LEVEL_EXERCISES.map((ex, i) => (
          <div key={i} style={{ marginBottom: "var(--space-5)" }}>
            <h4
              style={{
                marginBottom: "var(--space-2)",
                color: "var(--color-text)",
              }}
            >
              {ex.title}
            </h4>
            <div className="table-wrap">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Level</th>
                    {ex.rows[0].prompt && <th>Prompt</th>}
                    <th>Model</th>
                  </tr>
                </thead>
                <tbody>
                  {ex.rows.map((row, j) => {
                    const lvl = LEVELS.find((l) => l.level === row.level);
                    return (
                      <tr key={j}>
                        <td
                          style={{
                            fontWeight: 700,
                            color: lvl ? lvl.color : "var(--color-text)",
                          }}
                        >
                          {row.level}
                        </td>
                        {row.prompt && <td>{row.prompt}</td>}
                        <td>{row.model}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <h4
          style={{
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-2)",
            color: "var(--color-text)",
          }}
        >
          🌍 Real-life writing situations
        </h4>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
        >
          {REAL_LIFE_SITUATIONS.map((s, i) => (
            <span
              key={i}
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-text)",
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-sm)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard accentColor="var(--color-success)">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
          }}
        >
          🎨 Creative task ideas
        </h3>
        <div
          style={{
            display: "grid",
            gap: "var(--space-3)",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {CREATIVE_TASKS.map((t, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={i}
                className="case-boss-card"
                style={{
                  background: accent.b,
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  border: `1px solid ${accent.c}`,
                  transition: "transform var(--transition-interactive)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div
                  style={{ fontSize: "1.6em", marginBottom: "var(--space-1)" }}
                >
                  {t.icon}
                </div>
                <strong style={{ color: accent.c }}>{t.title}</strong>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-sm)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {t.body}
                </p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard accentColor="var(--color-primary)">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
          }}
        >
          🪄 Teaching innovation: four stages
        </h3>
        <div
          style={{
            display: "grid",
            gap: "var(--space-3)",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {TEACHING_STAGES.map((s, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={i}
                className="case-boss-card"
                style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  borderLeft: `4px solid ${accent.c}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  <span style={{ fontSize: "1.3em" }}>{s.icon}</span>
                  <strong style={{ color: accent.c }}>{s.stage}</strong>
                </div>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {s.body}
                </p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface-2)",
          }}
        >
          <span className="input-label">🚀 Example progression</span>
          <p
            style={{ color: "var(--color-text)", marginTop: "var(--space-2)" }}
          >
            <strong style={{ color: "var(--color-text-muted)" }}>Base:</strong>{" "}
            {STAGE_EXAMPLE.base}
          </p>
          <p style={{ color: "var(--color-text)" }}>
            <strong style={{ color: "var(--color-primary)" }}>
              Personalize:
            </strong>{" "}
            {STAGE_EXAMPLE.personalize}
          </p>
          <p style={{ color: "var(--color-text)" }}>
            <strong style={{ color: "var(--color-success)" }}>Expand:</strong>{" "}
            {STAGE_EXAMPLE.expand}
          </p>
        </div>
      </SectionCard>

      <SectionCard accentColor="var(--color-error)">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
          }}
        >
          ✅ Correction rubric
        </h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-3)",
          }}
        >
          Use the same correction logic at every level for a premium, consistent
          course product.
        </p>

        <h4
          style={{ marginBottom: "var(--space-2)", color: "var(--color-text)" }}
        >
          What teachers check
        </h4>
        <ul
          style={{
            paddingLeft: "var(--space-5)",
            marginBottom: "var(--space-4)",
            color: "var(--color-text)",
          }}
        >
          {RUBRIC_CRITERIA.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>

        <h4
          style={{ marginBottom: "var(--space-2)", color: "var(--color-text)" }}
        >
          Simple scoring model
        </h4>
        <div className="table-wrap">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Points</th>
                <th>Criterion</th>
              </tr>
            </thead>
            <tbody>
              {SCORING_MODEL.map((s, i) => (
                <tr key={i}>
                  <td
                    style={{ color: "var(--color-primary)", fontWeight: 700 }}
                  >
                    {s.point}
                  </td>
                  <td>{s.criterion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard accentColor="var(--color-success)">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-3)",
          }}
        >
          🗺️ A model syllabus
        </h3>
        <div className="table-wrap">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_SYLLABUS.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: LEVELS[i].color }}>
                    {LEVELS[i].icon} {row.level}
                  </td>
                  <td>{row.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
