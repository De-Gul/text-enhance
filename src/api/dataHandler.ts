import { normalize } from "../utils";
import enhanceData from "../data/enhance_sentences.json";

const ERROR_RATE = 0.1;

const sessions = enhanceData.sessions;

interface Session {
  input: string;
  outputs: string[];
}

export type Suggestion = {
  text: string;
  index: number;
};

export const fetchSuggestion = async (
  inputText: string,
  usedIndices: number[]
): Promise<Suggestion | null> => {
  console.log("fetchSuggestion", inputText, usedIndices);
  const delayMs = 300 + Math.floor(Math.random() * 900);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  //randomly return an error
  if (Math.random() < ERROR_RATE) {
    throw new Error("There was a random error fetching the suggestion");
  }

  const key = normalize(inputText);
  if (!key) {
    throw new Error("Input text is empty");
  }
  const matchedSession = sessions.find(
    (session: Session) => normalize(session.input) === key
  );
  if (
    !matchedSession ||
    !matchedSession.outputs ||
    matchedSession.outputs.length === 0
  ) {
    throw new Error("Sorry, no suggested enhancements found");
  }
  const availableOutputs = matchedSession.outputs.filter(
    (_, index) => !usedIndices.includes(index)
  );
  if (availableOutputs.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * availableOutputs.length);
  const suggestion: Suggestion = {
    text: availableOutputs[randomIndex],
    index: randomIndex,
  };
  return suggestion;
};
