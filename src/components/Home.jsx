import React from "react";
import { Link } from "react-router-dom";
import styles from "../components/Home.css";

const PILLS = [
  {
    label: "Vocabulary Quiz",
    path: "/quiz",
    icon: "📝",
    desc: "Verbs, nouns, adjectives & adverbs",
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
    label: "Tenses",
    path: "/tenses",
    icon: "⏱",
    desc: "Present, past, future & more",
  },
  {
    label: "Modal Verbs",
    path: "/modal-verbs",
    icon: "🔧",
    desc: "können, müssen, dürfen & more",
  },
  {
    label: "Regular vs Irregular",
    path: "/verb-types",
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
    label: "Scenario Simulation",
    path: "/scenarios",
    icon: "🎭",
    desc: "Real-life German conversations",
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
