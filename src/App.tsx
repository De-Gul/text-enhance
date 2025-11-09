import "./App.css";
import EnhancedText from "./components/EnhancedText";
import DemoGif from "./components/DemoGif";

function App() {
  return (
      <div className="app-container">
        <h2>Text Enhancement</h2>

        <EnhancedText
          label="Data"
          placeholder="Type the patient's case description here..."
        />
        <EnhancedText
          label="Assessment"
          placeholder="Type your assessment here..."
        />

        <DemoGif />
      </div>
  );
}
  
export default App;
