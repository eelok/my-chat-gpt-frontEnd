import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [prompt, updatePrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);

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
      event.preventDefault();
      setAnswer(message.answer);
      console.log('message', message.answer);
      await getAllPromtsAndAnswers();
      updatePrompt('');
    } catch (err) {
      console.log('err', err);
    }
  };

  const getAllPromtsAndAnswers = async () => {
    const requestOptions = {
      method: 'GET',
    };
    const reply = await fetch(
      'http://localhost:5500/conversation',
      requestOptions
    );
    const conversation = await reply.json();
    console.log('conversation', conversation);
    conversation.map((item) => console.log(item));
    setConversation(conversation);
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="conversation__wrapper">
          {conversation.map((item) => (
            <div className="conversation__line" key={item.id}>
              <tr>
                <th className="conversation__header">Your questions:</th>
                <tb className="conversation__text">{item.question} </tb>
              </tr>
              <tr>
                <th className="conversation__header">Answer:</th>
                <tb className="conversation__text">{item.answer}</tb>
              </tr>
            </div>
          ))}
        </div>
        <div className="spotlight__wrapper">
          <input
            value={prompt}
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
