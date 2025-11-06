import { useState } from "react";
import SuggestionDisplay from "./SuggestionDisplay";

interface EnhancedTextProps {
  label: string;
  placeholder: string;
}

function EnhancedText({ label, placeholder }: EnhancedTextProps) {
  const [inputText, setInputText] = useState("");
  const [textToEnhance, setTextToEnhance] = useState("");
  const [originalText, setOriginalText] = useState("");

  const handleUseText = (text: string) => {
    setInputText(text);
    setTextToEnhance("");
  };

  const handleEnhance = () => {
    setOriginalText(inputText);
    setTextToEnhance(inputText || "");
  };

  const handleDiscard = () => {
    setInputText(originalText);
    setTextToEnhance("");
  };
  return (
    <div>
      <label htmlFor="case-description">{label}</label>
      <textarea
        id="case-description"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={placeholder}
        rows={8}
        className="case-textarea"
        style={{
          flex: 1,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "0.75em",
        }}
      >
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleEnhance}
          disabled={!inputText}
          style={{
            flex: 0,
            opacity: !inputText ? 0.5 : 1,
            cursor: !inputText ? "not-allowed" : "pointer",
            marginLeft: "auto",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5em",
            }}
          >
            {/* Simple AI icon as SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-label="AI"
              style={{ verticalAlign: "middle" }}
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="#fff"
              />
              <text
                x="10"
                y="14"
                textAnchor="middle"
                fontSize="8"
                fontWeight="bold"
                fill="currentColor"
                fontFamily="Arial"
              >
                AI
              </text>
            </svg>
            Inhance
          </span>
        </button>
      </div>

      {textToEnhance && (
        <SuggestionDisplay
          inputText={textToEnhance}
          onUseText={handleUseText}
          onDiscard={handleDiscard}
        />
      )}
    </div>
  );
}

export default EnhancedText;
