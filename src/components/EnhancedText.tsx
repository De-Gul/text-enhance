import { useRef, useState } from "react";
import SuggestionDisplay from "./SuggestionDisplay";
import { Chip, styled, TextField } from "@mui/material";
import StyledButton from "./StyledButton";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface EnhancedTextProps {
  label: string;
  placeholder: string;
}

const StyledButtonContainer = styled("div")({
  position: "relative",
  minHeight: 40,
});

function EnhancedText({ label, placeholder }: EnhancedTextProps) {
  const [inputText, setInputText] = useState("");
  const [showEnhanceButton, setShowEnhanceButton] = useState(false);
  const [textToEnhance, setTextToEnhance] = useState("");
  const [originalText, setOriginalText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnhance = () => {
    setShowEnhanceButton(false);
    setOriginalText(inputText);
    setTextToEnhance(inputText);
  };

  const handleClose = () => {
    setTextToEnhance("");
    // delay to allow the input to blur
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleDiscard = () => {
    setInputText(originalText);
    handleClose();
  };

  const handleUseText = (text: string) => {
    setInputText(text);
    handleClose();
  };

  const handleShowEnhanceButton = () => {
    setShowEnhanceButton(true);
  };

  const handleHideEnhanceButton = () => {
    // delay to allow the input to blur
    setTimeout(() => {
      setShowEnhanceButton(false);
    }, 100);
  };

  return (
    <div className="case-form">
      <label htmlFor="case-description">{label}</label>
      <TextField
        id="case-description"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={placeholder}
        multiline
        rows={5}
        fullWidth
        variant="outlined"
        disabled={textToEnhance !== ""}
        onFocus={handleShowEnhanceButton}
        onBlur={handleHideEnhanceButton}
        inputRef={inputRef}
      />

      <StyledButtonContainer>
        <StyledButton
          variant="outlined"
          color="primary"
          onClick={handleEnhance}
          disabled={!inputText}
          startIcon={<AutoAwesomeIcon />}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            opacity: showEnhanceButton ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            zIndex: 1,
          }}
        >
          Enhance
          <Chip label="Beta" color="primary" size="small" disabled={!inputText} />
        </StyledButton>
        <div style={{ position: "relative", zIndex: 10 }}>
        {textToEnhance && (
          <SuggestionDisplay
            inputText={textToEnhance}
            onUseText={handleUseText}
            onDiscard={handleDiscard}
          />
        )}
        </div>
      </StyledButtonContainer>
    </div>
  );
}

export default EnhancedText;
