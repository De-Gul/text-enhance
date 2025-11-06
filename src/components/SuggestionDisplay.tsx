import { useState, useEffect } from "react";
import enhanceData from "../data/enhance_sentences.json";
import "../App.css";

interface Session {
  input: string;
  outputs: string[];
}

interface Suggestion {
  text: string;
  originalInput: string;
}

interface SuggestionDisplayProps {
  inputText: string;
  onUseText: (text: string) => void;
  onDiscard: () => void;
}

function SuggestionDisplay({
  inputText,
  onUseText,
  onDiscard,
}: SuggestionDisplayProps) {
  const sessions = enhanceData.sessions;
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [lastMatchKey, setLastMatchKey] = useState("");
  const [tryAgainCount, setTryAgainCount] = useState(0);
  const [savedSuggestions, setSavedSuggestions] = useState<Suggestion[]>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .replace(/\s+/g, " ")
      .trim();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    let cancelled = false;

    const simulateFetchSuggestion = async () => {
      try {
        const key = normalize(inputText);

        if (!key) {
          if (cancelled) return;
          setSuggestion(null);
          setUsedIndices([]);
          setLastMatchKey("");
          setTryAgainCount(0);
          setSavedSuggestions([]);
          setCurrentSuggestionIndex(0);
          setIsLoading(false);
          return;
        }

        const matchedSession = sessions.find(
          (session: Session) => normalize(session.input) === key
        );

        if (!matchedSession) {
          if (cancelled) return;
          setSuggestion(null);
          setUsedIndices([]);
          setLastMatchKey("");
          setTryAgainCount(0);
          setSavedSuggestions([]);
          setCurrentSuggestionIndex(0);
          return;
        }

        if (lastMatchKey !== key) {
          if (cancelled) return;
          setUsedIndices([]);
          setLastMatchKey(key);
          setSuggestion(null);
          setTryAgainCount(0);
          setSavedSuggestions([]);
          setCurrentSuggestionIndex(0);
        }

        if (!suggestion && savedSuggestions.length === 0) {
          const available: number[] = matchedSession.outputs
            .map((_, idx) => idx)
            .filter((idx) => !usedIndices.includes(idx));

          if (available.length === 0) {
            if (cancelled) return;
            setSuggestion(null);
            return;
          }

          const delayMs = 300 + Math.floor(Math.random() * 900);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          if (cancelled) return;

          const rand = Math.floor(Math.random() * available.length);
          const choiceIndex = available[rand];
          const newSuggestion: Suggestion = {
            text: matchedSession.outputs[choiceIndex],
            originalInput: matchedSession.input,
          };
          setSuggestion(newSuggestion);
          setSavedSuggestions([newSuggestion]);
          setCurrentSuggestionIndex(0);
          setUsedIndices((prev) => [...prev, choiceIndex]);
          setTryAgainCount(0);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    simulateFetchSuggestion();

    return () => {
      cancelled = true;
    };
  }, [
    inputText,
    lastMatchKey,
    suggestion,
    usedIndices,
    savedSuggestions.length,
  ]);

  const handleUseText = () => {
    if (suggestion) {
      onUseText(suggestion.text);
      setSuggestion(null);
      setTryAgainCount(0);
      setSavedSuggestions([]);
      setCurrentSuggestionIndex(0);
    }
  };

  const handleDiscard = () => {
    setSuggestion(null);
    setTryAgainCount(0);
    setSavedSuggestions([]);
    setCurrentSuggestionIndex(0);
    onDiscard();
  };

  const handleTryAgain = () => {
    if (suggestion && tryAgainCount < 3) {
      const key = normalize(inputText);
      const matchedSession = sessions.find(
        (session: Session) => normalize(session.input) === key
      );
      if (!matchedSession) return;

      // Save current suggestion if not already saved
      const currentSuggestionExists = savedSuggestions.some(
        (s) => s.text === suggestion.text
      );
      if (!currentSuggestionExists) {
        setSavedSuggestions((prev) => [...prev, suggestion]);
      }

      const available: number[] = matchedSession.outputs
        .map((_, idx) => idx)
        .filter((idx) => !usedIndices.includes(idx));

      if (available.length === 0) {
        setSuggestion(null);
        return;
      }

      const rand = Math.floor(Math.random() * available.length);
      const choiceIndex = available[rand];
      const newSuggestion: Suggestion = {
        text: matchedSession.outputs[choiceIndex],
        originalInput: matchedSession.input,
      };

      // Update saved suggestions array
      const updatedSaved = currentSuggestionExists
        ? [...savedSuggestions, newSuggestion]
        : [...savedSuggestions, suggestion, newSuggestion];

      setSavedSuggestions(updatedSaved);
      setCurrentSuggestionIndex(updatedSaved.length - 1);
      setSuggestion(newSuggestion);
      setUsedIndices((prev) => [...prev, choiceIndex]);
      setTryAgainCount((prev) => prev + 1);
    }
  };

  const handlePreviousSuggestion = () => {
    if (suggestion && currentSuggestionIndex > 0) {
      // Ensure current suggestion is saved before navigating
      const currentExists = savedSuggestions.some(
        (s) => s.text === suggestion.text
      );
      if (
        !currentExists &&
        currentSuggestionIndex === savedSuggestions.length
      ) {
        // Current suggestion is not saved, save it first
        setSavedSuggestions((prev) => [...prev, suggestion]);
      }

      const newIndex = currentSuggestionIndex - 1;
      setCurrentSuggestionIndex(newIndex);
      setSuggestion(savedSuggestions[newIndex]);
    }
  };

  const handleNextSuggestion = () => {
    if (suggestion) {
      // Ensure current suggestion is saved before navigating
      const currentExists = savedSuggestions.some(
        (s) => s.text === suggestion.text
      );
      if (!currentExists) {
        // Current suggestion is not saved, save it and update index
        const updated = [...savedSuggestions, suggestion];
        setSavedSuggestions(updated);
        setCurrentSuggestionIndex(updated.length - 1);
      } else if (currentSuggestionIndex < savedSuggestions.length - 1) {
        const newIndex = currentSuggestionIndex + 1;
        setCurrentSuggestionIndex(newIndex);
        setSuggestion(savedSuggestions[newIndex]);
      }
    }
  };

  if (!suggestion) {
    return null;
  }

  return (
    <div className="suggestion-container">
      <div className="suggestion-header">
        <strong>Suggested Enhancement:</strong>
      </div>
      <div className="suggestion-text">{suggestion.text}</div>
      <div className="suggestion-buttons">
        <button
          type="button"
          onClick={handleUseText}
          className="btn btn-primary"
        >
          Use Text
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          className="btn btn-secondary"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleTryAgain}
          className="btn btn-secondary"
          disabled={tryAgainCount >= 3 || isLoading}
        >
          Try Again
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}
      {savedSuggestions.length > 1 && (
        <div className="suggestion-navigation">
          <button
            type="button"
            onClick={handlePreviousSuggestion}
            className="btn-nav"
            disabled={currentSuggestionIndex === 0}
          >
            ← Previous
          </button>
          <span className="suggestion-counter">
            {currentSuggestionIndex + 1} of {savedSuggestions.length}
          </span>
          <button
            type="button"
            onClick={handleNextSuggestion}
            className="btn-nav"
            disabled={currentSuggestionIndex === savedSuggestions.length - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default SuggestionDisplay;
