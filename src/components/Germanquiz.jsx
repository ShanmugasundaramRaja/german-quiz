import React, { useState, useMemo, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import "./Germanquiz.css";

import verbsData from "../data/verbs.json";
import nounsData from "../data/nouns.json";
import adjectivesData from "../data/adjectives.json";
import adverbsData from "../data/adverbs.json";

const TAB_LABELS = {
  verbs: "Verbs",
  nouns: "Nouns",
  adverbs: "Adverbs",
  adjectives: "Adjectives",
};

const TAB_TITLES = {
  verbs: "German Verbs Quiz",
  nouns: "German Nouns Quiz",
  adverbs: "German Adverbs Quiz",
  adjectives: "German Adjectives Quiz",
};

const PAGE_SIZE = 50;
const LOCAL_KEY_PREFIX = "germanquiz_revealed_";

const Germanquiz = () => {
  const [mode, setMode] = useState("en-de");
  const [activeTab, setActiveTab] = useState("verbs");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [revealed, setRevealed] = useState([]); // per-page
  const [globalRevealed, setGlobalRevealed] = useState({}); // per-tab

  const [answerValue, setAnswerValue] = useState("");
  const [inputState, setInputState] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const answerInputRef = useRef(null);
  const rowRefs = useRef({}); // globalIndex -> <tr>

  // Dataset for current tab
  const allItems = useMemo(() => {
    switch (activeTab) {
      case "verbs":
        return verbsData;
      case "nouns":
        return nounsData;
      case "adverbs":
        return adverbsData;
      case "adjectives":
        return adjectivesData;
      default:
        return verbsData;
    }
  }, [activeTab]);

  const totalItems = allItems.length;
  const totalQuestions = totalItems;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const pageStartIndex = (currentPage - 1) * PAGE_SIZE;
  const pageEndIndex = Math.min(pageStartIndex + PAGE_SIZE, totalItems);
  const pageItems = allItems.slice(pageStartIndex, pageEndIndex);

  // Load tab state from localStorage or init
  const loadGlobalRevealedForTab = () => {
    const key = `${LOCAL_KEY_PREFIX}${activeTab}`;
    const stored =
      typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    let arr = null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === totalItems) {
          arr = parsed;
        }
      } catch {
        // ignore parse errors
      }
    }

    if (!arr) {
      arr = new Array(totalItems).fill(false);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(arr));
      }
    }

    return arr;
  };

  const derivePageRevealed = (tabState) => {
    const pageLen = pageItems.length;
    const arr = new Array(pageLen).fill(false);
    for (let i = 0; i < pageLen; i++) {
      const globalIndex = pageStartIndex + i;
      if (globalIndex < tabState.length) {
        arr[i] = !!tabState[globalIndex];
      }
    }
    return arr;
  };

  // Initialize / update tab state
  useEffect(() => {
    if (typeof window === "undefined") return;

    setGlobalRevealed((prev) => {
      let tabState = prev[activeTab];

      if (!tabState || tabState.length !== totalItems) {
        tabState = loadGlobalRevealedForTab();
      }

      const pageState = derivePageRevealed(tabState);
      setRevealed(pageState);
      setCurrentIndex(0);
      setAnswerValue("");
      setInputState("none");
      setShowResults(false);
      setShowConfetti(false);

      return { ...prev, [activeTab]: tabState };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, totalItems, pageStartIndex, pageItems.length]);

  // Page change within same tab
  useEffect(() => {
    const tabState = globalRevealed[activeTab];
    if (!tabState || tabState.length !== totalItems) return;

    const pageState = derivePageRevealed(tabState);
    setRevealed(pageState);
    setCurrentIndex(0);
    setAnswerValue("");
    setInputState("none");
    setShowResults(false);
    setShowConfetti(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Auto-scroll active row into view (table scroll area has its own scrollbar)
  useEffect(() => {
    if (
      currentIndex == null ||
      currentIndex < 0 ||
      currentIndex >= pageItems.length
    ) {
      return;
    }

    // Only auto-scroll once we are past the first 3 items on a page
    if (currentIndex < 3) return;

    const globalIndex = pageStartIndex + currentIndex;
    const rowEl = rowRefs.current[globalIndex];

    if (rowEl && rowEl.scrollIntoView) {
      rowEl.scrollIntoView({
        behavior: "smooth",
        block: "start", // align at top of scrollable area
      });
    }
  }, [currentIndex, pageItems.length, pageStartIndex]);

  const getPrompt = (globalIndex) => {
    const item = allItems[globalIndex];
    return mode === "en-de" ? item.en : item.de;
  };

  const getAnswer = (globalIndex) => {
    const item = allItems[globalIndex];
    return mode === "en-de" ? item.de : item.en;
  };

  const totalCorrect =
    (globalRevealed[activeTab] || []).filter(Boolean).length || 0;

  const normalizeAnswer = (text) => {
    if (!text) return "";
    let t = text.toLowerCase().trim();

    if (activeTab === "nouns") {
      t = t.replace(/^(der|die|das)\s+/, "");
    }

    return t;
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleRowClick = (pageIdx) => {
    setCurrentIndex(pageIdx);
    setInputState("none");
    setAnswerValue("");
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAnswerValue(value);
    setInputState("none");

    if (
      pageItems.length === 0 ||
      currentIndex < 0 ||
      currentIndex >= pageItems.length
    ) {
      return;
    }

    const globalIndex = pageStartIndex + currentIndex;
    const correctAnswerRaw = getAnswer(globalIndex);
    const correctAnswer = normalizeAnswer(correctAnswerRaw);
    const typed = normalizeAnswer(value);

    if (typed === correctAnswer) {
      setInputState("correct");

      let nextIndexAfterReveal = currentIndex;

      // update per-page revealed and find next index
      setRevealed((prev) => {
        const next = [...prev];
        next[currentIndex] = true;

        let candidate = -1;
        for (let i = currentIndex + 1; i < next.length; i++) {
          if (!next[i]) {
            candidate = i;
            break;
          }
        }
        if (candidate === -1) {
          for (let i = 0; i < currentIndex; i++) {
            if (!next[i]) {
              candidate = i;
              break;
            }
          }
        }

        nextIndexAfterReveal = candidate === -1 ? currentIndex : candidate;
        return next;
      });

      // update global revealed + persist
      setGlobalRevealed((prev) => {
        const currentTabState =
          prev[activeTab] && prev[activeTab].length === totalItems
            ? [...prev[activeTab]]
            : new Array(totalItems).fill(false);

        currentTabState[globalIndex] = true;

        const key = `${LOCAL_KEY_PREFIX}${activeTab}`;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(currentTabState));
        }

        return { ...prev, [activeTab]: currentTabState };
      });

      setTimeout(() => {
        setAnswerValue("");
        setInputState("none");
        setCurrentIndex(nextIndexAfterReveal);
        if (answerInputRef.current) {
          answerInputRef.current.focus();
        }
      }, 400);
    }
  };

  const handleInputKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      answerValue.trim().length > 0 &&
      inputState !== "correct"
    ) {
      setInputState("wrong");
      setTimeout(() => setInputState("none"), 400);
    }
  };

  const handleReset = () => {
    const freshGlobal = new Array(totalItems).fill(false);
    const freshPage = new Array(pageItems.length).fill(false);

    setGlobalRevealed((prev) => ({
      ...prev,
      [activeTab]: freshGlobal,
    }));
    setRevealed(freshPage);
    setCurrentIndex(0);
    setAnswerValue("");
    setInputState("none");
    setShowResults(false);
    setShowConfetti(false);

    const key = `${LOCAL_KEY_PREFIX}${activeTab}`;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(freshGlobal));
    }

    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleCheckAnswers = () => {
    if (totalQuestions === 0) {
      setShowResults(true);
      setShowConfetti(false);
      return;
    }

    const ratio = totalCorrect / totalQuestions;
    const celebrateNow = ratio >= 0.7;

    setShowConfetti(celebrateNow);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setShowConfetti(false);
  };

  const inputLabel =
    mode === "en-de" ? "Type the German word" : "Type the English word";

  const currentPrompt =
    currentIndex >= 0 && currentIndex < pageItems.length
      ? getPrompt(pageStartIndex + currentIndex)
      : "—";

  const inputClassName = [
    "answer-input",
    inputState === "correct" ? "correct" : "",
    inputState === "wrong" ? "wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const leftHeader = mode === "en-de" ? "English" : "German";
  const rightHeader = mode === "en-de" ? "German" : "English";

  const celebrate = totalQuestions > 0 && totalCorrect / totalQuestions >= 0.7;

  return (
    <div className="quiz=page">
      {showConfetti && typeof window !== "undefined" && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={800}
        />
      )}

      {/* TOP: sticky header, tabs, controls, input */}
      <div className="top-sticky">
        <header>
          <div className="logo-wrap">
            <svg
              className="logo-svg"
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              aria-label="German quiz logo"
            >
              <rect
                width="36"
                height="36"
                rx="10"
                fill="currentColor"
                fillOpacity="0.12"
              />
              <path
                d="M8 18h6M22 18h6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M14 18c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M18 22v3M18 11v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.5"
              />
            </svg>
            <div>
              <div className="logo-title">{TAB_TITLES[activeTab]}</div>
              <div className="logo-sub">German Quiz</div>
            </div>
          </div>
        </header>

        <div className="tabs-row">
          {["verbs", "nouns", "adverbs", "adjectives"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-button ${activeTab === tab ? "tab-active" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="controls">
          <div className="select-wrap">
            <select
              id="modeSelect"
              aria-label="Quiz direction"
              value={mode}
              onChange={handleModeChange}
            >
              <option value="en-de">English → German</option>
              <option value="de-en">German → English</option>
            </select>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <button
            className="btn-reset"
            id="resetBtn"
            aria-label="Reset quiz"
            type="button"
            onClick={handleReset}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4" />
            </svg>
            Reset
          </button>

          <button
            className="btn-reset"
            type="button"
            onClick={handleCheckAnswers}
          >
            Check answers
          </button>

          <div className="progress-badge" id="progressBadge">
            {totalCorrect} / {totalQuestions || 0}
          </div>
        </div>

        <div className="input-section">
          <div className="input-label" id="inputLabel">
            {inputLabel}
          </div>
          <div className="input-wrap">
            <input
              ref={answerInputRef}
              className={inputClassName}
              id="answerInput"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Type your answer here…"
              aria-label="Answer input"
              value={answerValue}
              disabled={pageItems.length === 0}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
          </div>
          <div className="input-hint" id="inputHint">
            Translating: <span id="currentWord">{currentPrompt}</span>
          </div>
        </div>
      </div>

      {/* MIDDLE: scrollable table area (CSS: .table-scroll { flex:1; overflow-y:auto; } ) */}
      <div className="table-scroll">
        <div className="table-wrap">
          <table aria-label="German quiz table">
            <thead>
              <tr>
                <th className="td-index">#</th>
                <th id="headerLeft">{leftHeader}</th>
                <th id="headerRight">{rightHeader}</th>
              </tr>
            </thead>
            <tbody id="verbTable">
              {pageItems.map((item, pageIdx) => {
                const globalIndex = pageStartIndex + pageIdx;
                const isRevealed = revealed[pageIdx];
                const isActive = pageIdx === currentIndex;

                return (
                  <tr
                    key={globalIndex}
                    ref={(el) => {
                      if (el) {
                        rowRefs.current[globalIndex] = el;
                      }
                    }}
                    className={`${isRevealed ? "revealed" : ""} ${
                      isActive ? "active-row" : ""
                    }`}
                    onClick={() => handleRowClick(pageIdx)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="td-index">{globalIndex + 1}</td>
                    <td
                      className={`td-prompt ${isActive ? "active" : ""}`}
                      id={`prompt-${globalIndex}`}
                    >
                      {mode === "en-de" ? item.en : item.de}
                    </td>
                    <td className="td-answer" id={`answer-${globalIndex}`}>
                      {isRevealed ? (
                        <span className="answer-revealed">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {mode === "en-de" ? item.de : item.en}
                        </span>
                      ) : (
                        <span className="answer-blank" />
                      )}
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No items on this page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM: sticky pagination (via CSS) */}
      <div className="pagination-row">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="pagination-info">
          Page {currentPage} / {totalPages} · {PAGE_SIZE} per page
        </span>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>

      {/* RESULTS OVERLAY */}
      {showResults && (
        <div
          className={`results-backdrop ${celebrate ? "results-celebrate" : ""}`}
          onClick={handleCloseResults}
        >
          <div className="results-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className={
                celebrate ? "results-confetti-full" : "results-confetti"
              }
            />
            <div className="results-icon">
              <span role="img" aria-label={celebrate ? "party" : "thinking"}>
                {celebrate ? "🥳" : "🤔"}
              </span>
            </div>
            <h2 className="results-title">
              {celebrate ? "Awesome work!" : "Keep trying"}
            </h2>
            <p className="results-text">
              You got <strong>{totalCorrect}</strong> out of{" "}
              <strong>{totalQuestions}</strong> correct in this tab ({activeTab}
              ).
            </p>
            {!celebrate && (
              <p className="results-text">
                Aim for at least 70% before the confetti party starts.
              </p>
            )}
            <button
              type="button"
              className="pagination-btn"
              onClick={handleCloseResults}
            >
              {celebrate ? "Continue practicing" : "Try harder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Germanquiz;
