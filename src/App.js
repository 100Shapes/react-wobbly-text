import React, { Component } from 'react';
import WobblyText from './WobblyText';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='text text--emoji'>🎊</div>
        <WobblyText>Happy</WobblyText>
        <WobblyText>Friday!</WobblyText>
        <div className='text text--emoji'>🙌</div>
      </div>
    );
  }
}

export default App;
