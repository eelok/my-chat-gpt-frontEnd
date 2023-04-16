import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [answer, setAnswer] = useState(undefined);

  useEffect(() => {
    if (prompt != null && prompt.trim() === '') {
      setAnswer(undefined);
    }
  }, [prompt]);

  const handleChange = (event) => {
    updatePrompt(event.target.value);
  };

  const sendPrompt = async (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      };
      const reply = await fetch('http://localhost:5500/ask', requestOptions);
      if (!reply.ok) {
        throw new Error('Something went wrong');
      }
      const { message } = await reply.json();
      setAnswer(message);
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <input
            type="text"
            className="spotlight__input"
            placeholder="Ask me anything...."
            onChange={handleChange}
            onKeyDown={(e) => sendPrompt(e)}
          />
          <div className="spotlight__answer">{answer}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
