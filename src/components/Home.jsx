import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const PILLS = [
  {
    label: "Vocabulary Quiz",
    path: "/quiz",
    icon: "📝",
    desc: "Verbs, nouns, adjectives & adverbs",
  },
  {
    label: "Articles",
    path: "/articles",
    icon: "👤",
    desc: "Articles of all cases",
  },
  {
    label: "Adverbs",
    path: "/adverbs",
    icon: "👤",
    desc: "Adverbs of all types",
  },
  {
    label: "Sentence Structure",
    path: "/sentence-structure",
    icon: "🔤",
    desc: "Word order & clause building",
  },
  {
    label: "Pronouns Table",
    path: "/pronouns",
    icon: "👤",
    desc: "Personal, possessive & reflexive",
  },
  {
    label: "Prepositions",
    path: "/prepositions",
    icon: "👤",
    desc: "All cases and two way",
  },
  {
    label: "Connectors",
    path: "/connectors",
    icon: "👤",
    desc: "Conjunctions and connectors of all cases",
  },
  {
    label: "Tenses",
    path: "/tenses",
    icon: "⏱",
    desc: "Present, past, future & more",
  },
  {
    label: "Questions",
    path: "/frage",
    icon: "❓",
    desc: "All types of questions",
  },
  {
    label: "Modal Verbs",
    path: "/modal-verbs",
    icon: "🔧",
    desc: "können, müssen, dürfen & more",
  },
  {
    label: "Adjectives",
    path: "/adjectives",
    icon: "👤",
    desc: "Adjectives of all types",
  },
  {
    label: "Regular vs Irregular",
    path: "/regularIrregular",
    icon: "⚡",
    desc: "Conjugation patterns",
  },
  {
    label: "Separable Verbs",
    path: "/separable-verbs",
    icon: "✂️",
    desc: "Trennbare & untrennbare Verben",
  },
  {
    label: "Speech Practice",
    path: "/speech",
    icon: "🗣",
    desc: "Pronunciation & speaking drills",
  },
  {
    label: "Negation",
    path: "/negation",
    icon: "🚫",
    desc: "All types of negation",
  },
  {
    label: "Scenario Simulation",
    path: "/scenarios",
    icon: "🎭",
    desc: "Real-life German conversations",
  },
  {
    label: "Comparitive & Superlative",
    path: "/compare",
    icon: "💪🏼",
    desc: "Comparisons and Superlations of all types",
  },
  {
    label: "Writing Practice",
    path: "/writing",
    icon: "✍️",
    desc: "Structured writing exercises",
  },
  {
    label: "Listening Practice",
    path: "/listening",
    icon: "🎧",
    desc: "Comprehension & dictation",
  },
  {
    label: "Plural",
    path: "/plural",
    icon: "👥",
    desc: "How to pluralise anything",
  },
  {
    label: "Reflexive verbs",
    path: "/reflexive",
    icon: "🔁",
    desc: "Use of reflexive verbs",
  },
  {
    label: "Active and Passive",
    path: "/active",
    icon: "🔁",
    desc: "Active and Passive voices in all cases",
  },
  {
    label: "Direct and Indirect",
    path: "/direct",
    icon: "👉",
    desc: "Direct and Indirect Speeches",
  },
  {
    label: "Alphabets, Numbers and Greetings",
    path: "/basics",
    icon: "📌",
    desc: "All the elementary basics",
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-badge">A1 → B1</div>
        <h1 className="home-title">Learning German</h1>
        <p className="home-subtitle">
          Pick a section to practice. Each module tracks your progress
          independently.
        </p>
      </div>

      <div className="home-grid">
        {PILLS.map(({ label, path, icon, desc }) => (
          <Link key={path} to={path} className="home-pill">
            <span className="home-pill-icon">{icon}</span>
            <span className="home-pill-label">{label}</span>
            <span className="home-pill-desc">{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
