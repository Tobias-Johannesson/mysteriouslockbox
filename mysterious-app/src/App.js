import React from 'react';
import './App.css';

function App() {
  const openingDate = new Date('2024-07-01T00:00:00'); // Set the date and time when the hunt should start
  const now = new Date();
  const isEarly = now < openingDate;

  const countdown = () => {
    const difference = +openingDate - +new Date();
    if (difference > 0) {
      const days = Math.floor((difference / (1000 * 60 * 60 * 24)));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }
    return "It's time!";
  };

  return (
    <div className="App">
      <header></header>
      <body>
        <img src="/lockbox.png" alt="Lockbox" />
        {isEarly ? (
          <>
            <h1>Hold Your Horses!</h1>
            <p>
              Hi there, brave challenger! This lockbox contains your reward, but it seems you're a bit early.
              The adventure begins at {openingDate.toLocaleTimeString()}, on {openingDate.toDateString()}.
              Keep your eyes peeled and come back in {countdown()}!
            </p>
            <p>
              Beware, the challenge might open early...
            </p>
          </>
        ) : (
          <p>
            The wait is over, brave challenger! It's time to solve the seven challenges and unlock your rewards...
          </p>
        )}
      </body>
      <footer></footer>
    </div>
  );
}

export default App;

