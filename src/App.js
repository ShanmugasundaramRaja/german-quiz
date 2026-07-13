// App.jsx (or your main router file)
// Replace your existing routing setup with this

import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Germanquiz from "./components/Germanquiz";
import PlaceholderPage from "./components/PlaceHolder";
import Pronouns from "./components/Pronouns";
import GermanPrepositionsExplorer from "./components/Prepositions.jsx"
import SentenceStructure from "./components/SentenceStructure.jsx"
import Tenses from "./components/Tenses.jsx"
import ModalVerb from "./components/ModalVerbs.jsx"
import GermanConnectors from "./components/Connectors.jsx"
import RegularIrregular from "./components/RegularIrregular.jsx"
import SeparableVerbs from "./components/SeparableVerbs.jsx"
import GermanAdjectivesMasterPage from "./components/Adjectives.jsx"
import ArticlesPage from "./components/Articles.jsx"
import Adverbs from "./components/Adverbs.jsx"
import Frage from "./components/Frage.jsx"
import Negations from "./components/Negations.jsx"
import ComparitiveAndSuperlative from "./components/ComparitiveAndSuperlative.jsx"
import Plural from "./components/Plural.jsx";
import Reflexive from "./components/Reflexive.jsx";
import ActivePassive from "./components/ActivePassive.jsx";
import DirectIndirect from "./components/DirectIndirect.jsx";
import Basics from "./components/Basics.jsx";
import Writing from "./components/Writing.jsx";
// Stub imports — replace each with the real component as you build it






const SpeechPractice    = () => <PlaceholderPage title="Speech Practice" />;
const ScenarioSim       = () => <PlaceholderPage title="Scenario Simulation" />;

const ListeningPractice = () => <PlaceholderPage title="Listening Practice" />;


export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/quiz"               element={<Germanquiz />} />
        <Route path="/sentence-structure" element={<SentenceStructure />} />
        <Route path="/pronouns"           element={<Pronouns/>} />
        <Route path="/tenses"             element={<Tenses />} />
        <Route path="/modal-verbs"        element={<ModalVerb />} />
            <Route path="/connectors"        element={<GermanConnectors />} />
              <Route path="/regularIrregular"        element={<RegularIrregular />} />
              <Route path="/adjectives" element={<GermanAdjectivesMasterPage/>}/>
              <Route path="/articles" element={<ArticlesPage/>}/>
              <Route path="/adverbs" element={<Adverbs/>}/>
               <Route path="/frage" element={<Frage/>}/>
                  <Route path="/negation" element={<Negations/>}/>
                   <Route path="/compare" element={<ComparitiveAndSuperlative/>}/>
  
        <Route path="/separable-verbs"    element={<SeparableVerbs />} />
        <Route path="/speech"             element={<SpeechPractice />} />
        <Route path="/scenarios"          element={<ScenarioSim />} />
  
        <Route path="/listening"          element={<ListeningPractice />} />
         <Route path="/prepositions"          element={<GermanPrepositionsExplorer />} />
         <Route path="/plural" element={<Plural/>}/>
           <Route path="/reflexive" element={<Reflexive/>}/>
            <Route path="/active" element={<ActivePassive/>}/>
            <Route path="/direct" element={<DirectIndirect/>}/>
             <Route path="/basics" element={<Basics/>}/>
              <Route path="/writing" element={<Writing/>}/>
      </Routes>
    </HashRouter>
  );
}