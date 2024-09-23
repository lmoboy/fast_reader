import { useState, useEffect, useRef } from "react";
import "./App.css";

  /**
   * App renders a button that prompts the user to select a text file to read.
   * When the user selects a file, the text is read and the words are displayed one
   * at a time. The user can pause/resume the flow of words by pressing the space
   * key. The display is updated every 100ms.
   */
function App() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " " && !paused) {
        setPaused(true);
      } else if (e.key === " " && paused) {
        setPaused(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [paused]);

  useEffect(() => {
    if (paused) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        if (wordIndex < text.split(" ").length) {
          setWordIndex(wordIndex + 1);
        }
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [wordIndex, text, paused]);

  return (
    <div className="App">
      <h1>
        {text ? (
          text.split(" ")[wordIndex]
        ) : (
          <button
            onClick={() => {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                  const text = reader.result
                    .replace(/["']/g, "")
                    .replace(/[-]/g, "")
                    .replace(/[^\w\s]/gi, "");
                  setText(text);
                };
                reader.readAsText(file);
              };
              fileInput.click();
            }}
          >
            Press Me
          </button>
        )}
      </h1>
    </div>
  );
}

export default App;

