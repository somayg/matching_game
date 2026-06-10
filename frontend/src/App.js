import React from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css';
import Level from './Level';
import Game from './Game';

const logoStyle = {
  alignSelf: 'center',
  display: 'flex',
  justifyContent: 'center',
};

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={
             <div>
        <header>
        <h1>Welcome to Matching Mayhem!</h1>
        <h2>learn about common weeds in the midwest by matching images with names</h2>
        <div style={logoStyle}>
            <img src="/images/logo.png" alt="Logo"/>
        </div>
        <h3>Click the button below to Play!</h3>
    </header>
    <nav>
        <ul>
          <li>
            <Link to="/Level" className="btn">Play Game</Link>
            </li>
        </ul>
    </nav> 
    </div>
    } 
          />
          <Route path="/Level" element={<Level />} />
          <Route path="/Game" element={<Game />} />

        </Routes>
      </div>
    </Router>
  
  );
}

export default App;
