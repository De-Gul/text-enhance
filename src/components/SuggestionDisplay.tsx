import { useState, useEffect, useCallback, useRef } from "react";
import { useDataContext } from "../api/DataContext";
import { CircularProgress, styled } from "@mui/material";
import type { Suggestion as SuggestionType } from "../api/dataHandler";
import StyledButton from "./StyledButton";
import StyledIconButton from "./StyledArrowButton";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface SuggestionDisplayProps {
  inputText: string;
  onUseText: (text: string) => void;
  onDiscard: () => void;
}

const StyledContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  padding: "1rem",
  backgroundColor: "white",
  marginBottom: "1.5rem",
});

const StyledTextContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

const StyledButtonsContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "0.5rem",
});

const StyledErrorMessage = styled("div")({
  color: "red",
  flex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.5rem",
  lineHeight: 1.2,
  fontSize: "0.9rem",
});

const StyledLoadingMessage = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  gap: "0.5rem",
  fontSize: "0.9rem",
  color: "#666",
  flex: 1,
});

const SuggestionNavigation = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  flex: 0,
  gap: "0.5rem",
  fontSize: "0.8rem",
});

const MAX_TRIES = 3;

function SuggestionDisplay({
  inputText,
  onUseText,
  onDiscard,
}: SuggestionDisplayProps) {
  const [suggestion, setSuggestion] = useState<SuggestionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tryAgainCount, setTryAgainCount] = useState(1);
  const [savedSuggestions, setSavedSuggestions] = useState<SuggestionType[]>(
    []
  );
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);
  const isCancelledRef = useRef(false);

  const { fetchSuggestion } = useDataContext();

  const resetSuggestions = () => {
    setSuggestion(null);
    setIsLoading(false);
    setTryAgainCount(1);
    setCurrentSuggestionIndex(0);
    setSavedSuggestions([]);
    setError(null);
  };

  const handleUseText = () => {
    onUseText(suggestion?.text || "");
    //resetSuggestion();
  };

  const handleDiscard = () => {
    onDiscard();
    resetSuggestions();
  };

  const handleFetchSuggestion = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const usedIndices = savedSuggestions.map((s) => s.index);
      const newSuggestion = await fetchSuggestion(inputText, usedIndices);
      if (isCancelledRef.current) return;
      if (newSuggestion) {
        setSuggestion(newSuggestion);
        setSavedSuggestions((prev) => {
          const newSavedSuggestions = [...prev, newSuggestion];
          setCurrentSuggestionIndex(newSavedSuggestions.length - 1);
          return newSavedSuggestions;
        });
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      if (!isCancelledRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchSuggestion, inputText, savedSuggestions]);

  const handleTryAgain = () => {
    if (tryAgainCount < MAX_TRIES || error) {
      handleFetchSuggestion().then(() => {
        setTryAgainCount(tryAgainCount + 1);
      });
    }
  };

  const handlePreviousSuggestion = () => {
    if (suggestion && currentSuggestionIndex > 0) {
      setCurrentSuggestionIndex(currentSuggestionIndex - 1);
      setSuggestion(savedSuggestions[currentSuggestionIndex - 1]);
    }
  };

  const handleNextSuggestion = () => {
    if (suggestion && currentSuggestionIndex < savedSuggestions.length - 1) {
      setCurrentSuggestionIndex(currentSuggestionIndex + 1);
      setSuggestion(savedSuggestions[currentSuggestionIndex + 1]);
    }
  };

  useEffect(() => {
    isCancelledRef.current = false;
    if (!hasFetchedRef.current) {
      handleFetchSuggestion();
      hasFetchedRef.current = true; // prevent multiple fetches on mount
    }

    return () => {
      isCancelledRef.current = true;
    };
  }, []);

  return (
    <StyledContainer>
      {suggestion && (
        <StyledTextContainer>{suggestion.text}</StyledTextContainer>
      )}
      <StyledButtonsContainer>
        {isLoading && (
          <StyledLoadingMessage>
            <CircularProgress size={20} /> Generating suggestions...
          </StyledLoadingMessage>
        )}
        {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
        <StyledButton
          onClick={handleDiscard}
          startIcon={<DeleteOutline />}
          variant="outlined"
        >
          Discard
        </StyledButton>
        <StyledButton
          onClick={handleTryAgain}
          startIcon={<ReplayIcon />}
          disabled={(!error && tryAgainCount >= 3) || isLoading}
          variant="outlined"
        >
          Try Again
        </StyledButton>
        <StyledButton
          onClick={handleUseText}
          startIcon={<CheckIcon />}
          variant="contained"
          color="primary"
          disabled={!suggestion}
        >
          Use Text
        </StyledButton>
      </StyledButtonsContainer>

      {savedSuggestions.length > 1 && (
        <SuggestionNavigation>
          <StyledIconButton
            type="button"
            onClick={handlePreviousSuggestion}
            className="btn-nav"
            disabled={currentSuggestionIndex === 0}
          >
            <ArrowBackIosIcon style={{ marginLeft: "0.3em" }} />
          </StyledIconButton>
          <span className="suggestion-counter">
            {currentSuggestionIndex + 1}/{savedSuggestions.length}
          </span>
          <StyledIconButton
            type="button"
            onClick={handleNextSuggestion}
            className="btn-nav"
            disabled={currentSuggestionIndex === savedSuggestions.length - 1}
          >
            <ArrowForwardIosIcon style={{ marginLeft: "0.2em" }} />
          </StyledIconButton>
        </SuggestionNavigation>
      )}
    </StyledContainer>
  );
}

export default SuggestionDisplay;
