// App.jsx (or your main router file)
// Replace your existing routing setup with this

import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Germanquiz from "./components/Germanquiz";
import PlaceholderPage from "./components/PlaceHolder";

// Stub imports — replace each with the real component as you build it
const SentenceStructure = () => <PlaceholderPage title="Sentence Structure" />;
const PronounsTable     = () => <PlaceholderPage title="Pronouns Table" />;
const Tenses            = () => <PlaceholderPage title="Tenses" />;
const ModalVerbs        = () => <PlaceholderPage title="Modal Verbs" />;
const VerbTypes         = () => <PlaceholderPage title="Regular vs Irregular Verbs" />;
const SeparableVerbs    = () => <PlaceholderPage title="Separable & Inseparable Verbs" />;
const SpeechPractice    = () => <PlaceholderPage title="Speech Practice" />;
const ScenarioSim       = () => <PlaceholderPage title="Scenario Simulation" />;
const WritingPractice   = () => <PlaceholderPage title="Writing Practice" />;
const ListeningPractice = () => <PlaceholderPage title="Listening Practice" />;

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/quiz"               element={<Germanquiz />} />
        <Route path="/sentence-structure" element={<SentenceStructure />} />
        <Route path="/pronouns"           element={<PronounsTable />} />
        <Route path="/tenses"             element={<Tenses />} />
        <Route path="/modal-verbs"        element={<ModalVerbs />} />
        <Route path="/verb-types"         element={<VerbTypes />} />
        <Route path="/separable-verbs"    element={<SeparableVerbs />} />
        <Route path="/speech"             element={<SpeechPractice />} />
        <Route path="/scenarios"          element={<ScenarioSim />} />
        <Route path="/writing"            element={<WritingPractice />} />
        <Route path="/listening"          element={<ListeningPractice />} />
      </Routes>
    </HashRouter>
  );
}