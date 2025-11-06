import "./App.css";
import EnhancedText from "./components/EnhancedText";

function App() {
  return (
    <div className="app-container">
      <h1>Patient Case Description</h1>

      <EnhancedText
        label="Enter patient case description:"
        placeholder="Type the patient's case description here..."
      />
    </div>
  );
}

export default App;
