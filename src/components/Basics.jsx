import { useState } from "react";

const C = {
  violet: { bg: "var(--color-primary-highlight)", border: "var(--color-primary)", text: "var(--color-primary)", soft: "var(--color-primary-highlight)" },
  green:  { bg: "var(--color-success-highlight)", border: "var(--color-success)",  text: "var(--color-success)",  soft: "var(--color-success-highlight)" },
  amber:  { bg: "var(--color-gold-highlight)",    border: "var(--color-gold)",     text: "var(--color-gold)",     soft: "var(--color-gold-highlight)"    },
  rose:   { bg: "var(--color-error-highlight)",   border: "var(--color-error)",    text: "var(--color-error)",    soft: "var(--color-error-highlight)"   },
};

/* ── DATA ─────────────────────────────────────────────────────────────── */

const ALPHABET = [
  { l: "A", name: "ah",      hint: '"a" in father'        },
  { l: "B", name: "beh",     hint: '"b" in bed'           },
  { l: "C", name: "tseh",    hint: '"ts" or "k"'          },
  { l: "D", name: "deh",     hint: '"d" in dog'           },
  { l: "E", name: "eh",      hint: '"e" in ten'           },
  { l: "F", name: "eff",     hint: '"f" in fish'          },
  { l: "G", name: "geh",     hint: 'hard "g" in go'       },
  { l: "H", name: "hah",     hint: '"h" in house'         },
  { l: "I", name: "ee",      hint: '"ee" in see'          },
  { l: "J", name: "yot",     hint: '"y" in yes'           },
  { l: "K", name: "kah",     hint: '"k" in kite'          },
  { l: "L", name: "ell",     hint: '"l" in lamp'          },
  { l: "M", name: "emm",     hint: '"m" in man'           },
  { l: "N", name: "enn",     hint: '"n" in no'            },
  { l: "O", name: "oh",      hint: '"o" in boat'          },
  { l: "P", name: "peh",     hint: '"p" in pen'           },
  { l: "Q", name: "koo",     hint: '"kv" + always u'      },
  { l: "R", name: "err",     hint: 'uvular r'             },
  { l: "S", name: "ess",     hint: '"z" start, "s" mid'   },
  { l: "T", name: "teh",     hint: '"t" in tea'           },
  { l: "U", name: "oo",      hint: '"oo" in moon'         },
  { l: "V", name: "fau",     hint: '"f" sound (Vater)'    },
  { l: "W", name: "veh",     hint: '"v" sound (Wasser)'   },
  { l: "X", name: "iks",     hint: '"ks" in box'          },
  { l: "Y", name: "ypsilon", hint: 'ü-like / loanword "i"'},
  { l: "Z", name: "tset",    hint: '"ts" in cats'         },
];

const SPECIALS = [
  { l: "Ä", name: "ä",              hint: '"e" in bed, open'      },
  { l: "Ö", name: "ö",              hint: '"i" in bird, rounded'  },
  { l: "Ü", name: "ü",              hint: 'French "tu", rounded'  },
  { l: "ß", name: "Eszett / ß",     hint: 'strong "ss", never "z"'},
];

const NUMBERS_0_20 = [
  [0,"null"],[1,"eins"],[2,"zwei"],[3,"drei"],[4,"vier"],
  [5,"fünf"],[6,"sechs"],[7,"sieben"],[8,"acht"],[9,"neun"],
  [10,"zehn"],[11,"elf"],[12,"zwölf"],[13,"dreizehn"],[14,"vierzehn"],
  [15,"fünfzehn"],[16,"sechzehn"],[17,"siebzehn"],[18,"achtzehn"],
  [19,"neunzehn"],[20,"zwanzig"],
];

const TENS = [
  [20,"zwanzig"],[30,"dreißig"],[40,"vierzig"],[50,"fünfzig"],
  [60,"sechzig"],[70,"siebzig"],[80,"achtzig"],[90,"neunzig"],[100,"hundert"],
];

const LARGE = [
  ["10³","tausend","thousand"],
  ["10⁶","eine Million","million"],
  ["10⁹","eine Milliarde","billion (EN)"],
  ["10¹²","eine Billion","trillion (EN)"],
  ["10¹⁵","eine Billiarde","quadrillion (EN)"],
];

const GREETINGS = [
  { de: "Hallo",         en: "Hello",           note: "Neutral, any time",              color: "green"  },
  { de: "Guten Morgen",  en: "Good morning",    note: "Until ~10–11 a.m.",              color: "amber"  },
  { de: "Guten Tag",     en: "Good day",        note: "Late morning to late afternoon", color: "amber"  },
  { de: "Guten Abend",   en: "Good evening",    note: "From ~5 p.m.",                   color: "violet" },
  { de: "Gute Nacht",    en: "Good night",      note: "Leaving late / going to bed",    color: "violet" },
  { de: "Tschüss",       en: "Bye",             note: "Informal goodbye",               color: "rose"   },
  { de: "Auf Wiedersehen",en: "See you",        note: "Formal face-to-face goodbye",    color: "rose"   },
];

const POLITENESS = [
  ["Danke",          "Thanks"],
  ["Vielen Dank",    "Thanks a lot"],
  ["Bitte",          "Please / You're welcome"],
  ["Entschuldigung", "Sorry / Excuse me"],
];

const TIME_TABLE = [
  ["6:05",  "sechs Uhr fünf",           "fünf nach sechs"],
  ["6:15",  "sechs Uhr fünfzehn",       "Viertel nach sechs"],
  ["6:30",  "sechs Uhr dreißig",        "halb sieben"],
  ["6:45",  "sechs Uhr fünfundvierzig", "Viertel vor sieben"],
  ["6:50",  "sechs Uhr fünfzig",        "zehn vor sieben"],
];

const INTRO_SCRIPT = [
  "Hallo, mein Name ist Alex.",
  "Ich komme aus Indien und wohne in Mannheim.",
  "Ich bin Entwickler und arbeite als Unternehmer.",
  "Ich bin 30 Jahre alt.",
  "Ich spreche Englisch und ein bisschen Deutsch.",
];

const INTRO_QA = [
  { topic: "Name",      ask_f: "Wie heißen Sie?",       ask_i: "Wie heißt du?",       ans: "Ich heiße … / Mein Name ist …" },
  { topic: "Origin",    ask_f: "Woher kommen Sie?",     ask_i: "Woher kommst du?",    ans: "Ich komme aus …" },
  { topic: "Residence", ask_f: "Wo wohnen Sie?",        ask_i: "Wo wohnst du?",       ans: "Ich wohne in …" },
  { topic: "Job",       ask_f: "Was sind Sie von Beruf?",ask_i: "Was machst du beruflich?", ans: "Ich bin … / Ich arbeite als …" },
  { topic: "Age",       ask_f: "Wie alt sind Sie?",     ask_i: "Wie alt bist du?",    ans: "Ich bin … Jahre alt." },
  { topic: "Languages", ask_f: "Sprechen Sie Deutsch?", ask_i: "Sprichst du Deutsch?",ans: "Ich spreche … / ein bisschen …" },
];

const REGIONS = [
  { region: "Nationwide",          greetings: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"], color: "green"  },
  { region: "North (Hamburg, HB)", greetings: ["Moin", "Moin Moin", "Tach"],                         color: "blue"   },
  { region: "South (Bavaria, AT)", greetings: ["Grüß Gott", "Servus", "Grüß dich"],                  color: "amber"  },
  { region: "West (NRW, Hessen)",  greetings: ["Tach", "Guude", "Ei Gude"],                          color: "violet" },
  { region: "East / Berlin",       greetings: ["Tag", "Hallo", "Na?"],                               color: "rose"   },
  { region: "Switzerland",         greetings: ["Grüezi"],                                            color: "green"  },
];

// fix blue missing from C
const ALL_C = { ...C, blue: { bg: "var(--color-primary-highlight)", border: "var(--color-primary)", text: "var(--color-primary)", soft: "var(--color-primary-highlight)" } };

const TABS = [
  ["alphabet",  "Alphabet",   "violet"],
  ["numbers",   "Numbers",    "green"],
  ["greetings", "Greetings",  "amber"],
  ["time",      "Time",       "rose"],
  ["intro",     "Introduce",  "violet"],
  ["regions",   "Regions",    "green"],
];

/* ── SHARED ─────────────────────────────────────────────────────────────── */

function Pill({ text, color = "violet" }) {
  const col = ALL_C[color] || C.violet;
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "var(--radius-full)", background: col.soft, color: col.text, fontWeight: 800, fontSize: "var(--text-xs)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {text}
    </span>
  );
}

function Card({ color = "violet", children, style = {} }) {
  const col = ALL_C[color] || C.violet;
  return (
    <div style={{ background: col.bg, border: `1.5px solid ${col.border}`, borderRadius: "var(--radius-xl)", padding: "var(--space-4)", ...style }}>
      {children}
    </div>
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
          <tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-divider)", background: i % 2 === 0 ? "transparent" : "var(--color-surface-2)" }}>
              {row.map((cell, j) => <td key={j} style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-text)", verticalAlign: "top" }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── ALPHABET TAB ───────────────────────────────────────────────────────── */

function AlphabetTab() {
  const [selected, setSelected] = useState(null);
  const letter = selected !== null ? [...ALPHABET, ...SPECIALS][selected] : null;

  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--space-4)", alignItems: "start" }}>
        <Card color="violet">
          <CardTitle>A–Z</CardTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: "var(--space-2)" }}>
            {ALPHABET.map((item, i) => (
              <button key={i} onClick={() => setSelected(selected === i ? null : i)} style={{ padding: "var(--space-2)", borderRadius: "var(--radius-lg)", border: selected === i ? `2px solid ${C.violet.border}` : "1px solid var(--color-border)", background: selected === i ? C.violet.soft : "var(--color-surface-2)", cursor: "pointer", textAlign: "center", transition: "all 120ms ease" }}>
                <div style={{ fontWeight: 900, fontSize: "var(--text-lg)", color: selected === i ? C.violet.text : "var(--color-text)", lineHeight: 1 }}>{item.l}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 2 }}>{item.name}</div>
              </button>
            ))}
          </div>
        </Card>

        <div style={{ display: "grid", gap: "var(--space-3)", minWidth: 180 }}>
          {letter ? (
            <Card color="violet">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", fontWeight: 900, color: C.violet.text, lineHeight: 1 }}>{letter.l}</div>
                <div style={{ fontWeight: 800, fontSize: "var(--text-base)", color: "var(--color-text)", marginTop: "var(--space-2)" }}>"{letter.name}"</div>
                <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginTop: "var(--space-1)", lineHeight: 1.5 }}>{letter.hint}</div>
              </div>
            </Card>
          ) : (
            <Card color="violet" style={{ textAlign: "center" }}>
              <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>Tap a letter to see its name and pronunciation.</div>
            </Card>
          )}

          <Card color="amber">
            <CardTitle>Umlauts + ß</CardTitle>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              {SPECIALS.map((item, i) => (
                <button key={i} onClick={() => setSelected(selected === ALPHABET.length + i ? null : ALPHABET.length + i)} style={{ padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-lg)", border: selected === ALPHABET.length + i ? `2px solid ${C.amber.border}` : "1px solid var(--color-border)", background: selected === ALPHABET.length + i ? C.amber.soft : "var(--color-surface-2)", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--space-3)", textAlign: "left" }}>
                  <span style={{ fontWeight: 900, fontSize: "var(--text-lg)", color: C.amber.text, minWidth: 24 }}>{item.l}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-text)" }}>{item.name}</div>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>{item.hint}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── NUMBERS TAB ────────────────────────────────────────────────────────── */

function NumbersTab() {
  const [quiz, setQuiz] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const newQuiz = () => {
    const pool = [...NUMBERS_0_20, ...TENS];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setQuiz(pick);
    setRevealed(false);
  };

  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <Card color="green">
          <CardTitle>0 – 20</CardTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-2)" }}>
            {NUMBERS_0_20.map(([n, de], i) => (
              <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-2) var(--space-3)", border: "1px solid var(--color-divider)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 900, color: C.green.text }}>{n}</span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text)", fontWeight: 700 }}>{de}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <Card color="amber">
            <CardTitle>Tens</CardTitle>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              {TENS.map(([n, de], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-2) var(--space-3)", border: "1px solid var(--color-divider)" }}>
                  <span style={{ fontWeight: 900, color: C.amber.text }}>{n}</span>
                  <span style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "var(--text-sm)" }}>{de}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card color="violet">
            <CardTitle>21+ pattern</CardTitle>
            <div style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: `1px solid ${C.violet.border}`, marginBottom: "var(--space-3)", fontFamily: "var(--font-display)", color: C.violet.text, fontWeight: 900, fontSize: "var(--text-base)" }}>
              [unit] + und + [tens]
            </div>
            {[["21","einundzwanzig"],["35","fünfunddreißig"],["47","siebenundvierzig"],["99","neunundneunzig"]].map(([n, de], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-text)", borderBottom: "1px solid var(--color-divider)", padding: "var(--space-2) 0" }}>
                <span style={{ fontWeight: 900, color: C.violet.text }}>{n}</span>
                <span style={{ fontWeight: 700 }}>{de}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <Card color="rose">
          <CardTitle>Large numbers</CardTitle>
          <MiniTable headers={["Power", "German", "English"]} rows={LARGE} />
          <div style={{ marginTop: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: `1px solid ${C.rose.border}` }}>
            <Pill text="False friend" color="rose" />
            <div style={{ marginTop: "var(--space-2)", color: "var(--color-text)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
              German <strong>Billion</strong> = English <strong>trillion</strong>.<br />
              German <strong>Milliarde</strong> = English <strong>billion</strong>.
            </div>
          </div>
        </Card>

        <Card color="green">
          <CardTitle>Quick drill</CardTitle>
          <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)" }}>
            See a number — recall the German word.
          </div>
          {quiz ? (
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              <div style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", border: `1px solid ${C.green.border}`, textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: C.green.text }}>{quiz[0]}</div>
                {revealed && <div style={{ marginTop: "var(--space-2)", fontWeight: 800, fontSize: "var(--text-lg)", color: "var(--color-text)" }}>{quiz[1]}</div>}
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button onClick={() => setRevealed(true)} style={{ flex: 1, padding: "var(--space-3)", borderRadius: "var(--radius-lg)", border: "none", background: C.green.border, color: "var(--color-surface-2)", fontWeight: 800, cursor: "pointer" }}>Reveal</button>
                <button onClick={newQuiz} style={{ flex: 1, padding: "var(--space-3)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", background: "var(--color-surface-2)", color: "var(--color-text)", fontWeight: 800, cursor: "pointer" }}>Next</button>
              </div>
            </div>
          ) : (
            <button onClick={newQuiz} style={{ width: "100%", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "none", background: C.green.border, color: "var(--color-surface-2)", fontWeight: 900, cursor: "pointer", fontSize: "var(--text-base)" }}>
              Start drill →
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ── GREETINGS TAB ──────────────────────────────────────────────────────── */

function GreetingsTab() {
  const [formality, setFormality] = useState("formal");

  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "var(--space-4)" }}>
        <Card color="amber">
          <CardTitle>Basic greetings</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {GREETINGS.map((g, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", alignItems: "center", gap: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: "1px solid var(--color-divider)" }}>
                <span style={{ fontWeight: 900, color: ALL_C[g.color]?.text || C.amber.text }}>{g.de}</span>
                <span style={{ color: "var(--color-text)", fontSize: "var(--text-sm)" }}>{g.en}</span>
                <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>{g.note}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <Card color="violet">
            <CardTitle>du vs Sie</CardTitle>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              {["formal", "informal"].map((f) => (
                <button key={f} onClick={() => setFormality(f)} style={{ flex: 1, padding: "var(--space-2)", borderRadius: "var(--radius-lg)", border: formality === f ? `2px solid ${C.violet.border}` : "1px solid var(--color-border)", background: formality === f ? C.violet.soft : "var(--color-surface-2)", color: formality === f ? C.violet.text : "var(--color-text-muted)", fontWeight: 800, cursor: "pointer", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {f === "formal" ? "Sie" : "du"}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              {formality === "formal" ? (
                <>
                  <div style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: `1px solid ${C.violet.border}` }}>
                    <div style={{ fontWeight: 800, color: "var(--color-text)" }}>Guten Tag, wie geht es Ihnen?</div>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)", marginTop: 4 }}>Good day, how are you?</div>
                  </div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Use with strangers, older people, or in professional contexts.</div>
                </>
              ) : (
                <>
                  <div style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: `1px solid ${C.green.border}` }}>
                    <div style={{ fontWeight: 800, color: "var(--color-text)" }}>Hallo, wie geht's dir?</div>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)", marginTop: 4 }}>Hi, how are you?</div>
                  </div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Use with friends, family, and peers.</div>
                </>
              )}
            </div>
          </Card>

          <Card color="green">
            <CardTitle>Politeness</CardTitle>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              {POLITENESS.map(([de, en], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-2) var(--space-3)", border: "1px solid var(--color-divider)" }}>
                  <span style={{ fontWeight: 800, color: C.green.text }}>{de}</span>
                  <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>{en}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── TIME TAB ───────────────────────────────────────────────────────────── */

function TimeTab() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <Card color="rose">
          <CardTitle>Asking the time</CardTitle>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {[
              ["Wie spät ist es?",      "What time is it?"],
              ["Wie viel Uhr ist es?",  "What time is it?"],
              ["Es ist … Uhr.",         "It is … o'clock."],
            ].map(([de, en], i) => (
              <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: "1px solid var(--color-divider)" }}>
                <div style={{ fontWeight: 800, color: "var(--color-text)" }}>{de}</div>
                <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>{en}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card color="violet">
          <CardTitle>Formal vs colloquial</CardTitle>
          <MiniTable headers={["Clock", "Formal", "Colloquial"]} rows={TIME_TABLE} />
          <div style={{ marginTop: "var(--space-3)", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: `1px solid ${C.violet.border}` }}>
            <Pill text="Key rule" color="violet" />
            <div style={{ marginTop: "var(--space-2)", color: "var(--color-text)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
              <strong>halb sieben</strong> = 6:30 — half to seven, not half past six.
            </div>
          </div>
        </Card>
      </div>

      <Card color="amber">
        <CardTitle>Time in context</CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {[
            ["6:30", "Es ist halb sieben."],
            ["4:15", "Es ist Viertel nach vier."],
            ["4:45", "Es ist Viertel vor fünf."],
            ["14:00","Es ist vierzehn Uhr. (formal)"],
          ].map(([time, sent], i) => (
            <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: "1px solid var(--color-divider)" }}>
              <div style={{ fontWeight: 900, color: C.amber.text, marginBottom: "var(--space-1)" }}>{time}</div>
              <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "var(--text-sm)" }}>{sent}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── INTRODUCE TAB ──────────────────────────────────────────────────────── */

function IntroTab() {
  const [step, setStep] = useState(0);

  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "var(--space-4)" }}>
        <Card color="violet">
          <CardTitle>Q&A patterns</CardTitle>
          <MiniTable
            headers={["Topic", "Formal (Sie)", "Informal (du)", "Answer"]}
            rows={INTRO_QA.map(r => [
              <Pill text={r.topic} color="violet" />,
              r.ask_f,
              r.ask_i,
              <span style={{ color: C.green.text, fontWeight: 700 }}>{r.ans}</span>,
            ])}
          />
        </Card>

        <Card color="green">
          <CardTitle>Mini script</CardTitle>
          <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)" }}>
            Step through a full self-introduction. Read each line aloud.
          </div>
          <div style={{ display: "grid", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
            {INTRO_SCRIPT.map((line, i) => (
              <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: i === step ? `2px solid ${C.green.border}` : "1px solid var(--color-divider)", color: "var(--color-text)", fontWeight: i === step ? 800 : 400, fontSize: "var(--text-sm)", transition: "all 150ms ease", opacity: i > step ? 0.45 : 1 }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <button onClick={() => setStep(Math.max(0, step - 1))} style={{ flex: 1, padding: "var(--space-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", background: "var(--color-surface-2)", color: "var(--color-text)", fontWeight: 800, cursor: "pointer" }}>← Back</button>
            <button onClick={() => setStep(Math.min(INTRO_SCRIPT.length - 1, step + 1))} style={{ flex: 1, padding: "var(--space-2)", borderRadius: "var(--radius-lg)", border: "none", background: C.green.border, color: "var(--color-surface-2)", fontWeight: 800, cursor: "pointer" }}>Next →</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── REGIONS TAB ────────────────────────────────────────────────────────── */

function RegionsTab() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card color="amber">
        <CardTitle>Regional greetings</CardTitle>
        <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
          Standard greetings work everywhere, but locals often prefer regional forms. Tap a region to expand.
        </div>
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          {REGIONS.map((r, i) => {
            const col = ALL_C[r.color] || C.amber;
            const open = active === i;
            return (
              <div key={i} style={{ borderRadius: "var(--radius-lg)", border: open ? `2px solid ${col.border}` : "1px solid var(--color-border)", overflow: "hidden", transition: "all 150ms ease" }}>
                <button onClick={() => setActive(open ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3) var(--space-4)", background: open ? col.soft : "var(--color-surface-2)", border: "none", cursor: "pointer", gap: "var(--space-3)" }}>
                  <span style={{ fontWeight: 800, color: open ? col.text : "var(--color-text)", fontSize: "var(--text-sm)" }}>{r.region}</span>
                  <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>{open ? "▲" : "▼"}</span>
                </button>
                {open && (
                  <div style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid ${col.border}`, display: "flex", flexWrap: "wrap", gap: "var(--space-2)", background: "var(--color-surface-2)" }}>
                    {r.greetings.map((g, j) => (
                      <span key={j} style={{ background: col.soft, color: col.text, borderRadius: "var(--radius-full)", padding: "4px 12px", fontWeight: 800, fontSize: "var(--text-sm)" }}>{g}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card color="rose">
        <CardTitle>Notable patterns</CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {[
            ["Moin", "Used all day in Hamburg — not just morning. From Low German moi ('good/pleasant')."],
            ["Grüß Gott", "Literally 'God greet you'. Common in Bavaria and Austria all day, not just formal."],
            ["Servus", "Informal in Bavaria and Austria. Means both hello and goodbye."],
            ["Na?", "Very informal Berlin greeting meaning 'What's up?' One word, many meanings."],
            ["Grüezi", "Swiss German. Used like Hallo all day. Marks specifically Swiss identity."],
          ].map(([label, desc], i) => (
            <div key={i} style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", border: "1px solid var(--color-divider)" }}>
              <div style={{ fontWeight: 900, color: C.rose.text, marginBottom: "var(--space-1)" }}>{label}</div>
              <div style={{ color: "var(--color-text)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── MAIN ───────────────────────────────────────────────────────────────── */

export default function Basics() {
  const [tab, setTab] = useState("alphabet");

  const renderTab = () => {
    switch (tab) {
      case "alphabet":  return <AlphabetTab />;
      case "numbers":   return <NumbersTab />;
      case "greetings": return <GreetingsTab />;
      case "time":      return <TimeTab />;
      case "intro":     return <IntroTab />;
      case "regions":   return <RegionsTab />;
      default:          return null;
    }
  };

  return (
    <div className="pronouns-page">
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span style={{ fontSize: "2rem" }}>🇩🇪</span>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "var(--color-text)", margin: 0, lineHeight: 1.1 }}>
              German Basics
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
              Alphabet · Numbers · Greetings · Time · Introductions · Regions
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", padding: "var(--space-1)", background: "var(--color-surface-2)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", marginBottom: "var(--space-6)" }}>
        {TABS.map(([id, label, color]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "var(--space-2) var(--space-4)", borderRadius: "var(--radius-lg)", border: "none", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.04em", transition: "all 150ms ease", background: tab === id ? ALL_C[color].border : "transparent", color: tab === id ? "var(--color-surface-2)" : "var(--color-text-muted)", boxShadow: tab === id ? "var(--shadow-sm)" : "none" }}>
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
