import React, { useState, useEffect } from 'react';
import '../assets/styles/App.css';
import KeyComponent from './KeyComponent';
import LockboxComponent from './LockboxComponent';
import LockComponent from './LockComponent';
import RiddleInputComponent from './RiddleInputComponent';
import PageComponent from './PageComponent';
import GratitudeComponent from './GratitudeComponent';

function App() {
  const [keys, setKeys] = useState([]);
  const [showMain, setShowMain] = useState(true);

  // Fetch keys from the server
  useEffect(() => {
    const fetchKeys = async () => {
        try {
            const apiBaseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiBaseUrl}/keys`);
            if (!response.ok) throw new Error('Network response was not ok');
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            const jsonData = await response.json();
            setKeys(jsonData);
        } catch (err) {
            console.error('Error fetching keys:', err.message);
        }
    };
    fetchKeys();
}, []);

  return (
    <div>
      { !showMain && ( <div>
        {<GratitudeComponent setShowMain={setShowMain}/>}
      </div> )}
      { showMain && (<div className="App">
        <header>
          {<KeyComponent keys={keys} />}
          {<PageComponent setShowMain={setShowMain} />}
        </header>
        <main>
          <div>
            {<LockboxComponent keys={keys} />}
            {<LockComponent keys={keys} setKeys={setKeys} />}
          </div>
          <div>
            {<RiddleInputComponent setKeys={setKeys} />}
          </div>
        </main>
        <footer></footer>
      </div>)}
    </div>
  );
}

export default App;
