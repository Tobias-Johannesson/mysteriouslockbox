import React, { useState } from 'react';
import '../assets/styles/App.css';
import LockboxComponent from './LockboxComponent';
import KeyComponent from './KeyComponent';

function App() {
  /* */

  return (
    <div className="App">
      {<LockboxComponent />}
      {<KeyComponent />}
    </div>
  );
}

export default App;
